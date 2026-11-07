import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contentSchema } from "@/lib/validation";

export async function PUT(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = contentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }

  const data = {
    logo: parsed.data.logo ?? null,
    slides: parsed.data.slides,
    banners: parsed.data.banners,
    squareAds: parsed.data.squareAds,
  };

  await prisma.setting.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  return NextResponse.json({ ok: true });
}
