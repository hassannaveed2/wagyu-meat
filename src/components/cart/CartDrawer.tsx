"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useSelectedCity } from "@/components/commerce/CommerceProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import { cartTotals } from "@/lib/commerce/pricing";
import { formatPKR } from "@/lib/commerce/format";
import { useCart } from "@/store/cart";
import { QuantityStepper } from "./QuantityStepper";
import { useCartView } from "./useCartView";

export function CartDrawer() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const isOpen = useCart((state) => state.isOpen);
  const close = useCart((state) => state.close);
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);
  const { lines, priced } = useCartView();
  const city = useSelectedCity();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const totals = cartTotals(priced, city);
  const threshold = city?.freeDeliveryThresholdPKR ?? 0;
  const progress = city && threshold > 0 ? Math.min(100, (totals.subtotal / threshold) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t("title")}>
      <button type="button" className="absolute inset-0 bg-sumi/50 backdrop-blur-[2px]" onClick={close} aria-label={t("continue")} tabIndex={-1} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] animate-fade-up flex-col bg-paper shadow-[var(--shadow-pop)] focus:outline-none"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <h2 className="display text-xl">{t("title")}</h2>
          <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5" aria-label={t("continue")}>
            <Icon name="close" size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <Icon name="cart" size={40} className="text-ink-3" />
            <p className="text-ink-2">{t("empty")}</p>
            <ButtonLink href="/shop" onClick={close}>
              {t("emptyCta")}
            </ButtonLink>
          </div>
        ) : (
          <>
            {city && (
              <div className="border-b border-line bg-paper-2 px-5 py-3">
                <p className="text-sm text-ink-2">
                  {totals.remainingForFree > 0
                    ? t("freeProgress", { amount: formatPKR(totals.remainingForFree) })
                    : t("freeReached")}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
                  <div className="h-full rounded-full bg-wagyu transition-[width] duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map(({ line, entry }) => (
                <li key={line.sku} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-paper-2">
                    {entry?.image && <Image src={entry.image} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    {entry ? (
                      <Link href={`/products/${entry.slug}`} onClick={close} className="font-medium leading-snug hover:text-wagyu">
                        {entry.name}
                      </Link>
                    ) : (
                      <p className="font-medium text-ink-3">{line.sku}</p>
                    )}
                    <p className="mt-0.5 text-sm text-ink-3">{entry ? entry.label : t("unavailable")}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper value={line.quantity} onChange={(q) => setQuantity(line.sku, q)} size="sm" />
                      <div className="text-right">
                        {entry && <p className="font-medium">{formatPKR(entry.pricePKR * line.quantity)}</p>}
                        <button type="button" onClick={() => remove(line.sku)} className="text-xs text-ink-3 underline-offset-2 hover:text-wagyu hover:underline">
                          {tc("remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 pb-6 pt-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-2">{t("subtotal")}</dt>
                  <dd className="font-medium">{formatPKR(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">{t("delivery")}</dt>
                  <dd>{!city ? t("deliveryChooseCity") : totals.delivery === 0 ? t("deliveryFree") : formatPKR(totals.delivery)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base">
                  <dt className="font-medium">{t("total")}</dt>
                  <dd className="font-semibold">{formatPKR(totals.total)}</dd>
                </div>
              </dl>
              <ButtonLink href="/checkout" onClick={close} size="lg" className="mt-4 w-full">
                {t("checkout")}
              </ButtonLink>
              <button type="button" onClick={close} className="mt-2 w-full py-2 text-sm text-ink-2 hover:text-ink">
                {t("continue")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
