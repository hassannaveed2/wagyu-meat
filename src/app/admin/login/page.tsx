import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-sumi px-4">
      <div className="w-full max-w-sm rounded-xl bg-paper p-8 shadow-[var(--shadow-pop)]">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded bg-wagyu text-sm font-semibold text-paper">和牛</span>
          <div>
            <p className="text-sm font-semibold tracking-[0.12em]">WAGYU MEAT</p>
            <p className="text-xs text-ink-3">Admin</p>
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
