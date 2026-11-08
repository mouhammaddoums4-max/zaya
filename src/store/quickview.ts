"use client";

import { create } from "zustand";
import type { ProductCardData } from "@/lib/types";

type QuickViewState = {
  list: ProductCardData[];
  index: number;
  open: (list: ProductCardData[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

export const useQuickView = create<QuickViewState>((set, get) => ({
  list: [],
  index: -1,
  open: (list, index) => set({ list: list.length ? list : [], index }),
  close: () => set({ list: [], index: -1 }),
  next: () => {
    const { list, index } = get();
    if (index < list.length - 1) set({ index: index + 1 });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1 });
  },
}));
