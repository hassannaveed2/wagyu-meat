import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { getCategories } from "@/db/queries/catalog";
import { getSettings } from "@/db/queries/content";
import { localized, type Locale } from "@/lib/i18n-db";
import { Footer } from "./Footer";
import { Header, type MenuGroup } from "./Header";

/** The storefront's header and footer around a page. The /v2 landing page brings its own instead. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const locale = (await getLocale()) as Locale;
  const [settings, categories] = await Promise.all([getSettings(), getCategories(locale)]);

  const menu: MenuGroup[] = (["origin", "cut", "occasion"] as const).map((key) => ({
    key,
    items: categories.filter((c) => c.type === key).map((c) => ({ slug: c.slug, name: c.name })),
  }));

  return (
    <>
      <Header announcement={localized(settings.announcement.en, settings.announcement.ja, locale)} menu={menu} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
