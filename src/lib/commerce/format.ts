const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** Rupee amounts are shown the same way in both locales: "Rs 12,500". */
export function formatPKR(amount: number): string {
  return `Rs ${pkr.format(amount)}`;
}

export function formatWeight(grams: number): string {
  return grams >= 1000 && grams % 100 === 0 ? `${grams / 1000} kg` : `${grams} g`;
}

export function formatDeliveryDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Karachi",
  }).format(date);
}
