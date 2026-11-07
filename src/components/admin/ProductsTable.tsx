"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, EyeOff } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { formatPrice } from "@/lib/format";
import { toast } from "@/components/Toaster";

type Row = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  stock: number;
  active: boolean;
  categoryName: string;
};

export default function ProductsTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Produit supprimé");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setDeleting(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
        <p className="text-ink-muted">Aucun produit. Créez le premier !</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-neutral-50 text-left text-xs uppercase text-ink-muted">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                      <SmartImage src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium">{p.name}</p>
                      {!p.active && (
                        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                          <EyeOff className="h-3 w-3" /> Masqué
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.categoryName}</td>
                <td className="px-4 py-3 font-semibold text-zaya">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock > 0 ? "" : "text-red-500"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-zaya-50 hover:text-zaya"
                      aria-label="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => remove(p.id, p.name)}
                      disabled={deleting === p.id}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-500"
                      aria-label="Supprimer"
                    >
                      {deleting === p.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
