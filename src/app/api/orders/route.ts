import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { orderReference } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { validatePromo } from "@/lib/promo";

const schema = z.object({
  customerName: z.string().trim().min(2, "Nom requis").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Numéro invalide")
    .max(20)
    .regex(/^[0-9+\s().-]+$/, "Numéro invalide"),
  location: z.string().trim().min(2, "Lieu de livraison requis").max(160),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  promoCode: z.string().trim().max(40).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "Panier vide")
    .max(50),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Sécurité : on recalcule TOUT depuis la base (jamais depuis le client)
  const ids = data.items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
  });

  if (products.length === 0) {
    return NextResponse.json(
      { error: "Aucun produit valide dans le panier" },
      { status: 400 },
    );
  }

  const lineItems = data.items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      const quantity = Math.min(item.quantity, product.stock || 99);
      if (quantity <= 0) return null;
      return {
        productId: product.id,
        productName: product.name,
        image: product.images[0] ?? null,
        price: product.price,
        quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "Produits indisponibles" },
      { status: 400 },
    );
  }

  const subtotal = lineItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee =
    subtotal >= SITE.freeDeliveryThreshold ? 0 : SITE.deliveryFee;

  // Code promo (revalidé côté serveur, jamais depuis le client)
  let discount = 0;
  let appliedCode: string | null = null;
  if (data.promoCode) {
    const promo = await validatePromo(data.promoCode, subtotal);
    if (promo.ok) {
      discount = promo.discount;
      appliedCode = promo.code;
    }
  }

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const order = await prisma.order.create({
    data: {
      reference: orderReference(),
      customerName: data.customerName,
      phone: data.phone,
      location: data.location,
      note: data.note || null,
      subtotal,
      deliveryFee,
      discount,
      promoCode: appliedCode,
      total,
      items: { create: lineItems },
    },
  });

  // Incrémente le compteur d'utilisation du code
  if (appliedCode) {
    await prisma.promoCode
      .update({
        where: { code: appliedCode },
        data: { used: { increment: 1 } },
      })
      .catch(() => null);
  }

  return NextResponse.json({
    ok: true,
    reference: order.reference,
    total: order.total,
  });
}
