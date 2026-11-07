"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Truck, ShieldCheck } from "lucide-react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setCanRender3D(desktop && !reduced);
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Fonds décoratifs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-zaya/30 blur-[100px]" />
        <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-zaya-600/20 blur-[120px]" />
        <div className="absolute inset-0 pattern-grid opacity-40" />
      </div>

      {/* Canvas 3D (desktop) */}
      {canRender3D && (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
          <HeroCanvas />
        </div>
      )}

      <div className="container-zaya relative z-10 grid gap-8 py-14 md:grid-cols-2 md:py-24 lg:py-28">
        <div className="flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur"
          >
            <Zap className="h-3.5 w-3.5 text-zaya-400" />
            Marketplace n°1 en Guinée
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Achetez tout,
            <br />
            <span className="text-gradient-zaya">livré chez vous.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-md text-base text-white/70 sm:text-lg"
          >
            Téléphones, électronique, mode, maison et bien plus — aux meilleurs
            prix, avec paiement à la livraison partout en Guinée.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.19 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/boutique" className="btn-primary shadow-glow">
              Découvrir la boutique
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/boutique?filtre=flash"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Zap className="h-4 w-4 text-zaya-400" />
              Ventes flash
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60"
          >
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-zaya-400" /> Livraison rapide
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-zaya-400" /> Paiement à la livraison
            </span>
          </motion.div>
        </div>

        {/* Visuel mobile (sans 3D) */}
        <div className="relative flex items-center justify-center md:hidden">
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-zaya via-zaya-400 to-zaya-700 opacity-80 blur-sm" />
            <div className="absolute inset-3 rounded-full bg-ink" />
            <Image
              src="/logo-zaya.png"
              alt="ZAYA"
              width={160}
              height={160}
              className="relative z-10 w-32 animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
