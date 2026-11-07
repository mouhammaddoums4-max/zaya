import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;

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

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: d.name,
      description: d.description || "",
      price: d.price,
      compareAtPrice: d.compareAtPrice ?? null,
      images: d.images,
      stock: d.stock,
      brand: d.brand || null,
      rating: d.rating ?? existing.rating,
      sold: d.sold ?? existing.sold,
      featured: d.featured ?? false,
      isFlashDeal: d.isFlashDeal ?? false,
      active: d.active ?? true,
      condition: d.condition ?? "NEUF",
      categoryId: d.categoryId,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
