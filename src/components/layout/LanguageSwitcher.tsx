"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    // Read the path at click time (not via usePathname) so the header can prerender on dynamic routes.
    const path = window.location.pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
    startTransition(() => router.replace(`${path}${window.location.search}`, { locale: next }));
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-full p-0.5 text-xs font-medium",
        tone === "dark" ? "bg-ink/5" : "bg-paper/10",
        pending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => switchTo(code)}
          aria-pressed={code === locale}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            code === locale
              ? tone === "dark"
                ? "bg-ink text-paper"
                : "bg-paper text-ink"
              : tone === "dark"
                ? "text-ink-2 hover:text-ink"
                : "text-paper/75 hover:text-paper",
          )}
        >
          {code === "en" ? "EN" : "日本語"}
        </button>
      ))}
    </div>
  );
}
