import { PageTitle, Table } from "@/components/admin/ui";
import { listSubscribers } from "@/db/queries/admin";

export const metadata = { title: "Subscribers" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function SubscribersPage() {
  const rows = await listSubscribers();
  return (
    <>
      <PageTitle
        title="Subscribers"
        description={`${rows.length} newsletter subscribers.`}
        action={
          // A file download from a route handler, not a page navigation.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a href="/admin/subscribers/export" className="inline-flex h-9 items-center rounded-md border border-line bg-paper px-4 text-sm font-medium hover:border-ink">
            Export CSV
          </a>
        }
      />
      <Table head={["Email", "Language", "Joined"]} empty={rows.length ? undefined : "No subscribers yet."}>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3 uppercase">{row.locale}</td>
            <td className="px-4 py-3 text-ink-2">{new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeZone: "Asia/Karachi" }).format(row.createdAt)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
