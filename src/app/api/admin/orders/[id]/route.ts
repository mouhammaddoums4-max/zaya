import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/sms";
import { formatPrice } from "@/lib/format";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  status: z
    .enum(["EN_ATTENTE", "CONFIRMEE", "EN_LIVRAISON", "LIVREE", "ANNULEE"])
    .optional(),
  driverId: z.string().optional().nullable(),
});

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const data: { status?: string; driverId?: string | null } = {};
  if (parsed.data.status) data.status = parsed.data.status;
  const assigning =
    parsed.data.driverId !== undefined && parsed.data.driverId !== null;
  if (parsed.data.driverId !== undefined)
    data.driverId = parsed.data.driverId || null;

  const order = await prisma.order.update({
    where: { id },
    data: data as never,
  });

  // SMS au livreur lors de l'assignation
  if (assigning && parsed.data.driverId) {
    const driver = await prisma.driver.findUnique({
      where: { id: parsed.data.driverId },
    });
    if (driver) {
      await sendSms(
        driver.phone,
        `ZAYA Livraison: commande ${order.reference} pour ${order.customerName} (${order.phone}). Lieu: ${order.location}. Montant a encaisser: ${formatPrice(order.total)}. Connectez-vous a l'espace livreur.`,
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.order.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
