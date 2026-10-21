"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/commerce/validation";

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(ORDER_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  adminNotes: z.string().max(2000).optional(),
});

export async function updateOrder(formData: FormData): Promise<void> {
  await requireAdmin();
  const input = updateSchema.parse(Object.fromEntries(formData));
  await db
    .update(orders)
    .set({ status: input.status, paymentStatus: input.paymentStatus, adminNotes: input.adminNotes || null })
    .where(eq(orders.id, input.id));
  revalidatePath(`/admin/orders/${input.id}`);
  redirect(`/admin/orders/${input.id}?saved=1`);
}
