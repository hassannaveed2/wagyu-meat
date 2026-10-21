import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { GuideCard, ReviewCard } from "@/components/home/Sections";
import { GradeBadges } from "@/components/product/GradeBadges";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { toCardProduct } from "@/components/product/to-card";
import { Icon } from "@/components/ui/Icon";
import { Markdown } from "@/components/ui/Markdown";
import { Accordion, Badge, Container, Section, SectionHeader, Stars } from "@/components/ui/primitives";
import { getCatalog, getProductBySlug } from "@/db/queries/catalog";
import { getGuides, getReviews } from "@/db/queries/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n-db";
import { JsonLd, productJsonLd } from "@/lib/json-ld";
import { buildAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  const catalog = await getCatalog("en");
  return catalog.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const product = await getProductBySlug(slug, locale);
  if (!product) return {};
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.short,
    alternates: buildAlternates(locale, `/products/${slug}`),
    openGraph: { images: product.image ? [{ url: product.image.url }] : undefined },
  };
}

export default function ProductPage({ params }: PageProps<"/[locale]/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-2">
      <div className="aspect-[4/5] animate-pulse rounded-[14px] bg-paper-2" />
      <div className="space-y-4 pt-4">
        <div className="h-4 w-32 animate-pulse rounded bg-paper-2" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-paper-2" />
        <div className="h-24 animate-pulse rounded bg-paper-2" />
      </div>
    </Container>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const t = await getTranslations("product");
  const tc = await getTranslations("common");
  const [catalog, reviews, guides] = await Promise.all([getCatalog(locale), getReviews(product.id, 6), getGuides(locale)]);

  const related = catalog
    .filter((p) => p.slug !== product.slug && p.productType !== "gift-card" && p.origin === product.origin)
    .slice(0, 4);
  const isJapanese = product.origin === "japan" && product.authenticityCertificate;

  const provenance = [
    t("provenanceBody", { region: product.region || tc(product.origin) }),
    isJapanese ? t("provenanceA5") : null,
    product.halalBody ? t("halalBody", { body: product.halalBody }) : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const accordion = [
    { id: "description", title: t("tabs.description"), content: <Markdown>{product.description}</Markdown> },
    product.contents ? { id: "contents", title: t("tabs.contents"), content: <Markdown>{product.contents}</Markdown> } : null,
    { id: "provenance", title: t("tabs.provenance"), content: <Markdown>{provenance}</Markdown> },
    product.cooking
      ? {
          id: "cooking",
          title: t("tabs.cooking"),
          content: (
            <>
              <Markdown>{product.cooking}</Markdown>
              {product.serving && (
                <p className="mt-3 rounded-md bg-gold-soft/50 px-3 py-2 text-sm text-ink">
                  <strong>{t("portion")}:</strong> {product.serving}
                </p>
              )}
            </>
          ),
        }
      : null,
    product.productType !== "gift-card"
      ? { id: "storage", title: t("tabs.storage"), content: <p>{product.storageNotes || t("storageBody")}</p> }
      : null,
    { id: "delivery", title: t("tabs.delivery"), content: <p>{t("deliveryBody")}</p> },
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <>
      <Container className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/shop" className="hover:text-ink">
                {t("breadcrumbShop")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={product.origin === "japan" ? "/shop/japanese-a5" : "/shop/australian-wagyu"} className="hover:text-ink">
                {tc(product.origin)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="truncate text-ink-2" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </Container>

      <Container className="grid grid-cols-[minmax(0,1fr)] gap-10 pb-16 pt-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:pb-24">
        <ProductGallery images={product.images} badges={<GradeBadges grade={product.grade} bms={product.bms} />} />

        <div className="lg:pt-2">
          {product.region && <p className="eyebrow">{product.region}</p>}
          <h1 className="display mt-2 text-[2.1rem] sm:text-[2.7rem]">{product.name}</h1>
          {product.rating && (
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
              <Stars rating={product.rating.average} size={15} />
              {product.rating.average.toFixed(1)} · {tc("reviews", { count: product.rating.count })}
            </a>
          )}
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-2">{product.short}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.halalCertified && (
              <Badge tone="leaf">
                <Icon name="shield" size={13} /> {tc("halal")}
              </Badge>
            )}
            {product.authenticityCertificate && (
              <Badge tone="gold">
                <Icon name="certificate" size={13} /> {tc("certificate")}
              </Badge>
            )}
            {product.productType !== "gift-card" && (
              <Badge>
                <Icon name="snowflake" size={13} /> {tc("frozen")}
              </Badge>
            )}
          </div>

          <div className="hairline my-7" />

          <PurchasePanel
            productId={product.id}
            productName={product.name}
            image={product.image?.url ?? null}
            variants={product.variants}
          />

          <Accordion items={accordion} defaultOpen="description" className="mt-10" />
        </div>
      </Container>

      <Section tone="paper-2" id="reviews">
        <Container>
          <SectionHeader
            title={t("reviewsTitle")}
            lede={product.rating ? `${product.rating.average.toFixed(1)} · ${tc("reviews", { count: product.rating.count })}` : undefined}
          />
          {reviews.length === 0 ? (
            <p className="text-ink-2">{t("noReviews")}</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {related.length > 0 && (
        <Section>
          <Container>
            <SectionHeader title={t("related")} />
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={toCardProduct(item)} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {product.productType !== "gift-card" && guides.length > 0 && (
        <Section tone="paper-2">
          <Container>
            <SectionHeader title={t("relatedGuides")} />
            <div className="grid gap-8 md:grid-cols-3">
              {guides.slice(0, 3).map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <JsonLd data={productJsonLd(product, locale)} />
    </>
  );
}
