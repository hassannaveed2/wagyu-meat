import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { Icon, WhatsAppGlyph } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { getSettings } from "@/db/queries/content";
import { getOrderByPublicId } from "@/db/queries/orders";
import { fromDateKey } from "@/lib/commerce/delivery";
import { formatDeliveryDate, formatPKR } from "@/lib/commerce/format";
import { localized, type Locale } from "@/lib/i18n-db";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { robots: { index: false } };

export default function SuccessPage({ params }: PageProps<"/[locale]/checkout/success/[publicId]">) {
  return (
    <Suspense fallback={<Container className="py-24"><div className="h-80 animate-pulse rounded-[14px] bg-paper-2" /></Container>}>
      <OrderConfirmation params={params} />
    </Suspense>
  );
}

async function OrderConfirmation({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const locale = (await getLocale()) as Locale;
  const [order, settings] = await Promise.all([getOrderByPublicId(publicId), getSettings()]);
  if (!order) notFound();

  const t = await getTranslations("success");
  const tc = await getTranslations("checkout");
  const tCart = await getTranslations("cart");
  const firstName = order.customerName.split(" ")[0];
  const message = `Hi! I just placed order ${order.orderNumber} (${formatPKR(order.totalPKR)}). Please confirm.`;
  const bankDetails = localized(settings.bankDetails.en, settings.bankDetails.ja, locale);

  return (
    <Container className="max-w-[760px] py-14 sm:py-20">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-soft text-leaf">
          <Icon name="check" size={28} />
        </span>
        <p className="eyebrow mt-6">{t("eyebrow")}</p>
        <h1 className="display mt-3 text-[2.2rem] sm:text-5xl">{t("title", { name: firstName })}</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-2">{t("body", { number: order.orderNumber })}</p>
      </div>

      <div className="mt-10 rounded-[14px] border border-line bg-paper p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
          <p className="font-[family-name:var(--font-display-en)] text-2xl font-semibold">{order.orderNumber}</p>
          <p className="flex items-center gap-2 text-sm text-ink-2">
            <Icon name="truck" size={18} className="text-wagyu" />
            {t("deliveryOn", { date: formatDeliveryDate(fromDateKey(order.deliveryDate), locale), slot: order.slot })}
          </p>
        </div>
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {item.title} · {item.label} × {item.quantity}
              </span>
              <span className="font-medium">{formatPKR(item.lineTotalPKR)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-2">{tCart("subtotal")}</dt>
            <dd>{formatPKR(order.subtotalPKR)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-2">{tCart("delivery")}</dt>
            <dd>{order.deliveryFeePKR === 0 ? tCart("deliveryFree") : formatPKR(order.deliveryFeePKR)}</dd>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold">
            <dt>{tCart("total")}</dt>
            <dd>{formatPKR(order.totalPKR)}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-[10px] bg-paper-2 p-4 text-sm">
          <p className="font-medium">
            {t("paymentNext")}: {tc(`methods.${order.paymentMethod}`)}
          </p>
          <p className="mt-1 text-ink-2">{tc(`methodHints.${order.paymentMethod}`)}</p>
          {order.paymentMethod === "bank-transfer" && bankDetails && <p className="mt-2 whitespace-pre-line text-ink">{bankDetails}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {settings.whatsappNumber && (
          <ExternalButton href={whatsappLink(settings.whatsappNumber, message)} variant="whatsapp" size="lg">
            <WhatsAppGlyph size={18} />
            {t("whatsapp")}
          </ExternalButton>
        )}
        <ButtonLink href="/track" variant="outline" size="lg">
          {t("track")}
        </ButtonLink>
        <ButtonLink href="/shop" variant="ghost" size="lg">
          {t("continue")}
        </ButtonLink>
      </div>
    </Container>
  );
}
