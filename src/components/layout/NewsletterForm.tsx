"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { subscribe, type FormState } from "@/app/[locale]/actions";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: "idle" });

  if (state.status === "success") {
    return <p className="text-sm text-gold">{t("subscribed")}</p>;
  }

  return (
    <form action={action} className="flex gap-2">
      <input type="hidden" name="locale" value={locale} />
      <label className="sr-only" htmlFor="newsletter-email">
        {t("emailPlaceholder")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder={t("emailPlaceholder")}
        className="h-11 min-w-0 flex-1 rounded-full border border-paper/20 bg-paper/5 px-4 text-sm text-paper placeholder:text-paper/45 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-11 shrink-0 rounded-full bg-paper px-5 text-sm font-medium text-ink hover:bg-paper-2 disabled:opacity-60"
      >
        {t("subscribe")}
      </button>
    </form>
  );
}
