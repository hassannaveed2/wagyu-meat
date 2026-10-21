"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

const LEVELS = Array.from({ length: 12 }, (_, i) => i + 1);

function band(level: number): "low" | "mid" | "high" | "top" {
  if (level <= 3) return "low";
  if (level <= 5) return "mid";
  if (level <= 9) return "high";
  return "top";
}

/** Reference photos of real marbling; each level shows the nearest one. */
const SWATCHES = [
  { src: "/images/bms-2.webp", max: 3 },
  { src: "/images/bms-5.webp", max: 6 },
  { src: "/images/bms-8.webp", max: 9 },
  { src: "/images/bms-12.webp", max: 12 },
];

function swatchFor(level: number): string {
  return (SWATCHES.find((swatch) => level <= swatch.max) ?? SWATCHES[SWATCHES.length - 1]).src;
}

export function BmsScale({ initial = 10, tone = "light" }: { initial?: number; tone?: "light" | "dark" }) {
  const t = useTranslations("bms");
  const [level, setLevel] = useState(initial);
  const id = useId();

  return (
    <div className={cn("rounded-[14px] p-5 sm:p-8", tone === "light" ? "border border-line bg-paper" : "bg-paper/5 ring-1 ring-paper/10")}>
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
        <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full bg-sumi md:w-full" aria-hidden="true">
          {SWATCHES.map((swatch) => (
            <Image
              key={swatch.src}
              src={swatch.src}
              alt=""
              fill
              sizes="220px"
              className={cn(
                "object-cover transition-opacity duration-500",
                swatchFor(level) === swatch.src ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <span className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgb(0_0_0/0.3)] ring-1 ring-black/10" />
        </div>
        <div>
          <p className={cn("text-sm font-semibold uppercase tracking-[0.14em]", tone === "light" ? "text-wagyu" : "text-gold")}>
            {t(`grade.${band(level)}`)}
          </p>
          <p className="display mt-1 text-4xl sm:text-5xl">{t("label", { value: level })}</p>
          <p className={cn("mt-3 min-h-[3rem] text-[1.02rem]", tone === "light" ? "text-ink-2" : "text-paper/75")} aria-live="polite">
            {t(`describe.${level}` as "describe.1")}
          </p>
          <label htmlFor={id} className="sr-only">
            {t("label", { value: level })}
          </label>
          <input
            id={id}
            type="range"
            min={1}
            max={12}
            step={1}
            value={level}
            onChange={(event) => setLevel(Number(event.target.value))}
            className="mt-6 w-full accent-[var(--color-wagyu)]"
          />
          <div className="mt-2 grid grid-cols-12 gap-1">
            {LEVELS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLevel(value)}
                className="group flex flex-col items-center gap-1"
                aria-label={t("label", { value })}
              >
                <span
                  className={cn(
                    "h-2 w-full rounded-full transition-all",
                    value === level ? "scale-y-150" : "opacity-60 group-hover:opacity-100",
                    band(value) === "low" && "bg-[#c9b9a8]",
                    band(value) === "mid" && "bg-[#c8956b]",
                    band(value) === "high" && "bg-gold",
                    band(value) === "top" && "bg-wagyu",
                  )}
                />
                <span className={cn("text-[0.65rem] tabular-nums", tone === "light" ? "text-ink-3" : "text-paper/50", value === level && "font-semibold")}>
                  {value}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
