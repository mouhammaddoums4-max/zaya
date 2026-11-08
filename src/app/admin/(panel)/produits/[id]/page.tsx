import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProduitPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, parentId: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/produits"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-zaya"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold">Modifier le produit</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          brand: product.brand ?? "",
          categoryId: product.categoryId,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? "",
          stock: product.stock,
          description: product.description,
          images: product.images,
          rating: product.rating,
          sold: product.sold,
          featured: product.featured,
          isFlashDeal: product.isFlashDeal,
          active: product.active,
          condition: product.condition,
        }}
      />
    </div>
  );
}
