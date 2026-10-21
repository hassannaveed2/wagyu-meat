export type Locale = "en" | "ja";

/** Picks the column for `locale`, falling back to English when the Japanese value is blank. */
export function localized(
  en: string | null | undefined,
  ja: string | null | undefined,
  locale: Locale,
): string {
  if (locale === "ja" && ja && ja.trim() !== "") return ja;
  return en ?? "";
}
