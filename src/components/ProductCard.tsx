"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "./Toaster";
import SmartImage from "./SmartImage";
import { formatPrice, discountPercent } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData;
  index?: number;
}) {
  const add = useCart((s) => s.add);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    add({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
    });
    toast("Ajouté au panier ✅");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-shadow hover:shadow-glow"
    >
      <Link href={`/produit/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="rounded-full bg-zaya px-2 py-0.5 text-[11px] font-bold text-white shadow">
                -{discount}%
              </span>
            )}
            {product.isFlashDeal && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white shadow">
                ⚡ Flash
              </span>
            )}
          </div>
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                Épuisé
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        {product.brand && (
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
            {product.brand}
          </p>
        )}
        <Link href={`/produit/${product.slug}`}>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-ink transition-colors group-hover:text-zaya">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
          <span>· {product.sold} vendus</span>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-base font-bold text-zaya">
                {formatPrice(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-xs text-ink-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              aria-label="Ajouter au panier"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zaya text-white shadow transition hover:bg-zaya-600 active:scale-90 disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
