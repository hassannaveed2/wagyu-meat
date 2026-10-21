import "server-only";
import { and, asc, desc, eq, isNull, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "../client";
import { cities, guides, reviews, siteSettings } from "../schema";
import { localized, type Locale } from "@/lib/i18n-db";
import { parseSettings, type SiteSettings } from "@/lib/settings";
import { REVIEWS_TAG } from "./catalog";

export const CITIES_TAG = "cities";
export const SETTINGS_TAG = "settings";
export const GUIDES_TAG = "guides";

export type City = {
  id: number;
  slug: string;
  name: string;
  deliveryFeePKR: number;
  freeDeliveryThresholdPKR: number;
  deliveryDays: number[];
  slots: string[];
  leadTimeHours: number;
};

export async function getCities(locale: Locale): Promise<City[]> {
  "use cache";
  cacheTag(CITIES_TAG);
  cacheLife("days");
  const rows = await db.select().from(cities).where(eq(cities.active, true)).orderBy(asc(cities.sortOrder));
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: localized(row.nameEn, row.nameJa, locale),
    deliveryFeePKR: row.deliveryFeePKR,
    freeDeliveryThresholdPKR: row.freeDeliveryThresholdPKR,
    deliveryDays: row.deliveryDays,
    slots: row.slots.map((slot) => localized(slot.en, slot.ja, locale)),
    leadTimeHours: row.leadTimeHours,
  }));
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("days");
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  return parseSettings(row?.data);
}

export type Review = {
  id: number;
  productId: number | null;
  name: string;
  city: string;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: string;
};

/** Approved reviews; for a product, includes general store reviews after its own. */
export async function getReviews(productId?: number, limit = 12): Promise<Review[]> {
  "use cache";
  cacheTag(REVIEWS_TAG);
  cacheLife("days");
  const where = productId
    ? and(eq(reviews.approved, true), or(eq(reviews.productId, productId), isNull(reviews.productId)))
    : eq(reviews.approved, true);
  const rows = await db.select().from(reviews).where(where).orderBy(desc(reviews.createdAt)).limit(limit * 2);
  const sorted = productId ? [...rows].sort((a, b) => Number(b.productId === productId) - Number(a.productId === productId)) : rows;
  return sorted.slice(0, limit).map((row) => ({
    id: row.id,
    productId: row.productId,
    name: row.name,
    city: row.city,
    rating: row.rating,
    body: row.body,
    verified: row.verified,
    createdAt: row.createdAt.toISOString(),
  }));
}

export type Guide = {
  slug: string;
  type: "guide" | "recipe";
  title: string;
  excerpt: string;
  body: string;
  heroImage: string | null;
  readingMinutes: number;
};

export async function getGuides(locale: Locale): Promise<Guide[]> {
  "use cache";
  cacheTag(GUIDES_TAG);
  cacheLife("days");
  const rows = await db.select().from(guides).where(eq(guides.published, true)).orderBy(asc(guides.sortOrder));
  return rows.map((row) => ({
    slug: row.slug,
    type: row.type,
    title: localized(row.titleEn, row.titleJa, locale),
    excerpt: localized(row.excerptEn, row.excerptJa, locale),
    body: localized(row.bodyEn, row.bodyJa, locale),
    heroImage: row.heroImage,
    readingMinutes: row.readingMinutes,
  }));
}

export async function getGuide(slug: string, locale: Locale): Promise<Guide | null> {
  const all = await getGuides(locale);
  return all.find((guide) => guide.slug === slug) ?? null;
}
