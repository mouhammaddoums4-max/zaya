"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, MessageSquare, Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { SITE } from "@/lib/constants";
import { toast } from "@/components/Toaster";

export default function CommandePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, clear } = useCart();
  const subtotal = useCart((s) => s.subtotal());
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    location: "",
    note: "",
  });

  useEffect(() => setMounted(true), []);

  const deliveryFee =
    subtotal >= SITE.freeDeliveryThreshold ? 0 : SITE.deliveryFee;
  const total = subtotal + deliveryFee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast("Votre panier est vide", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la commande");
      }
      clear();
      router.push(
        `/commande/merci?ref=${encodeURIComponent(data.reference)}&total=${data.total}`,
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Une erreur est survenue", "error");
      setLoading(false);
    }
  };

  if (!mounted) return <div className="container-zaya py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-zaya flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Votre panier est vide</h1>
        <Link href="/boutique" className="btn-primary">
          Explorer la boutique
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-zaya focus:ring-2 focus:ring-zaya/20";

  return (
    <div className="container-zaya py-6 sm:py-8">
      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">
        Finaliser la commande
      </h1>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        {/* Coordonnées */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <h2 className="mb-4 font-display text-lg font-bold">
              Vos informations de livraison
            </h2>
            <p className="mb-4 text-sm text-ink-muted">
              Pas besoin de compte. Remplissez simplement ces informations, nous
              vous contactons pour confirmer. <strong>Paiement à la livraison.</strong>
            </p>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Nom complet *"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Numéro de téléphone * (ex. 620 00 00 00)"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Lieu de livraison * (quartier, ville)"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-4 h-4 w-4 text-ink-muted" />
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Note (optionnel) : repère, précision…"
                  rows={3}
                  className={`${inputClass} resize-none pt-3`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            Vos données sont confidentielles et utilisées uniquement pour la livraison.
          </div>
        </div>

        {/* Récap */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <h2 className="mb-4 font-display text-lg font-bold">Votre commande</h2>
            <div className="max-h-56 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zaya px-1 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium">{item.name}</p>
                    <p className="text-sm font-bold text-zaya">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 h-px bg-black/5" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Livraison</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600">Offerte</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold">
                <span>Total</span>
                <span className="font-display text-xl text-zaya">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-5 w-full shadow-glow"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                </>
              ) : (
                "Confirmer la commande"
              )}
            </button>
            <p className="mt-3 text-center text-xs text-ink-muted">
              En confirmant, vous acceptez d'être contacté pour la livraison.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
