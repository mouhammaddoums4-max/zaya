import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getDriverSession } from "@/lib/auth";
import { sendDeliveryNotification } from "@/lib/email";
import { sendSms } from "@/lib/sms";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  status: z.enum(["EN_LIVRAISON", "LIVREE"]),
  signature: z.string().max(2_000_000).optional(),
  receivedBy: z.string().trim().max(120).optional(),
});

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getDriverSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.driverId !== session.driverId) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  if (parsed.data.status === "EN_LIVRAISON") {
    if (order.status === "EN_LIVRAISON") {
      return NextResponse.json({ ok: true });
    }
    if (order.status !== "CONFIRMEE") {
      return NextResponse.json(
        { error: "Cette commande ne peut plus être prise en charge." },
        { status: 409 },
      );
    }
    const result = await prisma.order.updateMany({
      where: { id, driverId: session.driverId, status: "CONFIRMEE" },
      data: { status: "EN_LIVRAISON" },
    });
    if (result.count !== 1) {
      return NextResponse.json({ error: "La commande a déjà été modifiée." }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  }

  if (order.status !== "EN_LIVRAISON") {
    return NextResponse.json(
      { error: "Seule une commande en livraison peut être terminée." },
      { status: 409 },
    );
  }
  const data: {
    status: "LIVREE";
    signature?: string;
    receivedBy?: string;
    deliveredAt?: Date;
  } = { status: "LIVREE" };

  if (!parsed.data.signature) {
    return NextResponse.json(
      { error: "Signature du client requise pour confirmer la livraison" },
      { status: 400 },
    );
  }
  data.signature = parsed.data.signature;
  data.receivedBy = parsed.data.receivedBy || order.customerName;
  data.deliveredAt = new Date();

  const result = await prisma.order.updateMany({
    where: { id, driverId: session.driverId, status: "EN_LIVRAISON" },
    data,
  });
  if (result.count !== 1) {
    return NextResponse.json({ error: "La commande a déjà été modifiée." }, { status: 409 });
  }

  const adminSms = process.env.ADMIN_SMS_NUMBER || "224628358080";
  await Promise.allSettled([
    sendSms(
      adminSms,
      `ZAYA - Livraison effectuée: commande ${order.reference}, client ${order.customerName}, lieu ${order.location}, réceptionnée par ${data.receivedBy}.`,
    ),
    sendDeliveryNotification({
      reference: order.reference,
      customerName: order.customerName,
      location: order.location,
      receivedBy: data.receivedBy,
      deliveredAt: data.deliveredAt,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
