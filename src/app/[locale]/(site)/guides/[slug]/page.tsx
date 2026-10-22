import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PageHeader } from "@/components/shop/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { Container } from "@/components/ui/primitives";
import { getGuide, getGuides } from "@/db/queries/content";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  const guides = await getGuides("en");
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const guide = await getGuide(slug, locale);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: buildAlternates(locale, `/guides/${slug}`),
    openGraph: { images: guide.heroImage ? [{ url: guide.heroImage }] : undefined },
  };
}

export default function GuidePage({ params }: PageProps<"/[locale]/guides/[slug]">) {
  return (
    <Suspense fallback={<div className="h-[60vh] animate-pulse bg-paper-2" />}>
      <GuideContent params={params} />
    </Suspense>
  );
}

async function GuideContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const guide = await getGuide(slug, locale);
  if (!guide) notFound();
  const t = await getTranslations("pages.guides");
  const tc = await getTranslations("common");

  return (
    <article>
      <PageHeader
        eyebrow={guide.type === "recipe" ? t("recipe") : t("guide")}
        title={guide.title}
        lede={guide.excerpt}
        image={guide.heroImage}
      >
        <p className="mt-4 text-sm text-paper/60">{tc("minutes", { count: guide.readingMinutes })}</p>
      </PageHeader>
      <Container className="max-w-[760px] py-14">
        <Markdown className="text-[1.05rem]">{guide.body}</Markdown>
        <div className="hairline my-12" />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/shop">{tc("backToShop")}</ButtonLink>
          <ButtonLink href="/guides" variant="outline">
            {t("title")}
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
