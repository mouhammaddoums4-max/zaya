import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validation";

export async function PUT(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const data = {
    popupEnabled: d.popupEnabled ?? false,
    popupImage: d.popupImage ?? null,
    popupLink: d.popupLink ?? null,
    popupTitle: d.popupTitle ?? null,
    announcement: d.announcement ?? null,
  };

  await prisma.setting.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  return NextResponse.json({ ok: true });
}
