import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getDriverSession } from "@/lib/auth";

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

  const data: {
    status: "EN_LIVRAISON" | "LIVREE";
    signature?: string;
    receivedBy?: string;
    deliveredAt?: Date;
  } = { status: parsed.data.status };

  if (parsed.data.status === "LIVREE") {
    if (!parsed.data.signature) {
      return NextResponse.json(
        { error: "Signature du client requise pour confirmer la livraison" },
        { status: 400 },
      );
    }
    data.signature = parsed.data.signature;
    data.receivedBy = parsed.data.receivedBy || order.customerName;
    data.deliveredAt = new Date();
  }

  await prisma.order.update({ where: { id }, data });

  return NextResponse.json({ ok: true });
}
