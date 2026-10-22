import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { figtree, fraunces } from "@/components/v2/fonts";
import type { GallerySlide } from "@/components/v2/HeroGallery";
import {
  V2Appeal,
  V2Benefits,
  V2Compare,
  V2Craft,
  V2Daily,
  V2Details,
  V2Faq,
  V2Footer,
  V2Header,
  V2Hero,
  V2HowTo,
  V2Offer,
  V2ProofStrip,
  V2Problem,
  V2Reviews,
} from "@/components/v2/Sections";
import { StickyOffer } from "@/components/v2/StickyOffer";
import { getCatalog } from "@/db/queries/catalog";
import { getCities, getReviews, getSettings } from "@/db/queries/content";
import { formatPKR } from "@/lib/commerce/format";
import { localized, type Locale } from "@/lib/i18n-db";

const SLIDES = [
  { key: "hero", src: "/images/hero-a5.webp" },
  { key: "ribeye", src: "/images/p-a5-ribeye.webp" },
  { key: "australia", src: "/images/origin-australia.webp" },
  { key: "yakiniku", src: "/images/p-a5-yakiniku.webp" },
  { key: "shabu", src: "/images/p-a5-shabu.webp" },
  { key: "flight", src: "/images/p-flight-box.webp" },
  { key: "gift", src: "/images/p-gift-box.webp" },
  { key: "steak", src: "/images/occ-steak.webp" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("v2.meta");
  // An alternative layout of the home page: keep it out of search results so it never competes with "/".
  return { title: t("title"), description: t("description"), robots: { index: false, follow: true } };
}

/** Alternative home page laid out as a long-form landing page (reference: buykatori.com). */
export default async function HomeV2Page() {
  const locale = (await getLocale()) as Locale;
  const [settings, catalog, cities, reviews] = await Promise.all([
    getSettings(),
    getCatalog(locale),
    getCities(locale),
    getReviews(undefined, 12),
  ]);
  const t = await getTranslations("v2.hero");

  const buyable = catalog.filter((p) => p.inStock && p.productType !== "gift-card");
  const fromPrice = formatPKR(Math.min(...buyable.map((p) => p.fromPricePKR)));
  const cityList = new Intl.ListFormat(locale === "ja" ? "ja-JP" : "en", { type: "conjunction" }).format(
    cities.map((city) => city.name),
  );
  const threshold = formatPKR(Math.min(...cities.map((city) => city.freeDeliveryThresholdPKR)));
  const rating = reviews.length
    ? { average: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10, count: reviews.length }
    : null;

  const featured = settings.featuredProductSlugs.length
    ? settings.featuredProductSlugs
        .map((slug) => buyable.find((p) => p.slug === slug))
        .filter((p): p is (typeof buyable)[number] => Boolean(p))
    : buyable.filter((p) => p.bestSeller);
  const offer = featured.slice(0, 4).map((p) => ({ slug: p.slug, name: p.name, price: formatPKR(p.fromPricePKR) }));

  const slides: GallerySlide[] = SLIDES.map((slide) => ({ src: slide.src, caption: t(`captions.${slide.key}`) }));
  const faq = settings.faq.slice(0, 8).map((item) => ({
    question: localized(item.question.en, item.question.ja, locale),
    answer: localized(item.answer.en, item.answer.ja, locale),
  }));

  return (
    <div className={`v2 ${fraunces.variable} ${figtree.variable} min-h-screen bg-white font-v2-sans text-[17px] text-v2-ink`}>
      <V2Header announcement={localized(settings.announcement.en, settings.announcement.ja, locale)} />
      <main id="main">
        <V2Hero slides={slides} rating={rating} fromPrice={fromPrice} cities={cityList} />
        <V2ProofStrip cities={cityList} />
        <V2Problem />
        <V2Appeal />
        <V2Craft />
        <V2Benefits />
        <V2Compare />
        <V2Daily />
        <V2HowTo />
        <V2Details cities={cityList} />
        <V2Faq items={faq} />
        <V2Reviews reviews={reviews} />
        <V2Offer products={offer} threshold={threshold} />
      </main>
      <V2Footer />
      <StickyOffer fromPrice={fromPrice} targetId="hero-cta" />
    </div>
  );
}
