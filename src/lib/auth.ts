import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./constants";

const secretKey = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = { role: "admin"; iat?: number; exp?: number };

export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin") return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** À utiliser dans les Server Components / Server Actions. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Comparaison de mots de passe à temps constant (anti timing-attack). */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  if (bufA.length !== bufB.length) {
    // comparer quand même pour ne pas révéler la longueur par le timing
    let diff = 1;
    for (let i = 0; i < Math.max(bufA.length, bufB.length); i++) {
      diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) diff |= bufA[i] ^ bufB[i];
  return diff === 0;
}
