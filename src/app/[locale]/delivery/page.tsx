import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { Container, Section } from "@/components/ui/primitives";
import { getCities } from "@/db/queries/content";
import { formatPKR } from "@/lib/commerce/format";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.delivery");
  return { title: t("title"), description: t("lede"), alternates: buildAlternates(locale, "/delivery") };
}

function weekdayNames(days: number[], locale: Locale): string {
  // 2026-10-18 is a Sunday; offset from it to name each weekday in the locale.
  const format = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-PK", { weekday: "long", timeZone: "UTC" });
  return [...days]
    .sort((a, b) => a - b)
    .map((day) => format.format(new Date(Date.UTC(2026, 9, 18 + day))))
    .join(locale === "ja" ? "・" : ", ");
}

export default async function DeliveryPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.delivery");
  const cities = await getCities(locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} image="/images/prov-coldchain.webp" />
      <Section>
        <Container>
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-[14px] border border-line text-left text-sm">
              <thead className="bg-paper-2">
                <tr>
                  {[t("city"), t("days"), t("slots"), t("fee"), t("free")].map((heading) => (
                    <th key={heading} scope="col" className="p-4 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.slug}>
                    <th scope="row" className="border-t border-line p-4 font-medium">
                      {city.name}
                      <span className="mt-1 block text-xs font-normal text-ink-3">{t("leadTime", { hours: city.leadTimeHours })}</span>
                    </th>
                    <td className="border-t border-line p-4 text-ink-2">{weekdayNames(city.deliveryDays, locale)}</td>
                    <td className="border-t border-line p-4 text-ink-2">{city.slots.join(" · ")}</td>
                    <td className="border-t border-line p-4">{formatPKR(city.deliveryFeePKR)}</td>
                    <td className="border-t border-line p-4">{formatPKR(city.freeDeliveryThresholdPKR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="display text-2xl">{t("packTitle")}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{t("packBody")}</p>
            </div>
            <div>
              <h2 className="display text-2xl">{t("policyTitle")}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{t("policyBody")}</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
