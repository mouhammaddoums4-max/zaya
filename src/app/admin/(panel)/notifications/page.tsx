import { prisma } from "@/lib/prisma";
import PushForm from "@/components/admin/PushForm";

export const dynamic = "force-dynamic";

export default async function AdminPushPage() {
  const subscribers = await prisma.pushSubscription.count();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Notifications push</h1>
        <p className="text-sm text-ink-muted">
          Envoyez une notification à tous les visiteurs abonnés (promos, nouveautés…)
        </p>
      </div>
      <PushForm subscribers={subscribers} />
    </div>
  );
}
