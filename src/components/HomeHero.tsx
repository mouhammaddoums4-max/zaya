"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { CategoryIcon } from "./icons";
import SmartImage from "./SmartImage";
import type { CategoryData } from "@/lib/types";
import type { Slide } from "@/lib/data";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;

const DEFAULT_SLIDES: Slide[] = [
  {
    title: "Achetez malin.\nVendez facilement.",
    subtitle: "Tout ce dont vous avez besoin, au meilleur prix !",
    cta: "Découvrir maintenant",
    link: "/boutique",
    image: img("1483985988355-763728e1935b"),
  },
  {
    title: "Ventes Flash\nchaque jour",
    subtitle: "Jusqu'à -50% sur une sélection de produits.",
    cta: "Voir les offres",
    link: "/boutique?filtre=flash",
    image: img("1607083206968-13611e3d76db"),
  },
  {
    title: "Livré partout\nen Guinée",
    subtitle: "Paiement à la livraison, en toute confiance.",
    cta: "Commander maintenant",
    link: "/boutique",
    image: img("1556742049-0cfed4f6a45d"),
  },
];

export default function HomeHero({
  categories,
  slides,
}: {
  categories: CategoryData[];
  slides?: Slide[];
}) {
  const data = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        setDir(1);
        setIndex((i) => (i + 1) % data.length);
      }
    }, 5500);
    return () => clearInterval(id);
  }, [data.length]);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + data.length) % data.length);
  };

  const slide = data[index];

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
        <div
          className="group relative flex-1 overflow-hidden rounded-xl bg-ink"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <div className="relative h-[220px] w-full sm:h-[300px] lg:h-[360px]">
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <SmartImage
                  src={slide.image}
                  alt={slide.subtitle || slide.title || "ZAYA"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                  {slide.title && (
                    <motion.h2
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                      className="max-w-lg whitespace-pre-line font-display text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
                    >
                      {slide.title}
                    </motion.h2>
                  )}
                  {slide.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="mt-2 max-w-sm text-sm text-white/80 sm:mt-3 sm:text-base"
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                  >
                    <Link
                      href={slide.link || "/boutique"}
                      className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-zaya px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zaya-600 sm:mt-5"
                    >
                      {slide.cta || "Découvrir"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Flèches */}
            {data.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Précédent"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Suivant"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Dots */}
            {data.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {data.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDir(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
