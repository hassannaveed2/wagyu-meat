import Link from "next/link";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/session";
import { logout } from "../login/actions";

export const instant = false;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper-2" />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-paper-2 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-sumi px-4 py-5 text-paper lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded bg-wagyu text-sm font-semibold">和牛</span>
            <span className="text-sm font-semibold tracking-[0.12em]">WAGYU MEAT</span>
          </Link>
          <AdminNav role={session.role} />
        </div>
        <div className="mt-8 hidden border-t border-paper/10 pt-4 text-xs text-paper/60 lg:block">
          <p className="truncate text-paper/85">{session.name}</p>
          <p className="truncate">{session.email}</p>
          <p className="mt-1 capitalize">{session.role}</p>
          <div className="mt-3 flex gap-3">
            <a href="/en" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-paper hover:underline">
              View store
            </a>
            <form action={logout}>
              <button type="submit" className="underline-offset-2 hover:text-paper hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
