import { NextResponse } from "next/server";
import { z } from "zod";
import { validatePromo } from "@/lib/promo";

const schema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.coerce.number().int().min(0),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Données invalides" }, { status: 400 });
  }

  const result = await validatePromo(parsed.data.code, parsed.data.subtotal);
  if (!result.ok) {
    return NextResponse.json(result, { status: 200 });
  }
  return NextResponse.json(result);
}
