import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/** Hache un code PIN (salt + scrypt). */
export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

/** Vérifie un code PIN contre son hash stocké (temps constant). */
export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  try {
    const computed = scryptSync(pin, salt, 32);
    const expected = Buffer.from(hash, "hex");
    return (
      computed.length === expected.length &&
      timingSafeEqual(computed, expected)
    );
  } catch {
    return false;
  }
}
