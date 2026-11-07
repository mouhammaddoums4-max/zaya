import { prisma } from "@/lib/prisma";
import DriversManager from "@/components/admin/DriversManager";

export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const rows = drivers.map((d) => ({
    id: d.id,
    name: d.name,
    phone: d.phone,
    active: d.active,
    deliveries: d._count.orders,
  }));

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
