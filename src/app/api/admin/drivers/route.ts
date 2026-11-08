import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { driverSchema } from "@/lib/validation";
import { hashPin } from "@/lib/pin";
import { normalizePhoneGN } from "@/lib/sms";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = driverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const phone = normalizePhoneGN(d.phone) || d.phone.replace(/\s+/g, "");

  const exists = await prisma.driver.findUnique({ where: { phone } });
  if (exists) {
    return NextResponse.json(
      { error: "Un livreur avec ce numéro existe déjà" },
      { status: 400 },
    );
  }

  const driver = await prisma.driver.create({
    data: { name: d.name, phone, pinHash: hashPin(d.pin), photo: d.photo ?? null },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: driver.id });
}
