import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { loadShop } from "@/components/shop/shop-data";
import { Container } from "@/components/ui/primitives";
import { getCategories } from "@/db/queries/catalog";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getCategories("en");
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const locale = (await getLocale()) as Locale;
  const category = (await getCategories(locale)).find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || undefined,
    alternates: buildAlternates(locale, `/shop/${slug}`),
  };
}

export default function CategoryPage({ params }: PageProps<"/[locale]/shop/[category]">) {
  return (
    <Suspense fallback={<div className="h-[60vh] animate-pulse bg-paper-2" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("shop");
  const { products, categories, origins, cuts, occasions } = await loadShop(locale);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader eyebrow={t("title")} title={category.name} lede={category.description || t("lede")} image={category.image} />
      <Container className="py-10 sm:py-14">
        <ShopBrowser
          products={products}
          origins={origins}
          cuts={cuts}
          occasions={occasions}
          initial={{ [category.type]: category.slug }}
        />
      </Container>
    </>
  );
}
