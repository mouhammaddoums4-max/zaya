import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPin } from "@/lib/pin";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  active: z.boolean().optional(),
  pin: z
    .string()
    .trim()
    .regex(/^[0-9]{4,6}$/)
    .optional(),
  photo: z.string().max(2_000_000).nullish(),
});

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const data: { active?: boolean; pinHash?: string; photo?: string | null } = {};
  if (parsed.data.active !== undefined) data.active = parsed.data.active;
  if (parsed.data.pin) data.pinHash = hashPin(parsed.data.pin);
  if (parsed.data.photo !== undefined) data.photo = parsed.data.photo ?? null;

  await prisma.driver.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.driver.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
