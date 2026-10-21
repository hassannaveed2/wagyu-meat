"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { Button, ExternalButton } from "@/components/ui/Button";
import { Icon, WhatsAppGlyph } from "@/components/ui/Icon";
import type { Variant } from "@/db/queries/catalog";
import { formatPKR } from "@/lib/commerce/format";
import { cn } from "@/lib/cn";
import { useBodyFlag } from "@/lib/use-body-flag";
import { whatsappLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { DeliveryEstimate } from "./DeliveryEstimate";

export function PurchasePanel({
  productId,
  productName,
  image,
  variants,
}: {
  productId: number;
  productName: string;
  image: string | null;
  variants: Variant[];
}) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const { whatsappNumber } = useCommerce();
  const add = useCart((state) => state.add);
  const firstAvailable = variants.find((v) => v.inStock) ?? variants[0];
  const [sku, setSku] = useState(firstAvailable?.sku);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const selected = variants.find((v) => v.sku === sku) ?? firstAvailable;
  useBodyFlag("buybar");

  // Show the mobile buy bar once the main add-to-cart button scrolls out of view.
  useEffect(() => {
    const target = buttonRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!selected) return null;

  function addToCart() {
    if (!selected?.inStock) return;
    add({ productId, sku: selected.sku, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  const whatsappMessage = `Hi! I'd like to order: ${productName} (${selected.label}) × ${quantity}`;

  return (
    <div>
      {variants.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">{t("chooseSize")}</legend>
          <div className="grid grid-cols-2 gap-3">
            {variants.map((variant) => {
              const active = variant.sku === selected.sku;
              return (
                <label
                  key={variant.sku}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-[10px] border p-4 transition-colors",
                    active ? "border-wagyu bg-wagyu-soft/50 ring-1 ring-wagyu" : "border-line bg-paper hover:border-ink/30",
                    !variant.inStock && "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={variant.sku}
                    checked={active}
                    disabled={!variant.inStock}
                    onChange={() => setSku(variant.sku)}
                    className="sr-only"
                  />
                  <span className="font-medium">{variant.label}</span>
                  <span className="mt-1 text-lg font-semibold">{formatPKR(variant.pricePKR)}</span>
                  {variant.weightGrams > 0 && (
                    <span className="text-xs text-ink-3">{tc("perKg", { price: formatPKR(variant.pricePerKg) })}</span>
                  )}
                  {variant.compareAtPKR && variant.compareAtPKR > variant.pricePKR && (
                    <span className="mt-1 text-xs text-leaf">
                      <s className="text-ink-3">{formatPKR(variant.compareAtPKR)}</s> ·{" "}
                      {tc("save", { amount: formatPKR(variant.compareAtPKR - variant.pricePKR) })}
                    </span>
                  )}
                  {!variant.inStock && <span className="mt-1 text-xs font-semibold uppercase">{tc("outOfStock")}</span>}
                  {active && <Icon name="check" size={18} className="absolute right-3 top-3 text-wagyu" />}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div ref={buttonRef} className="mt-6 flex gap-3">
        <QuantityStepper value={quantity} onChange={(value) => setQuantity(Math.max(1, Math.min(20, value)))} />
        <Button size="lg" className="h-12 flex-1" onClick={addToCart} disabled={!selected.inStock}>
          {added ? <Icon name="check" size={18} /> : <Icon name="cart" size={18} />}
          {!selected.inStock ? (
            tc("outOfStock")
          ) : added ? (
            tc("added")
          ) : (
            <>
              {tc("addToCart")}
              <span className="hidden sm:inline"> · {formatPKR(selected.pricePKR * quantity)}</span>
            </>
          )}
        </Button>
      </div>

      {whatsappNumber && (
        <ExternalButton href={whatsappLink(whatsappNumber, whatsappMessage)} variant="outline" size="lg" className="mt-3 h-12 w-full">
          <WhatsAppGlyph size={18} />
          {tc("orderOnWhatsApp")}
        </ExternalButton>
      )}

      <div className="mt-5">
        <DeliveryEstimate />
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 shadow-[0_-10px_30px_-20px_rgb(25_21_18/0.5)] backdrop-blur transition-transform duration-300 lg:hidden",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{productName}</p>
            <p className="text-xs text-ink-2">
              {selected.label} · {formatPKR(selected.pricePKR)}
            </p>
          </div>
          <Button onClick={addToCart} disabled={!selected.inStock} tabIndex={showSticky ? 0 : -1}>
            {added ? tc("added") : tc("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
