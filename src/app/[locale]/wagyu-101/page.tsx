import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { CutMap } from "@/components/content/CutMap";
import { CompareTable } from "@/components/home/Sections";
import { BmsScale } from "@/components/product/BmsScale";
import { PageHeader } from "@/components/shop/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.wagyu101");
  return { title: t("title"), description: t("lede"), alternates: buildAlternates(locale, "/wagyu-101") };
}

export default async function Wagyu101Page() {
  const t = await getTranslations("pages.wagyu101");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} image="/images/origin-japan.webp" />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="display text-[2rem] sm:text-[2.4rem]">{t("whatTitle")}</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-2">{t("whatBody")}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[14px]">
            <Image src="/images/prov-farm.webp" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
        </Container>
      </Section>

      <Section tone="paper-2">
        <Container>
          <SectionHeader title={t("gradeTitle")} lede={t("gradeBody")} />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: t("yield"), rows: [t("yieldA"), t("yieldB"), t("yieldC")] },
              { title: t("quality"), rows: [t("quality5"), t("quality4"), t("quality3")] },
            ].map((card) => (
              <div key={card.title} className="rounded-[14px] border border-line bg-paper p-6">
                <h3 className="text-lg font-medium">{card.title}</h3>
                <ul className="mt-4 space-y-2">
                  {card.rows.map((row, index) => (
                    <li key={row} className="flex items-center gap-3 text-ink-2">
                      <span
                        className={
                          index === 0
                            ? "grid h-7 w-7 place-items-center rounded-full bg-wagyu text-paper"
                            : "grid h-7 w-7 place-items-center rounded-full bg-paper-3 text-ink-2"
                        }
                      >
                        <Icon name={index === 0 ? "check" : "minus"} size={14} />
                      </span>
                      {row}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <h3 className="display mb-6 text-2xl">{t("bmsTitle")}</h3>
            <BmsScale initial={12} />
          </div>
        </Container>
      </Section>

      <section className="seigaiha py-20 text-paper">
        <Container>
          <SectionHeader title={t("cutsTitle")} lede={t("cutsLede")} tone="dark" />
          <CutMap />
        </Container>
      </section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display text-[2rem]">{t("ausTitle")}</h2>
            <p className="mt-4 leading-relaxed text-ink-2">{t("ausBody")}</p>
            <ButtonLink href="/shop/australian-wagyu" variant="outline" className="mt-6">
              {nav("shop")} →
            </ButtonLink>
          </div>
          <div>
            <h2 className="display text-[2rem]">{t("traceTitle")}</h2>
            <p className="mt-4 leading-relaxed text-ink-2">{t("traceBody")}</p>
            <ButtonLink href="/halal-provenance" variant="outline" className="mt-6">
              {nav("halal")} →
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <CompareTable />
    </>
  );
}
