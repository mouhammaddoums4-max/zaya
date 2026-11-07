import "server-only";
import { prisma } from "./prisma";

export type Segment = "VIP" | "RECURRENT" | "NOUVEAU";

const VIP_THRESHOLD = 2_000_000; // GNF

export function segmentOf(totalSpent: number, orderCount: number): Segment {
  if (totalSpent >= VIP_THRESHOLD || orderCount >= 5) return "VIP";
  if (orderCount >= 2) return "RECURRENT";
  return "NOUVEAU";
}

export type CrmRow = {
  name: string;
  phone: string;
  location: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: Date;
  firstOrder: Date;
  segment: Segment;
};

/** Agrège les clients à partir des commandes (regroupés par numéro). */
export async function getCrmClients(): Promise<CrmRow[]> {
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

  const map = new Map<
    string,
    Omit<CrmRow, "segment"> & { key: string }
  >();

  for (const o of orders) {
    const key = o.phone.replace(/\s+/g, "");
    const existing = map.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.total;
      if (o.createdAt > existing.lastOrder) existing.lastOrder = o.createdAt;
      if (o.createdAt < existing.firstOrder) existing.firstOrder = o.createdAt;
    } else {
      map.set(key, {
        key,
        name: o.customerName,
        phone: o.phone,
        location: o.location,
        orderCount: 1,
        totalSpent: o.total,
        lastOrder: o.createdAt,
        firstOrder: o.createdAt,
      });
    }
  }

  return Array.from(map.values())
    .map((c) => ({ ...c, segment: segmentOf(c.totalSpent, c.orderCount) }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}
