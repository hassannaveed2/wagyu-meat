import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSessionToken,
  verifySessionToken,
  type AdminRole,
  type Session,
} from "./token";

export async function startSession(session: Session): Promise<void> {
  const token = await signSessionToken(session);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  // Sessions are per-request: never let them be prerendered.
  await connection();
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/**
 * Gate for every admin page and server action. Re-checks the user in the database so
 * deactivated accounts lose access immediately, even with an unexpired cookie.
 */
export async function requireAdmin(role?: AdminRole): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [user] = await db
    .select({ active: adminUsers.active, role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId));
  if (!user || !user.active) redirect("/admin/login");

  const current = { ...session, role: user.role };
  if (role === "admin" && current.role !== "admin") redirect("/admin?error=forbidden");
  return current;
}
