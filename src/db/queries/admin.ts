import "server-only";
import { and, asc, count, desc, eq, gte, inArray, like, or, sql, sum } from "drizzle-orm";
import { db } from "../client";
import {
  adminUsers,
  categories,
  cities,
  enquiries,
  guides,
  orderItems,
  orders,
  productCategories,
  productImages,
  products,
  productVariants,
  reviews,
  siteSettings,
  subscribers,
} from "../schema";
import { fromDateKey, toDateKey } from "@/lib/commerce/delivery";
import { parseSettings } from "@/lib/settings";
import type { OrderStatus } from "@/lib/commerce/validation";

export async function getDashboardStats(now: Date) {
  const startOfToday = fromDateKey(toDateKey(now)); // midnight in Pakistan
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [[today], [pending], [week], [productCount], outOfStock, recent] = await Promise.all([
    db.select({ n: count() }).from(orders).where(gte(orders.createdAt, startOfToday)),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "pending")),
    db
      .select({ revenue: sum(orders.totalPKR), n: count() })
      .from(orders)
      .where(and(gte(orders.createdAt, weekAgo), sql`${orders.status} <> 'cancelled'`)),
    db.select({ n: count() }).from(products).where(eq(products.published, true)),
    db
      .select({ sku: productVariants.sku, label: productVariants.labelEn, product: products.nameEn, productId: products.id })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(eq(productVariants.inStock, false))
      .limit(10),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
  ]);

  return {
    ordersToday: today.n,
    pending: pending.n,
    weekRevenue: Number(week.revenue ?? 0),
    weekOrders: week.n,
    products: productCount.n,
    outOfStock,
    recent,
  };
}

export async function listOrders(filter: { status?: OrderStatus; q?: string }) {
  const conditions = [];
  if (filter.status) conditions.push(eq(orders.status, filter.status));
  if (filter.q) {
    const term = `%${filter.q.trim()}%`;
    conditions.push(or(like(orders.orderNumber, term), like(orders.customerName, term), like(orders.customerPhone, term)));
  }
  return db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);
}

export async function getOrder(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...order, items };
}

export async function listProductsForAdmin() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
  const ids = rows.map((row) => row.id);
  if (ids.length === 0) return [];
  const [variants, images] = await Promise.all([
    db.select().from(productVariants).where(inArray(productVariants.productId, ids)),
    db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(asc(productImages.sortOrder)),
  ]);
  return rows.map((row) => ({
    ...row,
    variants: variants.filter((v) => v.productId === row.id),
    image: images.find((i) => i.productId === row.id)?.url ?? null,
  }));
}

export async function getProductForEdit(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return null;
  const [variants, images, links] = await Promise.all([
    db.select().from(productVariants).where(eq(productVariants.productId, id)).orderBy(asc(productVariants.sortOrder)),
    db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder)),
    db.select().from(productCategories).where(eq(productCategories.productId, id)),
  ]);
  return { product, variants, images, categoryIds: links.map((link) => link.categoryId) };
}

export function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.type), asc(categories.sortOrder));
}

export function listCities() {
  return db.select().from(cities).orderBy(asc(cities.sortOrder));
}

export function listReviews() {
  return db
    .select({ review: reviews, productName: products.nameEn })
    .from(reviews)
    .leftJoin(products, eq(products.id, reviews.productId))
    .orderBy(desc(reviews.createdAt));
}

export function listGuides() {
  return db.select().from(guides).orderBy(asc(guides.sortOrder));
}

export async function getGuideForEdit(id: number) {
  const [guide] = await db.select().from(guides).where(eq(guides.id, id));
  return guide ?? null;
}

export function listEnquiries() {
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(300);
}

export function listSubscribers() {
  return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
}

export function listAdminUsers() {
  return db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      active: adminUsers.active,
      lastLoginAt: adminUsers.lastLoginAt,
    })
    .from(adminUsers)
    .orderBy(asc(adminUsers.id));
}

export async function getSettingsForEdit() {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  return parseSettings(row?.data);
}
