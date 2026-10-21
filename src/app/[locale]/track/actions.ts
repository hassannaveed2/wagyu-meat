"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { findOrderForTracking } from "@/db/queries/orders";
import { createRateLimiter } from "@/lib/auth/rate-limit";
import { pkPhoneSchema, type OrderStatus } from "@/lib/commerce/validation";

const limiter = createRateLimiter({ limit: 20, windowMs: 15 * 60 * 1000 });

export type TrackState =
  | { status: "idle" }
  | { status: "not-found" }
  | {
      status: "found";
      order: {
        orderNumber: string;
        status: OrderStatus;
        createdAt: string;
        deliveryDate: string;
        slot: string;
        totalPKR: number;
        items: { title: string; label: string; quantity: number }[];
      };
    };

export async function trackOrder(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const parsed = z
    .object({ orderNumber: z.string().trim().min(4).max(20), phone: pkPhoneSchema })
    .safeParse({ orderNumber: formData.get("orderNumber"), phone: formData.get("phone") });
  if (!parsed.success) return { status: "not-found" };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!limiter.hit(ip)) return { status: "not-found" };

  const order = await findOrderForTracking(parsed.data.orderNumber, parsed.data.phone);
  if (!order) return { status: "not-found" };
  return {
    status: "found",
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      deliveryDate: order.deliveryDate,
      slot: order.slot,
      totalPKR: order.totalPKR,
      items: order.items.map((item) => ({ title: item.title, label: item.label, quantity: item.quantity })),
    },
  };
}
