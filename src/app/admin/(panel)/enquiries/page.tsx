import { SubmitButton } from "@/components/admin/SubmitButton";
import { PageTitle, StatusPill, Table } from "@/components/admin/ui";
import { listEnquiries } from "@/db/queries/admin";
import { whatsappLink } from "@/lib/whatsapp";
import { setEnquiryStatus } from "../content-actions";

export const metadata = { title: "Enquiries" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function EnquiriesPage() {
  const rows = await listEnquiries();
  return (
    <>
      <PageTitle title="Enquiries" description="Contact and corporate-gifting messages from the store." />
      <Table head={["From", "Type", "Message", "Received", "Status"]} empty={rows.length ? undefined : "No enquiries yet."}>
        {rows.map((enquiry) => (
          <tr key={enquiry.id} className="align-top">
            <td className="px-4 py-3">
              <p className="font-medium">{enquiry.name}</p>
              {enquiry.company && <p className="text-xs text-ink-3">{enquiry.company}</p>}
              <a href={whatsappLink(enquiry.phone)} target="_blank" rel="noopener noreferrer" className="text-xs text-whatsapp">
                {enquiry.phone}
              </a>
              {enquiry.email && <p className="text-xs text-ink-3">{enquiry.email}</p>}
            </td>
            <td className="px-4 py-3 capitalize">{enquiry.type}</td>
            <td className="max-w-md px-4 py-3 whitespace-pre-line text-ink-2">{enquiry.message}</td>
            <td className="whitespace-nowrap px-4 py-3 text-ink-2">
              {new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeZone: "Asia/Karachi" }).format(enquiry.createdAt)}
            </td>
            <td className="px-4 py-3">
              <StatusPill status={enquiry.status} />
              <form action={setEnquiryStatus} className="mt-2">
                <input type="hidden" name="id" value={enquiry.id} />
                <input type="hidden" name="status" value={enquiry.status === "new" ? "handled" : "new"} />
                <SubmitButton variant="outline">{enquiry.status === "new" ? "Mark handled" : "Reopen"}</SubmitButton>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
