import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, ErrorNote, Field, Flash, inputClass, PageTitle, StatusPill, Table } from "@/components/admin/ui";
import { listAdminUsers } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth/session";
import { addUser, resetPassword, setUserActive } from "./actions";

export const metadata = { title: "Team" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const session = await requireAdmin("admin");
  const { saved, error } = await searchParams;
  const users = await listAdminUsers();

  return (
    <>
      <PageTitle title="Team" description="Admins manage everything. Staff can handle orders, products, reviews and content, but not settings or the team." />
      <Flash message={saved ? "Saved." : null} />
      <ErrorNote message={typeof error === "string" ? error : null} />
      <Table head={["Name", "Role", "Last sign-in", "Status", ""]}>
        {users.map((user) => (
          <tr key={user.id} className="align-top">
            <td className="px-4 py-3">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-ink-3">{user.email}</p>
            </td>
            <td className="px-4 py-3 capitalize">{user.role}</td>
            <td className="px-4 py-3 text-ink-2">
              {user.lastLoginAt ? new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" }).format(user.lastLoginAt) : "Never"}
            </td>
            <td className="px-4 py-3">
              <StatusPill status={user.active ? "delivered" : "cancelled"} label={user.active ? "Active" : "Disabled"} />
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {user.id !== session.userId && (
                  <form action={setUserActive}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="active" value={String(!user.active)} />
                    <SubmitButton variant={user.active ? "danger" : "outline"}>{user.active ? "Disable" : "Enable"}</SubmitButton>
                  </form>
                )}
                <form action={resetPassword} className="flex gap-2">
                  <input type="hidden" name="id" value={user.id} />
                  <input name="password" type="password" placeholder="New password" minLength={10} required autoComplete="new-password" className={`${inputClass} h-9 w-40`} />
                  <SubmitButton variant="outline">Set</SubmitButton>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <Card title="Add a team member" className="mt-6">
        <form action={addUser} className="grid gap-3 sm:grid-cols-5 sm:items-end">
          <Field label="Name">
            <input name="name" required className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Role">
            <select name="role" defaultValue="staff" className={inputClass}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Temporary password">
            <input name="password" type="password" minLength={10} required autoComplete="new-password" className={inputClass} />
          </Field>
          <SubmitButton>Add member</SubmitButton>
        </form>
      </Card>
    </>
  );
}
