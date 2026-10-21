import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { GuideCard } from "@/components/home/Sections";
import { PageHeader } from "@/components/shop/PageHeader";
import { Container } from "@/components/ui/primitives";
import { getGuides } from "@/db/queries/content";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.guides");
  return { title: t("title"), description: t("lede"), alternates: buildAlternates(locale, "/guides") };
}

export default async function GuidesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.guides");
  const guides = await getGuides(locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} image="/images/guide-sear.webp" />
      <Container className="py-14 sm:py-20">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <div key={guide.slug}>
              <p className="eyebrow mb-3">{guide.type === "recipe" ? t("recipe") : t("guide")}</p>
              <GuideCard guide={guide} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
