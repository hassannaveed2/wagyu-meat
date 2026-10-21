"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { CATALOG_TAG } from "@/db/queries/catalog";
import { productCategories, productImages, products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { saveImageUpload, UploadError } from "@/lib/storage";

const text = (max: number) => z.string().trim().max(max).default("");
const flag = z.preprocess((value) => value === "on" || value === "true", z.boolean());

const variantSchema = z.object({
  sku: z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9-]+$/, "SKUs may only contain letters, numbers and dashes"),
  labelEn: z.string().trim().min(1).max(80),
  labelJa: text(80),
  weightGrams: z.coerce.number().int().min(0).max(100_000),
  pricePKR: z.coerce.number().int().min(1).max(10_000_000),
  compareAtPKR: z.coerce.number().int().min(0).max(10_000_000).nullable().optional(),
  inStock: z.boolean(),
});

const imageSchema = z.object({
  url: z.string().regex(/^\/(images|uploads)\/[a-z0-9-]+\.(webp|jpg|png)$/),
  altEn: text(200),
  altJa: text(200),
});

const productSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and dashes"),
  nameEn: z.string().trim().min(2).max(160),
  nameJa: text(160),
  shortEn: text(300),
  shortJa: text(300),
  descriptionEn: text(10_000),
  descriptionJa: text(10_000),
  regionEn: text(120),
  regionJa: text(120),
  contentsEn: text(4000),
  contentsJa: text(4000),
  cookingEn: text(6000),
  cookingJa: text(6000),
  storageNotesEn: text(4000),
  storageNotesJa: text(4000),
  servingEn: text(200),
  servingJa: text(200),
  metaTitleEn: text(160),
  metaTitleJa: text(160),
  metaDescriptionEn: text(300),
  metaDescriptionJa: text(300),
  origin: z.enum(["japan", "australia"]),
  grade: z.enum(["A5", "A4", "MB8-9", "MB6-7", "NA"]),
  bms: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().min(1).max(12).nullable()),
  brand: text(120),
  productType: z.enum(["steak", "sliced", "burger", "bundle", "gift-card"]),
  storage: z.enum(["frozen", "chilled"]),
  halalCertified: flag,
  halalBody: text(160),
  authenticityCertificate: flag,
  featured: flag,
  bestSeller: flag,
  published: flag,
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  categoryIds: z.array(z.coerce.number().int().positive()).default([]),
  variants: z.array(variantSchema).min(1, "Add at least one size/variant"),
  images: z.array(imageSchema).default([]),
});

export type SaveState = { error?: string };

function field(formData: FormData, key: string) {
  return formData.get(key) ?? undefined;
}

function readForm(formData: FormData) {
  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(productSchema.shape)) {
    if (key === "categoryIds" || key === "variants" || key === "images") continue;
    raw[key] = field(formData, key);
  }
  for (const key of ["halalCertified", "authenticityCertificate", "featured", "bestSeller", "published"]) {
    raw[key] = formData.get(key) ?? "false";
  }
  raw.categoryIds = formData.getAll("categoryIds");
  raw.variants = parseJsonList(formData.get("variants"));
  raw.images = parseJsonList(formData.get("images"));
  return raw;
}

function parseJsonList(value: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(value ?? "[]"));
  } catch {
    return null; // rejected by the schema with a readable message
  }
}

export async function saveProduct(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: `${issue.path.join(".") || "Form"}: ${issue.message}` };
  }
  const { id, categoryIds, variants, images, ...values } = parsed.data;

  const skus = variants.map((v) => v.sku.toUpperCase());
  if (new Set(skus).size !== skus.length) return { error: "Each variant needs a unique SKU." };

  let productId = id;
  try {
    await db.transaction(async (tx) => {
      if (productId) {
        await tx.update(products).set(values).where(eq(products.id, productId));
      } else {
        const [result] = await tx.insert(products).values(values);
        productId = Number(result.insertId);
      }
      const pid = productId!;
      await tx.delete(productVariants).where(eq(productVariants.productId, pid));
      await tx.insert(productVariants).values(
        variants.map((v, index) => ({ ...v, sku: v.sku.toUpperCase(), compareAtPKR: v.compareAtPKR || null, productId: pid, sortOrder: index })),
      );
      await tx.delete(productImages).where(eq(productImages.productId, pid));
      if (images.length) {
        await tx.insert(productImages).values(images.map((image, index) => ({ ...image, productId: pid, sortOrder: index })));
      }
      await tx.delete(productCategories).where(eq(productCategories.productId, pid));
      if (categoryIds.length) {
        await tx.insert(productCategories).values([...new Set(categoryIds)].map((categoryId) => ({ productId: pid, categoryId })));
      }
    });
  } catch (error) {
    const message = (error as { cause?: { code?: string } }).cause?.code === "ER_DUP_ENTRY" ? "That slug or a SKU is already used by another product." : "Could not save the product.";
    console.error("saveProduct failed", error);
    return { error: message };
  }

  updateTag(CATALOG_TAG);
  redirect(`/admin/products/${productId}?saved=1`);
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin("admin");
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  await db.transaction(async (tx) => {
    await tx.delete(productVariants).where(eq(productVariants.productId, id));
    await tx.delete(productImages).where(eq(productImages.productId, id));
    await tx.delete(productCategories).where(eq(productCategories.productId, id));
    await tx.delete(products).where(eq(products.id, id));
  });
  updateTag(CATALOG_TAG);
  redirect("/admin/products?deleted=1");
}

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  try {
    return { url: await saveImageUpload(file) };
  } catch (error) {
    return { error: error instanceof UploadError ? error.message : "Upload failed." };
  }
}
