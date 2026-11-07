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
import { STATUS_META, STATUS_ORDER, type OrderStatus } from "./statusMeta";
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
      if (!res.ok) throw new Error("Erreur");
      toast(driverId ? "Livreur assigné ✅ (SMS envoyé)" : "Livreur retiré");
      router.refresh();
    } catch {
      toast("Erreur d'assignation", "error");
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

  const changeStatus = async (id: string, status: OrderStatus) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erreur");
      toast("Statut mis à jour ✅");
      router.refresh();
    } catch {
      toast("Impossible de changer le statut", "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string, ref: string) => {
    if (!confirm(`Supprimer la commande ${ref} ?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      toast("Commande supprimée");
      router.refresh();
    } catch {
      toast("Suppression impossible", "error");
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

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                    disabled={busy === o.id}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-zaya"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={o.driverId || ""}
                    onChange={(e) => assignDriver(o.id, e.target.value)}
                    disabled={busy === o.id}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-zaya"
                    title="Assigner un livreur"
                  >
                    <option value="">🛵 Aucun livreur</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                  {o.paid ? (
                    <a
                      href={o.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600"
                    >
                      ✓ Payé · Voir le reçu
                    </a>
                  ) : (
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
                  )}
                  <button
                    onClick={() => remove(o.id, o.reference)}
                    disabled={busy === o.id}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted hover:bg-red-50 hover:text-red-500"
                    aria-label="Supprimer"
                  >
                    {busy === o.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
