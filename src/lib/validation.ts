import { z } from "zod";

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
  images: z.array(z.string().trim().url("URL d'image invalide")).max(8).default([]),
  stock: z.coerce.number().int().min(0).default(100),
  brand: z.string().trim().max(80).optional().nullable(),
  rating: z.coerce.number().min(0).max(5).optional().default(4.6),
  sold: z.coerce.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  isFlashDeal: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(80),
  icon: z.string().trim().max(40).optional().nullable(),
  image: z
    .string()
    .trim()
    .url("URL invalide")
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

export const settingsSchema = z.object({
  popupEnabled: z.boolean().optional().default(false),
  popupImage: z
    .string()
    .trim()
    .url("URL d'image invalide")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  popupLink: emptyToNull,
  popupTitle: emptyToNull,
  announcement: emptyToNull,
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
