import "server-only";
import { prisma } from "./prisma";

export type PromoResult =
  | { ok: true; code: string; discount: number; label: string }
  | { ok: false; error: string };

export function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export async function validatePromo(
  rawCode: string,
  subtotal: number,
): Promise<PromoResult> {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "Entrez un code" };

  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.active) {
    return { ok: false, error: "Code promo invalide" };
  }
  if (promo.expiresAt && promo.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: "Ce code a expiré" };
  }
  if (promo.maxUses != null && promo.used >= promo.maxUses) {
    return { ok: false, error: "Ce code n'est plus disponible" };
  }
  if (subtotal < promo.minOrder) {
    return {
      ok: false,
      error: `Montant minimum : ${new Intl.NumberFormat("fr-FR").format(promo.minOrder)} FG`,
    };
  }

  let discount =
    promo.type === "PERCENT"
      ? Math.round((subtotal * promo.value) / 100)
      : promo.value;
  discount = Math.min(discount, subtotal);

  const label =
    promo.type === "PERCENT"
      ? `-${promo.value}%`
      : `-${new Intl.NumberFormat("fr-FR").format(promo.value)} FG`;

  return { ok: true, code: promo.code, discount, label };
}
