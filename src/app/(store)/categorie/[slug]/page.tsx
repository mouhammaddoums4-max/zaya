import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ProductGridWithAds from "@/components/ProductGridWithAds";
import BoutiqueToolbar from "@/components/BoutiqueToolbar";
import { CategoryIcon } from "@/components/icons";
import { getCategoryBySlug, searchProducts, getSettings, getSubcategories } from "@/lib/data";

export const revalidate = 30;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tri?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Catégorie introuvable" };
  return {
    title: cat.name,
    description: `Achetez ${cat.name} au meilleur prix sur ZAYA. Livraison partout en Guinée.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, settings, subcats] = await Promise.all([
    searchProducts({ category: slug, sort: sp.tri }),
    getSettings(),
    getSubcategories(category.id),
  ]);

  return (
    <div className="container-zaya py-6 sm:py-8">
      <nav className="mb-5 flex items-center gap-1 text-sm text-ink-muted">
        <Link href="/" className="hover:text-zaya">Accueil</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{category.name}</span>
      </nav>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zaya-50 text-zaya">
          <CategoryIcon name={category.icon} className="h-6 w-6" />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {category.name}
        </h1>
      </div>

      {subcats.length > 0 && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {subcats.map((sc) => (
            <Link
              key={sc.id}
              href={`/categorie/${sc.slug}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-black/10 transition hover:ring-zaya"
            >
              <CategoryIcon name={sc.icon} className="h-4 w-4 text-zaya" />
              {sc.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mb-5">
        <BoutiqueToolbar count={products.length} />
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      ) : (
        <ProductGridWithAds products={products} ads={settings.squareAds} />
      )}
    </div>
  );
}
