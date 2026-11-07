import Link from "next/link";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import HomeHero from "@/components/HomeHero";
import TrustBadges from "@/components/TrustBadges";
import CategoriesShowcase from "@/components/CategoriesShowcase";
import PromoBanners from "@/components/PromoBanners";
import FlashDeals from "@/components/FlashDeals";
import ProductGridWithAds from "@/components/ProductGridWithAds";
import {
  getCategories,
  getFlashDeals,
  getBestSellers,
  getNewProducts,
  getSettings,
} from "@/lib/data";

export const revalidate = 60;

function SectionTitle({
  title,
  href,
  icon,
}: {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="section-title title-underline flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-sm font-semibold text-zaya hover:text-zaya-600"
        >
          Voir plus
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [categories, flash, best, fresh, settings] = await Promise.all([
    getCategories(),
    getFlashDeals(12),
    getBestSellers(12),
    getNewProducts(12),
    getSettings(),
  ]);

  return (
    <>
      <HomeHero categories={categories} slides={settings.slides} />

      <div className="container-zaya space-y-8 py-6 sm:space-y-10 sm:py-8">
        <TrustBadges />

        <CategoriesShowcase categories={categories} />

        <PromoBanners banners={settings.banners} />

        {flash.length > 0 && <FlashDeals products={flash} />}

        {best.length > 0 && (
          <section>
            <SectionTitle
              title="Meilleures ventes"
              href="/boutique?tri=populaire"
              icon={<TrendingUp className="h-5 w-5 text-zaya" />}
            />
            <ProductGridWithAds products={best} ads={settings.squareAds} />
          </section>
        )}

        {fresh.length > 0 && (
          <section>
            <SectionTitle
              title="Nouveautés"
              href="/boutique?tri=nouveau"
              icon={<Sparkles className="h-5 w-5 text-zaya" />}
            />
            <ProductGridWithAds products={fresh} ads={settings.squareAds} />
          </section>
        )}
      </div>
    </>
  );
}
