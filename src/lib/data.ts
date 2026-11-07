import "server-only";
import { prisma } from "./prisma";
import type { ProductCardData, CategoryData } from "./types";

const productSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  images: true,
  rating: true,
  reviewsCount: true,
  sold: true,
  stock: true,
  brand: true,
  isFlashDeal: true,
  category: { select: { name: true, slug: true } },
} as const;

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  rating: number;
  reviewsCount: number;
  sold: number;
  stock: number;
  brand: string | null;
  isFlashDeal: boolean;
  category: { name: string; slug: string } | null;
};

function toCard(p: RawProduct): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    sold: p.sold,
    stock: p.stock,
    brand: p.brand,
    isFlashDeal: p.isFlashDeal,
    categoryName: p.category?.name,
    categorySlug: p.category?.slug,
  };
}

export async function getCategories(): Promise<CategoryData[]> {
  const cats = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, icon: true, image: true },
  });
  return cats;
}

export async function getFeaturedProducts(take = 10): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { sold: "desc" },
    take,
    select: productSelect,
  });
  return products.map(toCard);
}

export async function getFlashDeals(take = 12): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { active: true, isFlashDeal: true },
    orderBy: { updatedAt: "desc" },
    take,
    select: productSelect,
  });
  return products.map(toCard);
}

export async function getNewProducts(take = 12): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take,
    select: productSelect,
  });
  return products.map(toCard);
}

export async function getBestSellers(take = 12): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sold: "desc" },
    take,
    select: productSelect,
  });
  return products.map(toCard);
}

export async function getPromoProducts(take = 60): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { active: true, compareAtPrice: { not: null } },
    orderBy: { sold: "desc" },
    take,
    select: productSelect,
  });
  return products.map(toCard);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  take = 6,
): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { active: true, categoryId, id: { not: excludeId } },
    orderBy: { sold: "desc" },
    take,
    select: productSelect,
  });
  return products.map(toCard);
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export type ProductQuery = {
  q?: string;
  category?: string;
  sort?: string;
  min?: number;
  max?: number;
};

export async function searchProducts(
  query: ProductQuery,
): Promise<ProductCardData[]> {
  const where: Record<string, unknown> = { active: true };
  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
      { brand: { contains: query.q, mode: "insensitive" } },
    ];
  }
  if (query.category) {
    where.category = { slug: query.category };
  }
  if (query.min != null || query.max != null) {
    where.price = {};
    if (query.min != null) (where.price as Record<string, number>).gte = query.min;
    if (query.max != null) (where.price as Record<string, number>).lte = query.max;
  }

  let orderBy: Record<string, string> = { sold: "desc" };
  switch (query.sort) {
    case "prix-asc":
      orderBy = { price: "asc" };
      break;
    case "prix-desc":
      orderBy = { price: "desc" };
      break;
    case "nouveau":
      orderBy = { createdAt: "desc" };
      break;
    case "populaire":
    default:
      orderBy = { sold: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: 60,
    select: productSelect,
  });
  return products.map(toCard);
}

export type Slide = {
  image: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  link?: string;
};
export type Banner = Slide;
export type SquareAd = { image: string; link?: string };

export type SiteSettings = {
  id: string;
  popupEnabled: boolean;
  popupImage: string | null;
  popupLink: string | null;
  popupTitle: string | null;
  announcement: string | null;
  slides: Slide[];
  banners: Banner[];
  squareAds: SquareAd[];
};

function parseArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v) => v && typeof v === "object" && typeof (v as { image?: unknown }).image === "string" && (v as { image: string }).image.length > 4,
  ) as T[];
}

export async function getSettings(): Promise<SiteSettings> {
  const s = await prisma.setting.findUnique({ where: { id: "main" } });
  return {
    id: "main",
    popupEnabled: s?.popupEnabled ?? false,
    popupImage: s?.popupImage ?? null,
    popupLink: s?.popupLink ?? null,
    popupTitle: s?.popupTitle ?? null,
    announcement: s?.announcement ?? null,
    slides: parseArray<Slide>(s?.slides),
    banners: parseArray<Banner>(s?.banners),
    squareAds: parseArray<SquareAd>(s?.squareAds),
  };
}

export async function getStats() {
  const [products, categories, orders, pending] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "EN_ATTENTE" } }),
  ]);
  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ["CONFIRMEE", "EN_LIVRAISON", "LIVREE"] } },
  });
  return {
    products,
    categories,
    orders,
    pending,
    revenue: revenue._sum.total ?? 0,
  };
}
