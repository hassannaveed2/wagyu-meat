import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EnquiryForm } from "@/components/content/EnquiryForm";
import { ProductCard } from "@/components/product/ProductCard";
import { toCardProduct } from "@/components/product/to-card";
import { PageHeader } from "@/components/shop/PageHeader";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import { getCatalog } from "@/db/queries/catalog";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.gifting");
  return { title: t("title"), description: t("lede"), alternates: buildAlternates(locale, "/gifting") };
}

export default async function GiftingPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.gifting");
  const catalog = await getCatalog(locale);
  const gifts = catalog.filter((product) => product.categorySlugs.includes("gifting"));
  const steps = ["choose", "message", "deliver"] as const;

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} image="/images/occ-gift.webp" />

      <Section>
        <Container>
          <SectionHeader title={t("how")} />
          <ol className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step} className="rounded-[14px] border border-line bg-paper p-6">
                <span className="font-[family-name:var(--font-display-en)] text-4xl text-gold">{index + 1}</span>
                <p className="mt-3 leading-relaxed text-ink-2">{t(`steps.${step}`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="paper-2">
        <Container>
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {gifts.map((product) => (
              <ProductCard key={product.slug} product={toCardProduct(product)} />
            ))}
          </div>
        </Container>
      </Section>

      <Section id="corporate">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="display text-[2rem] sm:text-[2.4rem]">{t("corporateTitle")}</h2>
            <p className="mt-4 leading-relaxed text-ink-2">{t("corporateBody")}</p>
          </div>
          <EnquiryForm type="corporate" />
        </Container>
      </Section>
    </>
  );
}
