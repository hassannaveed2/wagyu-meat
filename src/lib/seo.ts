import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import type { Locale } from "./i18n-db";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Canonical + hreflang alternates for a locale-less path such as "/shop". */
export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const code of routing.locales) languages[code] = `/${code}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}
