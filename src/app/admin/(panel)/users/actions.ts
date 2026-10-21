"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";

const password = z.string().min(10, "Passwords need at least 10 characters").max(200);

export async function addUser(formData: FormData): Promise<void> {
  await requireAdmin("admin");
  const input = z
    .object({
      name: z.string().trim().min(2).max(120),
      email: z.email().transform((value) => value.toLowerCase()),
      role: z.enum(["admin", "staff"]),
      password,
    })
    .safeParse(Object.fromEntries(formData));
  if (!input.success) redirect(`/admin/users?error=${encodeURIComponent(input.error.issues[0].message)}`);

  const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, input.data.email));
  if (existing) redirect("/admin/users?error=That%20email%20already%20has%20an%20account");

  await db.insert(adminUsers).values({
    name: input.data.name,
    email: input.data.email,
    role: input.data.role,
    passwordHash: await hashPassword(input.data.password),
  });
  redirect("/admin/users?saved=1");
}

export async function setUserActive(formData: FormData): Promise<void> {
  const session = await requireAdmin("admin");
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  if (id === session.userId) redirect("/admin/users?error=You%20can%27t%20deactivate%20your%20own%20account");
  await db.update(adminUsers).set({ active: formData.get("active") === "true" }).where(eq(adminUsers.id, id));
  redirect("/admin/users?saved=1");
}

export async function resetPassword(formData: FormData): Promise<void> {
  await requireAdmin("admin");
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const parsed = password.safeParse(formData.get("password"));
  if (!parsed.success) redirect(`/admin/users?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  await db.update(adminUsers).set({ passwordHash: await hashPassword(parsed.data) }).where(eq(adminUsers.id, id));
  redirect("/admin/users?saved=1");
}
