export const MAX_QUANTITY_PER_LINE = 20;

/** What the browser sends: identifiers and quantity only. Any other field is ignored. */
export type CartLine = {
  productId: number;
  sku: string;
  quantity: number;
};

export type CatalogVariant = {
  productId: number;
  sku: string;
  title: string;
  label: string;
  weightGrams: number;
  pricePKR: number;
  inStock: boolean;
};

export type ValidatedLine = {
  productId: number;
  sku: string;
  title: string;
  label: string;
  weightGrams: number;
  unitPricePKR: number;
  quantity: number;
};

export type CartError = {
  sku: string;
  reason: "unknown" | "out-of-stock" | "quantity" | "empty";
};

export type CartValidation = { ok: true; lines: ValidatedLine[] } | { ok: false; errors: CartError[] };

function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY_PER_LINE;
}

/** Re-prices a cart from the catalog. Prices sent by the client are never trusted. */
export function validateCartLines(lines: CartLine[], catalog: CatalogVariant[]): CartValidation {
  if (lines.length === 0) return { ok: false, errors: [{ sku: "", reason: "empty" }] };

  const merged = new Map<string, number>();
  for (const line of lines) {
    merged.set(line.sku, (merged.get(line.sku) ?? 0) + line.quantity);
  }

  const bySku = new Map(catalog.map((variant) => [variant.sku, variant]));
  const errors: CartError[] = [];
  const validated: ValidatedLine[] = [];

  for (const [sku, quantity] of merged) {
    const variant = bySku.get(sku);
    if (!variant) {
      errors.push({ sku, reason: "unknown" });
    } else if (!variant.inStock) {
      errors.push({ sku, reason: "out-of-stock" });
    } else if (!isValidQuantity(quantity)) {
      errors.push({ sku, reason: "quantity" });
    } else {
      validated.push({
        productId: variant.productId,
        sku,
        title: variant.title,
        label: variant.label,
        weightGrams: variant.weightGrams,
        unitPricePKR: variant.pricePKR,
        quantity,
      });
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, lines: validated };
}
