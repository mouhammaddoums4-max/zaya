import Link from "next/link";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { getStats } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { STATUS_META } from "@/components/admin/statusMeta";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getStats();
  const recent = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { items: true },
  });

  const cards = [
    { label: "Produits", value: stats.products, icon: Package, href: "/admin/produits" },
    { label: "Catégories", value: stats.categories, icon: FolderTree, href: "/admin/categories" },
    { label: "Commandes", value: stats.orders, icon: ShoppingCart, href: "/admin/commandes" },
    { label: "En attente", value: stats.pending, icon: Clock, href: "/admin/commandes" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-ink-muted">Bienvenue sur votre espace ZAYA</p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary">
          <Plus className="h-4 w-4" /> Nouveau produit
        </Link>
      </div>

      {/* Revenu */}
      <div className="mb-5 flex items-center justify-between rounded-3xl bg-gradient-to-r from-ink to-ink-soft p-6 text-white">
        <div>
          <p className="flex items-center gap-2 text-sm text-white/70">
            <TrendingUp className="h-4 w-4 text-zaya-400" /> Chiffre d'affaires (commandes confirmées)
          </p>
          <p className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            {formatPrice(stats.revenue)}
          </p>
        </div>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 transition hover:ring-zaya"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zaya-50 text-zaya">
                <c.icon className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-ink-muted transition group-hover:translate-x-1 group-hover:text-zaya" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{c.value}</p>
            <p className="text-sm text-ink-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Commandes récentes</h2>
          <Link
            href="/admin/commandes"
            className="text-sm font-semibold text-zaya hover:text-zaya-600"
          >
            Tout voir
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase text-ink-muted">
                  <th className="pb-2 pr-4">Référence</th>
                  <th className="pb-2 pr-4">Client</th>
                  <th className="pb-2 pr-4">Total</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const meta = STATUS_META[o.status];
                  return (
                    <tr key={o.id} className="border-b border-black/5 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs font-semibold">
                        {o.reference}
                      </td>
                      <td className="py-3 pr-4">
                        {o.customerName}
                        <span className="block text-xs text-ink-muted">{o.phone}</span>
                      </td>
                      <td className="py-3 pr-4 font-semibold">{formatPrice(o.total)}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${meta.badge}`}>
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
