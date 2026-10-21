"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_QUANTITY_PER_LINE, type CartLine } from "@/lib/commerce/cart";
import { safeStorage } from "./safe-storage";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  lastAddedSku: string | null;
  add: (line: CartLine) => void;
  setQuantity: (sku: string, quantity: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const clamp = (quantity: number) => Math.max(1, Math.min(MAX_QUANTITY_PER_LINE, Math.round(quantity)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      lastAddedSku: null,
      add: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.sku === line.sku);
          const lines = existing
            ? state.lines.map((l) => (l.sku === line.sku ? { ...l, quantity: clamp(l.quantity + line.quantity) } : l))
            : [...state.lines, { ...line, quantity: clamp(line.quantity) }];
          return { lines, isOpen: true, lastAddedSku: line.sku };
        }),
      setQuantity: (sku, quantity) =>
        set((state) => ({ lines: state.lines.map((l) => (l.sku === sku ? { ...l, quantity: clamp(quantity) } : l)) })),
      remove: (sku) => set((state) => ({ lines: state.lines.filter((l) => l.sku !== sku) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, lastAddedSku: null }),
    }),
    {
      name: "wm-cart",
      storage: safeStorage,
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
