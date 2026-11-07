"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardData } from "@/lib/types";

type RecentState = {
  items: ProductCardData[];
  push: (p: ProductCardData) => void;
};

export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set) => ({
      items: [],
      push: (p) =>
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== p.id);
          return { items: [p, ...filtered].slice(0, 12) };
        }),
    }),
    { name: "zaya-recent" },
  ),
);
