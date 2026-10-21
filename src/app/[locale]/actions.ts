"use server";

import { z } from "zod";
import { addEnquiry, addSubscriber } from "@/db/queries/orders";
import { pkPhoneSchema } from "@/lib/commerce/validation";

export type FormState = { status: "idle" | "success" | "error" };

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ email: z.email().max(191), locale: z.enum(["en", "ja"]) })
    .safeParse({ email: formData.get("email"), locale: formData.get("locale") });
  if (!parsed.success) return { status: "error" };
  await addSubscriber(parsed.data.email.toLowerCase(), parsed.data.locale);
  return { status: "success" };
}

const enquirySchema = z.object({
  type: z.enum(["corporate", "contact"]),
  name: z.string().trim().min(2).max(120),
  phone: pkPhoneSchema,
  email: z
    .union([z.literal(""), z.email().max(191)])
    .optional()
    .transform((value) => value || null),
  company: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((value) => value || null),
  message: z.string().trim().min(5).max(2000),
});

export async function sendEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = enquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error" };
  await addEnquiry(parsed.data);
  return { status: "success" };
}
