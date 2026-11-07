import Link from "next/link";
import { Flame, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import FlashDeals from "@/components/FlashDeals";
import ProductGrid from "@/components/ProductGrid";
import SectionHeader from "@/components/SectionHeader";
import ScrollReveal from "@/components/ScrollReveal";
import {
  getCategories,
  getFlashDeals,
  getFeaturedProducts,
  getBestSellers,
  getNewProducts,
} from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, flash, featured, best, fresh] = await Promise.all([
    getCategories(),
    getFlashDeals(10),
    getFeaturedProducts(10),
    getBestSellers(10),
    getNewProducts(10),
  ]);

  return (
    <>
      <Hero />

      <div className="container-zaya space-y-12 py-10 sm:space-y-16 sm:py-12">
        {/* Catégories */}
        <ScrollReveal>
          <SectionHeader
            title="Explorer par catégorie"
            subtitle="Trouvez exactement ce que vous cherchez"
          />
          <CategoryStrip categories={categories} />
        </ScrollReveal>

        {/* Ventes flash */}
        {flash.length > 0 && (
          <ScrollReveal>
            <FlashDeals products={flash} />
          </ScrollReveal>
        )}

        {/* Bannières promo */}
        <ScrollReveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/categorie/telephones-tablettes"
              className="shine group relative flex h-40 items-center overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-ink-soft p-6 text-white sm:h-48"
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-zaya-400">
                  High-Tech
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold">
                  Smartphones &<br />accessoires
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-zaya-400">
                  Découvrir <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-zaya/30 blur-2xl" />
            </Link>
            <Link
              href="/categorie/mode-femme"
              className="shine group relative flex h-40 items-center overflow-hidden rounded-3xl bg-gradient-to-br from-zaya-600 to-zaya p-6 text-white sm:h-48"
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Tendance
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold">
                  Mode & Style<br />pour tous
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                  Découvrir <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Meilleures ventes */}
        {best.length > 0 && (
          <ScrollReveal>
            <SectionHeader
              title="Meilleures ventes"
              subtitle="Les produits préférés de nos clients"
              href="/boutique?tri=populaire"
              accent={<TrendingUp className="h-5 w-5 text-zaya" />}
            />
            <ProductGrid products={best} />
          </ScrollReveal>
        )}

        {/* Sélection */}
        {featured.length > 0 && (
          <ScrollReveal>
            <SectionHeader
              title="Notre sélection"
              subtitle="Coups de cœur de l'équipe ZAYA"
              href="/boutique"
              accent={<Flame className="h-5 w-5 text-zaya" />}
            />
            <ProductGrid products={featured} />
          </ScrollReveal>
        )}

        {/* Nouveautés */}
        {fresh.length > 0 && (
          <ScrollReveal>
            <SectionHeader
              title="Nouveautés"
              subtitle="Fraîchement arrivés"
              href="/boutique?tri=nouveau"
              accent={<Sparkles className="h-5 w-5 text-zaya" />}
            />
            <ProductGrid products={fresh} />
          </ScrollReveal>
        )}
      </div>
    </>
  );
}
