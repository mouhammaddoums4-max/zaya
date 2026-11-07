import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0],
    price: p.price,
    stock: p.stock,
    active: p.active,
    categoryName: p.category?.name ?? "—",
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Produits</h1>
          <p className="text-sm text-ink-muted">{products.length} produit(s)</p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary">
          <Plus className="h-4 w-4" /> Nouveau
        </Link>
      </div>
      <ProductsTable products={rows} />
    </div>
  );
}
