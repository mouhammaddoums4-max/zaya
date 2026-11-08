"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, MessageSquare, Loader2, ShieldCheck, Tag, Check, X, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { SITE } from "@/lib/constants";
import { toast } from "@/components/Toaster";
import { getEndOfDayCountdown } from "@/lib/format";

export default function CommandePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, clear } = useCart();
  const subtotal = useCart((s) => s.subtotal());
  const hasFlashDeal = items.some((item) => item.isFlashDeal);
  const [flashCountdown, setFlashCountdown] = useState<ReturnType<typeof getEndOfDayCountdown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    location: "",
    note: "",
  });

  // Code promo
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promo, setPromo] = useState<{
    code: string;
    discount: number;
    label: string;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!hasFlashDeal) {
      setFlashCountdown(null);
      return;
    }
    const updateCountdown = () => setFlashCountdown(getEndOfDayCountdown());
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [hasFlashDeal]);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, subtotal }),
      });
      const data = await res.json();
      if (data.ok) {
        setPromo({ code: data.code, discount: data.discount, label: data.label });
        toast("Code promo appliqué 🎉");
      } else {
        setPromo(null);
        setPromoError(data.error || "Code invalide");
      }
    } catch {
      setPromoError("Erreur de validation");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const deliveryFee =
    subtotal >= SITE.freeDeliveryThreshold ? 0 : SITE.deliveryFee;
  const discount = promo ? Math.min(promo.discount, subtotal) : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast("Votre panier est vide", "error");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      toast("Vous êtes hors ligne. Vérifiez votre connexion et réessayez.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          promoCode: promo?.code || "",
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
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;
      toast(
        offline
          ? "Connexion perdue. Votre commande n'a pas été envoyée, réessayez."
          : err instanceof Error
            ? err.message
            : "Une erreur est survenue",
        "error",
      );
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
              <br />
              📍 Après validation, vous pourrez <strong>partager votre localisation
              par WhatsApp</strong> pour une livraison plus rapide.
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

            {hasFlashDeal && flashCountdown && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <Zap className="h-4 w-4 shrink-0 text-amber-600" />
                  Votre vente flash se termine aujourd’hui
                </p>
                <p className="mt-1 text-xs">
                  Validez avant la fin du compte à rebours pour profiter de cette offre.
                </p>
                <p className="mt-2 text-center font-mono text-lg font-bold tabular-nums" aria-live="off">
                  {String(flashCountdown.h).padStart(2, "0")}:
                  {String(flashCountdown.m).padStart(2, "0")}:
                  {String(flashCountdown.s).padStart(2, "0")}
                </p>
              </div>
            )}

            <div className="my-4 h-px bg-black/5" />

            {/* Code promo */}
            <div className="mb-4">
              {promo ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <Check className="h-4 w-4" /> {promo.code} ({promo.label})
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-emerald-700/70 hover:text-emerald-900"
                    aria-label="Retirer le code"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                        placeholder="Code promo"
                        className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm uppercase outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="rounded-xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-50"
                    >
                      {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-1.5 text-xs text-red-500">{promoError}</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Remise ({promo?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
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
