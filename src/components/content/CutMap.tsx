"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type CutKey = "chuck" | "rib" | "loin" | "tenderloin" | "rump" | "round" | "brisket";

/** Regions are drawn as simple shapes and clipped to the cow silhouette. */
const REGIONS: { key: CutKey; d: string; label: [number, number]; shop: string }[] = [
  { key: "chuck", d: "M100 70 H250 V215 H100 Z", label: [178, 150], shop: "/shop/sliced" },
  { key: "rib", d: "M250 70 H345 V215 H250 Z", label: [298, 150], shop: "/shop/ribeye" },
  { key: "loin", d: "M345 70 H455 V165 H345 Z", label: [400, 125], shop: "/shop/striploin" },
  { key: "tenderloin", d: "M345 165 H455 V215 H345 Z", label: [400, 193], shop: "/shop/tenderloin" },
  { key: "rump", d: "M455 70 H555 V180 H455 Z", label: [505, 130], shop: "/shop/picanha" },
  { key: "round", d: "M455 180 H555 V70 H690 V330 H455 Z", label: [600, 200], shop: "/shop" },
  { key: "brisket", d: "M90 215 H455 V330 H90 Z", label: [280, 245], shop: "/shop/sliced" },
];

const SILHOUETTE =
  "M60 110 C60 90 80 78 100 80 L130 86 C150 84 170 82 190 84 L560 86 C600 86 630 100 640 130 C648 160 640 200 628 226 L620 300 L596 300 L590 240 C575 252 560 256 545 256 L540 300 L516 300 L512 256 L230 262 L226 300 L202 300 L196 256 C182 252 170 246 160 236 L156 300 L132 300 L128 222 C112 200 104 180 100 160 L76 162 C56 162 44 150 46 136 C48 124 56 116 60 110 Z";

export function CutMap() {
  const t = useTranslations("pages.cuts");
  const tPage = useTranslations("pages.wagyu101");
  const [active, setActive] = useState<CutKey>("rib");
  const current = REGIONS.find((region) => region.key === active)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <svg viewBox="40 60 620 260" className="w-full" role="group" aria-label={tPage("cutsTitle")}>
        <defs>
          <clipPath id="cow">
            <path d={SILHOUETTE} />
          </clipPath>
        </defs>
        <path d="M640 130 C660 150 662 190 652 222" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" />
        <g clipPath="url(#cow)">
          {REGIONS.map((region) => (
            <path
              key={region.key}
              d={region.d}
              role="button"
              tabIndex={0}
              aria-label={t(`${region.key}.name`)}
              aria-pressed={active === region.key}
              onClick={() => setActive(region.key)}
              onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && setActive(region.key)}
              onMouseEnter={() => setActive(region.key)}
              className={cn(
                "cursor-pointer stroke-paper/40 transition-colors duration-200 focus:outline-none",
                active === region.key ? "fill-wagyu" : "fill-sumi-2 hover:fill-[#3a312a]",
              )}
              strokeWidth="1.5"
            />
          ))}
        </g>
        <path d={SILHOUETTE} fill="none" stroke="var(--color-gold)" strokeWidth="2" />
        {REGIONS.map((region) => (
          <text
            key={region.key}
            x={region.label[0]}
            y={region.label[1]}
            textAnchor="middle"
            className="pointer-events-none select-none fill-paper text-[13px] font-medium"
          >
            {t(`${region.key}.name`).split(" (")[0]}
          </text>
        ))}
      </svg>

      <div className="rounded-[14px] bg-paper/5 p-6 ring-1 ring-paper/10" aria-live="polite">
        <p className="eyebrow text-gold">{t(`${current.key}.name`)}</p>
        <p className="mt-3 text-lg leading-relaxed text-paper/85">{t(`${current.key}.body`)}</p>
        <ButtonLink href={current.shop} variant="light" className="mt-6">
          {t("shop", { cut: t(`${current.key}.name`).split(" (")[0] })} →
        </ButtonLink>
      </div>
    </div>
  );
}
