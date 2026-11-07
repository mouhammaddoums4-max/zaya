import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Données invalides" },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const category = await prisma.category.findUnique({
    where: { id: d.categoryId },
  });
  if (!category) {
    return NextResponse.json(
      { error: "Catégorie introuvable" },
      { status: 400 },
    );
  }

  const slug = `${slugify(d.name)}-${Math.random().toString(36).slice(2, 6)}`;

  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      description: d.description || "",
      price: d.price,
      compareAtPrice: d.compareAtPrice ?? null,
      images: d.images,
      stock: d.stock,
      brand: d.brand || null,
      rating: d.rating ?? 4.6,
      sold: d.sold ?? 0,
      featured: d.featured ?? false,
      isFlashDeal: d.isFlashDeal ?? false,
      active: d.active ?? true,
      categoryId: d.categoryId,
    },
  });

  return NextResponse.json({ ok: true, id: product.id });
}
