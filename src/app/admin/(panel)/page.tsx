import Link from "next/link";
import { connection } from "next/server";
import { Card, ErrorNote, PageTitle, StatusPill, Table } from "@/components/admin/ui";
import { getDashboardStats } from "@/db/queries/admin";
import { formatPKR } from "@/lib/commerce/format";

export const metadata = { title: "Dashboard" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  await connection();
  const { error } = await searchParams;
  const stats = await getDashboardStats(new Date());

  const tiles = [
    { label: "Orders today", value: String(stats.ordersToday) },
    { label: "Pending orders", value: String(stats.pending), href: "/admin/orders?status=pending" },
    { label: "Revenue · 7 days", value: formatPKR(stats.weekRevenue), sub: `${stats.weekOrders} orders` },
    { label: "Live products", value: String(stats.products), href: "/admin/products" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" description="Today at a glance." />
      <ErrorNote message={error === "forbidden" ? "That section is for administrators only." : null} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const body = (
            <div className="rounded-lg border border-line bg-paper p-5">
              <p className="text-xs uppercase tracking-[0.08em] text-ink-3">{tile.label}</p>
              <p className="mt-2 font-[family-name:var(--font-display-en)] text-3xl font-semibold">{tile.value}</p>
              {tile.sub && <p className="mt-1 text-xs text-ink-3">{tile.sub}</p>}
            </div>
          );
          return tile.href ? (
            <Link key={tile.label} href={tile.href} className="block hover:opacity-90">
              {body}
            </Link>
          ) : (
            <div key={tile.label}>{body}</div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card title="Recent orders" action={<Link href="/admin/orders" className="text-sm text-wagyu">View all</Link>}>
          <Table head={["Order", "Customer", "City", "Total", "Status"]} empty={stats.recent.length ? undefined : "No orders yet."}>
            {stats.recent.map((order) => (
              <tr key={order.id} className="hover:bg-paper-2">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="hover:text-wagyu">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{order.cityName}</td>
                <td className="px-4 py-3">{formatPKR(order.totalPKR)}</td>
                <td className="px-4 py-3">
                  <StatusPill status={order.status} />
                </td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Sold-out variants">
          {stats.outOfStock.length === 0 ? (
            <p className="text-sm text-ink-3">Everything is in stock.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.outOfStock.map((variant) => (
                <li key={variant.sku}>
                  <Link href={`/admin/products/${variant.productId}`} className="hover:text-wagyu">
                    {variant.product} · {variant.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
