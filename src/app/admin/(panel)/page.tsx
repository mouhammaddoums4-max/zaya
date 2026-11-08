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
    {
      label: "Commandes",
      value: stats.orders,
      icon: ShoppingCart,
      href: "/admin/commandes",
      detail: "Toutes les commandes",
      iconTone: "bg-blue-50 text-blue-700",
    },
    {
      label: "À traiter",
      value: stats.pending,
      icon: Clock,
      href: "/admin/commandes",
      detail: "En attente de confirmation",
      iconTone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Produits",
      value: stats.products,
      icon: Package,
      href: "/admin/produits",
      detail: "Dans votre catalogue",
      iconTone: "bg-orange-50 text-orange-700",
    },
    {
      label: "Catégories",
      value: stats.categories,
      icon: FolderTree,
      href: "/admin/categories",
      detail: "Pour organiser la boutique",
      iconTone: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
            Vue d’ensemble
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Bonjour, bienvenue chez ZAYA
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Voici ce qui se passe dans votre boutique aujourd’hui.
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-100"
        >
          <Plus className="h-4 w-4" /> Ajouter un produit
        </Link>
      </div>

      <section
        aria-label="Résumé de la boutique"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconTone}`}
              >
                <card.icon className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
            </div>
            <p className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-950">
              {card.value.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{card.label}</p>
            <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
          </Link>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              Chiffre d’affaires
            </p>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {formatPrice(stats.revenue)}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Total des commandes confirmées, en livraison et livrées
            </p>
          </div>
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Gérer les commandes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Commandes récentes
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Suivez les dernières activités de vente.
            </p>
          </div>
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
          >
            Voir toutes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-5 py-3 font-semibold sm:px-6">Commande</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const meta = STATUS_META[o.status];
                  return (
                    <tr
                      key={o.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <Link
                          href="/admin/commandes"
                          className="font-mono text-xs font-semibold text-slate-800 hover:text-orange-700"
                        >
                          {o.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800">
                          {o.customerName}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {o.phone}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(o.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                        >
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
      </section>
    </div>
  );
}
