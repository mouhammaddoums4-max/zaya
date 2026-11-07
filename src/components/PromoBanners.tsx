import Link from "next/link";
import { ArrowRight, Zap, Headphones, Sparkles } from "lucide-react";
import SmartImage from "./SmartImage";
import type { Banner } from "@/lib/data";

function ImageBanner({ banner }: { banner: Banner }) {
  return (
    <Link
      href={banner.link || "/boutique"}
      className="group relative flex h-36 items-center overflow-hidden rounded-xl bg-ink"
    >
      <SmartImage
        src={banner.image}
        alt={banner.title || "Promotion"}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {(banner.title || banner.subtitle || banner.cta) && (
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />
      )}
      <div className="relative z-10 p-5 text-white">
        {banner.title && (
          <p className="font-display text-xl font-extrabold leading-tight">
            {banner.title}
          </p>
        )}
        {banner.subtitle && (
          <p className="mt-1 text-sm text-white/80">{banner.subtitle}</p>
        )}
        {banner.cta && (
          <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-zaya px-3 py-1.5 text-xs font-semibold">
            {banner.cta} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </Link>
  );
}

export default function PromoBanners({ banners }: { banners?: Banner[] }) {
  if (banners && banners.length > 0) {
    return (
      <section className="grid gap-3 md:grid-cols-3">
        {banners.slice(0, 6).map((b, i) => (
          <ImageBanner key={i} banner={b} />
        ))}
      </section>
    );
  }

  // Design par défaut (aucune bannière configurée en admin)
  return (
    <section className="grid gap-3 md:grid-cols-3">
      <Link
        href="/boutique?filtre=promo"
        className="group relative flex h-36 items-center overflow-hidden rounded-xl bg-gradient-to-br from-zaya to-zaya-600 p-5 text-white"
      >
        <div className="relative z-10">
          <p className="font-display text-xl font-extrabold leading-tight">
            Promotions
            <br />
            jusqu'à <span className="text-white">-50%</span>
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur transition group-hover:bg-white/25">
            En profiter <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <Headphones className="absolute -right-2 bottom-1 h-24 w-24 text-white/20" />
      </Link>

      <Link
        href="/boutique?filtre=flash"
        className="group relative flex h-36 items-center overflow-hidden rounded-xl bg-gradient-to-br from-ink to-ink-soft p-5 text-white"
      >
        <div className="relative z-10">
          <p className="flex items-center gap-2 font-display text-xl font-extrabold">
            <Zap className="h-5 w-5 text-zaya-400" /> Ventes Flash
          </p>
          <p className="mt-1 text-sm text-white/70">Offres limitées !</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-zaya px-3 py-1.5 text-xs font-semibold transition group-hover:bg-zaya-600">
            Acheter vite <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <Zap className="absolute -right-2 bottom-0 h-24 w-24 text-zaya/20" />
      </Link>

      <Link
        href="/boutique?tri=populaire"
        className="group relative flex h-36 items-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-white p-5 ring-1 ring-black/5"
      >
        <div className="relative z-10">
          <p className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
            <Sparkles className="h-5 w-5 text-zaya" /> Meilleurs prix
          </p>
          <p className="mt-1 text-sm text-ink-muted">Qualité & confiance</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-zaya px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-zaya-600">
            Découvrir <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <Sparkles className="absolute -right-2 bottom-0 h-24 w-24 text-zaya/10" />
      </Link>
    </section>
  );
}
