import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [pending, toAssign] = await Promise.all([
    prisma.order.count({ where: { status: "EN_ATTENTE" } }),
    prisma.order.count({ where: { status: "CONFIRMEE", driverId: null } }),
  ]);
  return NextResponse.json({ pending, toAssign, total: pending + toAssign });
}
