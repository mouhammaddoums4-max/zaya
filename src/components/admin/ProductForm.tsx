"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ImageIcon, Upload } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { toast } from "@/components/Toaster";
import { formatNumber } from "@/lib/format";
import { compressImageFile } from "@/lib/imageCompress";

type Category = { id: string; name: string; parentId: string | null };

export type ProductFormData = {
  id?: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number | string;
  compareAtPrice: number | string;
  stock: number | string;
  description: string;
  images: string[];
  rating: number | string;
  sold: number | string;
  featured: boolean;
  isFlashDeal: boolean;
  active: boolean;
  condition: "NEUF" | "OCCASION" | "RECONDITIONNE";
};

const empty: ProductFormData = {
  name: "",
  brand: "",
  categoryId: "",
  price: "",
  compareAtPrice: "",
  stock: 100,
  description: "",
  images: [],
  rating: 4.6,
  sold: 0,
  featured: false,
  isFlashDeal: false,
  active: true,
  condition: "NEUF",
};

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormData;
}) {
  const router = useRouter();

  const parents = categories.filter((c) => !c.parentId);
  const childrenOf = (pid: string) =>
    categories.filter((c) => c.parentId === pid);

  // Catégorie initiale (feuille) → déduit le parent à sélectionner
  const catById = new Map(categories.map((c) => [c.id, c]));
  const initialCat = initial ? catById.get(String(initial.categoryId)) : undefined;
  const initialParentId = initialCat
    ? initialCat.parentId ?? initialCat.id
    : parents[0]?.id ?? categories[0]?.id ?? "";
  const defaultLeaf =
    childrenOf(initialParentId)[0]?.id ?? initialParentId ?? "";

  const [form, setForm] = useState<ProductFormData>(
    initial ?? { ...empty, categoryId: defaultLeaf },
  );
  const [parentId, setParentId] = useState(initialParentId);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onParentChange = (pid: string) => {
    setParentId(pid);
    const kids = childrenOf(pid);
    const leaf = kids[0]?.id ?? pid;
    setForm((f) => ({ ...f, categoryId: leaf }));
  };
  const [uploading, setUploading] = useState(false);
  const isEdit = Boolean(initial?.id);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 12 * 1024 * 1024) {
          toast(`${file.name} est trop lourd (max 12 Mo)`, "error");
          continue;
        }
        try {
          const dataUrl = await compressImageFile(file);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataUrl }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload échoué");
          results.push(data.url);
        } catch (err) {
          toast(
            err instanceof Error ? err.message : `Impossible de traiter ${file.name}`,
            "error",
          );
        }
      }
      if (results.length) {
        setForm((f) => ({ ...f, images: [...f.images, ...results].slice(0, 8) }));
        toast(`${results.length} image(s) ajoutée(s) ✅`);
      }
    } finally {
      setUploading(false);
    }
  };

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) {
      toast("L'URL doit commencer par http(s)://", "error");
      return;
    }
    set("images", [...form.images, url]);
    setImageUrl("");
  };

  const removeImage = (i: number) =>
    set("images", form.images.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast("Le nom est requis", "error");
    if (!form.categoryId) return toast("Choisissez une catégorie", "error");
    if (form.price === "" || Number(form.price) < 0)
      return toast("Prix invalide", "error");

    setLoading(true);
    const payload = {
      name: form.name,
      brand: form.brand || null,
      categoryId: form.categoryId,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === "" ? null : Number(form.compareAtPrice),
      stock: Number(form.stock) || 0,
      description: form.description,
      images: form.images,
      rating: Number(form.rating) || 4.6,
      sold: Number(form.sold) || 0,
      featured: form.featured,
      isFlashDeal: form.isFlashDeal,
      active: form.active,
      condition: form.condition,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast(isEdit ? "Produit mis à jour ✅" : "Produit créé ✅");
      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zaya focus:ring-2 focus:ring-zaya/20";
  const label = "mb-1.5 block text-sm font-medium text-ink";

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* Infos générales */}
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-4 font-display font-bold">Informations</h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Nom du produit *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={field}
                placeholder="Ex. Smartphone ZAYA X9 Pro"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Marque</label>
                <input
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  className={field}
                  placeholder="Ex. ZAYA"
                />
              </div>
              <div>
                <label className={label}>Catégorie parente *</label>
                <select
                  value={parentId}
                  onChange={(e) => onParentChange(e.target.value)}
                  className={field}
                >
                  {parents.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {childrenOf(parentId).length > 0 && (
                <div>
                  <label className={label}>Sous-catégorie *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => set("categoryId", e.target.value)}
                    className={field}
                  >
                    {childrenOf(parentId).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className={label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                className={`${field} resize-none`}
                placeholder="Décrivez le produit, ses caractéristiques…"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-1 font-display font-bold">Images</h2>
          <p className="mb-3 text-xs text-ink-muted">
            Importez vos photos depuis l'appareil (recommandé : carré, min. 800×800 px).
            La première image est la principale.
          </p>

          {/* Import depuis l'appareil */}
          <label
            className={`mb-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zaya/40 bg-zaya-50/50 py-6 text-center transition hover:border-zaya ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = "";
              }}
            />
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-zaya" />
            ) : (
              <Upload className="h-6 w-6 text-zaya" />
            )}
            <span className="text-sm font-semibold text-zaya">
              {uploading ? "Traitement…" : "Importer des photos"}
            </span>
            <span className="text-[11px] text-ink-muted">
              JPG, PNG — depuis votre téléphone ou ordinateur
            </span>
          </label>

          <p className="mb-2 text-center text-[11px] text-ink-muted">
            ou collez un lien d'image
          </p>
          <div className="mb-4 flex gap-2">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              className={field}
              placeholder="https://exemple.com/image.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-ink px-4 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Ajouter
            </button>
          </div>
          {form.images.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/10 py-8 text-ink-muted">
              <ImageIcon className="h-8 w-8" />
              <p className="text-sm">Aucune image pour l'instant</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-50 ring-1 ring-black/5"
                >
                  <SmartImage src={img} alt={`Image ${i + 1}`} fill sizes="120px" className="object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-zaya px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Principale
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Colonne latérale */}
      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-4 font-display font-bold">Prix & stock</h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Prix (FG) *</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={field}
                placeholder="2500000"
              />
              {form.price !== "" && (
                <p className="mt-1 text-xs text-ink-muted">
                  = {formatNumber(Number(form.price))} FG
                </p>
              )}
            </div>
            <div>
              <label className={label}>Prix barré (promo)</label>
              <input
                type="number"
                min={0}
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
                className={field}
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label className={label}>Stock</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label}>État</label>
              <select
                value={form.condition}
                onChange={(e) =>
                  set("condition", e.target.value as ProductFormData["condition"])
                }
                className={field}
              >
                <option value="NEUF">Neuf</option>
                <option value="OCCASION">Occasion</option>
                <option value="RECONDITIONNE">Reconditionné</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="mb-4 font-display font-bold">Options</h2>
          <div className="space-y-3">
            {[
              { k: "featured" as const, label: "Mettre en vedette (sélection)" },
              { k: "isFlashDeal" as const, label: "Vente flash ⚡" },
              { k: "active" as const, label: "Produit visible (actif)" },
            ].map((opt) => (
              <label
                key={opt.k}
                className="flex cursor-pointer items-center justify-between"
              >
                <span className="text-sm">{opt.label}</span>
                <input
                  type="checkbox"
                  checked={form[opt.k]}
                  onChange={(e) => set(opt.k, e.target.checked)}
                  className="h-5 w-5 accent-zaya"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Note</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label}>Vendus</label>
              <input
                type="number"
                min={0}
                value={form.sold}
                onChange={(e) => set("sold", e.target.value)}
                className={field}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEdit ? (
            "Enregistrer les modifications"
          ) : (
            "Créer le produit"
          )}
        </button>
      </div>
    </form>
  );
}
