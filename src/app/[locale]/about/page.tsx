import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/primitives";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.about");
  return { title: t("title"), alternates: buildAlternates(locale, "/about") };
}

export default async function AboutPage() {
  const t = await getTranslations("pages.about");
  const nav = await getTranslations("nav");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} image="/images/hero-a5.webp" />
      <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[1.1rem] leading-[1.85] text-ink-2">{t("body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop">{nav("shopAll")}</ButtonLink>
            <ButtonLink href="/halal-provenance" variant="outline">
              {nav("halal")}
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
          <Image src="/images/p-flight-box.webp" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
        </div>
      </Container>
    </>
  );
}
