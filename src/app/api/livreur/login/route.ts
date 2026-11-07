import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPin } from "@/lib/pin";
import { createDriverSession } from "@/lib/auth";
import { DRIVER_COOKIE } from "@/lib/constants";
import { normalizePhoneGN } from "@/lib/sms";

const schema = z.object({
  phone: z.string().trim().min(6).max(20),
  pin: z.string().trim().min(4).max(6),
});

const attempts = new Map<string, { count: number; first: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > 10 * 60 * 1000) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > 10;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Numéro et code requis" }, { status: 400 });
  }

  const phone = normalizePhoneGN(parsed.data.phone) || parsed.data.phone.replace(/\s+/g, "");
  const driver = await prisma.driver.findUnique({ where: { phone } });
  if (!driver || !driver.active || !verifyPin(parsed.data.pin, driver.pinHash)) {
    return NextResponse.json(
      { error: "Numéro ou code incorrect" },
      { status: 401 },
    );
  }

  const token = await createDriverSession(driver.id, driver.name);
  const store = await cookies();
  store.set(DRIVER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  attempts.delete(ip);

  return NextResponse.json({ ok: true });
}
