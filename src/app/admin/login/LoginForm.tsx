"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { inputClass } from "@/components/admin/ui";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-2">Email</span>
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-2">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      {state.error && (
        <p className="text-sm text-wagyu" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-ink text-sm font-medium text-paper hover:bg-wagyu disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
