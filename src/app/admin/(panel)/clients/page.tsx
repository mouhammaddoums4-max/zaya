import { prisma } from "@/lib/prisma";
import CrmManager, { type CrmClient, type CrmOrder } from "@/components/admin/CrmManager";

export const dynamic = "force-dynamic";

export default async function AdminCrmPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      reference: true,
      customerName: true,
      phone: true,
      location: true,
      note: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  // Regroupe par numéro de téléphone (normalisé)
  const map = new Map<string, CrmClient>();

  for (const o of orders) {
    const key = o.phone.replace(/\s+/g, "");
    const order: CrmOrder = {
      reference: o.reference,
      status: o.status,
      total: o.total,
      date: o.createdAt.toISOString(),
      note: o.note,
    };
    const existing = map.get(key);
    if (existing) {
      existing.orders.push(order);
      existing.orderCount += 1;
      existing.totalSpent += o.total;
      // les commandes sont déjà triées desc → la 1re vue est la plus récente
      if (o.createdAt.toISOString() < existing.firstOrder) {
        existing.firstOrder = o.createdAt.toISOString();
      }
    } else {
      map.set(key, {
        name: o.customerName,
        phone: o.phone,
        location: o.location,
        orderCount: 1,
        totalSpent: o.total,
        lastOrder: o.createdAt.toISOString(),
        firstOrder: o.createdAt.toISOString(),
        orders: [order],
      });
    }
  }

  const clients = Array.from(map.values());

  return <CrmManager clients={clients} />;
}
