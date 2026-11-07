import { prisma } from "@/lib/prisma";
import PromoManager from "@/components/admin/PromoManager";

export const dynamic = "force-dynamic";

export default async function AdminCodesPage() {
  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = promos.map((p) => ({
    id: p.id,
    code: p.code,
    type: p.type as "PERCENT" | "FIXED",
    value: p.value,
    minOrder: p.minOrder,
    maxUses: p.maxUses,
    used: p.used,
    active: p.active,
    expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Codes promo</h1>
        <p className="text-sm text-ink-muted">
          Créez des codes de réduction pour vos clients
        </p>
      </div>
      <PromoManager promos={rows} />
    </div>
  );
}
