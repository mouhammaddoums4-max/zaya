import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promoSchema } from "@/lib/validation";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = promoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }
  const d = parsed.data;

  if (d.type === "PERCENT" && (d.value < 1 || d.value > 100)) {
    return NextResponse.json(
      { error: "Le pourcentage doit être entre 1 et 100" },
      { status: 400 },
    );
  }

  const exists = await prisma.promoCode.findUnique({ where: { code: d.code } });
  if (exists) {
    return NextResponse.json({ error: "Ce code existe déjà" }, { status: 400 });
  }

  const promo = await prisma.promoCode.create({
    data: {
      code: d.code,
      type: d.type,
      value: d.value,
      minOrder: d.minOrder ?? 0,
      maxUses: d.maxUses ?? null,
      active: d.active ?? true,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
    },
  });

  return NextResponse.json({ ok: true, id: promo.id });
}
