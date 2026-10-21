"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { placeOrder, type PlaceOrderResult } from "@/app/[locale]/checkout/actions";
import { useCartView } from "@/components/cart/useCartView";
import { useCommerce } from "@/components/commerce/CommerceProvider";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "@/i18n/navigation";
import { nextDeliveryDates, toDateKey } from "@/lib/commerce/delivery";
import { formatDeliveryDate, formatPKR } from "@/lib/commerce/format";
import { cartTotals } from "@/lib/commerce/pricing";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/commerce/validation";
import { cn } from "@/lib/cn";
import { useBodyFlag } from "@/lib/use-body-flag";
import { useCart } from "@/store/cart";
import { useCity } from "@/store/city";

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  notes: string;
  giftMessage: string;
};

const inputClass =
  "h-12 w-full rounded-[10px] border border-line bg-paper px-4 text-[0.95rem] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none aria-[invalid=true]:border-wagyu";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-wagyu" role="alert">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-ink-3">{hint}</span>
      )}
    </label>
  );
}

function Panel({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[14px] border border-line bg-paper p-5 sm:p-7">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-sm text-paper">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const { cities, hydrated } = useCommerce();
  const { lines, priced } = useCartView();
  const clearCart = useCart((state) => state.clear);
  const savedCity = useCity((state) => state.citySlug);
  const setSavedCity = useCity((state) => state.setCity);

  const [fields, setFields] = useState<Fields>({ name: "", phone: "", email: "", address: "", area: "", notes: "", giftMessage: "" });
  const [chosenCity, setCitySlug] = useState<string>("");
  const [chosenDate, setDateKey] = useState("");
  const [slotIndex, setSlotIndex] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [isGift, setIsGift] = useState(false);
  const [hidePrices, setHidePrices] = useState(false);
  const [result, setResult] = useState<PlaceOrderResult | null>(null);
  const [pending, startTransition] = useTransition();
  // The form only renders after the cart hydrates on the client, so reading the clock here is safe.
  const [now] = useState<Date | null>(() => (typeof window === "undefined" ? null : new Date()));
  useBodyFlag("checkout");

  // Default to the city chosen in the header until the shopper picks one here.
  const citySlug = chosenCity || savedCity || "";

  const city = cities.find((c) => c.slug === citySlug) ?? null;
  const dates = useMemo(() => (city && now ? nextDeliveryDates(now, city) : []), [city, now]);

  // Fall back to the first offered date when the chosen one is not available for this city.
  const dateKey = dates.some((d) => toDateKey(d) === chosenDate) ? chosenDate : dates[0] ? toDateKey(dates[0]) : "";

  const totals = cartTotals(priced, city);
  const fieldErrors = result && !result.ok ? (result.fieldErrors ?? {}) : {};
  const errorText = (key: string) => (fieldErrors[key] ? t(`errors.${fieldErrors[key]}` as "errors.required") : undefined);
  const update = (key: keyof Fields) => (event: { target: { value: string } }) => setFields((f) => ({ ...f, [key]: event.target.value }));

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-[14px] bg-paper-2" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-line py-20 text-center">
        <p className="text-ink-2">{t("emptyCart")}</p>
        <ButtonLink href="/shop" className="mt-5">
          {tCart("emptyCta")}
        </ButtonLink>
      </div>
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (city) setSavedCity(city.slug);
    startTransition(async () => {
      const response = await placeOrder({
        ...fields,
        citySlug,
        deliveryDate: dateKey,
        slotIndex,
        paymentMethod: payment,
        isGift,
        hidePrices,
        locale,
        lines: lines.map(({ line }) => ({ productId: line.productId, sku: line.sku, quantity: line.quantity })),
      });
      setResult(response);
      if (response.ok) {
        clearCart();
        router.push(`/checkout/success/${response.publicId}`);
      } else if (response.error === "cart" && response.cartErrors) {
        const removable = response.cartErrors.filter((e) => e.reason === "unknown" || e.reason === "out-of-stock");
        removable.forEach((e) => useCart.getState().remove(e.sku));
      }
    });
  }

  const formError =
    result && !result.ok && result.error !== "fields" ? t(`errors.${result.error}` as "errors.unknown") : null;

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="space-y-5">
        <Panel step={1} title={t("contact")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("name")} error={errorText("name")}>
              <input className={inputClass} value={fields.name} onChange={update("name")} autoComplete="name" required aria-invalid={Boolean(fieldErrors.name)} />
            </Field>
            <Field label={t("phone")} error={errorText("phone")} hint={t("phoneHint")}>
              <input
                className={inputClass}
                value={fields.phone}
                onChange={update("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0300 1234567"
                required
                aria-invalid={Boolean(fieldErrors.phone)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("email")} error={errorText("email")}>
                <input className={inputClass} value={fields.email} onChange={update("email")} type="email" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel step={2} title={t("delivery")}>
          <div className="grid gap-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">{t("city")}</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {cities.map((c) => (
                  <label
                    key={c.slug}
                    className={cn(
                      "cursor-pointer rounded-[10px] border p-3 text-sm transition-colors",
                      c.slug === citySlug ? "border-wagyu bg-wagyu-soft/50 ring-1 ring-wagyu" : "border-line hover:border-ink/30",
                    )}
                  >
                    <input type="radio" name="city" value={c.slug} checked={c.slug === citySlug} onChange={() => setCitySlug(c.slug)} className="sr-only" />
                    <span className="block font-medium">{c.name}</span>
                    <span className="text-xs text-ink-3">{formatPKR(c.deliveryFeePKR)}</span>
                  </label>
                ))}
              </div>
              {result && !result.ok && result.error === "city" && <p className="mt-2 text-sm text-wagyu">{t("errors.city")}</p>}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("address")} error={errorText("address")}>
                <input className={inputClass} value={fields.address} onChange={update("address")} autoComplete="street-address" required aria-invalid={Boolean(fieldErrors.address)} />
              </Field>
              <Field label={t("area")} error={errorText("area")}>
                <input className={inputClass} value={fields.area} onChange={update("area")} autoComplete="address-level3" required aria-invalid={Boolean(fieldErrors.area)} />
              </Field>
            </div>
            {city && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("date")} error={errorText("deliveryDate")}>
                  <select className={inputClass} value={dateKey} onChange={(e) => setDateKey(e.target.value)}>
                    {dates.map((date) => (
                      <option key={toDateKey(date)} value={toDateKey(date)}>
                        {formatDeliveryDate(date, locale)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("slot")}>
                  <select className={inputClass} value={slotIndex} onChange={(e) => setSlotIndex(Number(e.target.value))}>
                    {city.slots.map((slot, index) => (
                      <option key={slot} value={index}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
            <Field label={t("notes")}>
              <textarea className={cn(inputClass, "h-24 py-3")} value={fields.notes} onChange={update("notes")} maxLength={500} />
            </Field>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="h-4 w-4 accent-[var(--color-wagyu)]" />
              <Icon name="gift" size={16} className="text-wagyu" />
              {t("gift")}
            </label>
            {isGift && (
              <div className="grid gap-3 rounded-[10px] bg-paper-2 p-4">
                <Field label={t("giftMessage")}>
                  <textarea className={cn(inputClass, "h-20 py-3")} value={fields.giftMessage} onChange={update("giftMessage")} maxLength={300} />
                </Field>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={hidePrices} onChange={(e) => setHidePrices(e.target.checked)} className="h-4 w-4 accent-[var(--color-wagyu)]" />
                  {t("hidePrices")}
                </label>
              </div>
            )}
          </div>
        </Panel>

        <Panel step={3} title={t("payment")}>
          <div className="grid gap-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[10px] border p-4 transition-colors",
                  method === payment ? "border-wagyu bg-wagyu-soft/50 ring-1 ring-wagyu" : "border-line hover:border-ink/30",
                )}
              >
                <input type="radio" name="payment" value={method} checked={method === payment} onChange={() => setPayment(method)} className="mt-1 accent-[var(--color-wagyu)]" />
                <span>
                  <span className="block font-medium">{t(`methods.${method}`)}</span>
                  <span className="mt-0.5 block text-sm text-ink-2">{t(`methodHints.${method}`)}</span>
                </span>
              </label>
            ))}
          </div>
        </Panel>
      </div>

      <aside className="rounded-[14px] border border-line bg-paper-2 p-5 sm:p-7 lg:sticky lg:top-28">
        <h2 className="text-lg font-medium">{t("summary")}</h2>
        <ul className="mt-5 space-y-4">
          {lines.map(({ line, entry }) => (
            <li key={line.sku} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-paper-3">
                {entry?.image && <Image src={entry.image} alt="" fill sizes="56px" className="object-cover" />}
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.65rem] text-paper">{line.quantity}</span>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium leading-snug">{entry?.name ?? line.sku}</p>
                <p className="text-ink-3">{entry ? entry.label : tCart("unavailable")}</p>
              </div>
              {entry && <p className="text-sm font-medium">{formatPKR(entry.pricePKR * line.quantity)}</p>}
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-2">{tCart("subtotal")}</dt>
            <dd>{formatPKR(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-2">{tCart("delivery")}</dt>
            <dd>{!city ? tCart("deliveryChooseCity") : totals.delivery === 0 ? tCart("deliveryFree") : formatPKR(totals.delivery)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-medium">{tCart("total")}</dt>
            <dd className="font-semibold">{formatPKR(totals.total)}</dd>
          </div>
        </dl>
        {formError && (
          <p className="mt-4 rounded-md bg-wagyu-soft px-3 py-2 text-sm text-wagyu-ink" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={pending || !city}>
          {pending ? t("placing") : t("place", { total: formatPKR(totals.total) })}
        </Button>
        <p className="mt-3 text-center text-xs text-ink-3">{t("terms")}</p>
      </aside>
    </form>
  );
}
