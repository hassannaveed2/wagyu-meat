/**
 * Seeds the catalogue, cities, guides, settings and the first admin user.
 *   npm run db:seed            — only seeds an empty catalogue
 *   npm run db:seed -- --reset — replaces catalogue/content tables (never touches orders)
 */
import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { connectionOptions } from "../connection";
import * as schema from "../schema";
import { hashPassword } from "@/lib/auth/password";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "./catalog-data";
import { SAMPLE_REVIEWS, SEED_CITIES, SEED_GUIDES, SEED_SETTINGS } from "./content-data";

const {
  adminUsers,
  categories,
  cities,
  guides,
  productCategories,
  productImages,
  products,
  productVariants,
  reviews,
  siteSettings,
} = schema;

async function main() {
  const reset = process.argv.includes("--reset");
  const pool = mysql.createPool({ ...connectionOptions(), connectionLimit: 2 });
  const db = drizzle(pool, { schema, mode: "default" });

  try {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products);
    if (Number(count) > 0 && !reset) {
      console.log(`Catalogue already has ${count} products. Re-run with --reset to replace it.`);
    } else {
      await db.transaction(async (tx) => {
        for (const table of [productCategories, productImages, productVariants, products, categories, cities, guides]) {
          await tx.delete(table);
        }
        await tx.delete(reviews).where(sql`${reviews.name} LIKE 'Sample —%'`);

        const categoryIds = new Map<string, number>();
        for (const [index, category] of SEED_CATEGORIES.entries()) {
          const [result] = await tx.insert(categories).values({
            slug: category.slug,
            type: category.type,
            nameEn: category.name[0],
            nameJa: category.name[1],
            descriptionEn: category.description[0],
            descriptionJa: category.description[1],
            image: category.image ?? null,
            sortOrder: index,
          });
          categoryIds.set(category.slug, Number(result.insertId));
        }

        const productIds = new Map<string, number>();
        for (const [index, p] of SEED_PRODUCTS.entries()) {
          const [result] = await tx.insert(products).values({
            slug: p.slug,
            nameEn: p.name[0],
            nameJa: p.name[1],
            shortEn: p.short[0],
            shortJa: p.short[1],
            descriptionEn: p.description[0],
            descriptionJa: p.description[1],
            origin: p.origin,
            grade: p.grade,
            bms: p.bms,
            regionEn: p.region[0],
            regionJa: p.region[1],
            brand: p.brand,
            productType: p.productType,
            storage: "frozen",
            halalCertified: p.productType !== "gift-card",
            authenticityCertificate: p.authenticityCertificate,
            contentsEn: p.contents?.[0] ?? null,
            contentsJa: p.contents?.[1] ?? null,
            cookingEn: p.cooking[0],
            cookingJa: p.cooking[1],
            servingEn: p.serving[0],
            servingJa: p.serving[1],
            metaTitleEn: `${p.name[0]} | Wagyu Meat Pakistan`,
            metaTitleJa: `${p.name[1]}｜Wagyu Meat`,
            metaDescriptionEn: p.short[0],
            metaDescriptionJa: p.short[1],
            featured: p.featured ?? false,
            bestSeller: p.bestSeller ?? false,
            sortOrder: index,
          });
          const productId = Number(result.insertId);
          productIds.set(p.slug, productId);

          await tx.insert(productVariants).values(
            p.variants.map((v, i) => ({
              productId,
              sku: v.sku,
              labelEn: v.en,
              labelJa: v.ja,
              weightGrams: v.grams,
              pricePKR: v.price,
              compareAtPKR: v.compareAt ?? null,
              sortOrder: i,
            })),
          );
          await tx.insert(productImages).values(
            p.images.map((url, i) => ({ productId, url, altEn: p.name[0], altJa: p.name[1], sortOrder: i })),
          );
          await tx.insert(productCategories).values(
            p.categories.map((slug) => {
              const categoryId = categoryIds.get(slug);
              if (!categoryId) throw new Error(`Unknown category ${slug} on ${p.slug}`);
              return { productId, categoryId };
            }),
          );
        }

        await tx.insert(cities).values(SEED_CITIES);
        await tx.insert(guides).values(SEED_GUIDES);

        if (process.env.SEED_SAMPLE_REVIEWS === "true") {
          await tx.insert(reviews).values(
            SAMPLE_REVIEWS.map((r) => ({
              productId: r.product ? (productIds.get(r.product) ?? null) : null,
              name: r.name,
              city: r.city,
              rating: r.rating,
              body: r.body,
              verified: false,
              approved: true,
            })),
          );
          console.warn("⚠ Seeded SAMPLE reviews for design preview. Delete them in /admin/reviews before launch.");
        }
      });
      console.log(`Seeded ${SEED_PRODUCTS.length} products, ${SEED_CATEGORIES.length} categories, ${SEED_CITIES.length} cities, ${SEED_GUIDES.length} guides.`);
    }

    const [existingSettings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
    if (!existingSettings || reset) {
      await db
        .insert(siteSettings)
        .values({ id: 1, data: SEED_SETTINGS })
        .onDuplicateKeyUpdate({ set: { data: SEED_SETTINGS } });
      console.log("Seeded site settings.");
    }

    const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (email && password) {
      const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
      if (!existing) {
        await db.insert(adminUsers).values({
          email,
          name: "Administrator",
          passwordHash: await hashPassword(password),
          role: "admin",
        });
        console.log(`Created admin user ${email} (password from SEED_ADMIN_PASSWORD in .env).`);
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
