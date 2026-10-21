import {
  boolean,
  date,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/commerce/validation";

// Translatable text is stored as paired `_en` / `_ja` columns. Reads fall back to English.

const createdAt = () => timestamp("created_at").notNull().defaultNow();
const updatedAt = () => timestamp("updated_at").notNull().defaultNow().onUpdateNow();
const fk = (name: string) => int(name, { unsigned: true });
const id = () => int("id", { unsigned: true }).autoincrement().primaryKey();

export const adminUsers = mysqlTable("admin_users", {
  id: id(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  role: mysqlEnum("role", ["admin", "staff"]).notNull().default("staff"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: createdAt(),
});

export const categories = mysqlTable("categories", {
  id: id(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  type: mysqlEnum("type", ["origin", "cut", "occasion"]).notNull(),
  nameEn: varchar("name_en", { length: 120 }).notNull(),
  nameJa: varchar("name_ja", { length: 120 }).notNull().default(""),
  descriptionEn: text("description_en"),
  descriptionJa: text("description_ja"),
  image: varchar("image", { length: 255 }),
  sortOrder: smallint("sort_order").notNull().default(0),
});

export const products = mysqlTable(
  "products",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    nameEn: varchar("name_en", { length: 160 }).notNull(),
    nameJa: varchar("name_ja", { length: 160 }).notNull().default(""),
    shortEn: varchar("short_en", { length: 300 }).notNull().default(""),
    shortJa: varchar("short_ja", { length: 300 }).notNull().default(""),
    descriptionEn: text("description_en"),
    descriptionJa: text("description_ja"),
    origin: mysqlEnum("origin", ["japan", "australia"]).notNull(),
    grade: mysqlEnum("grade", ["A5", "A4", "MB8-9", "MB6-7", "NA"]).notNull().default("NA"),
    bms: tinyint("bms"),
    regionEn: varchar("region_en", { length: 120 }).notNull().default(""),
    regionJa: varchar("region_ja", { length: 120 }).notNull().default(""),
    brand: varchar("brand", { length: 120 }).notNull().default(""),
    productType: mysqlEnum("product_type", ["steak", "sliced", "burger", "bundle", "gift-card"]).notNull(),
    storage: mysqlEnum("storage", ["frozen", "chilled"]).notNull().default("frozen"),
    halalCertified: boolean("halal_certified").notNull().default(true),
    halalBody: varchar("halal_body", { length: 160 }).notNull().default(""),
    authenticityCertificate: boolean("authenticity_certificate").notNull().default(false),
    contentsEn: text("contents_en"),
    contentsJa: text("contents_ja"),
    cookingEn: text("cooking_en"),
    cookingJa: text("cooking_ja"),
    storageNotesEn: text("storage_notes_en"),
    storageNotesJa: text("storage_notes_ja"),
    servingEn: varchar("serving_en", { length: 200 }).notNull().default(""),
    servingJa: varchar("serving_ja", { length: 200 }).notNull().default(""),
    metaTitleEn: varchar("meta_title_en", { length: 160 }).notNull().default(""),
    metaTitleJa: varchar("meta_title_ja", { length: 160 }).notNull().default(""),
    metaDescriptionEn: varchar("meta_description_en", { length: 300 }).notNull().default(""),
    metaDescriptionJa: varchar("meta_description_ja", { length: 300 }).notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    bestSeller: boolean("best_seller").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sortOrder: smallint("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("products_origin_idx").on(t.origin), index("products_published_idx").on(t.published)],
);

export const productVariants = mysqlTable(
  "product_variants",
  {
    id: id(),
    productId: fk("product_id").notNull(),
    sku: varchar("sku", { length: 64 }).notNull().unique(),
    labelEn: varchar("label_en", { length: 80 }).notNull(),
    labelJa: varchar("label_ja", { length: 80 }).notNull().default(""),
    weightGrams: int("weight_grams").notNull(),
    pricePKR: int("price_pkr").notNull(),
    compareAtPKR: int("compare_at_pkr"),
    inStock: boolean("in_stock").notNull().default(true),
    sortOrder: smallint("sort_order").notNull().default(0),
  },
  (t) => [index("variants_product_idx").on(t.productId)],
);

export const productImages = mysqlTable(
  "product_images",
  {
    id: id(),
    productId: fk("product_id").notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    altEn: varchar("alt_en", { length: 200 }).notNull().default(""),
    altJa: varchar("alt_ja", { length: 200 }).notNull().default(""),
    sortOrder: smallint("sort_order").notNull().default(0),
  },
  (t) => [index("images_product_idx").on(t.productId)],
);

export const productCategories = mysqlTable(
  "product_categories",
  {
    id: id(),
    productId: fk("product_id").notNull(),
    categoryId: fk("category_id").notNull(),
  },
  (t) => [uniqueIndex("product_category_unique").on(t.productId, t.categoryId)],
);

export type CitySlot = { en: string; ja: string };

export const cities = mysqlTable("cities", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  nameEn: varchar("name_en", { length: 80 }).notNull(),
  nameJa: varchar("name_ja", { length: 80 }).notNull().default(""),
  active: boolean("active").notNull().default(true),
  deliveryFeePKR: int("delivery_fee_pkr").notNull(),
  freeDeliveryThresholdPKR: int("free_threshold_pkr").notNull(),
  /** 0 = Sunday … 6 = Saturday */
  deliveryDays: json("delivery_days").$type<number[]>().notNull(),
  slots: json("slots").$type<CitySlot[]>().notNull(),
  leadTimeHours: smallint("lead_time_hours").notNull().default(24),
  sortOrder: smallint("sort_order").notNull().default(0),
});

export const orders = mysqlTable(
  "orders",
  {
    id: id(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    /** Unguessable id used in the confirmation URL, so order numbers can't be enumerated. */
    publicId: varchar("public_id", { length: 32 }).notNull().unique(),
    status: mysqlEnum("status", ORDER_STATUSES).notNull().default("pending"),
    paymentStatus: mysqlEnum("payment_status", PAYMENT_STATUSES).notNull().default("pending"),
    paymentMethod: mysqlEnum("payment_method", PAYMENT_METHODS).notNull(),
    customerName: varchar("customer_name", { length: 120 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
    customerEmail: varchar("customer_email", { length: 191 }),
    cityId: fk("city_id").notNull(),
    cityName: varchar("city_name", { length: 80 }).notNull(),
    address: varchar("address", { length: 300 }).notNull(),
    area: varchar("area", { length: 120 }).notNull(),
    deliveryDate: date("delivery_date", { mode: "string" }).notNull(),
    slot: varchar("slot", { length: 40 }).notNull(),
    notes: text("notes"),
    isGift: boolean("is_gift").notNull().default(false),
    giftMessage: varchar("gift_message", { length: 300 }),
    hidePrices: boolean("hide_prices").notNull().default(false),
    subtotalPKR: int("subtotal_pkr").notNull(),
    deliveryFeePKR: int("delivery_fee_pkr").notNull(),
    totalPKR: int("total_pkr").notNull(),
    locale: varchar("locale", { length: 5 }).notNull().default("en"),
    adminNotes: text("admin_notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("orders_status_idx").on(t.status),
    index("orders_phone_idx").on(t.customerPhone),
    index("orders_created_idx").on(t.createdAt),
  ],
);

export const orderItems = mysqlTable(
  "order_items",
  {
    id: id(),
    orderId: fk("order_id").notNull(),
    productId: fk("product_id").notNull(),
    sku: varchar("sku", { length: 64 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    label: varchar("label", { length: 80 }).notNull(),
    weightGrams: int("weight_grams").notNull(),
    unitPricePKR: int("unit_price_pkr").notNull(),
    quantity: smallint("quantity").notNull(),
    lineTotalPKR: int("line_total_pkr").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const reviews = mysqlTable(
  "reviews",
  {
    id: id(),
    productId: fk("product_id"),
    name: varchar("name", { length: 80 }).notNull(),
    city: varchar("city", { length: 80 }).notNull().default(""),
    rating: tinyint("rating").notNull(),
    body: text("body").notNull(),
    locale: varchar("locale", { length: 5 }).notNull().default("en"),
    verified: boolean("verified").notNull().default(false),
    approved: boolean("approved").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("reviews_product_idx").on(t.productId)],
);

export const guides = mysqlTable("guides", {
  id: id(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  type: mysqlEnum("type", ["guide", "recipe"]).notNull().default("guide"),
  titleEn: varchar("title_en", { length: 160 }).notNull(),
  titleJa: varchar("title_ja", { length: 160 }).notNull().default(""),
  excerptEn: varchar("excerpt_en", { length: 300 }).notNull().default(""),
  excerptJa: varchar("excerpt_ja", { length: 300 }).notNull().default(""),
  bodyEn: text("body_en"),
  bodyJa: text("body_ja"),
  heroImage: varchar("hero_image", { length: 255 }),
  readingMinutes: tinyint("reading_minutes").notNull().default(4),
  published: boolean("published").notNull().default(true),
  sortOrder: smallint("sort_order").notNull().default(0),
  createdAt: createdAt(),
});

/** Single row (id = 1) holding site settings and homepage content as validated JSON. */
export const siteSettings = mysqlTable("site_settings", {
  id: id(),
  data: json("data").notNull(),
  updatedAt: updatedAt(),
});

export const subscribers = mysqlTable("subscribers", {
  id: id(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  locale: varchar("locale", { length: 5 }).notNull().default("en"),
  createdAt: createdAt(),
});

export const enquiries = mysqlTable("enquiries", {
  id: id(),
  type: mysqlEnum("type", ["corporate", "contact"]).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 191 }),
  company: varchar("company", { length: 160 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "handled"]).notNull().default("new"),
  createdAt: createdAt(),
});
