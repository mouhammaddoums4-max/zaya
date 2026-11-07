import Link from "next/link";
import { SearchX, Zap } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import BoutiqueToolbar from "@/components/BoutiqueToolbar";
import {
  getCategories,
  searchProducts,
  getFlashDeals,
  getPromoProducts,
} from "@/lib/data";
import { CategoryIcon } from "@/components/icons";

export const revalidate = 30;

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tri?: string;
    filtre?: string;
  }>;
};

export default async function BoutiquePage({ searchParams }: Props) {
  const sp = await searchParams;
  const flashMode = sp.filtre === "flash";
  const promoMode = sp.filtre === "promo";

  const [categories, products] = await Promise.all([
    getCategories(),
    flashMode
      ? getFlashDeals(60)
      : promoMode
        ? getPromoProducts(60)
        : searchProducts({ q: sp.q, category: sp.category, sort: sp.tri }),
  ]);

  const title = flashMode
    ? "Ventes Flash ⚡"
    : promoMode
      ? "Promotions 🔥"
      : sp.q
        ? `Résultats pour « ${sp.q} »`
        : "Toute la boutique";

  return (
    <div className="container-zaya py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {flashMode && <Zap className="mr-1 inline h-6 w-6 text-zaya" />}
          {title}
        </h1>
      </div>

      {/* Chips catégories */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Link
          href="/boutique"
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            !sp.category && !flashMode && !promoMode
              ? "bg-zaya text-white"
              : "bg-white text-ink ring-1 ring-black/10 hover:ring-zaya"
          }`}
        >
          Tout
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/boutique?category=${cat.slug}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
              sp.category === cat.slug
                ? "bg-zaya text-white"
                : "bg-white text-ink ring-1 ring-black/10 hover:ring-zaya"
            }`}
          >
            <CategoryIcon name={cat.icon} className="h-4 w-4" />
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mb-5">
        <BoutiqueToolbar count={products.length} />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zaya-50">
            <SearchX className="h-9 w-9 text-zaya" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">Aucun produit trouvé</p>
            <p className="mt-1 text-sm text-ink-muted">
              Essayez une autre recherche ou catégorie.
            </p>
          </div>
          <Link href="/boutique" className="btn-primary">
            Voir toute la boutique
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
