"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Wallet,
  ShoppingBag,
  Sparkles,
  Phone,
  MapPin,
  Search,
  ChevronDown,
  Crown,
  Repeat,
  UserPlus,
  Download,
  Send,
  MessageSquare,
  Loader2,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { toast } from "@/components/Toaster";
import { STATUS_META, type OrderStatus } from "./statusMeta";
import { cn } from "@/lib/utils";

export type CrmOrder = {
  reference: string;
  status: OrderStatus;
  total: number;
  date: string;
  note: string | null;
};

export type CrmClient = {
  name: string;
  phone: string;
  location: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
  firstOrder: string;
  orders: CrmOrder[];
};

type Segment = "VIP" | "RECURRENT" | "NOUVEAU";

const VIP_THRESHOLD = 2_000_000; // GNF

function segmentOf(c: CrmClient): Segment {
  if (c.totalSpent >= VIP_THRESHOLD || c.orderCount >= 5) return "VIP";
  if (c.orderCount >= 2) return "RECURRENT";
  return "NOUVEAU";
}

const SEGMENT_META: Record<
  Segment,
  { label: string; badge: string; icon: typeof Crown }
> = {
  VIP: { label: "VIP", badge: "bg-amber-100 text-amber-700", icon: Crown },
  RECURRENT: { label: "Récurrent", badge: "bg-indigo-100 text-indigo-700", icon: Repeat },
  NOUVEAU: { label: "Nouveau", badge: "bg-emerald-100 text-emerald-700", icon: UserPlus },
};

