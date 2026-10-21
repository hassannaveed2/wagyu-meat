import type { ProductDetail } from "@/db/queries/catalog";
import type { CardProduct } from "./ProductCard";

/** Trims a product to what cards need, keeping client payloads small. */
export function toCardProduct(product: ProductDetail): CardProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short: product.short,
    grade: product.grade,
    bms: product.bms,
    region: product.region,
    variants: product.variants,
    fromPricePKR: product.fromPricePKR,
    inStock: product.inStock,
    rating: product.rating,
    productType: product.productType,
    images: product.images.slice(0, 2),
  };
}
