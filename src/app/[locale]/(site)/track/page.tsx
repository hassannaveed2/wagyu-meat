import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { TrackForm } from "@/components/checkout/TrackForm";
import { PageHeader } from "@/components/shop/PageHeader";
import { Container } from "@/components/ui/primitives";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("track");
  return { title: t("title"), alternates: buildAlternates(locale, "/track") };
}

export default async function TrackPage() {
  const t = await getTranslations("track");
  return (
    <>
      <PageHeader title={t("title")} lede={t("lede")} />
      <Container className="max-w-[880px] py-12">
        <TrackForm />
      </Container>
    </>
  );
}