type SortKey = "spent" | "recent" | "orders";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function CrmManager({ clients }: { clients: CrmClient[] }) {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<"TOUS" | Segment>("TOUS");
  const [sort, setSort] = useState<SortKey>("spent");
  const [open, setOpen] = useState<string | null>(null);

  // SMS promo
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsMsg, setSmsMsg] = useState("");
  const [smsSeg, setSmsSeg] = useState<"TOUS" | Segment>("TOUS");
  const [smsLoading, setSmsLoading] = useState(false);

  const sendSmsPromo = async () => {
    if (!smsMsg.trim()) return;
    setSmsLoading(true);
    try {
      const res = await fetch("/api/admin/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: smsMsg.trim(), segment: smsSeg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Envoi échoué");
      if (data.configured) {
        toast(`SMS envoyé à ${data.recipients} client(s) ✅`);
      } else {
        toast(
          `${data.recipients} destinataire(s) — SMS non configuré (Nimba)`,
          "error",
        );
      }
      setSmsMsg("");
      setSmsOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setSmsLoading(false);
    }
  };

  const enriched = useMemo(
    () => clients.map((c) => ({ ...c, segment: segmentOf(c) })),
    [clients],
  );

  // Statistiques globales
  const stats = useMemo(() => {
    const totalRevenue = enriched.reduce((s, c) => s + c.totalSpent, 0);
    const totalOrders = enriched.reduce((s, c) => s + c.orderCount, 0);
    const now = Date.now();
    const newCount = enriched.filter(
      (c) => now - new Date(c.firstOrder).getTime() <= 30 * 86400_000,
    ).length;
    return {
      clients: enriched.length,
      revenue: totalRevenue,
      avg: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
      newCount,
    };
  }, [enriched]);

  const segmentCounts = useMemo(() => {
    const c = { VIP: 0, RECURRENT: 0, NOUVEAU: 0 };
    for (const e of enriched) c[e.segment] += 1;
    return c;
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = enriched;
    if (segment !== "TOUS") list = list.filter((c) => c.segment === segment);
    if (q)
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q),
      );
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "spent") return b.totalSpent - a.totalSpent;
      if (sort === "orders") return b.orderCount - a.orderCount;
      return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
    });
    return sorted;
  }, [enriched, query, segment, sort]);

  const statCards = [
    { label: "Clients", value: String(stats.clients), icon: Users },
    { label: "CA total", value: formatPrice(stats.revenue), icon: Wallet },
    { label: "Panier moyen", value: formatPrice(stats.avg), icon: ShoppingBag },
    { label: "Nouveaux (30j)", value: String(stats.newCount), icon: Sparkles },
  ];

  const segChips: { key: "TOUS" | Segment; label: string }[] = [
    { key: "TOUS", label: `Tous (${enriched.length})` },
    { key: "VIP", label: `VIP (${segmentCounts.VIP})` },
    { key: "RECURRENT", label: `Récurrents (${segmentCounts.RECURRENT})` },
    { key: "NOUVEAU", label: `Nouveaux (${segmentCounts.NOUVEAU})` },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">CRM — Clients</h1>
          <p className="text-sm text-ink-muted">
            Fiches clients, segments et historique d&apos;achat (regroupés par numéro)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/admin/crm/export"
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold ring-1 ring-black/10 transition hover:text-zaya"
          >
            <Download className="h-4 w-4" /> Exporter (Excel)
          </a>
          <button
            onClick={() => setSmsOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-zaya px-3 py-2 text-sm font-semibold text-white transition hover:bg-zaya-600"
          >
            <MessageSquare className="h-4 w-4" /> SMS promo
          </button>
        </div>
      </div>

      {/* Composeur SMS promotionnel */}
      {smsOpen && (
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display font-bold">
              <MessageSquare className="h-5 w-5 text-zaya" /> SMS promotionnel
            </h2>
            <button
              onClick={() => setSmsOpen(false)}
              className="text-ink-muted hover:text-ink"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            <div>
              <textarea
                value={smsMsg}
                onChange={(e) => setSmsMsg(e.target.value)}
                rows={4}
                maxLength={480}
                placeholder="Ex. ZAYA : -20% ce week-end sur toute la boutique ! Commandez sur zayamarket.store"
                className="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20"
              />
              <p className="mt-1 text-right text-xs text-ink-muted">
                {smsMsg.length}/480
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">
                  Destinataires
                </label>
                <select
                  value={smsSeg}
                  onChange={(e) =>
                    setSmsSeg(e.target.value as "TOUS" | Segment)
                  }
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zaya"
                >
                  <option value="TOUS">Tous ({enriched.length})</option>
                  <option value="VIP">VIP ({segmentCounts.VIP})</option>
                  <option value="RECURRENT">
                    Récurrents ({segmentCounts.RECURRENT})
                  </option>
                  <option value="NOUVEAU">
                    Nouveaux ({segmentCounts.NOUVEAU})
                  </option>
                </select>
              </div>
              <button
                onClick={sendSmsPromo}
                disabled={smsLoading || !smsMsg.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zaya px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zaya-600 disabled:opacity-60"
              >
                {smsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Envoi via Nimba SMS. Nécessite les variables NIMBA_SERVICE_ID /
            NIMBA_SECRET_TOKEN côté serveur.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
              <s.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-tight">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher nom, numéro, localité…"
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zaya"
        >
          <option value="spent">Trier : dépense ↓</option>
          <option value="orders">Trier : commandes ↓</option>
          <option value="recent">Trier : plus récents</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {segChips.map((s) => (
          <button
            key={s.key}
            onClick={() => setSegment(s.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              segment === s.key
                ? "bg-zaya text-white"
                : "bg-white text-ink-muted ring-1 ring-black/10 hover:text-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card ring-1 ring-black/5">
          <Users className="mx-auto h-10 w-10 text-ink-muted" />
          <p className="mt-3 text-ink-muted">Aucun client trouvé.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const seg = SEGMENT_META[c.segment];
            const isOpen = open === c.phone;
            return (
              <div
                key={c.phone}
                className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : c.phone)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-neutral-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zaya-50 text-sm font-bold text-zaya">
                    {c.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{c.name}</p>
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                          seg.badge,
                        )}
                      >
                        <seg.icon className="h-3 w-3" />
                        {seg.label}
                      </span>
                    </div>
                    <p className="flex items-center gap-2 text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" /> {c.location}
                      </span>
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-zaya">
                      {formatPrice(c.totalSpent)}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {c.orderCount} cmd · dernier {fmtDate(c.lastOrder)}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-ink-muted transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-black/5 bg-neutral-50/60 px-4 py-4">
                    {/* Résumé + actions */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold ring-1 ring-black/10 hover:text-zaya"
                      >
                        <Phone className="h-3.5 w-3.5" /> Appeler
                      </a>
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-xs font-semibold text-white"
                      >
                        WhatsApp
                      </a>
                      <span className="ml-auto text-xs text-ink-muted">
                        Client depuis {fmtDate(c.firstOrder)}
                      </span>
                    </div>

                    {/* Historique commandes */}
                    <p className="mb-2 text-xs font-semibold uppercase text-ink-muted">
                      Historique ({c.orders.length})
                    </p>
                    <div className="space-y-1.5">
                      {c.orders.map((o) => {
                        const st = STATUS_META[o.status];
                        return (
                          <div
                            key={o.reference}
                            className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-black/5"
                          >
                            <span className="font-mono text-xs text-ink-muted">
                              {o.reference}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                st.badge,
                              )}
                            >
                              {st.label}
                            </span>
                            <span className="ml-auto text-xs text-ink-muted">
                              {fmtDate(o.date)}
                            </span>
                            <span className="w-24 text-right font-semibold text-zaya">
                              {formatPrice(o.total)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
