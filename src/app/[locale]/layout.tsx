import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CommerceProvider, type CatalogEntry } from "@/components/commerce/CommerceProvider";
import { Footer } from "@/components/layout/Footer";
import { Header, type MenuGroup } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { getCatalog, getCategories } from "@/db/queries/catalog";
import { getCities, getSettings } from "@/db/queries/content";
import { routing } from "@/i18n/routing";
import { localized, type Locale } from "@/lib/i18n-db";
import { buildAlternates, SITE_URL } from "@/lib/seo";
import "../globals.css";

const displayEn = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-en",
  display: "swap",
});
const sansEn = Inter({ subsets: ["latin"], variable: "--font-sans-en", display: "swap" });
const displayJa = Shippori_Mincho({
  weight: ["500", "600", "700"],
  variable: "--font-display-ja",
  display: "swap",
  preload: false,
});
const sansJa = Noto_Sans_JP({ variable: "--font-sans-ja", display: "swap", preload: false });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    description: t("description"),
    alternates: buildAlternates(locale, ""),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "ja" ? "ja_JP" : "en_PK",
      images: [{ url: "/images/hero-a5.webp", width: 1800, height: 1018 }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1a1613",
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = (await getLocale()) as Locale;
  const [settings, cities, categories, catalog] = await Promise.all([
    getSettings(),
    getCities(locale),
    getCategories(locale),
    getCatalog(locale),
  ]);

  const menu: MenuGroup[] = (["origin", "cut", "occasion"] as const).map((key) => ({
    key,
    items: categories.filter((c) => c.type === key).map((c) => ({ slug: c.slug, name: c.name })),
  }));

  const lookup: Record<string, CatalogEntry> = {};
  for (const product of catalog) {
    for (const variant of product.variants) {
      lookup[variant.sku] = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        label: variant.label,
        pricePKR: variant.pricePKR,
        weightGrams: variant.weightGrams,
        image: product.image?.url ?? null,
        inStock: variant.inStock,
      };
    }
  }

  return (
    <html lang={locale} className={`${displayEn.variable} ${sansEn.variable} ${displayJa.variable} ${sansJa.variable}`}>
      <body className="min-h-screen">
        <NextIntlClientProvider>
          <CommerceProvider catalog={lookup} cities={cities} whatsappNumber={settings.whatsappNumber}>
            <Header announcement={localized(settings.announcement.en, settings.announcement.ja, locale)} menu={menu} />
            <main id="main">{children}</main>
            <Footer settings={settings} />
            <CartDrawer />
            <WhatsAppFloat />
          </CommerceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
