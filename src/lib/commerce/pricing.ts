export type CityPricing = {
  deliveryFeePKR: number;
  freeDeliveryThresholdPKR: number;
};

export type PricedLine = {
  sku: string;
  unitPricePKR: number;
  quantity: number;
};

export type CartTotals = {
  subtotal: number;
  delivery: number;
  total: number;
  remainingForFree: number;
};

export function pricePerKg(pricePKR: number, weightGrams: number): number {
  return Math.round((pricePKR / weightGrams) * 1000);
}

export function deliveryFee(subtotal: number, city: CityPricing): number {
  return subtotal >= city.freeDeliveryThresholdPKR ? 0 : city.deliveryFeePKR;
}

/** Totals for a priced cart. With no city chosen yet, delivery is not charged. */
export function cartTotals(lines: PricedLine[], city: CityPricing | null): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPricePKR * line.quantity, 0);
  const delivery = city ? deliveryFee(subtotal, city) : 0;
  const remainingForFree = city ? Math.max(0, city.freeDeliveryThresholdPKR - subtotal) : 0;
  return { subtotal, delivery, total: subtotal + delivery, remainingForFree };
}
