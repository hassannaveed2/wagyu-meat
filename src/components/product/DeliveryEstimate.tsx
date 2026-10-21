"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useSelectedCity } from "@/components/commerce/CommerceProvider";
import { CitySelector } from "@/components/layout/CitySelector";
import { Icon } from "@/components/ui/Icon";
import { nextDeliveryDates } from "@/lib/commerce/delivery";
import { formatDeliveryDate, formatPKR } from "@/lib/commerce/format";


export function DeliveryEstimate() {
  const t = useTranslations("city");
  const locale = useLocale();
  const city = useSelectedCity();
  // The city only exists after the client store hydrates, so the clock is read on the client.
  const next = useMemo(() => (city ? (nextDeliveryDates(new Date(), city, 1)[0] ?? null) : null), [city]);

  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-line bg-paper-2 p-4 text-sm">
      <Icon name="truck" size={20} className="mt-0.5 shrink-0 text-wagyu" />
      {city && next ? (
        <div>
          <p className="font-medium text-ink">{t("nextDelivery", { city: city.name, date: formatDeliveryDate(next, locale) })}</p>
          <p className="mt-0.5 text-ink-2">
            {t("freeOver", { amount: formatPKR(city.freeDeliveryThresholdPKR) })} · {t("fee", { amount: formatPKR(city.deliveryFeePKR) })}
          </p>
        </div>
      ) : (
        <CitySelector tone="dark" />
      )}
    </div>
  );
}
