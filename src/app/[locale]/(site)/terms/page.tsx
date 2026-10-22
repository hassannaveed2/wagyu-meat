import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/content/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.legal");
  return { title: t("termsTitle") };
}

export default function Page() {
  return <LegalPage titleKey="termsTitle" />;
}