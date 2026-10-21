import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { Accordion, Container } from "@/components/ui/primitives";
import { getSettings } from "@/db/queries/content";
import { localized, type Locale } from "@/lib/i18n-db";
import { faqJsonLd, JsonLd } from "@/lib/json-ld";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.faq");
  return { title: t("title"), alternates: buildAlternates(locale, "/faq") };
}

export default async function FaqPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.faq");
  const settings = await getSettings();
  const items = settings.faq.map((item) => ({
    question: localized(item.question.en, item.question.ja, locale),
    answer: localized(item.answer.en, item.answer.ja, locale),
  }));

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />
      <Container className="max-w-[880px] py-14">
        <Accordion items={items.map((item, i) => ({ id: String(i), title: item.question, content: item.answer }))} defaultOpen="0" />
      </Container>
      <JsonLd data={faqJsonLd(items)} />
    </>
  );
}
