import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let path = "/";
  try {
    const body = await req.json();
    path = String(body.path || "/").split("?")[0].slice(0, 200);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (
    !path.startsWith("/") ||
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/livreur")
  ) {
    return NextResponse.json({ ok: true });
  }

  const day = new Date().toISOString().slice(0, 10);
  try {
    await prisma.visit.upsert({
      where: { day_path: { day, path } },
      update: { count: { increment: 1 } },
      create: { day, path, count: 1 },
    });
  } catch {
    /* non bloquant */
  }
  return NextResponse.json({ ok: true });
}
