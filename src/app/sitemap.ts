import type { MetadataRoute } from "next";
import { getCatalog, getCategories } from "@/db/queries/catalog";
import { getGuides } from "@/db/queries/content";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const STATIC_PATHS = [
  "",
  "/shop",
  "/wagyu-101",
  "/guides",
  "/gifting",
  "/halal-provenance",
  "/delivery",
  "/faq",
  "/about",
  "/contact",
  "/track",
];

function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]));
  return {
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    alternates: { languages },
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, categories, guides] = await Promise.all([getCatalog("en"), getCategories("en"), getGuides("en")]);
  return [
    ...STATIC_PATHS.map((path) => entry(path, path === "" ? 1 : 0.6)),
    ...categories.map((category) => entry(`/shop/${category.slug}`, 0.7)),
    ...catalog.map((product) => entry(`/products/${product.slug}`, 0.9)),
    ...guides.map((guide) => entry(`/guides/${guide.slug}`, 0.5)),
  ];
}
