"use client";

import { create } from "zustand";
import type { ProductCardData } from "@/lib/types";

type QuickViewState = {
  product: ProductCardData | null;
  open: (p: ProductCardData) => void;
  close: () => void;
};

export const useQuickView = create<QuickViewState>((set) => ({
  product: null,
  open: (p) => set({ product: p }),
  close: () => set({ product: null }),
}));
