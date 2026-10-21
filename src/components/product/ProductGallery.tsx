"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function ProductGallery({ images, badges }: { images: { url: string; alt: string }[]; badges?: ReactNode }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-28 lg:flex-row-reverse lg:items-start">
      <div className="relative aspect-[4/5] w-full min-w-0 flex-1 overflow-hidden rounded-[14px] bg-sumi">
        {current && (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="animate-fade-up object-cover"
          />
        )}
        {badges && <div className="absolute left-4 top-4">{badges}</div>}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 lg:w-20 lg:flex-col">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${image.alt} ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square w-20 overflow-hidden rounded-[8px] ring-2 ring-offset-2 ring-offset-paper transition",
                index === active ? "ring-wagyu" : "ring-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
