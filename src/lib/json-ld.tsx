import type { ProductDetail } from "@/db/queries/catalog";
import { SITE_URL } from "./seo";

/** Renders structured data. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function productJsonLd(product: ProductDetail, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short,
    image: product.images.map((image) => `${SITE_URL}${image.url}`),
    brand: { "@type": "Brand", name: product.brand || "Wagyu Meat" },
    sku: product.variants[0]?.sku,
    url: `${SITE_URL}/${locale}/products/${product.slug}`,
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      sku: variant.sku,
      name: variant.label,
      price: variant.pricePKR,
      priceCurrency: "PKR",
      availability: variant.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
    ...(product.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.average,
            reviewCount: product.rating.count,
          },
        }
      : {}),
  };
}
