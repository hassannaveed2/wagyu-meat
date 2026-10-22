import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.halal");
  return { title: t("title"), description: t("lede"), alternates: buildAlternates(locale, "/halal-provenance") };
}

export default async function HalalPage() {
  const t = await getTranslations("pages.halal");
  const chain = ["farm", "process", "grade", "freeze", "store", "deliver"] as const;

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} image="/images/prov-farm.webp" />
      <Section>
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            { icon: "shield" as const, title: t("halalTitle"), body: t("halalBody") },
            { icon: "certificate" as const, title: t("authTitle"), body: t("authBody") },
          ].map((card) => (
            <div key={card.title} className="rounded-[14px] border border-line bg-paper p-7">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf-soft text-leaf">
                <Icon name={card.icon} size={24} />
              </span>
              <h2 className="display mt-5 text-2xl">{card.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{card.body}</p>
            </div>
          ))}
        </Container>
      </Section>
      <Section tone="paper-2">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader title={t("chainTitle")} />
            <ol className="relative space-y-6 border-l border-gold/50 pl-8">
              {chain.map((step, index) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[45px] grid h-7 w-7 place-items-center rounded-full bg-wagyu text-xs font-semibold text-paper">
                    {index + 1}
                  </span>
                  <p className="text-[1.02rem]">{t(`chain.${step}`)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[14px]">
            <Image src="/images/prov-coldchain.webp" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
        </Container>
      </Section>
    </>
  );
}
