"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Check,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "./Toaster";
import SmartImage from "./SmartImage";
import ShareButtons from "./ShareButtons";
import { formatPrice, discountPercent } from "@/lib/format";
import { CONDITION_META, type ProductCondition } from "@/lib/types";

type DetailProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  rating: number;
  reviewsCount: number;
  sold: number;
  stock: number;
  isFlashDeal: boolean;
  brand: string | null;
  condition: ProductCondition;
};

export default function ProductDetail({
  product,
  url,
}: {
  product: DetailProduct;
  url: string;
}) {
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const router = useRouter();

  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;
  const images = product.images.length ? product.images : [""];

  const addToCart = () => {
    if (outOfStock) return;
    add(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
        isFlashDeal: product.isFlashDeal,
      },
      qty,
    );
    toast(`${qty} × ajouté au panier ✅`);
  };

  const buyNow = () => {
    if (outOfStock) return;
    add(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
        isFlashDeal: product.isFlashDeal,
      },
      qty,
    );
    router.push("/commande");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Galerie */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div
          className="relative aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-black/5"
        >
          <SmartImage
            src={images[active]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-zaya px-3 py-1 text-sm font-bold text-white shadow">
              -{discount}%
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl ring-2 transition sm:h-20 sm:w-20 ${
                  active === i ? "ring-zaya" : "ring-transparent hover:ring-black/10"
                }`}
              >
                <SmartImage
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Infos */}
      <div>
        {product.brand && (
          <p className="text-sm font-medium uppercase tracking-wide text-zaya">
            {product.brand}
          </p>
        )}
        <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-ink-muted">({product.reviewsCount} avis)</span>
          </span>
          <span className="text-ink-muted">·</span>
          <span className="text-ink-muted">{product.sold} vendus</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CONDITION_META[product.condition].badge}`}
          >
            {CONDITION_META[product.condition].label}
          </span>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-display text-3xl font-extrabold text-zaya sm:text-4xl">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="pb-1 text-lg text-ink-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-2">
          {outOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
              Rupture de stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
              <Check className="h-4 w-4" /> En stock
            </span>
          )}
        </div>

        {/* Quantité + actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-black/5"
              aria-label="Diminuer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-black/5"
              aria-label="Augmenter"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={addToCart}
            disabled={outOfStock}
            className="btn-ghost flex-1 disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            Ajouter au panier
          </button>
          <button
            onClick={buyNow}
            disabled={outOfStock}
            className="btn-primary flex-1 shadow-glow disabled:opacity-50"
          >
            Commander maintenant
          </button>
        </div>

        {/* Partage */}
        <div className="mt-6 border-t border-black/5 pt-5">
          <ShareButtons
            url={url}
            title={`${product.name} — ${formatPrice(product.price)}`}
            shareText="Découvrez ce produit et commandez directement sur ZAYA, avec livraison partout en Guinée."
          />
        </div>

        {/* Garanties */}
        <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-neutral-50 p-4 sm:grid-cols-3">
          {[
            { icon: Truck, t: "Livraison rapide", d: "Partout en Guinée" },
            { icon: ShieldCheck, t: "Paiement à la livraison", d: "Payez en recevant" },
            { icon: RefreshCcw, t: "Produit vérifié", d: "Qualité garantie" },
          ].map((g) => (
            <div key={g.t} className="flex items-center gap-2">
              <g.icon className="h-5 w-5 shrink-0 text-zaya" />
              <div>
                <p className="text-xs font-semibold text-ink">{g.t}</p>
                <p className="text-[11px] text-ink-muted">{g.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-6">
            <h2 className="mb-2 font-display text-lg font-bold">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
