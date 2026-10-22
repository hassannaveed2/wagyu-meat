"use server";

import { headers } from "next/headers";
import { getCatalogVariants } from "@/db/queries/catalog";
import { createRateLimiter } from "@/lib/auth/rate-limit";
import { createOrder, getCityForCheckout } from "@/db/queries/orders";
import { validateCartLines, type CartError } from "@/lib/commerce/cart";
import { checkDeliverySelection } from "@/lib/commerce/delivery";
import { cartTotals } from "@/lib/commerce/pricing";
import { checkoutSchema } from "@/lib/commerce/validation";

// Guards against scripted fake orders; generous enough for real customers retrying.
const orderLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });

export type PlaceOrderResult =
  | { ok: true; publicId: string; orderNumber: string }
  | {
      ok: false;
      error: "fields" | "city" | "date" | "slot" | "cart" | "unknown";
      fieldErrors?: Record<string, string>;
      cartErrors?: CartError[];
    };

export async function placeOrder(raw: unknown): Promise<PlaceOrderResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!orderLimiter.hit(ip)) return { ok: false, error: "unknown" };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message.startsWith("invalid-") || issue.message === "required" ? issue.message : "required";
    }
    return { ok: false, error: "fields", fieldErrors };
  }
  const input = parsed.data;

  try {
    const city = await getCityForCheckout(input.citySlug);
    if (!city) return { ok: false, error: "city" };

    const delivery = checkDeliverySelection(
      new Date(),
      { deliveryDays: city.deliveryDays, leadTimeHours: city.leadTimeHours, slots: city.slots.map((slot) => slot.en) },
      input.deliveryDate,
      input.slotIndex,
    );
    if (!delivery.ok) return { ok: false, error: delivery.error };

    const catalog = await getCatalogVariants(input.lines.map((line) => line.sku));
    const validation = validateCartLines(input.lines, catalog);
    if (!validation.ok) return { ok: false, error: "cart", cartErrors: validation.errors };

    const totals = cartTotals(
      validation.lines.map((line) => ({ sku: line.sku, unitPricePKR: line.unitPricePKR, quantity: line.quantity })),
      city,
    );
    const { orderNumber, publicId } = await createOrder({
      input,
      city: { id: city.id, name: city.nameEn },
      slot: delivery.slot,
      lines: validation.lines,
      totals,
    });
    return { ok: true, orderNumber, publicId };
  } catch (error) {
    console.error("placeOrder failed", error);
    return { ok: false, error: "unknown" };
  }
}
