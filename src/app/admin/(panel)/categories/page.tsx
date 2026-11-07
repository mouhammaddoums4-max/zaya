import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const rows = categories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    productCount: c._count.products,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Catégories</h1>
        <p className="text-sm text-ink-muted">{categories.length} catégorie(s)</p>
      </div>
      <CategoryManager categories={rows} />
    </div>
  );
}
