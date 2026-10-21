import Link from "next/link";
import { AdminLink, PageTitle, StatusPill, Table } from "@/components/admin/ui";
import { listGuides } from "@/db/queries/admin";

export const metadata = { title: "Guides & recipes" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function GuidesAdminPage() {
  const rows = await listGuides();
  return (
    <>
      <PageTitle title="Guides & recipes" description="Cooking guides shown on the store and product pages." action={<AdminLink href="/admin/guides/new">New guide</AdminLink>} />
      <Table head={["Title", "Type", "Read time", "Status"]} empty={rows.length ? undefined : "No guides yet."}>
        {rows.map((guide) => (
          <tr key={guide.id} className="hover:bg-paper-2">
            <td className="px-4 py-3">
              <Link href={`/admin/guides/${guide.id}`} className="font-medium hover:text-wagyu">
                {guide.titleEn}
              </Link>
              <span className="block text-xs text-ink-3" lang="ja">
                {guide.titleJa || "— no Japanese title —"}
              </span>
            </td>
            <td className="px-4 py-3 capitalize">{guide.type}</td>
            <td className="px-4 py-3">{guide.readingMinutes} min</td>
            <td className="px-4 py-3">
              <StatusPill status={guide.published ? "delivered" : "pending"} label={guide.published ? "Live" : "Draft"} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
