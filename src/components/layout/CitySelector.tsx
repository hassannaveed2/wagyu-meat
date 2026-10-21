"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { useCommerce, useSelectedCity } from "@/components/commerce/CommerceProvider";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/lib/commerce/format";
import { cn } from "@/lib/cn";
import { useCity } from "@/store/city";

export function CitySelector({
  tone = "light",
  dropUp = false,
  className,
}: {
  tone?: "dark" | "light";
  dropUp?: boolean;
  className?: string;
}) {
  const t = useTranslations("city");
  const { cities } = useCommerce();
  const selected = useSelectedCity();
  const setCity = useCity((state) => state.setCity);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          tone === "light" ? "text-paper/85 hover:text-paper" : "text-ink-2 hover:text-ink",
        )}
      >
        <Icon name="pin" size={15} />
        <span className="text-[0.7rem] uppercase tracking-[0.12em] opacity-70">{t("label")}</span>
        <span>{selected ? selected.name : t("choose")}</span>
        <Icon name="chevronDown" size={14} />
      </button>
      {open && (
        <ul
          id={listId}
          className={cn(
            "absolute z-50 w-72 overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper p-1 text-ink shadow-[var(--shadow-pop)]",
            dropUp ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2",
          )}
        >
          {cities.map((city) => (
            <li key={city.slug}>
              <button
                type="button"
                onClick={() => {
                  setCity(city.slug);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start justify-between gap-3 rounded-md px-3 py-2.5 text-left hover:bg-paper-2",
                  selected?.slug === city.slug && "bg-paper-2",
                )}
              >
                <span>
                  <span className="block text-sm font-medium">{city.name}</span>
                  <span className="block text-xs text-ink-3">
                    {t("freeOver", { amount: formatPKR(city.freeDeliveryThresholdPKR) })}
                  </span>
                </span>
                {selected?.slug === city.slug && <Icon name="check" size={18} className="mt-0.5 text-wagyu" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
