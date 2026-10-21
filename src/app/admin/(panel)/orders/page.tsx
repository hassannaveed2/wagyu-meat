import Link from "next/link";
import { inputClass, PageTitle, StatusPill, Table } from "@/components/admin/ui";
import { listOrders } from "@/db/queries/admin";
import { formatPKR } from "@/lib/commerce/format";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/commerce/validation";
import { cn } from "@/lib/cn";

export const metadata = { title: "Orders" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const status = ORDER_STATUSES.includes(params.status as OrderStatus) ? (params.status as OrderStatus) : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const rows = await listOrders({ status, q });

  return (
    <>
      <PageTitle title="Orders" description="Newest first. Click an order to update its status." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[undefined, ...ORDER_STATUSES].map((value) => (
          <Link
            key={value ?? "all"}
            href={value ? `/admin/orders?status=${value}` : "/admin/orders"}
            className={cn(
              "rounded-full border px-3 py-1 text-xs capitalize",
              status === value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink",
            )}
          >
            {value ? value.replace(/-/g, " ") : "All"}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search number, name, phone" className={cn(inputClass, "w-64")} />
        </form>
      </div>
      <Table
        head={["Order", "Placed", "Customer", "City", "Delivery", "Payment", "Total", "Status"]}
        empty={rows.length ? undefined : "No orders match."}
      >
        {rows.map((order) => (
          <tr key={order.id} className="hover:bg-paper-2">
            <td className="whitespace-nowrap px-4 py-3 font-medium">
              <Link href={`/admin/orders/${order.id}`} className="hover:text-wagyu">
                {order.orderNumber}
              </Link>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-ink-2">
              {new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" }).format(order.createdAt)}
            </td>
            <td className="px-4 py-3">
              {order.customerName}
              <span className="block text-xs text-ink-3">{order.customerPhone}</span>
            </td>
            <td className="px-4 py-3">{order.cityName}</td>
            <td className="whitespace-nowrap px-4 py-3">
              {order.deliveryDate}
              <span className="block text-xs text-ink-3">{order.slot}</span>
            </td>
            <td className="px-4 py-3">
              <span className="text-xs uppercase text-ink-2">{order.paymentMethod}</span>
              <span className="mt-1 block">
                <StatusPill status={order.paymentStatus} />
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-3 font-medium">{formatPKR(order.totalPKR)}</td>
            <td className="px-4 py-3">
              <StatusPill status={order.status} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
