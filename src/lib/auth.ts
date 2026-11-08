import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE, DRIVER_COOKIE } from "./constants";

function resolveSecret(): string {
  const secret = process.env.AUTH_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  // En production, un secret fort est OBLIGATOIRE : sans lui, n'importe qui
  // pourrait forger un jeton de session admin/livreur.
  if (isProd) {
    if (!secret || secret.length < 32) {
      throw new Error(
        "AUTH_SECRET manquant ou trop court (>= 32 caractères requis en production).",
      );
    }
    return secret;
  }

  if (!secret) {
    console.warn(
      "[auth] AUTH_SECRET non défini — utilisation d'un secret de développement NON sécurisé.",
    );
    return "dev-insecure-secret-change-me";
  }
  return secret;
}

// Clé calculée paresseusement (à l'exécution), jamais au build :
// évite de casser `next build` quand AUTH_SECRET n'est pas injecté.
let _encodedKey: Uint8Array | null = null;
function getKey(): Uint8Array {
  if (!_encodedKey) {
    _encodedKey = new TextEncoder().encode(resolveSecret());
  }
  return _encodedKey;
}

export type SessionPayload = { role: "admin"; iat?: number; exp?: number };

export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
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

// ---- Sessions LIVREUR ----
export type DriverSession = {
  role: "driver";
  driverId: string;
  name?: string;
  iat?: number;
  exp?: number;
};

export async function createDriverSession(
  driverId: string,
  name: string,
): Promise<string> {
  return new SignJWT({ role: "driver", driverId, name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getKey());
}

export async function verifyDriverSession(
  token: string | undefined | null,
): Promise<DriverSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "driver" || !payload.driverId) return null;
    return payload as DriverSession;
  } catch {
    return null;
  }
}

export async function getDriverSession(): Promise<DriverSession | null> {
  const store = await cookies();
  const token = store.get(DRIVER_COOKIE)?.value;
  return verifyDriverSession(token);
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
