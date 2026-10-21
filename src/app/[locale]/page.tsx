import { getLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { OriginTiles } from "@/components/home/OriginTiles";
import {
  CompareTable,
  FinalCta,
  GiftFeature,
  GuideCards,
  OccasionTiles,
  Provenance,
  ReviewCards,
} from "@/components/home/Sections";
import { TrustStrip } from "@/components/home/TrustStrip";
import { BmsScale } from "@/components/product/BmsScale";
import { ProductCard } from "@/components/product/ProductCard";
import { toCardProduct } from "@/components/product/to-card";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion, Container, Section, SectionHeader } from "@/components/ui/primitives";
import { getCatalog, getCategories } from "@/db/queries/catalog";
import { getGuides, getReviews, getSettings } from "@/db/queries/content";
import { localized, type Locale } from "@/lib/i18n-db";
import { faqJsonLd, JsonLd } from "@/lib/json-ld";

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const [settings, catalog, categories, guides, reviews] = await Promise.all([
    getSettings(),
    getCatalog(locale),
    getCategories(locale),
    getGuides(locale),
    getReviews(undefined, 12),
  ]);
  const t = await getTranslations("home");

  const featured = settings.featuredProductSlugs.length
    ? settings.featuredProductSlugs
        .map((slug) => catalog.find((p) => p.slug === slug))
        .filter((p): p is (typeof catalog)[number] => Boolean(p))
    : catalog.filter((p) => p.bestSeller);
  const minFrom = (origin: "japan" | "australia") =>
    Math.min(...catalog.filter((p) => p.origin === origin && p.inStock && p.productType !== "gift-card").map((p) => p.fromPricePKR));
  const rating = reviews.length
    ? { average: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10, count: reviews.length }
    : null;
  const faq = settings.faq.map((item) => ({
    question: localized(item.question.en, item.question.ja, locale),
    answer: localized(item.answer.en, item.answer.ja, locale),
  }));

  return (
    <>
      <Hero
        eyebrow={localized(settings.hero.eyebrow.en, settings.hero.eyebrow.ja, locale)}
        headline={localized(settings.hero.headline.en, settings.hero.headline.ja, locale)}
        subheading={localized(settings.hero.subheading.en, settings.hero.subheading.ja, locale)}
        image={settings.hero.image}
        rating={rating}
      />
      <TrustStrip />
      <OriginTiles fromJapan={minFrom("japan")} fromAustralia={minFrom("australia")} />

      <Section tone="paper" className="pt-0 sm:pt-0 lg:pt-0">
        <Container>
          <SectionHeader
            eyebrow={t("bestSellers.eyebrow")}
            title={t("bestSellers.title")}
            action={
              <ButtonLink href="/shop" variant="outline" size="sm">
                {t("bestSellers.viewAll")}
              </ButtonLink>
            }
          />
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((product, index) => (
              <ProductCard key={product.slug} product={toCardProduct(product)} priority={index < 2} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper-2">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionHeader eyebrow={t("marbling.eyebrow")} title={t("marbling.title")} lede={t("marbling.lede")} />
            <BmsScale />
          </div>
          <ButtonLink href="/wagyu-101" variant="outline" className="mt-2">
            {t("marbling.link")}
          </ButtonLink>
        </Container>
      </Section>

      <OccasionTiles occasions={categories.filter((c) => c.type === "occasion")} />
      <CompareTable />
      <Provenance />
      <GiftFeature />
      <GuideCards guides={guides} />
      <ReviewCards reviews={reviews} rating={rating} />

      {faq.length > 0 && (
        <Section>
          <Container className="max-w-[880px]">
            <SectionHeader
              eyebrow={t("faq.eyebrow")}
              title={t("faq.title")}
              align="center"
            />
            <Accordion items={faq.slice(0, 6).map((item, i) => ({ id: String(i), title: item.question, content: item.answer }))} />
            <div className="mt-8 text-center">
              <ButtonLink href="/faq" variant="ghost">
                {t("faq.more")} →
              </ButtonLink>
            </div>
          </Container>
          <JsonLd data={faqJsonLd(faq)} />
        </Section>
      )}

      <FinalCta whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
