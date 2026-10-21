"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { CATALOG_TAG, REVIEWS_TAG } from "@/db/queries/catalog";
import { CITIES_TAG, GUIDES_TAG } from "@/db/queries/content";
import { categories, cities, enquiries, guides, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";

const text = (max: number) => z.string().trim().max(max).default("");
const flag = z.preprocess((value) => value === "on", z.boolean());
const id = z.coerce.number().int().positive();
const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/);
const optionalImage = z
  .string()
  .trim()
  .regex(/^(\/(images|uploads)\/[a-z0-9-]+\.(webp|jpg|png))?$/, "Image must be a /images/… or /uploads/… path")
  .transform((value) => value || null);

function form(formData: FormData) {
  return Object.fromEntries(formData) as Record<string, string>;
}

// ---------- Categories ----------

const categorySchema = z.object({
  id: id.optional(),
  slug,
  type: z.enum(["origin", "cut", "occasion"]),
  nameEn: z.string().trim().min(1).max(120),
  nameJa: text(120),
  descriptionEn: text(1000),
  descriptionJa: text(1000),
  image: optionalImage,
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function saveCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const { id: categoryId, ...values } = categorySchema.parse(form(formData));
  if (categoryId) await db.update(categories).set(values).where(eq(categories.id, categoryId));
  else await db.insert(categories).values(values);
  updateTag(CATALOG_TAG);
  redirect("/admin/categories?saved=1");
}

// ---------- Cities ----------

const citySchema = z.object({
  id: id.optional(),
  slug,
  nameEn: z.string().trim().min(1).max(80),
  nameJa: text(80),
  deliveryFeePKR: z.coerce.number().int().min(0).max(100_000),
  freeDeliveryThresholdPKR: z.coerce.number().int().min(0).max(10_000_000),
  leadTimeHours: z.coerce.number().int().min(0).max(240),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  slots: z.string().max(1000),
});

export async function saveCity(formData: FormData): Promise<void> {
  await requireAdmin("admin");
  const { id: cityId, slots: slotText, ...values } = citySchema.parse(form(formData));
  const deliveryDays = formData.getAll("deliveryDays").map(Number).filter((day) => day >= 0 && day <= 6);
  // One slot per line: "12–4 pm | 12時〜16時"
  const slots = slotText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [en, ja = ""] = line.split("|").map((part) => part.trim());
      return { en, ja };
    });
  const row = { ...values, slots, deliveryDays, active: formData.get("active") === "on" };
  if (cityId) await db.update(cities).set(row).where(eq(cities.id, cityId));
  else await db.insert(cities).values(row);
  updateTag(CITIES_TAG);
  redirect("/admin/cities?saved=1");
}

// ---------- Reviews ----------

export async function setReviewApproval(formData: FormData): Promise<void> {
  await requireAdmin();
  const reviewId = id.parse(formData.get("id"));
  await db.update(reviews).set({ approved: formData.get("approved") === "true" }).where(eq(reviews.id, reviewId));
  updateTag(REVIEWS_TAG);
  revalidatePath("/admin/reviews");
}

export async function deleteReview(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(reviews).where(eq(reviews.id, id.parse(formData.get("id"))));
  updateTag(REVIEWS_TAG);
  revalidatePath("/admin/reviews");
}

const reviewSchema = z.object({
  productId: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().int().positive().nullable()),
  name: z.string().trim().min(2).max(80),
  city: text(80),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(5).max(2000),
});

export async function addReview(formData: FormData): Promise<void> {
  await requireAdmin();
  const values = reviewSchema.parse(form(formData));
  await db.insert(reviews).values({ ...values, verified: formData.get("verified") === "on", approved: true });
  updateTag(REVIEWS_TAG);
  redirect("/admin/reviews?saved=1");
}

// ---------- Guides ----------

const guideSchema = z.object({
  id: id.optional(),
  slug,
  type: z.enum(["guide", "recipe"]),
  titleEn: z.string().trim().min(2).max(160),
  titleJa: text(160),
  excerptEn: text(300),
  excerptJa: text(300),
  bodyEn: text(30_000),
  bodyJa: text(30_000),
  heroImage: optionalImage,
  readingMinutes: z.coerce.number().int().min(1).max(60),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  published: flag,
});

export async function saveGuide(formData: FormData): Promise<void> {
  await requireAdmin();
  const { id: guideId, ...values } = guideSchema.parse({ ...form(formData), published: formData.get("published") ?? "off" });
  let savedId = guideId;
  if (guideId) await db.update(guides).set(values).where(eq(guides.id, guideId));
  else savedId = Number((await db.insert(guides).values(values))[0].insertId);
  updateTag(GUIDES_TAG);
  redirect(`/admin/guides/${savedId}?saved=1`);
}

// ---------- Enquiries ----------

export async function setEnquiryStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const status = z.enum(["new", "handled"]).parse(formData.get("status"));
  await db.update(enquiries).set({ status }).where(eq(enquiries.id, id.parse(formData.get("id"))));
  revalidatePath("/admin/enquiries");
}
