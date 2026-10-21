import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db/client";
import { listSubscribers } from "@/db/queries/admin";
import { adminUsers } from "@/db/schema";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

/** Quotes a CSV cell and neutralises spreadsheet formula injection. */
function cell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return new Response("Unauthorized", { status: 401 });
  // A valid cookie isn't enough: the account must still be active.
  const [user] = await db.select({ active: adminUsers.active }).from(adminUsers).where(eq(adminUsers.id, session.userId));
  if (!user?.active) return new Response("Unauthorized", { status: 401 });

  const rows = await listSubscribers();
  const csv = ["email,locale,joined", ...rows.map((row) => [cell(row.email), cell(row.locale), cell(row.createdAt.toISOString())].join(","))].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wagyu-meat-subscribers.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
