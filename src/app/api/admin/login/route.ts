import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createSession, safeCompare } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";

// Limitation de tentatives (basique, en mémoire par instance)
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 10 * 60 * 1000; // 10 min
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
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
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !safeCompare(parsed.data.password, expected)) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 },
    );
  }

  const token = await createSession();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // succès -> on réinitialise le compteur
  attempts.delete(ip);

  return NextResponse.json({ ok: true });
}
