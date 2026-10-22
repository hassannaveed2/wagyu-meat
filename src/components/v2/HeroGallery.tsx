"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type GallerySlide = { src: string; caption: string };

/** Main photo with arrows, a caption and a thumbnail strip, as on the reference landing page. */
export function HeroGallery({ slides }: { slides: GallerySlide[] }) {
  const t = useTranslations("v2.hero");
  const [index, setIndex] = useState(0);
  const go = (next: number) => setIndex((next + slides.length) % slides.length);
  const current = slides[index];

  return (
    <div role="region" aria-roledescription="carousel" aria-label={t("gallery")}>
      <div className="relative aspect-[1/1.02] overflow-hidden rounded-[18px] bg-v2-tint">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.caption}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 520px, 100vw"
            className={cn("object-cover transition-opacity duration-500", i === index ? "opacity-100" : "opacity-0")}
          />
        ))}
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={t("prev")}
          className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-v2-ink shadow-md hover:bg-v2-tint"
        >
          <Icon name="chevronLeft" size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={t("next")}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-v2-ink shadow-md hover:bg-v2-tint"
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
      <p className="mt-2.5 text-sm font-medium" aria-live="polite">
        {current.caption}
      </p>
      <div className="mt-2.5 grid grid-cols-8 gap-1.5 sm:gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            aria-label={t("show", { index: i + 1 })}
            aria-current={i === index}
            className={cn(
              "relative aspect-square overflow-hidden rounded-[10px] border-2 transition-colors",
              i === index ? "border-v2-ink" : "border-transparent hover:border-v2-line",
            )}
          >
            <Image src={slide.src} alt="" fill sizes="56px" className="object-cover" />
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-v2-muted">{t("illustrative")}</p>
    </div>
  );
}
