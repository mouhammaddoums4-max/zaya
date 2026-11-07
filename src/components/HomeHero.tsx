"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { CategoryIcon } from "./icons";
import SmartImage from "./SmartImage";
import type { CategoryData } from "@/lib/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;

const SLIDES = [
  {
    title: "Achetez malin.\nVendez facilement.",
    subtitle: "Tout ce dont vous avez besoin, au meilleur prix !",
    cta: "Découvrir maintenant",
    href: "/boutique",
    image: img("1483985988355-763728e1935b"),
  },
  {
    title: "Ventes Flash\nchaque jour",
    subtitle: "Jusqu'à -50% sur une sélection de produits.",
    cta: "Voir les offres",
    href: "/boutique?filtre=flash",
    image: img("1607083206968-13611e3d76db"),
  },
  {
    title: "Livré partout\nen Guinée",
    subtitle: "Paiement à la livraison, en toute confiance.",
    cta: "Commander maintenant",
    href: "/boutique",
    image: img("1556742049-0cfed4f6a45d"),
  },
];

export default function HomeHero({
  categories,
}: {
  categories: CategoryData[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container-zaya pt-4">
      <div className="flex gap-4">
        {/* Sidebar catégories (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.id}
                href={`/categorie/${cat.slug}`}
                className="group flex items-center justify-between border-b border-black/5 px-4 py-[11px] text-sm text-ink transition last:border-0 hover:bg-zaya-50 hover:text-zaya"
              >
                <span className="flex items-center gap-3">
                  <CategoryIcon name={cat.icon} className="h-[18px] w-[18px] text-ink-muted group-hover:text-zaya" />
                  <span className="line-clamp-1">{cat.name}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-transparent group-hover:text-zaya" />
              </Link>
            ))}
          </div>
        </aside>

        {/* Carrousel */}
        <div className="relative flex-1 overflow-hidden rounded-xl">
          <div className="relative h-[220px] w-full sm:h-[300px] lg:h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <SmartImage
                  src={SLIDES[index].image}
                  alt={SLIDES[index].subtitle}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                  <h2 className="whitespace-pre-line font-display text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {SLIDES[index].title}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm text-white/80 sm:mt-3 sm:text-base">
                    {SLIDES[index].subtitle}
                  </p>
                  <Link
                    href={SLIDES[index].href}
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-zaya px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zaya-600 sm:mt-5"
                  >
                    {SLIDES[index].cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
