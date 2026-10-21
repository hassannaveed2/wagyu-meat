"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createRateLimiter } from "@/lib/auth/rate-limit";
import { endSession, startSession } from "@/lib/auth/session";

const limiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

export type LoginState = { error?: string };

function safeNext(next: string | undefined): string {
  // Only allow redirects within the admin area.
  return next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) return { error: "Enter your email and password." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!limiter.hit(ip)) return { error: "Too many attempts. Try again in 15 minutes." };

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, parsed.data.email));
  const valid = user && user.active && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!valid) return { error: "Email or password is incorrect." };

  limiter.reset(ip);
  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
  await startSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
  redirect(safeNext(parsed.data.next));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
