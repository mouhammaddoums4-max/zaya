import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo après compression
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  let body: { dataUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const dataUrl = body.dataUrl;
  if (!dataUrl || typeof dataUrl !== "string") {
    return NextResponse.json({ error: "Image manquante" }, { status: 400 });
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Format d'image invalide" }, { status: 400 });
  }

  const mime = match[1];
  if (!ALLOWED.includes(mime)) {
    return NextResponse.json({ error: "Type d'image non supporté" }, { status: 400 });
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    return NextResponse.json({ error: "Image trop volumineuse" }, { status: 400 });
  }

  const media = await prisma.mediaImage.create({
    data: { data: buffer, mime },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, url: `/api/img/${media.id}` });
}
