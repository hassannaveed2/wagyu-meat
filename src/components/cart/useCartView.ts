"use client";

import { useCommerce, type CatalogEntry } from "@/components/commerce/CommerceProvider";
import type { CartLine } from "@/lib/commerce/cart";
import type { PricedLine } from "@/lib/commerce/pricing";
import { useCart } from "@/store/cart";

/** Joins stored cart lines with the current catalogue for display and estimated totals. */
export function useCartView(): {
  lines: { line: CartLine; entry: CatalogEntry | null }[];
  priced: PricedLine[];
  count: number;
} {
  const { catalog } = useCommerce();
  const stored = useCart((state) => state.lines);
  const lines = stored.map((line) => ({ line, entry: catalog[line.sku] ?? null }));
  const priced = lines
    .filter((l): l is { line: CartLine; entry: CatalogEntry } => l.entry !== null && l.entry.inStock)
    .map(({ line, entry }) => ({ sku: line.sku, unitPricePKR: entry.pricePKR, quantity: line.quantity }));
  return { lines, priced, count: stored.reduce((sum, line) => sum + line.quantity, 0) };
}
