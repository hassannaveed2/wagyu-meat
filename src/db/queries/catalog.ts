import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "../client";
import { categories, productCategories, productImages, products, productVariants, reviews } from "../schema";
import { localized, type Locale } from "@/lib/i18n-db";
import { pricePerKg } from "@/lib/commerce/pricing";
import type { CatalogVariant } from "@/lib/commerce/cart";

export const CATALOG_TAG = "catalog";
export const REVIEWS_TAG = "reviews";

export type Origin = "japan" | "australia";
export type Grade = "A5" | "A4" | "MB8-9" | "MB6-7" | "NA";

export type Variant = {
  id: number;
  sku: string;
  label: string;
  weightGrams: number;
  pricePKR: number;
  compareAtPKR: number | null;
  pricePerKg: number;
  inStock: boolean;
};

export type ProductImage = { url: string; alt: string };

export type ProductCard = {
  id: number;
  slug: string;
  name: string;
  short: string;
  origin: Origin;
  grade: Grade;
  bms: number | null;
  region: string;
  productType: string;
  storage: "frozen" | "chilled";
  halalCertified: boolean;
  image: ProductImage | null;
  variants: Variant[];
  fromPricePKR: number;
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  categorySlugs: string[];
  sortOrder: number;
  rating: { average: number; count: number } | null;
};

export type ProductDetail = ProductCard & {
  description: string;
  contents: string;
  cooking: string;
  storageNotes: string;
  serving: string;
  brand: string;
  halalBody: string;
  authenticityCertificate: boolean;
  images: ProductImage[];
  metaTitle: string;
  metaDescription: string;
};

export type Category = {
  id: number;
  slug: string;
  type: "origin" | "cut" | "occasion";
  name: string;
  description: string;
  image: string | null;
};

type ProductRow = typeof products.$inferSelect;

async function loadCatalog(locale: Locale): Promise<ProductDetail[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.published, true))
    .orderBy(asc(products.sortOrder), asc(products.id));
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);

  const [variantRows, imageRows, linkRows, reviewRows] = await Promise.all([
    db.select().from(productVariants).where(inArray(productVariants.productId, ids)).orderBy(asc(productVariants.sortOrder)),
    db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(asc(productImages.sortOrder)),
    db
      .select({ productId: productCategories.productId, slug: categories.slug })
      .from(productCategories)
      .innerJoin(categories, eq(categories.id, productCategories.categoryId))
      .where(inArray(productCategories.productId, ids)),
    db
      .select({ productId: reviews.productId, rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.approved, true)),
  ]);

  return rows.map((row) => toDetail(row, locale, variantRows, imageRows, linkRows, reviewRows));
}

function toDetail(
  row: ProductRow,
  locale: Locale,
  variantRows: (typeof productVariants.$inferSelect)[],
  imageRows: (typeof productImages.$inferSelect)[],
  linkRows: { productId: number; slug: string }[],
  reviewRows: { productId: number | null; rating: number }[],
): ProductDetail {
  const variants: Variant[] = variantRows
    .filter((v) => v.productId === row.id)
    .map((v) => ({
      id: v.id,
      sku: v.sku,
      label: localized(v.labelEn, v.labelJa, locale),
      weightGrams: v.weightGrams,
      pricePKR: v.pricePKR,
      compareAtPKR: v.compareAtPKR,
      pricePerKg: pricePerKg(v.pricePKR, v.weightGrams),
      inStock: v.inStock,
    }));
  const images = imageRows
    .filter((i) => i.productId === row.id)
    .map((i) => ({ url: i.url, alt: localized(i.altEn, i.altJa, locale) || localized(row.nameEn, row.nameJa, locale) }));
  const ratings = reviewRows.filter((r) => r.productId === row.id).map((r) => r.rating);
  const inStockPrices = variants.filter((v) => v.inStock).map((v) => v.pricePKR);
  const allPrices = variants.map((v) => v.pricePKR);

  return {
    id: row.id,
    slug: row.slug,
    name: localized(row.nameEn, row.nameJa, locale),
    short: localized(row.shortEn, row.shortJa, locale),
    origin: row.origin,
    grade: row.grade,
    bms: row.bms,
    region: localized(row.regionEn, row.regionJa, locale),
    productType: row.productType,
    storage: row.storage,
    halalCertified: row.halalCertified,
    image: images[0] ?? null,
    images,
    variants,
    fromPricePKR: Math.min(...(inStockPrices.length ? inStockPrices : allPrices.length ? allPrices : [0])),
    inStock: inStockPrices.length > 0,
    featured: row.featured,
    bestSeller: row.bestSeller,
    categorySlugs: linkRows.filter((l) => l.productId === row.id).map((l) => l.slug),
    sortOrder: row.sortOrder,
    rating: ratings.length
      ? { average: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10, count: ratings.length }
      : null,
    description: localized(row.descriptionEn, row.descriptionJa, locale),
    contents: localized(row.contentsEn, row.contentsJa, locale),
    cooking: localized(row.cookingEn, row.cookingJa, locale),
    storageNotes: localized(row.storageNotesEn, row.storageNotesJa, locale),
    serving: localized(row.servingEn, row.servingJa, locale),
    brand: row.brand,
    halalBody: row.halalBody,
    authenticityCertificate: row.authenticityCertificate,
    metaTitle: localized(row.metaTitleEn, row.metaTitleJa, locale),
    metaDescription: localized(row.metaDescriptionEn, row.metaDescriptionJa, locale),
  };
}

/** Every published product with variants, images and ratings, resolved for one locale. */
export async function getCatalog(locale: Locale): Promise<ProductDetail[]> {
  "use cache";
  cacheTag(CATALOG_TAG, REVIEWS_TAG);
  cacheLife("days");
  return loadCatalog(locale);
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<ProductDetail | null> {
  const catalog = await getCatalog(locale);
  return catalog.find((product) => product.slug === slug) ?? null;
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("days");
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    type: row.type,
    name: localized(row.nameEn, row.nameJa, locale),
    description: localized(row.descriptionEn, row.descriptionJa, locale),
    image: row.image,
  }));
}

/** Live (uncached) variant data for pricing an order at checkout. */
export async function getCatalogVariants(skus: string[]): Promise<CatalogVariant[]> {
  if (skus.length === 0) return [];
  const rows = await db
    .select({
      productId: productVariants.productId,
      sku: productVariants.sku,
      title: products.nameEn,
      label: productVariants.labelEn,
      weightGrams: productVariants.weightGrams,
      pricePKR: productVariants.pricePKR,
      inStock: productVariants.inStock,
      published: products.published,
    })
    .from(productVariants)
    .innerJoin(products, eq(products.id, productVariants.productId))
    .where(inArray(productVariants.sku, skus));
  return rows.map(({ published, ...variant }) => ({ ...variant, inStock: variant.inStock && published }));
}
