"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string;
};

type WishState = {
  items: WishItem[];
  toggle: (item: WishItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  count: () => number;
};

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          return {
            items: exists
              ? state.items.filter((i) => i.id !== item.id)
              : [...state.items, item],
          };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      has: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    { name: "zaya-wishlist" },
  ),
);
