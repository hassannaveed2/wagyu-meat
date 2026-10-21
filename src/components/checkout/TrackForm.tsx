"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { trackOrder, type TrackState } from "@/app/[locale]/track/actions";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { fromDateKey } from "@/lib/commerce/delivery";
import { formatDeliveryDate, formatPKR } from "@/lib/commerce/format";
import { cn } from "@/lib/cn";

const STEPS = ["pending", "confirmed", "packed", "out-for-delivery", "delivered"] as const;
const input =
  "h-12 w-full rounded-[10px] border border-line bg-paper px-4 text-[0.95rem] focus:border-ink focus:outline-none";

export function TrackForm() {
  const t = useTranslations("track");
  const locale = useLocale();
  const [state, action, pending] = useActionState<TrackState, FormData>(trackOrder, { status: "idle" });

  return (
    <div>
      <form action={action} className="grid gap-4 rounded-[14px] border border-line bg-paper p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t("number")}</span>
          <input name="orderNumber" required placeholder="WM-24001" className={input} autoCapitalize="characters" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t("phone")}</span>
          <input name="phone" type="tel" required placeholder="0300 1234567" className={input} autoComplete="tel" />
        </label>
        <Button type="submit" size="lg" className="h-12" disabled={pending}>
          <Icon name="search" size={18} />
          {t("submit")}
        </Button>
      </form>

      {state.status === "not-found" && (
        <p className="mt-6 rounded-md bg-wagyu-soft px-4 py-3 text-sm text-wagyu-ink" role="alert">
          {t("notFound")}
        </p>
      )}

      {state.status === "found" && (
        <div className="mt-8 rounded-[14px] border border-line bg-paper p-6 sm:p-8" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-[family-name:var(--font-display-en)] text-2xl font-semibold">{state.order.orderNumber}</p>
            <p className="text-sm text-ink-3">
              {t("placed", { date: new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-PK", { dateStyle: "medium", timeZone: "Asia/Karachi" }).format(new Date(state.order.createdAt)) })}
            </p>
          </div>

          {state.order.status === "cancelled" ? (
            <p className="mt-6 font-medium text-wagyu">{t("status.cancelled")}</p>
          ) : (
            <ol className="mt-8 grid grid-cols-5 gap-2">
              {STEPS.map((step, index) => {
                const reached = STEPS.indexOf(state.order.status as (typeof STEPS)[number]) >= index;
                return (
                  <li key={step} className="text-center">
                    <span className={cn("mx-auto block h-1.5 rounded-full", reached ? "bg-wagyu" : "bg-paper-3")} />
                    <span className={cn("mt-2 block text-[0.7rem] sm:text-xs", reached ? "font-medium text-ink" : "text-ink-3")}>{t(`status.${step}`)}</span>
                  </li>
                );
              })}
            </ol>
          )}

          <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
            <Icon name="truck" size={18} className="text-wagyu" />
            {formatDeliveryDate(fromDateKey(state.order.deliveryDate), locale)} · {state.order.slot}
          </p>
          <h2 className="mt-6 text-sm font-medium">{t("items")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-ink-2">
            {state.order.items.map((item) => (
              <li key={`${item.title}-${item.label}`}>
                {item.title} · {item.label} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold">{formatPKR(state.order.totalPKR)}</p>
        </div>
      )}
    </div>
  );
}
