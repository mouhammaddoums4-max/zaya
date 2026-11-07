"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { formatPrice, discountPercent } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { toast } from "@/components/Toaster";

export default function FavorisPage() {
  const [mounted, setMounted] = useState(false);
  const { items, remove } = useWishlist();
  const add = useCart((s) => s.add);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container-zaya py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-zaya flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zaya-50">
          <Heart className="h-11 w-11 text-zaya" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Aucun favori</h1>
          <p className="mt-1 text-ink-muted">
            Ajoutez des produits à vos favoris en cliquant sur le ❤️.
          </p>
        </div>
        <Link href="/boutique" className="btn-primary">
          Explorer la boutique <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-zaya py-6 sm:py-8">
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">
        Mes favoris <span className="text-ink-muted">({items.length})</span>
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((p) => {
          const discount = discountPercent(p.price, p.compareAtPrice);
          return (
            <motion.div
              key={p.id}
              layout
              className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]"
            >
              <Link href={`/produit/${p.slug}`} className="relative block">
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                  <SmartImage src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />
                  {discount > 0 && (
                    <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <Link href={`/produit/${p.slug}`}>
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-ink group-hover:text-zaya">
                    {p.name}
                  </h3>
                </Link>
                <p className="mt-1 font-display text-base font-extrabold text-red-600">
                  {formatPrice(p.price)}
                </p>
                <div className="mt-2.5 flex gap-2">
                  <button
                    onClick={() => {
                      add({
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        image: p.image,
                        stock: 99,
                      });
                      toast("Ajouté au panier ✅");
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zaya py-2 text-xs font-semibold text-white transition hover:bg-zaya-600"
                  >
                    <ShoppingCart className="h-4 w-4" /> Panier
                  </button>
                  <button
                    onClick={() => {
                      remove(p.id);
                      toast("Retiré des favoris");
                    }}
                    aria-label="Retirer"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted ring-1 ring-black/10 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
