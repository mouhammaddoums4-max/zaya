"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/store/recentlyViewed";
import type { ProductCardData } from "@/lib/types";

export default function RecentlyViewedTracker({
  product,
}: {
  product: ProductCardData;
}) {
  const push = useRecentlyViewed((s) => s.push);
  useEffect(() => {
    push(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  return null;
}
