"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { CategoryIcon } from "@/components/icons";
import { toast } from "@/components/Toaster";

type Cat = {
  id: string;
  name: string;
  icon: string | null;
  productCount: number;
};

const ICONS = [
  "smartphone",
  "tv",
  "laptop",
  "refrigerator",
  "shirt",
  "sparkles",
  "home",
  "shopping-basket",
  "baby",
  "dumbbell",
  "tag",
];

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("tag");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast("Nom requis", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, order: categories.length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Catégorie créée ✅");
      setName("");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string, label: string) => {
    if (!confirm(`Supprimer la catégorie « ${label} » ?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Catégorie supprimée");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setDeleting(null);
    }
  };

  const field =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Formulaire */}
      <div className="lg:col-span-1">
        <form
          onSubmit={add}
          className="sticky top-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5"
        >
          <h2 className="mb-4 font-display font-bold">Nouvelle catégorie</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nom</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={field}
                placeholder="Ex. Jeux vidéo"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Icône</label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map((ic) => (
                  <button
                    type="button"
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`flex aspect-square items-center justify-center rounded-lg ring-1 transition ${
                      icon === ic
                        ? "bg-zaya text-white ring-zaya"
                        : "bg-neutral-50 text-ink-muted ring-black/5 hover:text-zaya"
                    }`}
                  >
                    <CategoryIcon name={ic} className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Plus className="h-4 w-4" /> Ajouter</>)}
            </button>
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="lg:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
                  <CategoryIcon name={c.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink-muted">{c.productCount} produit(s)</p>
                </div>
              </div>
              <button
                onClick={() => remove(c.id, c.name)}
                disabled={deleting === c.id}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-500"
                aria-label="Supprimer"
              >
                {deleting === c.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
