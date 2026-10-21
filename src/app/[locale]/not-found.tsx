import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/primitives";

export default async function NotFound() {
  const t = await getTranslations("pages.notFound");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-[family-name:var(--font-display-en)] text-7xl text-gold">404</p>
      <h1 className="display mt-4 text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-ink-2">{t("body")}</p>
      <ButtonLink href="/" className="mt-8">
        {t("cta")}
      </ButtonLink>
    </Container>
  );
}
