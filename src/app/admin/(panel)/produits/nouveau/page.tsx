import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NouveauProduitPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, parentId: true },
  });

  return (
    <div>
      <Link
        href="/admin/produits"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-zaya"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold">Nouveau produit</h1>
      {categories.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-black/5">
          <p className="text-ink-muted">
            Créez d'abord une{" "}
            <Link href="/admin/categories" className="font-semibold text-zaya">
              catégorie
            </Link>
            .
          </p>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
