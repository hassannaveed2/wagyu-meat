import { z } from "zod";

export const PAYMENT_METHODS = ["cod", "bank-transfer", "jazzcash", "easypaisa", "card"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["pending", "paid", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** Pakistani mobile numbers, normalized to +92 3XX XXXXXXX. */
export const pkPhoneSchema = z
  .string()
  .transform((value) => value.replace(/[\s\-()]/g, ""))
  .pipe(z.string().regex(/^(?:\+?92|0)3\d{9}$/, "invalid-phone"))
  .transform((digits) => `+92${digits.replace(/^(?:\+?92|0)/, "")}`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? undefined : value))
    .optional();

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "required").max(120),
  phone: pkPhoneSchema,
  email: z
    .union([z.literal(""), z.email("invalid-email")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  citySlug: z.string().trim().min(1, "required"),
  address: z.string().trim().min(5, "required").max(300),
  area: z.string().trim().min(2, "required").max(120),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid-date"),
  slotIndex: z.number().int().min(0).max(20),
  notes: optionalText(500),
  paymentMethod: z.enum(PAYMENT_METHODS),
  isGift: z.boolean().default(false),
  giftMessage: optionalText(300),
  hidePrices: z.boolean().default(false),
  locale: z.enum(["en", "ja"]).default("en"),
  lines: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        sku: z.string().min(1).max(64),
        quantity: z.number(),
      }),
    )
    .min(1, "empty-cart")
    .max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
