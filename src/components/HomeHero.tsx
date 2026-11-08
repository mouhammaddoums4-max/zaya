"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Headphones,
} from "lucide-react";

const TRUST = [
  { icon: ShieldCheck, title: "Paiement sécurisé", desc: "Payez à la livraison" },
  { icon: Zap, title: "Rapidité", desc: "Livraison express" },
  { icon: Headphones, title: "Assistance", desc: "7j/7 sur WhatsApp" },
];
import SmartImage from "./SmartImage";
import type { Slide } from "@/lib/data";

const DEFAULT_SLIDES: Slide[] = [
  {
    title: "Achetez malin.\nVendez facilement.",
    subtitle: "Tout ce dont vous avez besoin, au meilleur prix !",
    cta: "Découvrir maintenant",
    link: "/boutique",
    image: "/hero/hero-1.png",
  },
  {
    title: "Mode homme\ntendance",
    subtitle: "Chemises, boubous et styles premium pour lui.",
    cta: "Voir la collection",
    link: "/boutique",
    image: "/hero/hero-2.png",
  },
  {
    title: "Élégance femme\nà l'africaine",
    subtitle: "Tenues, accessoires et beauté — livrés chez vous.",
    cta: "Découvrir",
    link: "/boutique",
    image: "/hero/hero-3.png",
  },
  {
    title: "Livraison partout\nen Guinée",
    subtitle: "Paiement à la livraison, en toute confiance.",
    cta: "Commander maintenant",
    link: "/boutique",
    image: "/hero/hero-4.png",
  },
  {
    title: "Des milliers\nde produits",
    subtitle: "Électronique, mode, maison, supermarché — tout ZAYA.",
    cta: "Explorer la boutique",
    link: "/boutique",
    image: "/hero/hero-5.png",
  },
  {
    title: "Tout pour\nvotre maison",
    subtitle: "Découvrez les essentiels pour équiper votre intérieur.",
    cta: "Voir les produits",
    link: "/boutique",
    image: "/hero/hero-5.png",
  },
  {
    title: "Les nouveautés\nvous attendent",
    subtitle: "Explorez les dernières trouvailles de la boutique ZAYA.",
    cta: "Découvrir",
    link: "/boutique",
    image: "/hero/hero-1.png",
  },
];

export default function HomeHero({ slides }: { slides?: Slide[] }) {
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
      {/* Carrousel */}
      <div
        className="group relative w-full overflow-hidden rounded-xl bg-ink"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
          <div className="relative aspect-[1983/793] w-full">
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
                  sizes="(max-width: 1280px) 100vw, 1280px"
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

      {/* Réassurance */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        {TRUST.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 ring-1 ring-black/[0.06] sm:gap-3 sm:px-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zaya-50 text-zaya sm:h-10 sm:w-10">
              <f.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink sm:text-sm">
                {f.title}
              </p>
              <p className="truncate text-[11px] text-ink-muted sm:text-xs">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
