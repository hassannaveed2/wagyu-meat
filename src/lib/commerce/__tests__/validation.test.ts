import { describe, expect, it } from "vitest";
import { checkoutSchema, pkPhoneSchema } from "../validation";

describe("pkPhoneSchema", () => {
  it.each(["03001234567", "+923001234567", "0300-1234567", "92 300 1234567", "0300 123 4567"])(
    "normalizes %s",
    (input) => {
      expect(pkPhoneSchema.parse(input)).toBe("+923001234567");
    },
  );

  it.each(["12345", "04212345678", "+9230012345", "abc", ""])("rejects %s", (input) => {
    expect(pkPhoneSchema.safeParse(input).success).toBe(false);
  });
});

describe("checkoutSchema", () => {
  const valid = {
    name: "Ayesha Khan",
    phone: "0300-1234567",
    email: "",
    citySlug: "lahore",
    address: "House 12, Street 4",
    area: "DHA Phase 5",
    deliveryDate: "2026-10-24",
    slotIndex: 0,
    notes: "",
    paymentMethod: "cod",
    isGift: false,
    giftMessage: "",
    hidePrices: false,
    lines: [{ productId: 1, sku: "A5-RIB-300", quantity: 1 }],
  };

  it("accepts a complete order and normalizes the phone", () => {
    const parsed = checkoutSchema.parse(valid);
    expect(parsed.phone).toBe("+923001234567");
    expect(parsed.email).toBeUndefined();
  });

  it("rejects unknown payment methods", () => {
    expect(checkoutSchema.safeParse({ ...valid, paymentMethod: "crypto" }).success).toBe(false);
  });

  it("rejects malformed dates", () => {
    expect(checkoutSchema.safeParse({ ...valid, deliveryDate: "24/10/2026" }).success).toBe(false);
  });

  it("requires an address", () => {
    expect(checkoutSchema.safeParse({ ...valid, address: " " }).success).toBe(false);
  });
});
