import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/sms";
import { formatPrice } from "@/lib/format";
import { receiptUrl } from "@/lib/receipt";
import { SITE } from "@/lib/constants";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  accept: z.boolean().optional(),
  cancel: z.boolean().optional(),
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

  const operations = [
    parsed.data.accept === true,
    parsed.data.cancel === true,
    parsed.data.driverId !== undefined,
    parsed.data.paid !== undefined,
  ].filter(Boolean).length;
  if (operations !== 1) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  if (parsed.data.accept) {
    if (current.status !== "EN_ATTENTE") {
      return NextResponse.json(
        { error: "Seule une commande en attente peut être acceptée." },
        { status: 409 },
      );
    }
    const result = await prisma.order.updateMany({
      where: { id, status: "EN_ATTENTE" },
      data: { status: "CONFIRMEE" },
    });
    if (result.count !== 1) {
      return NextResponse.json({ error: "La commande a déjà été modifiée." }, { status: 409 });
    }
    return NextResponse.json({ ok: true, status: "CONFIRMEE" });
  }

  if (parsed.data.cancel) {
    if (!["EN_ATTENTE", "CONFIRMEE"].includes(current.status)) {
      return NextResponse.json(
        { error: "Une commande en livraison ou terminée ne peut plus être annulée." },
        { status: 409 },
      );
    }
    if (current.paid) {
      return NextResponse.json(
        { error: "Cette commande est déjà payée. Vérifiez le remboursement avant toute annulation." },
        { status: 409 },
      );
    }
    if (current.driverId) {
      return NextResponse.json(
        { error: "Retirez le livreur avant d'annuler la commande." },
        { status: 409 },
      );
    }
    const result = await prisma.order.updateMany({
      where: { id, status: current.status, driverId: null },
      data: { status: "ANNULEE" },
    });
    if (result.count !== 1) {
      return NextResponse.json({ error: "La commande a déjà été modifiée." }, { status: 409 });
    }
    return NextResponse.json({ ok: true, status: "ANNULEE" });
  }

  if (parsed.data.driverId !== undefined) {
    if (current.status !== "CONFIRMEE" && current.status !== "EN_LIVRAISON") {
      return NextResponse.json(
        { error: "Acceptez d'abord la commande avant de gérer son livreur." },
        { status: 409 },
      );
    }
    if (parsed.data.driverId) {
      const driver = await prisma.driver.findFirst({
        where: { id: parsed.data.driverId, active: true },
      });
      if (!driver) {
        return NextResponse.json({ error: "Livreur introuvable ou inactif." }, { status: 404 });
      }
    }

    const nextStatus = parsed.data.driverId
      ? "EN_LIVRAISON"
      : current.status === "EN_LIVRAISON"
        ? "CONFIRMEE"
        : current.status;
    const result = await prisma.order.updateMany({
      where: { id, status: current.status, driverId: current.driverId },
      data: { driverId: parsed.data.driverId || null, status: nextStatus },
    });
    if (result.count !== 1) {
      return NextResponse.json({ error: "La commande a déjà été modifiée." }, { status: 409 });
    }

    if (parsed.data.driverId && parsed.data.driverId !== current.driverId) {
      const [order, driver] = await Promise.all([
        prisma.order.findUniqueOrThrow({ where: { id } }),
        prisma.driver.findUniqueOrThrow({ where: { id: parsed.data.driverId } }),
      ]);
      await sendSms(
        driver.phone,
        `ZAYA Livraison: commande ${order.reference} pour ${order.customerName} (${order.phone}). Lieu: ${order.location}. A encaisser: ${formatPrice(order.total)}. Vos livraisons: ${SITE.url.replace(/\/$/, "")}/livreur`,
      );
    }
    return NextResponse.json({ ok: true, status: nextStatus });
  }

  if (parsed.data.paid !== undefined) {
    if (parsed.data.paid && current.status === "ANNULEE") {
      return NextResponse.json(
        { error: "Une commande annulée ne peut pas être marquée comme payée." },
        { status: 409 },
      );
    }
    if (parsed.data.paid === current.paid) {
      return NextResponse.json({ ok: true });
    }
    const result = await prisma.order.updateMany({
      where: { id, paid: current.paid },
      data: { paid: parsed.data.paid, paidAt: parsed.data.paid ? new Date() : null },
    });
    if (result.count !== 1) {
      return NextResponse.json({ error: "La commande a déjà été modifiée." }, { status: 409 });
    }

    if (parsed.data.paid) {
      await sendSms(
        current.phone,
        `ZAYA: Paiement recu pour la commande ${current.reference} (${formatPrice(current.total)}). Votre recu: ${receiptUrl(current.reference)} . Merci !`,
      );
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  // Les commandes traitées ou payées sont conservées dans l'historique.
  if (order.status !== "EN_ATTENTE" || order.paid || order.driverId) {
    return NextResponse.json(
      {
        error:
          "Seule une commande en attente, non payée et sans livreur peut être supprimée. Annulez les autres pour conserver leur historique.",
      },
      { status: 400 },
    );
  }

  const result = await prisma.order.deleteMany({
    where: { id, status: "EN_ATTENTE", paid: false, driverId: null },
  });
  if (result.count !== 1) {
    return NextResponse.json(
      { error: "La commande a été modifiée et ne peut plus être supprimée." },
      { status: 409 },
    );
  }
  return NextResponse.json({ ok: true });
}
