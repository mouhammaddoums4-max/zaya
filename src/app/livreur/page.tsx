import { redirect } from "next/navigation";
import { getDriverSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DriverOrders from "@/components/DriverOrders";

export const dynamic = "force-dynamic";
export const metadata = { title: "Espace livreur" };

export default async function DriverHome() {
  const session = await getDriverSession();
  if (!session) redirect("/livreur/login");

  const orders = await prisma.order.findMany({
    where: {
      driverId: session.driverId,
      status: { in: ["CONFIRMEE", "EN_LIVRAISON", "LIVREE"] },
    },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const data = orders.map((o) => ({
    id: o.id,
    reference: o.reference,
    customerName: o.customerName,
    phone: o.phone,
    location: o.location,
    note: o.note,
    status: o.status,
    total: o.total,
    itemsCount: o.items.reduce((n, i) => n + i.quantity, 0),
    createdAt: o.createdAt.toISOString(),
  }));

  return <DriverOrders orders={data} driverName={session.name || "Livreur"} />;
}
