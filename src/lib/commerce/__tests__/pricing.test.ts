import { describe, expect, it } from "vitest";
import { cartTotals, deliveryFee, pricePerKg } from "../pricing";
import { formatPKR } from "../format";

const lahore = { deliveryFeePKR: 1500, freeDeliveryThresholdPKR: 25000 };

describe("pricePerKg", () => {
  it("scales the piece price to one kilogram", () => {
    expect(pricePerKg(12500, 250)).toBe(50000);
  });
  it("rounds to whole rupees", () => {
    expect(pricePerKg(10000, 300)).toBe(33333);
  });
});

describe("deliveryFee", () => {
  it("charges the city fee below the threshold", () => {
    expect(deliveryFee(24999, lahore)).toBe(1500);
  });
  it("is free at or above the threshold", () => {
    expect(deliveryFee(25000, lahore)).toBe(0);
  });
});

describe("cartTotals", () => {
  const lines = [
    { sku: "A5-RIB-300", unitPricePKR: 18000, quantity: 1 },
    { sku: "AU-STR-250", unitPricePKR: 4500, quantity: 1 },
  ];

  it("sums lines and adds the delivery fee", () => {
    expect(cartTotals(lines, lahore)).toEqual({
      subtotal: 22500,
      delivery: 1500,
      total: 24000,
      remainingForFree: 2500,
    });
  });

  it("drops the fee once free delivery is reached", () => {
    const more = [...lines, { sku: "AU-STR-250", unitPricePKR: 4500, quantity: 1 }];
    expect(cartTotals(more, lahore)).toEqual({
      subtotal: 27000,
      delivery: 0,
      total: 27000,
      remainingForFree: 0,
    });
  });

  it("charges no delivery when no city is chosen yet", () => {
    expect(cartTotals(lines, null)).toEqual({
      subtotal: 22500,
      delivery: 0,
      total: 22500,
      remainingForFree: 0,
    });
  });
});

describe("formatPKR", () => {
  it("formats with Rs prefix and thousands separators", () => {
    expect(formatPKR(1250000)).toBe("Rs 1,250,000");
    expect(formatPKR(0)).toBe("Rs 0");
  });
});
