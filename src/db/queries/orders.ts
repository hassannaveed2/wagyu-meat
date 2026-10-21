import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { cities, enquiries, orderItems, orders, subscribers } from "../schema";
import type { ValidatedLine } from "@/lib/commerce/cart";
import type { CartTotals } from "@/lib/commerce/pricing";
import type { CheckoutInput } from "@/lib/commerce/validation";

const ORDER_NUMBER_BASE = 24000;

export function orderNumberFor(id: number): string {
  return `WM-${ORDER_NUMBER_BASE + id}`;
}

/** Raw city row (both languages) for server-side checkout validation. */
export async function getCityForCheckout(slug: string) {
  const [city] = await db.select().from(cities).where(and(eq(cities.slug, slug), eq(cities.active, true)));
  return city ?? null;
}

export type NewOrder = {
  input: CheckoutInput;
  city: { id: number; name: string };
  slot: string;
  lines: ValidatedLine[];
  totals: CartTotals;
};

/** Inserts the order and its items in one transaction. */
export async function createOrder({ input, city, slot, lines, totals }: NewOrder): Promise<{ orderNumber: string; publicId: string }> {
  const publicId = randomBytes(16).toString("hex");
  return db.transaction(async (tx) => {
    const [result] = await tx.insert(orders).values({
      orderNumber: `TMP-${publicId.slice(0, 12)}`,
      publicId,
      paymentMethod: input.paymentMethod,
      customerName: input.name,
      customerPhone: input.phone,
      customerEmail: input.email ?? null,
      cityId: city.id,
      cityName: city.name,
      address: input.address,
      area: input.area,
      deliveryDate: input.deliveryDate,
      slot,
      notes: input.notes ?? null,
      isGift: input.isGift,
      giftMessage: input.isGift ? (input.giftMessage ?? null) : null,
      hidePrices: input.isGift && input.hidePrices,
      subtotalPKR: totals.subtotal,
      deliveryFeePKR: totals.delivery,
      totalPKR: totals.total,
      locale: input.locale,
    });
    const orderId = Number(result.insertId);
    const orderNumber = orderNumberFor(orderId);
    await tx.update(orders).set({ orderNumber }).where(eq(orders.id, orderId));
    await tx.insert(orderItems).values(
      lines.map((line) => ({
        orderId,
        productId: line.productId,
        sku: line.sku,
        title: line.title,
        label: line.label,
        weightGrams: line.weightGrams,
        unitPricePKR: line.unitPricePKR,
        quantity: line.quantity,
        lineTotalPKR: line.unitPricePKR * line.quantity,
      })),
    );
    return { orderNumber, publicId };
  });
}

export type OrderSummary = typeof orders.$inferSelect & { items: (typeof orderItems.$inferSelect)[] };

async function withItems(order: typeof orders.$inferSelect | undefined): Promise<OrderSummary | null> {
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getOrderByPublicId(publicId: string): Promise<OrderSummary | null> {
  if (!/^[a-f0-9]{32}$/.test(publicId)) return null;
  const [order] = await db.select().from(orders).where(eq(orders.publicId, publicId));
  return withItems(order);
}

/** Order lookup for customers: both the number and the phone must match. */
export async function findOrderForTracking(orderNumber: string, phone: string): Promise<OrderSummary | null> {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderNumber, orderNumber.trim().toUpperCase()), eq(orders.customerPhone, phone)));
  return withItems(order);
}

export async function addSubscriber(email: string, locale: string): Promise<void> {
  await db.insert(subscribers).values({ email, locale }).onDuplicateKeyUpdate({ set: { locale } });
}

export async function addEnquiry(values: typeof enquiries.$inferInsert): Promise<void> {
  await db.insert(enquiries).values(values);
}
