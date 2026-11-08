"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star, ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuickView } from "@/store/quickview";
import { useCart } from "@/store/cart";
import { toast } from "./Toaster";
import SmartImage from "./SmartImage";
import { formatPrice, discountPercent } from "@/lib/format";
import { CONDITION_META } from "@/lib/types";

export default function QuickViewModal() {
  const list = useQuickView((s) => s.list);
  const index = useQuickView((s) => s.index);
  const close = useQuickView((s) => s.close);
  const next = useQuickView((s) => s.next);
  const prev = useQuickView((s) => s.prev);
  const add = useCart((s) => s.add);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const touchX = useRef<number | null>(null);

  const product = index >= 0 && index < list.length ? list[index] : null;
  const hasPrev = index > 0;
  const hasNext = index < list.length - 1;

  useEffect(() => {
    setActive(0);
    setQty(1);
  }, [index]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, close, next, prev]);

  const discount = product ? discountPercent(product.price, product.compareAtPrice) : 0;

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60"
          />

          {/* Flèches (desktop) */}
          {hasPrev && (
            <button
              onClick={prev}
              aria-label="Précédent"
              className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg hover:bg-white sm:flex"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={next}
              aria-label="Suivant"
              className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg hover:bg-white sm:flex"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (dx < -50) next();
              if (dx > 50) prev();
              touchX.current = null;
            }}
            className="relative grid w-full max-w-2xl gap-5 overflow-hidden rounded-2xl bg-white p-4 shadow-2xl sm:grid-cols-2 sm:p-5"
          >
            <button
              onClick={close}
              aria-label="Fermer"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Galerie */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
                <SmartImage
                  src={product.images[active]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 90vw, 320px"
                  className="object-cover"
                />
                {discount > 0 && (
                  <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                    -{discount}%
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="mt-2 flex gap-2">
                  {product.images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`relative h-12 w-12 overflow-hidden rounded-lg ring-2 ${active === i ? "ring-zaya" : "ring-transparent"}`}
                    >
                      <SmartImage src={img} alt="" fill sizes="48px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex flex-col">
              {product.brand && (
                <p className="text-xs font-medium uppercase tracking-wide text-zaya">{product.brand}</p>
              )}
              <h2 className="mt-0.5 font-display text-lg font-bold leading-snug">{product.name}</h2>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CONDITION_META[product.condition].badge}`}>
                  {CONDITION_META[product.condition].label}
                </span>
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-2xl font-extrabold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="pb-0.5 text-sm text-ink-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full border border-black/10 p-1">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-black/5">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-7 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-black/5">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      add(
                        {
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          image: product.images[0],
                          stock: product.stock,
                        },
                        qty,
                      );
                      toast("Ajouté au panier ✅");
                    }}
                    className="btn-primary flex-1"
                  >
                    <ShoppingCart className="h-4 w-4" /> Ajouter
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/produit/${product.slug}`}
                    onClick={close}
                    className="text-sm font-semibold text-zaya hover:text-zaya-600"
                  >
                    Voir la fiche complète →
                  </Link>
                  {list.length > 1 && (
                    <span className="text-xs text-ink-muted">
                      {index + 1} / {list.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
