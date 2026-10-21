"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import { formatPKR } from "@/lib/commerce/format";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import type { ProductCard as ProductCardData } from "@/db/queries/catalog";
import { GradeBadges } from "./GradeBadges";

export type CardProduct = Pick<
  ProductCardData,
  "id" | "slug" | "name" | "short" | "grade" | "bms" | "region" | "variants" | "fromPricePKR" | "inStock" | "rating" | "productType"
> & { images: { url: string; alt: string }[] };

export function ProductCard({ product, priority = false }: { product: CardProduct; priority?: boolean }) {
  const t = useTranslations("common");
  const add = useCart((state) => state.add);
  const [justAdded, setJustAdded] = useState(false);

  const cheapest = product.variants
    .filter((v) => v.inStock)
    .sort((a, b) => a.pricePKR - b.pricePKR)[0];
  const [primary, secondary] = product.images;
  const href = `/products/${product.slug}`;

  function quickAdd() {
    if (!cheapest) return;
    add({ productId: product.id, sku: cheapest.sku, quantity: 1 });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-sumi">
        {primary && (
          <Image
            src={primary.url}
            alt={primary.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            className={cn("object-cover transition-all duration-700 group-hover:scale-[1.04]", secondary && "group-hover:opacity-0")}
          />
        )}
        {secondary && (
          <Image
            src={secondary.url}
            alt=""
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3">
          <GradeBadges grade={product.grade} bms={product.bms} />
        </div>
        {!product.inStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-paper/90 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-ink">
            {t("outOfStock")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {product.region && <p className="text-[0.72rem] uppercase tracking-[0.12em] text-ink-3">{product.region}</p>}
        <h3 className="mt-1 text-[1.05rem] font-medium leading-snug">
          <Link href={href} className="hover:text-wagyu">
            {product.name}
          </Link>
        </h3>
        {product.rating && (
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-3">
            <Icon name="star" size={13} className="text-gold" />
            {product.rating.average.toFixed(1)} · {t("reviews", { count: product.rating.count })}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[0.72rem] text-ink-3">{product.variants.length > 1 ? t("from") : cheapest?.label}</p>
            <p className="font-semibold">{formatPKR(product.fromPricePKR)}</p>
          </div>
          {cheapest && (
            <button
              type="button"
              onClick={quickAdd}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
                justAdded ? "bg-leaf text-paper" : "bg-ink text-paper hover:bg-wagyu",
              )}
              aria-label={`${t("addToCart")}: ${product.name}, ${cheapest.label}`}
            >
              <Icon name={justAdded ? "check" : "plus"} size={16} />
              {justAdded ? t("added") : cheapest.label}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
