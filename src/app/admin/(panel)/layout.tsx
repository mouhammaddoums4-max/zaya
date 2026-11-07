import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const pendingCount = await prisma.order.count({
    where: { status: "EN_ATTENTE" },
  });

  return <AdminShell pendingCount={pendingCount}>{children}</AdminShell>;
}
