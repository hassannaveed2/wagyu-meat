import { getCatalog, getCategories } from "@/db/queries/catalog";
import type { Locale } from "@/lib/i18n-db";
import { toCardProduct } from "@/components/product/to-card";
import type { ShopProduct } from "./ShopBrowser";

export async function loadShop(locale: Locale) {
  const [catalog, categories] = await Promise.all([getCatalog(locale), getCategories(locale)]);
  const products: ShopProduct[] = catalog.map((product) => ({
    ...toCardProduct(product),
    origin: product.origin,
    categorySlugs: product.categorySlugs,
    sortOrder: product.sortOrder,
  }));
  const pick = (type: "origin" | "cut" | "occasion") =>
    categories.filter((c) => c.type === type).map((c) => ({ slug: c.slug, name: c.name }));
  return { products, categories, origins: pick("origin"), cuts: pick("cut"), occasions: pick("occasion") };
}
