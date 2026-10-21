import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shop/PageHeader";
import { Container } from "@/components/ui/primitives";

/** Placeholder legal page; the business must supply reviewed text before launch. */
export async function LegalPage({ titleKey }: { titleKey: "privacyTitle" | "termsTitle" | "refundsTitle" }) {
  const t = await getTranslations("pages.legal");
  const delivery = await getTranslations("pages.delivery");
  return (
    <>
      <PageHeader title={t(titleKey)} />
      <Container className="max-w-[760px] py-14">
        <p className="rounded-[10px] border border-dashed border-gold bg-gold-soft/40 p-5 text-sm text-ink">{t("draft")}</p>
        {titleKey === "refundsTitle" && <p className="mt-8 leading-relaxed text-ink-2">{delivery("policyBody")}</p>}
      </Container>
    </>
  );
}
