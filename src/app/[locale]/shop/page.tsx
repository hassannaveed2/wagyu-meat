import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { loadShop } from "@/components/shop/shop-data";
import { Container } from "@/components/ui/primitives";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("shop");
  return { title: t("title"), description: t("lede"), alternates: buildAlternates(locale, "/shop") };
}

export default async function ShopPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("shop");
  const { products, origins, cuts, occasions } = await loadShop(locale);

  return (
    <>
      <PageHeader eyebrow="Wagyu Meat" title={t("title")} lede={t("lede")} />
      <Container className="py-10 sm:py-14">
        <ShopBrowser products={products} origins={origins} cuts={cuts} occasions={occasions} initial={{}} />
      </Container>
    </>
  );
}
