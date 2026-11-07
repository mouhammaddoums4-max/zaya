"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ProductCardData } from "@/lib/types";

function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTime({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Box({ value }: { value: number }) {
  return (
    <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-ink px-1 font-mono text-sm font-bold text-white">
      {value.toString().padStart(2, "0")}
    </span>
  );
}

export default function FlashDeals({
  products,
}: {
  products: ProductCardData[];
}) {
  const { h, m, s } = useCountdown();
  if (products.length === 0) return null;

  return (
    <section className="rounded-3xl bg-gradient-to-r from-zaya-50 to-white p-4 ring-1 ring-zaya-100 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink sm:text-2xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zaya text-white">
              <Zap className="h-4 w-4" />
            </span>
            Ventes Flash
          </h2>
          <div className="flex items-center gap-1 text-sm text-ink-muted">
            <span className="hidden sm:inline">Se termine dans</span>
            <Box value={h} />
            <span className="font-bold">:</span>
            <Box value={m} />
            <span className="font-bold">:</span>
            <Box value={s} />
          </div>
        </div>
        <Link
          href="/boutique?filtre=flash"
          className="group flex items-center gap-1 text-sm font-semibold text-zaya hover:text-zaya-600"
        >
          Voir tout
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:px-0">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="w-40 shrink-0 snap-start sm:w-48"
          >
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
