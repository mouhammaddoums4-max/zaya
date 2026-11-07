import { z } from "zod";

// Accepte : lien http(s), chemin interne (/api/img/...), ou data URL
export const imageUrl = z
  .string()
  .trim()
  .regex(/^(https?:\/\/|\/|data:image\/).+/i, "Image invalide");

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(160),
  categoryId: z.string().min(1, "Catégorie requise"),
  price: z.coerce.number().int().min(0, "Prix invalide"),
  compareAtPrice: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  description: z.string().trim().max(5000).optional().default(""),
  images: z.array(imageUrl).max(8).default([]),
  stock: z.coerce.number().int().min(0).default(100),
  brand: z.string().trim().max(80).optional().nullable(),
  rating: z.coerce.number().min(0).max(5).optional().default(4.6),
  sold: z.coerce.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  isFlashDeal: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  condition: z
    .enum(["NEUF", "OCCASION", "RECONDITIONNE"])
    .optional()
    .default("NEUF"),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(80),
  icon: z.string().trim().max(40).optional().nullable(),
  image: imageUrl.optional().nullable().or(z.literal("").transform(() => null)),
  parentId: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  order: z.coerce.number().int().min(0).optional().default(0),
});

const emptyToNull = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .nullable()
  .transform((v) => (v ? v : null));

const optText = z.string().trim().max(200).optional().default("");

const slideSchema = z.object({
  image: imageUrl,
  title: optText,
  subtitle: optText,
  cta: optText,
  link: optText,
});

const squareAdSchema = z.object({
  image: imageUrl,
  link: optText,
});

export const settingsSchema = z.object({
  popupEnabled: z.boolean().optional().default(false),
  popupImage: imageUrl.optional().nullable().or(z.literal("").transform(() => null)),
  popupLink: emptyToNull,
  popupTitle: emptyToNull,
  announcement: emptyToNull,
});

export const contentSchema = z.object({
  slides: z.array(slideSchema).max(10).default([]),
  banners: z.array(slideSchema).max(6).default([]),
  squareAds: z.array(squareAdSchema).max(12).default([]),
});

export const promoSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Code requis")
    .max(40)
    .transform((v) => v.toUpperCase().replace(/\s+/g, "")),
  type: z.enum(["PERCENT", "FIXED"]).default("PERCENT"),
  value: z.coerce.number().int().min(1, "Valeur invalide"),
  minOrder: z.coerce.number().int().min(0).optional().default(0),
  maxUses: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  active: z.boolean().optional().default(true),
  expiresAt: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "EN_ATTENTE",
    "CONFIRMEE",
    "EN_LIVRAISON",
    "LIVREE",
    "ANNULEE",
  ]),
});
