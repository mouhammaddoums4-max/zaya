import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let sub: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  try {
    const body = await req.json();
    sub = body.subscription || body;
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      update: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      create: {
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    });
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
