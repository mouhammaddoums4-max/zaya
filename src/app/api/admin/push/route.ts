import { NextResponse } from "next/server";
import { z } from "zod";
import { sendPushToAll } from "@/lib/push";

const schema = z.object({
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().max(200).optional().default(""),
  url: z.string().trim().max(300).optional().default("/"),
  image: z.string().trim().max(500).optional().nullable(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }

  const result = await sendPushToAll({
    title: parsed.data.title,
    body: parsed.data.body,
    url: parsed.data.url || "/",
    image: parsed.data.image || undefined,
  });

  return NextResponse.json({ ok: true, ...result });
}
