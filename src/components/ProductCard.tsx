"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { toast } from "./Toaster";
import SmartImage from "./SmartImage";
import { formatPrice, discountPercent } from "@/lib/format";
import { CONDITION_META, type ProductCardData } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData;
  index?: number;
}) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishHas = useWishlist((s) => s.has);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;
  const isWished = mounted && wishHas(product.id);

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

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0],
    });
    toast(isWished ? "Retiré des favoris" : "Ajouté aux favoris ❤️");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.25) }}
      className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]"
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
          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.isFlashDeal && (
            <span className="absolute left-2 top-9 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white">
              ⚡ Flash
            </span>
          )}
          <button
            onClick={handleWish}
            aria-label="Ajouter aux favoris"
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition ${
              isWished ? "text-red-500" : "text-ink-muted hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWished ? "fill-red-500" : ""}`} />
          </button>
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                Épuisé
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ink transition-colors group-hover:text-zaya">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${CONDITION_META[product.condition].badge}`}
          >
            {CONDITION_META[product.condition].label}
          </span>
        </div>

        <div className="mt-1.5">
          <p className="font-display text-base font-extrabold text-red-600">
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
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-zaya py-2 text-xs font-semibold text-white transition hover:bg-zaya-600 active:scale-[0.98] disabled:opacity-40 sm:text-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </button>
      </div>
    </motion.div>
  );
}
