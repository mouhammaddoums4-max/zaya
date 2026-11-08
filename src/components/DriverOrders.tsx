"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Navigation,
  Package,
  LogOut,
  Check,
  Truck,
  Loader2,
  PenLine,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import SignaturePad from "./SignaturePad";
import { toast } from "./Toaster";

type Order = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  location: string;
  note: string | null;
  status: string;
  total: number;
  itemsCount: number;
  createdAt: string;
};

export default function DriverOrders({
  orders,
  driverName,
}: {
  orders: Order[];
  driverName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  // Signature de réception
  const [signOrder, setSignOrder] = useState<Order | null>(null);
  const [sigData, setSigData] = useState("");
  const [receivedBy, setReceivedBy] = useState("");

  const setStatus = async (
    id: string,
    status: "EN_LIVRAISON" | "LIVREE",
    extra?: { signature?: string; receivedBy?: string },
  ) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/livreur/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast(status === "LIVREE" ? "Livraison confirmée ✅" : "Course démarrée 🛵");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setBusy(null);
    }
  };

  const openSign = (o: Order) => {
    setSignOrder(o);
    setSigData("");
    setReceivedBy(o.customerName);
  };

  const confirmDelivery = async () => {
    if (!signOrder) return;
    if (!sigData) {
      toast("Faites signer le client avant de confirmer", "error");
      return;
    }
    await setStatus(signOrder.id, "LIVREE", {
      signature: sigData,
      receivedBy: receivedBy.trim() || signOrder.customerName,
    });
    setSignOrder(null);
  };

  const logout = async () => {
    await fetch("/api/livreur/logout", { method: "POST" });
    router.push("/livreur/login");
    router.refresh();
  };

  const pending = orders.filter((o) => o.status !== "LIVREE");
  const done = orders.filter((o) => o.status === "LIVREE");

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-ink px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Image src="/logo-zaya.png" alt="ZAYA" width={90} height={30} className="logo-white h-7 w-auto" />
          <span className="rounded bg-zaya px-1.5 py-0.5 text-[10px] font-bold">LIVREUR</span>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
          <LogOut className="h-4 w-4" /> Quitter
        </button>
      </header>

      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-1 font-display text-xl font-bold">Bonjour {driverName} 👋</h1>
        <p className="mb-5 text-sm text-ink-muted">
          {pending.length} livraison(s) à effectuer
        </p>

        {orders.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
            <Package className="mx-auto h-10 w-10 text-ink-muted" />
            <p className="mt-3 text-ink-muted">Aucune livraison assignée pour l'instant.</p>
          </div>
        )}

        <div className="space-y-3">
          {[...pending, ...done].map((o) => {
            const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.location)}`;
            const delivered = o.status === "LIVREE";
            return (
              <div
                key={o.id}
                className={`rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 ${delivered ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs font-bold text-ink-muted">{o.reference}</p>
                    <p className="font-display text-lg font-bold">{o.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-zaya">{formatPrice(o.total)}</p>
                    <p className="text-xs text-ink-muted">{o.itemsCount} article(s)</p>
                  </div>
                </div>

                <div className="mt-2 flex items-start gap-1.5 text-sm text-ink/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zaya" />
                  {o.location}
                </div>
                {o.note && <p className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-800">📝 {o.note}</p>}

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <a href={`tel:${o.phone}`} className="flex items-center justify-center gap-1 rounded-lg bg-neutral-100 py-2 text-xs font-semibold">
                    <Phone className="h-4 w-4" /> Appeler
                  </a>
                  <a href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 rounded-lg bg-[#25D366] py-2 text-xs font-semibold text-white">
                    WhatsApp
                  </a>
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 rounded-lg bg-ink py-2 text-xs font-semibold text-white">
                    <Navigation className="h-4 w-4" /> Itinéraire
                  </a>
                </div>

                {!delivered && (
                  <div className="mt-2 flex gap-2">
                    {o.status !== "EN_LIVRAISON" && (
                      <button onClick={() => setStatus(o.id, "EN_LIVRAISON")} disabled={busy === o.id} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zaya py-2 text-xs font-semibold text-zaya">
                        {busy === o.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Truck className="h-4 w-4" /> Prendre en charge</>}
                      </button>
                    )}
                    <button onClick={() => openSign(o)} disabled={busy === o.id} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white">
                      {busy === o.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><PenLine className="h-4 w-4" /> Livrer & faire signer</>}
                    </button>
                  </div>
                )}
                {delivered && (
                  <p className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-emerald-50 py-2 text-xs font-semibold text-emerald-600">
                    <Check className="h-4 w-4" /> Livré
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal signature de réception */}
      {signOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display font-bold">
                <PenLine className="h-5 w-5 text-zaya" /> Accusé de réception
              </h2>
              <button
                onClick={() => setSignOrder(null)}
                className="text-ink-muted hover:text-ink"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-ink-muted">
              Commande <b className="font-mono text-ink">{signOrder.reference}</b> —{" "}
              {formatPrice(signOrder.total)}
            </p>

            <label className="mt-4 block text-xs font-medium text-ink-muted">
              Nom du réceptionnaire
            </label>
            <input
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20"
              placeholder="Nom du client"
            />

            <label className="mt-4 block text-xs font-medium text-ink-muted">
              Signature du client
            </label>
            <div className="mt-1">
              <SignaturePad onChange={setSigData} />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSignOrder(null)}
                className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelivery}
                disabled={busy === signOrder.id || !sigData}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy === signOrder.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Confirmer la livraison
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
