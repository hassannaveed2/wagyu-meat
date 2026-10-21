import { describe, expect, it } from "vitest";
import { validateCartLines, type CatalogVariant } from "../cart";

const catalog: CatalogVariant[] = [
  { productId: 1, sku: "A5-RIB-300", title: "A5 Ribeye", label: "300 g", weightGrams: 300, pricePKR: 18000, inStock: true },
  { productId: 1, sku: "A5-RIB-500", title: "A5 Ribeye", label: "500 g", weightGrams: 500, pricePKR: 29000, inStock: false },
];

describe("validateCartLines", () => {
  it("prices lines from the catalog, ignoring anything the client sent", () => {
    const tampered = [{ productId: 1, sku: "A5-RIB-300", quantity: 2, unitPricePKR: 1 }];
    const result = validateCartLines(tampered, catalog);
    expect(result).toEqual({
      ok: true,
      lines: [
        {
          productId: 1,
          sku: "A5-RIB-300",
          title: "A5 Ribeye",
          label: "300 g",
          weightGrams: 300,
          unitPricePKR: 18000,
          quantity: 2,
        },
      ],
    });
  });

  it("rejects unknown SKUs", () => {
    const result = validateCartLines([{ productId: 9, sku: "NOPE", quantity: 1 }], catalog);
    expect(result).toEqual({ ok: false, errors: [{ sku: "NOPE", reason: "unknown" }] });
  });

  it("rejects out-of-stock variants", () => {
    const result = validateCartLines([{ productId: 1, sku: "A5-RIB-500", quantity: 1 }], catalog);
    expect(result).toEqual({ ok: false, errors: [{ sku: "A5-RIB-500", reason: "out-of-stock" }] });
  });

  it.each([0, 21, 1.5, -1])("rejects quantity %s", (quantity) => {
    const result = validateCartLines([{ productId: 1, sku: "A5-RIB-300", quantity }], catalog);
    expect(result).toEqual({ ok: false, errors: [{ sku: "A5-RIB-300", reason: "quantity" }] });
  });

  it("rejects an empty cart", () => {
    expect(validateCartLines([], catalog)).toEqual({ ok: false, errors: [{ sku: "", reason: "empty" }] });
  });

  it("merges duplicate SKUs before checking the quantity limit", () => {
    const lines = [
      { productId: 1, sku: "A5-RIB-300", quantity: 15 },
      { productId: 1, sku: "A5-RIB-300", quantity: 10 },
    ];
    expect(validateCartLines(lines, catalog)).toEqual({
      ok: false,
      errors: [{ sku: "A5-RIB-300", reason: "quantity" }],
    });
  });
});
