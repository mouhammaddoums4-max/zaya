export type ProductCondition = "NEUF" | "OCCASION" | "RECONDITIONNE";

export type ProductCardData = {
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
  condition: ProductCondition;
  categoryName?: string;
  categorySlug?: string;
};

export const CONDITION_META: Record<
  ProductCondition,
  { label: string; badge: string }
> = {
  NEUF: { label: "Neuf", badge: "bg-emerald-100 text-emerald-700" },
  OCCASION: { label: "Occasion", badge: "bg-amber-100 text-amber-700" },
  RECONDITIONNE: { label: "Reconditionné", badge: "bg-blue-100 text-blue-700" },
};

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  parentId?: string | null;
};

export type CategoryNode = CategoryData & { children: CategoryData[] };
