import { prisma } from "@/lib/prisma";
import DriversManager from "@/components/admin/DriversManager";

export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: { select: { status: true, total: true } },
    },
  });

  const rows = drivers.map((d) => {
    const assigned = d.orders.length;
    const delivered = d.orders.filter((o) => o.status === "LIVREE").length;
    const inProgress = d.orders.filter(
      (o) => o.status === "EN_LIVRAISON",
    ).length;
    const pending = d.orders.filter(
      (o) => o.status === "EN_ATTENTE" || o.status === "CONFIRMEE",
    ).length;
    const revenue = d.orders
      .filter((o) => o.status === "LIVREE")
      .reduce((s, o) => s + o.total, 0);
    return {
      id: d.id,
      name: d.name,
      phone: d.phone,
      photo: d.photo,
      active: d.active,
      assigned,
      delivered,
      inProgress,
      pending,
      revenue,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Livreurs</h1>
        <p className="text-sm text-ink-muted">
          Gérez vos livreurs — ils se connectent sur <b>/livreur</b> avec leur
          numéro et code PIN
        </p>
      </div>
      <DriversManager drivers={rows} />
    </div>
  );
}
