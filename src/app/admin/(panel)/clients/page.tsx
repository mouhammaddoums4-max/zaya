import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Phone, MapPin, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerName: true,
      phone: true,
      location: true,
      total: true,
      createdAt: true,
    },
  });

  // Regroupe par numéro de téléphone
  const map = new Map<
    string,
    {
      name: string;
      phone: string;
      location: string;
      orders: number;
      total: number;
      last: Date;
    }
  >();

  for (const o of orders) {
    const key = o.phone.replace(/\s+/g, "");
    const existing = map.get(key);
    if (existing) {
      existing.orders += 1;
      existing.total += o.total;
    } else {
      map.set(key, {
        name: o.customerName,
        phone: o.phone,
        location: o.location,
        orders: 1,
        total: o.total,
        last: o.createdAt,
      });
    }
  }

  const clients = Array.from(map.values()).sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">CRM — Carnet client</h1>
        <p className="text-sm text-ink-muted">
          {clients.length} client(s) — regroupés par numéro
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card ring-1 ring-black/5">
          <Users className="mx-auto h-10 w-10 text-ink-muted" />
          <p className="mt-3 text-ink-muted">Aucun client pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-neutral-50 text-left text-xs uppercase text-ink-muted">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Localité</th>
                  <th className="px-4 py-3 text-center">Commandes</th>
                  <th className="px-4 py-3 text-right">Total dépensé</th>
                  <th className="px-4 py-3 text-right">Contact</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.phone} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="flex items-center gap-1 text-xs text-ink-muted">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {c.location}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-zaya-50 px-2 py-0.5 text-xs font-semibold text-zaya">
                        {c.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-zaya">
                      {formatPrice(c.total)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`tel:${c.phone}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-zaya-50 hover:text-zaya"
                          aria-label="Appeler"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 items-center gap-1 rounded-lg bg-[#25D366] px-2 text-xs font-semibold text-white"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
