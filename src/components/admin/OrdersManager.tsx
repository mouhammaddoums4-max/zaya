"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  MapPin,
  Trash2,
  Loader2,
  ChevronDown,
  Package,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { STATUS_META, type OrderStatus } from "./statusMeta";
import { toast } from "@/components/Toaster";

type Item = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  location: string;
  note: string | null;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  driverId: string | null;
  paid: boolean;
  signature: string | null;
  receivedBy: string | null;
  deliveredAt: string | null;
  receiptUrl: string;
  items: Item[];
};

export default function OrdersManager({
  orders,
  whatsapp,
  drivers = [],
}: {
  orders: Order[];
  whatsapp: string;
  drivers?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const assignDriver = async (id: string, driverId: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: driverId || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'assignation");
      toast(
        driverId
          ? "Livreur assigné, commande en livraison ✅"
          : "Livreur retiré, commande repassée en confirmée",
      );
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur d'assignation", "error");
    } finally {
      setBusy(null);
    }
  };

  const acceptOrder = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible d'accepter la commande");
      toast("Commande confirmée ✅");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const cancelOrder = async (id: string, ref: string) => {
    if (!confirm(`Annuler la commande ${ref} ? Cette action sera conservée dans l'historique.`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancel: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible d'annuler la commande");
      toast("Commande annulée");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const markPaid = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      });
      if (!res.ok) throw new Error();
      toast("Paiement enregistré ✅ (reçu envoyé par SMS)");
      router.refresh();
    } catch {
      toast("Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string, ref: string) => {
    if (!confirm(`Supprimer la commande ${ref} ?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Suppression impossible");
      toast("Commande supprimée");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Suppression impossible", "error");
    } finally {
      setBusy(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-card ring-1 ring-black/5">
        <Package className="mx-auto h-10 w-10 text-ink-muted" />
        <p className="mt-3 text-ink-muted">Aucune commande pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const meta = STATUS_META[o.status];
        const open = openId === o.id;
        const waLink = `https://wa.me/${o.phone.replace(/[^0-9]/g, "")}`;
        return (
          <div
            key={o.id}
            className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5"
          >
            <button
              onClick={() => setOpenId(open ? null : o.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold">{o.reference}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{o.customerName}</p>
                <p className="text-xs text-ink-muted">
                  {new Date(o.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {o.items.reduce((n, i) => n + i.quantity, 0)} article(s)
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-zaya">{formatPrice(o.total)}</p>
                <ChevronDown
                  className={`ml-auto mt-1 h-4 w-4 text-ink-muted transition ${open ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {open && (
              <div className="border-t border-black/5 p-4">
                {/* Contact */}
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <a
                    href={`tel:${o.phone}`}
                    className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm"
                  >
                    <Phone className="h-4 w-4 text-zaya" /> {o.phone}
                  </a>
                  <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm">
                    <MapPin className="h-4 w-4 text-zaya" /> {o.location}
                  </div>
                </div>
                {o.note && (
                  <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    📝 {o.note}
                  </p>
                )}

                {/* Articles */}
                <div className="mb-4 space-y-1.5">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span className="text-ink/80">
                        {it.quantity} × {it.productName}
                      </span>
                      <span className="font-medium">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-black/5 pt-2 text-sm text-ink-muted">
                    <span>Livraison</span>
                    <span>{o.deliveryFee === 0 ? "Offerte" : formatPrice(o.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-zaya">{formatPrice(o.total)}</span>
                  </div>
                </div>

                {/* Preuve de livraison (signature client) */}
                {o.signature && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                    <p className="mb-2 text-xs font-semibold text-emerald-700">
                      ✓ Réception confirmée
                      {o.receivedBy ? ` par ${o.receivedBy}` : ""}
                      {o.deliveredAt
                        ? ` — ${new Date(o.deliveredAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}`
                        : ""}
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={o.signature}
                      alt="Signature du client"
                      className="h-24 w-auto rounded-lg border border-black/5 bg-white"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {o.status === "EN_ATTENTE" && (
                    <>
                      <button
                        onClick={() => acceptOrder(o.id)}
                        disabled={busy === o.id}
                        className="rounded-xl bg-zaya px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {busy === o.id ? "Traitement…" : "Accepter la commande"}
                      </button>
                      {!o.paid && (
                        <button
                          onClick={() => cancelOrder(o.id, o.reference)}
                          disabled={busy === o.id}
                          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
                        >
                          Annuler
                        </button>
                      )}
                    </>
                  )}
                  {o.status === "CONFIRMEE" && (
                    <>
                      <select
                        value={o.driverId || ""}
                        onChange={(e) => assignDriver(o.id, e.target.value)}
                        disabled={busy === o.id}
                        className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-zaya disabled:opacity-50"
                        aria-label="Assigner un livreur"
                      >
                        <option value="">Choisir un livreur</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      {!o.paid && (
                        <button
                          onClick={() => cancelOrder(o.id, o.reference)}
                          disabled={busy === o.id}
                          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
                        >
                          Annuler
                        </button>
                      )}
                    </>
                  )}
                  {o.status === "EN_LIVRAISON" && (
                    <select
                      value={o.driverId || ""}
                      onChange={(e) => assignDriver(o.id, e.target.value)}
                      disabled={busy === o.id}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-zaya disabled:opacity-50"
                      aria-label="Changer ou retirer le livreur"
                    >
                      <option value="">Retirer le livreur</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {(o.status === "LIVREE" || o.status === "ANNULEE") && (
                    <span className="rounded-xl bg-neutral-100 px-3 py-2 text-sm text-ink-muted">
                      {o.status === "LIVREE" ? "Livraison terminée" : "Commande annulée"}
                    </span>
                  )}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                  {o.paid ? (
                    <>
                      <a
                        href={o.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600"
                      >
                        ✓ Reçu
                      </a>
                      <a
                        href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour ${o.customerName}, voici le reçu de votre commande ${o.reference} chez ZAYA : ${o.receiptUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-sm font-semibold text-white"
                      >
                        Envoyer le reçu (WhatsApp)
                      </a>
                    </>
                  ) : o.status !== "ANNULEE" ? (
                    <button
                      onClick={() => markPaid(o.id)}
                      disabled={busy === o.id}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white"
                    >
                      {busy === o.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Enregistrer le paiement"
                      )}
                    </button>
                  ) : null}
                  {o.status === "EN_ATTENTE" && !o.paid && (
                    <button
                      onClick={() => remove(o.id, o.reference)}
                      disabled={busy === o.id}
                      className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      aria-label="Supprimer la commande en attente"
                    >
                      {busy === o.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
