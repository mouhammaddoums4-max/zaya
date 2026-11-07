"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import SmartImage from "./SmartImage";
import { SITE } from "@/lib/constants";

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, close, increment, decrement, remove } = useCart();
  const subtotal = useCart((s) => s.subtotal());

  if (pathname.startsWith("/admin")) return null;

  const freeDelivery = subtotal >= SITE.freeDeliveryThreshold;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-black/50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShoppingBag className="h-5 w-5 text-zaya" />
                Mon panier
              </h2>
              <button
                onClick={close}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zaya-50">
                  <ShoppingBag className="h-9 w-9 text-zaya" />
                </div>
                <p className="text-sm text-ink-muted">Votre panier est vide.</p>
                <button onClick={close} className="btn-primary">
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 rounded-2xl bg-neutral-50 p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/produit/${item.slug}`}
                          onClick={close}
                          className="line-clamp-2 text-sm font-medium text-ink hover:text-zaya"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm font-bold text-zaya">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white">
                            <button
                              onClick={() => decrement(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:text-zaya"
                              aria-label="Diminuer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increment(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:text-zaya"
                              aria-label="Augmenter"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-red-50 hover:text-red-500"
                            aria-label="Retirer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-black/5 p-4">
                  {!freeDelivery && (
                    <p className="mb-3 rounded-xl bg-zaya-50 px-3 py-2 text-center text-xs text-zaya-700">
                      Plus que{" "}
                      <strong>
                        {formatPrice(SITE.freeDeliveryThreshold - subtotal)}
                      </strong>{" "}
                      pour la livraison offerte 🚚
                    </p>
                  )}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-ink-muted">Sous-total</span>
                    <span className="font-display text-xl font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <Link
                    href="/commande"
                    onClick={close}
                    className="btn-primary w-full"
                  >
                    Commander maintenant
                  </Link>
                  <button
                    onClick={close}
                    className="mt-2 w-full py-2 text-center text-sm text-ink-muted hover:text-ink"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
