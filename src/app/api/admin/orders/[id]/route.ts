import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/sms";
import { formatPrice } from "@/lib/format";
import { receiptUrl } from "@/lib/receipt";
import { SITE } from "@/lib/constants";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  status: z
    .enum(["EN_ATTENTE", "CONFIRMEE", "EN_LIVRAISON", "LIVREE", "ANNULEE"])
    .optional(),
  driverId: z.string().optional().nullable(),
  paid: z.boolean().optional(),
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

  const current = await prisma.order.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const data: {
    status?: string;
    driverId?: string | null;
    paid?: boolean;
    paidAt?: Date | null;
  } = {};
  if (parsed.data.status) data.status = parsed.data.status;

  const assigning =
    parsed.data.driverId !== undefined && parsed.data.driverId !== null;
  if (parsed.data.driverId !== undefined)
    data.driverId = parsed.data.driverId || null;

  // Règle métier : on ne peut assigner un livreur qu'après acceptation
  if (assigning && current.status === "EN_ATTENTE") {
    return NextResponse.json(
      { error: "Acceptez d'abord la commande avant d'assigner un livreur." },
      { status: 400 },
    );
  }
  // Assigner un livreur passe automatiquement la commande en livraison
  if (assigning && (current.status === "CONFIRMEE" || current.status === "EN_ATTENTE")) {
    data.status = "EN_LIVRAISON";
  }

  const markingPaid = parsed.data.paid === true;
  if (parsed.data.paid !== undefined) {
    data.paid = parsed.data.paid;
    data.paidAt = parsed.data.paid ? new Date() : null;
  }

  const order = await prisma.order.update({
    where: { id },
    data: data as never,
  });

  // SMS au client avec le lien du reçu lors de l'enregistrement du paiement
  if (markingPaid) {
    await sendSms(
      order.phone,
      `ZAYA: Paiement recu pour la commande ${order.reference} (${formatPrice(order.total)}). Votre recu: ${receiptUrl(order.reference)} . Merci !`,
    );
  }

  // SMS au livreur lors de l'assignation
  if (assigning && parsed.data.driverId) {
    const driver = await prisma.driver.findUnique({
      where: { id: parsed.data.driverId },
    });
    if (driver) {
      await sendSms(
        driver.phone,
        `ZAYA Livraison: commande ${order.reference} pour ${order.customerName} (${order.phone}). Lieu: ${order.location}. A encaisser: ${formatPrice(order.total)}. Vos livraisons: ${SITE.url.replace(/\/$/, "")}/livreur`,
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  // Garde-fou : une commande engagée ne peut pas être supprimée
  if (["CONFIRMEE", "EN_LIVRAISON", "LIVREE"].includes(order.status)) {
    return NextResponse.json(
      {
        error:
          "Impossible de supprimer une commande confirmée, en livraison ou livrée. Annulez-la d'abord si nécessaire.",
      },
      { status: 400 },
    );
  }

  try {
    await prisma.order.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
