import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import SectionHeader from "@/components/SectionHeader";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import RecentlyViewed from "@/components/RecentlyViewed";
import {
  getProductBySlug,
  getRelatedProducts,
  getFrequentlyBoughtTogether,
} from "@/lib/data";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };

  const url = `${SITE.url}/produit/${product.slug}`;
  const image = product.images[0];
  const desc = `${formatPrice(product.price)} — ${
    product.description || product.name
  }`.slice(0, 200);

  return {
    title: product.name,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title: `${product.name} — ${formatPrice(product.price)}`,
      description: desc,
      images: image
        ? [{ url: image, width: 900, height: 900, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${formatPrice(product.price)}`,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const [related, fbt] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 10),
    getFrequentlyBoughtTogether(product.id, 6),
  ]);
  const url = `${SITE.url}/produit/${product.slug}`;

  const cardData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    sold: product.sold,
    stock: product.stock,
    brand: product.brand,
    isFlashDeal: product.isFlashDeal,
    condition: product.condition,
  };

  return (
    <div className="container-zaya py-5 sm:py-8">
      {/* Fil d'ariane */}
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-ink-muted">
        <Link href="/" className="hover:text-zaya">Accueil</Link>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <Link
              href={`/categorie/${product.category.slug}`}
              className="hover:text-zaya"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="line-clamp-1 text-ink">{product.name}</span>
      </nav>

      <ProductDetail
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          sold: product.sold,
          stock: product.stock,
          brand: product.brand,
          condition: product.condition,
        }}
        url={url}
      />

      <RecentlyViewedTracker product={cardData} />

      {fbt.length > 0 && (
        <div className="mt-14">
          <SectionHeader title="Souvent achetés ensemble" />
          <ProductGrid products={fbt} />
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-14">
          <SectionHeader title="Produits similaires" />
          <ProductGrid products={related} />
        </div>
      )}

      <div className="mt-14">
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* JSON-LD pour le SEO / partage riche */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // On échappe `<` pour empêcher une rupture de la balise <script>
          // (ex. un nom/description contenant "</script>") = anti-XSS stocké.
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.description,
            brand: product.brand || "ZAYA",
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "GNF",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: Math.max(product.reviewsCount, 1),
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
