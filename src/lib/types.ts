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
  categoryName?: string;
  categorySlug?: string;
};

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
};
