"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { useBodyFlag } from "@/lib/use-body-flag";

/** Black offer bar pinned to the bottom once the hero's main button has scrolled out of view. */
export function StickyOffer({ fromPrice, targetId }: { fromPrice: string; targetId: string }) {
  const t = useTranslations("v2");
  const [visible, setVisible] = useState(false);
  useBodyFlag("stickybar", visible);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 bg-v2-ink text-white transition-transform duration-300",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-[1040px] items-center gap-4 px-4 py-3 sm:px-6">
        <Image
          src="/images/p-a5-ribeye.webp"
          alt=""
          width={48}
          height={48}
          className="hidden h-12 w-12 shrink-0 rounded-[8px] object-cover sm:block"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-white/75">{t("sticky.line1")}</p>
          <p className="truncate text-sm font-semibold">{t("sticky.line2")}</p>
        </div>
        <p className="hidden text-sm font-semibold sm:block">{t("sticky.from", { price: fromPrice })}</p>
        <Link
          href="/shop"
          tabIndex={visible ? undefined : -1}
          className="shrink-0 rounded-[12px] bg-white px-5 py-2.5 text-sm font-bold text-v2-ink hover:bg-v2-tint"
        >
          {t("hero.cta")}
        </Link>
      </div>
    </div>
  );
}
