export const SITE = {
  name: "ZAYA",
  tagline: "Le meilleur du shopping en ligne en Guinée",
  description:
    "ZAYA — votre marketplace n°1 en Guinée. Téléphones, électronique, mode, maison, beauté et plus. Livraison rapide, paiement à la livraison, meilleurs prix en GNF.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zayamarket.store",
  email: "contact@zayamarket.store",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "224628358080",
  deliveryFee: 15000, // GNF, frais de livraison par défaut
  freeDeliveryThreshold: 1000000, // livraison offerte au-dessus de ce montant
};

export const SESSION_COOKIE = "zaya_session";
