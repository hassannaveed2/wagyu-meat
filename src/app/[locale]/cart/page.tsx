import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartPageView } from "@/components/cart/CartPageView";
import { Container } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart");
  return { title: t("title"), robots: { index: false } };
}

export default async function CartPage() {
  const t = await getTranslations("cart");
  return (
    <Container className="max-w-[880px] py-12">
      <h1 className="display mb-8 text-[2.3rem] sm:text-5xl">{t("title")}</h1>
      <CartPageView />
    </Container>
  );
}
