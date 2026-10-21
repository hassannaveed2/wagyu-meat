"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { MAX_QUANTITY_PER_LINE } from "@/lib/commerce/cart";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}) {
  const t = useTranslations("common");
  const button = cn(
    "grid place-items-center text-ink-2 hover:text-ink disabled:opacity-30",
    size === "sm" ? "h-8 w-8" : "h-11 w-11",
  );
  return (
    <div className={cn("inline-flex items-center rounded-full border border-line bg-paper", size === "md" && "h-12")}>
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t("decrease")}>
        <Icon name="minus" size={16} />
      </button>
      <span className={cn("min-w-6 text-center font-medium tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">
        <span className="sr-only">{t("quantity")}: </span>
        {value}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY_PER_LINE}
        aria-label={t("increase")}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
