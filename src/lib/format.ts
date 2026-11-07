export const CURRENCY = "FG";

/** Formate un montant entier en Franc Guinéen : 2 850 000 FG */
export function formatPrice(value: number): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return `${formatted} ${CURRENCY}`;
}

/** Montant sans la devise : 2 850 000 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
