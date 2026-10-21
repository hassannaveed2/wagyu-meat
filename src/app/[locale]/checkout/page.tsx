import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Container } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return { title: t("title"), robots: { index: false } };
}

export default async function CheckoutPage() {
  const t = await getTranslations("checkout");
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="display mb-8 text-[2.3rem] sm:text-5xl">{t("title")}</h1>
      <CheckoutForm />
    </Container>
  );
}
