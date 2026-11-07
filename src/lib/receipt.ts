import "server-only";
import { createHmac } from "crypto";
import { SITE } from "./constants";

/** Jeton non devinable pour protéger l'accès au reçu. */
export function receiptToken(ref: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET || "zaya-receipt")
    .update(ref)
    .digest("hex")
    .slice(0, 12);
}

export function verifyReceiptToken(ref: string, token: string): boolean {
  if (!token) return false;
  const expected = receiptToken(ref);
  return token.length === expected.length && token === expected;
}

export function receiptUrl(ref: string): string {
  const base = SITE.url.replace(/\/$/, "");
  return `${base}/recu/${ref}?t=${receiptToken(ref)}`;
}
