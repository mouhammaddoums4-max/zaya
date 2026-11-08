export type OrderStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_LIVRAISON"
  | "LIVREE"
  | "ANNULEE";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string }
> = {
  EN_ATTENTE: { label: "En attente", badge: "bg-amber-100 text-amber-700" },
  CONFIRMEE: { label: "Confirmée", badge: "bg-blue-100 text-blue-700" },
  EN_LIVRAISON: { label: "En livraison", badge: "bg-indigo-100 text-indigo-700" },
  LIVREE: { label: "Livrée", badge: "bg-emerald-100 text-emerald-700" },
  ANNULEE: { label: "Annulée", badge: "bg-red-100 text-red-700" },
};
