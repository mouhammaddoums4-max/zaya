"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { SITE } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function PanierPage() {
  const [mounted, setMounted] = useState(false);
  const { items, increment, decrement, remove, clear } = useCart();
  const subtotal = useCart((s) => s.subtotal());
  useEffect(() => setMounted(true), []);

  const deliveryFee =
    subtotal >= SITE.freeDeliveryThreshold ? 0 : SITE.deliveryFee;
  const total = subtotal + deliveryFee;

  if (!mounted) {
    return <div className="container-zaya py-16" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-zaya flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zaya-50">
          <ShoppingBag className="h-11 w-11 text-zaya" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Votre panier est vide</h1>
          <p className="mt-1 text-ink-muted">
            Découvrez nos produits et ajoutez vos favoris.
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
        Mon panier
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liste */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex gap-4 rounded-2xl bg-white p-3 shadow-card ring-1 ring-black/5 sm:p-4"
            >
              <Link
                href={`/produit/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-50"
              >
                <SmartImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/produit/${item.slug}`}
                  className="line-clamp-2 font-medium text-ink hover:text-zaya"
                >
                  {item.name}
                </Link>
                <p className="mt-1 font-display text-lg font-bold text-zaya">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 rounded-full border border-black/10">
                    <button
                      onClick={() => decrement(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:text-zaya"
                      aria-label="Diminuer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-7 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:text-zaya"
                      aria-label="Augmenter"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="flex items-center gap-1 text-sm text-ink-muted hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Retirer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <button
            onClick={clear}
            className="text-sm text-ink-muted hover:text-red-500"
          >
            Vider le panier
          </button>
        </div>

        {/* Récap */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <h2 className="mb-4 font-display text-lg font-bold">Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Livraison</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600">Offerte</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="my-3 h-px bg-black/5" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-display text-xl font-bold text-zaya">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
            <Link href="/commande" className="btn-primary mt-5 w-full">
              Passer la commande
            </Link>
            <Link
              href="/boutique"
              className="mt-2 block w-full py-2 text-center text-sm text-ink-muted hover:text-ink"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
