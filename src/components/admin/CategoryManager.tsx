"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Pencil, X, CornerDownRight } from "lucide-react";
import { CategoryIcon } from "@/components/icons";
import AdminImageUpload from "./AdminImageUpload";
import { toast } from "@/components/Toaster";

type Cat = {
  id: string;
  name: string;
  icon: string | null;
  image: string | null;
  parentId: string | null;
  productCount: number;
};

const ICONS = [
  "smartphone", "tv", "laptop", "refrigerator", "shirt", "sparkles",
  "home", "shopping-basket", "baby", "dumbbell", "tag",
];

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const parents = categories.filter((c) => !c.parentId);

  // création
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("tag");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // édition
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ name: string; icon: string; parentId: string; image: string }>({
    name: "", icon: "tag", parentId: "", image: "",
  });
  const [busy, setBusy] = useState<string | null>(null);

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20";

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast("Nom requis", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, parentId: parentId || null, image: image || null, order: categories.length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Catégorie créée ✅");
      setName(""); setParentId(""); setImage(""); setIcon("tag");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c: Cat) => {
    setEditId(c.id);
    setEdit({ name: c.name, icon: c.icon || "tag", parentId: c.parentId || "", image: c.image || "" });
  };

  const saveEdit = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: edit.name, icon: edit.icon, parentId: edit.parentId || null, image: edit.image || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Catégorie mise à jour ✅");
      setEditId(null);
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string, label: string) => {
    if (!confirm(`Supprimer « ${label} » ?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Catégorie supprimée");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const Row = ({ c, child }: { c: Cat; child?: boolean }) => (
    <div className={`rounded-xl bg-white p-3 shadow-card ring-1 ring-black/5 ${child ? "ml-6" : ""}`}>
      {editId === c.id ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <AdminImageUpload value={edit.image} onChange={(url) => setEdit({ ...edit, image: url })} aspect="square" hint="400×400" />
            <div className="space-y-2">
              <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={field} placeholder="Nom" />
              <select value={edit.parentId} onChange={(e) => setEdit({ ...edit, parentId: e.target.value })} className={field}>
                <option value="">— Catégorie parente (aucune) —</option>
                {parents.filter((p) => p.id !== c.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="flex flex-wrap gap-1.5">
                {ICONS.map((ic) => (
                  <button type="button" key={ic} onClick={() => setEdit({ ...edit, icon: ic })}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${edit.icon === ic ? "bg-zaya text-white ring-zaya" : "bg-neutral-50 text-ink-muted ring-black/5"}`}>
                    <CategoryIcon name={ic} className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => saveEdit(c.id)} disabled={busy === c.id} className="btn-primary px-4 py-2 text-sm">
              {busy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </button>
            <button onClick={() => setEditId(null)} className="btn-ghost px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zaya-50 text-zaya">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            ) : (
              <CategoryIcon name={c.icon} className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 font-medium">
              {child && <CornerDownRight className="h-3.5 w-3.5 text-ink-muted" />}
              {c.name}
            </p>
            <p className="text-xs text-ink-muted">{c.productCount} produit(s)</p>
          </div>
          <button onClick={() => startEdit(c)} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-zaya-50 hover:text-zaya" aria-label="Modifier">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => remove(c.id, c.name)} disabled={busy === c.id} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-500" aria-label="Supprimer">
            {busy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Création */}
      <form onSubmit={create} className="lg:col-span-1">
        <div className="sticky top-6 space-y-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <h2 className="font-display font-bold">Nouvelle catégorie</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Nom (ex. Jeux vidéo)" />
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={field}>
            <option value="">— Catégorie parente (aucune) —</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Icône</label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((ic) => (
                <button type="button" key={ic} onClick={() => setIcon(ic)}
                  className={`flex aspect-square items-center justify-center rounded-lg ring-1 ${icon === ic ? "bg-zaya text-white ring-zaya" : "bg-neutral-50 text-ink-muted ring-black/5 hover:text-zaya"}`}>
                  <CategoryIcon name={ic} className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Image (optionnel)</label>
            <AdminImageUpload value={image} onChange={setImage} aspect="square" hint="carré ≈ 400 × 400 px" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Plus className="h-4 w-4" /> Ajouter</>)}
          </button>
        </div>
      </form>

      {/* Liste hiérarchique */}
      <div className="space-y-3 lg:col-span-2">
        {parents.map((p) => (
          <div key={p.id} className="space-y-2">
            <Row c={p} />
            {categories.filter((c) => c.parentId === p.id).map((child) => (
              <Row key={child.id} c={child} child />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
