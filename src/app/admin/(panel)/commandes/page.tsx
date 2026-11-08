import { prisma } from "@/lib/prisma";
import OrdersManager from "@/components/admin/OrdersManager";
import { SITE } from "@/lib/constants";
import { receiptUrl } from "@/lib/receipt";
import type { OrderStatus } from "@/components/admin/statusMeta";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [orders, drivers] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.driver.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const data = orders.map((o) => ({
    id: o.id,
    reference: o.reference,
    customerName: o.customerName,
    phone: o.phone,
    location: o.location,
    note: o.note,
    status: o.status as OrderStatus,
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    driverId: o.driverId,
    paid: o.paid,
    signature: o.signature,
    receivedBy: o.receivedBy,
    deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
    receiptUrl: receiptUrl(o.reference),
    items: o.items.map((i) => ({
      id: i.id,
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
    })),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Commandes</h1>
        <p className="text-sm text-ink-muted">{orders.length} commande(s)</p>
      </div>
      <OrdersManager orders={data} whatsapp={SITE.whatsapp} drivers={drivers} />
    </div>
  );
}
