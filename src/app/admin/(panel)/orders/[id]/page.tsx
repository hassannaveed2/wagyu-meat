import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, Field, Flash, inputClass, PageTitle, StatusPill, textareaClass } from "@/components/admin/ui";
import { getOrder } from "@/db/queries/admin";
import { formatPKR } from "@/lib/commerce/format";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/commerce/validation";
import { whatsappLink } from "@/lib/whatsapp";
import { updateOrder } from "../actions";

export const metadata = { title: "Order" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function OrderPage({ params, searchParams }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const order = await getOrder(Number(id));
  if (!order) notFound();

  const confirmMessage = `Assalam o Alaikum ${order.customerName.split(" ")[0]}! Your Wagyu Meat order ${order.orderNumber} (${formatPKR(order.totalPKR)}) is confirmed for delivery on ${order.deliveryDate}, ${order.slot}.`;

  return (
    <>
      <PageTitle
        title={order.orderNumber}
        description={`Placed ${new Intl.DateTimeFormat("en-PK", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Karachi" }).format(order.createdAt)} · ${order.locale.toUpperCase()} site`}
        action={
          <Link href="/admin/orders" className="text-sm text-ink-2 hover:text-ink">
            ← All orders
          </Link>
        }
      />
      <Flash message={saved ? "Order updated." : null} />
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card title="Items">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5">
                      <span className="font-medium">{item.title}</span>
                      <span className="block text-xs text-ink-3">
                        {item.label} · {item.sku}
                      </span>
                    </td>
                    <td className="py-2.5 text-ink-2">
                      {formatPKR(item.unitPricePKR)} × {item.quantity}
                    </td>
                    <td className="py-2.5 text-right font-medium">{formatPKR(item.lineTotalPKR)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-line text-sm">
                <tr>
                  <td colSpan={2} className="pt-3 text-ink-2">Subtotal</td>
                  <td className="pt-3 text-right">{formatPKR(order.subtotalPKR)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-ink-2">Delivery</td>
                  <td className="text-right">{formatPKR(order.deliveryFeePKR)}</td>
                </tr>
                <tr className="text-base font-semibold">
                  <td colSpan={2} className="pt-1">Total</td>
                  <td className="pt-1 text-right">{formatPKR(order.totalPKR)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Customer">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-ink-2">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-sm text-ink-2">{order.customerEmail}</p>}
              <a
                href={whatsappLink(order.customerPhone, confirmMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-9 items-center rounded-md bg-whatsapp px-4 text-sm font-medium text-white"
              >
                Message on WhatsApp
              </a>
            </Card>
            <Card title="Delivery">
              <p className="font-medium">
                {order.deliveryDate} · {order.slot}
              </p>
              <p className="mt-1 text-sm text-ink-2">
                {order.address}, {order.area}, {order.cityName}
              </p>
              {order.notes && <p className="mt-2 rounded bg-paper-2 p-2 text-sm">{order.notes}</p>}
              {order.isGift && (
                <div className="mt-3 rounded bg-gold-soft/60 p-3 text-sm">
                  <p className="font-medium">🎁 Gift{order.hidePrices ? " · hide prices on invoice" : ""}</p>
                  {order.giftMessage && <p className="mt-1 italic">“{order.giftMessage}”</p>}
                </div>
              )}
            </Card>
          </div>
        </div>

        <Card title="Status">
          <div className="mb-4 flex gap-2">
            <StatusPill status={order.status} />
            <StatusPill status={order.paymentStatus} />
            <span className="text-xs uppercase text-ink-3">{order.paymentMethod}</span>
          </div>
          <form action={updateOrder} className="space-y-4">
            <input type="hidden" name="id" value={order.id} />
            <Field label="Order status">
              <select name="status" defaultValue={order.status} className={inputClass}>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Payment status">
              <select name="paymentStatus" defaultValue={order.paymentStatus} className={inputClass}>
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Internal notes" hint="Only visible to staff.">
              <textarea name="adminNotes" defaultValue={order.adminNotes ?? ""} rows={4} className={textareaClass} />
            </Field>
            <SubmitButton className="w-full">Save changes</SubmitButton>
          </form>
        </Card>
      </div>
    </>
  );
}
