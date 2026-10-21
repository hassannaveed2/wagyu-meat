import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink focus:border-ink focus:outline-none";
export const textareaClass =
  "w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-[family-name:var(--font-display-en)] text-3xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, children, className, action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("rounded-lg border border-line bg-paper p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-2">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-medium text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

/** A pair of inputs for a translated field: English and Japanese side by side. */
export function LocalizedInput({
  label,
  name,
  en,
  ja,
  multiline = false,
  rows = 4,
  required = false,
  hint,
}: {
  label: string;
  name: string;
  en?: string | null;
  ja?: string | null;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-xs font-medium text-ink-2">{label}</legend>
      <div className="grid gap-2 md:grid-cols-2">
        {(["en", "ja"] as const).map((lang) => {
          const value = (lang === "en" ? en : ja) ?? "";
          // Matches the column naming: nameEn / nameJa.
          const fieldName = `${name}${lang === "en" ? "En" : "Ja"}`;
          return (
            <div key={lang} className="relative">
              <span className="pointer-events-none absolute right-2 top-2 rounded bg-paper-2 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase text-ink-3">
                {lang}
              </span>
              {multiline ? (
                <textarea name={fieldName} defaultValue={value} rows={rows} className={textareaClass} lang={lang} required={required && lang === "en"} />
              ) : (
                <input name={fieldName} defaultValue={value} className={cn(inputClass, "pr-10")} lang={lang} required={required && lang === "en"} />
              )}
            </div>
          );
        })}
      </div>
      {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
    </fieldset>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--color-wagyu)]" />
      {label}
    </label>
  );
}

export function AdminButton({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: "primary" | "outline" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
        variant === "primary" && "bg-ink text-paper hover:bg-wagyu",
        variant === "outline" && "border border-line bg-paper hover:border-ink",
        variant === "danger" && "border border-wagyu/30 text-wagyu hover:bg-wagyu hover:text-paper",
        className,
      )}
      {...props}
    />
  );
}

export function AdminLink({ className, variant = "primary", ...props }: ComponentProps<typeof Link> & { variant?: "primary" | "outline" }) {
  return (
    <Link
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
        variant === "primary" ? "bg-ink text-paper hover:bg-wagyu" : "border border-line bg-paper hover:border-ink",
        className,
      )}
      {...props}
    />
  );
}

const STATUS_TONES: Record<string, string> = {
  pending: "bg-gold-soft text-[#6b5126]",
  confirmed: "bg-[#e3ecf7] text-[#244a7a]",
  packed: "bg-[#ece3f7] text-[#4e2d7a]",
  "out-for-delivery": "bg-[#e0f0f2] text-[#1f5d66]",
  delivered: "bg-leaf-soft text-leaf",
  cancelled: "bg-wagyu-soft text-wagyu-ink",
  paid: "bg-leaf-soft text-leaf",
  refunded: "bg-paper-3 text-ink-2",
  new: "bg-gold-soft text-[#6b5126]",
  handled: "bg-leaf-soft text-leaf",
};

/** Coloured status badge. `status` picks the colour; `label` overrides the text. */
export function StatusPill({ status, label }: { status: string; label?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize", STATUS_TONES[status] ?? "bg-paper-2 text-ink-2")}>
      {label ?? status.replace(/-/g, " ")}
    </span>
  );
}

export function Flash({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="mb-5 rounded-md border border-leaf/30 bg-leaf-soft px-4 py-2.5 text-sm text-leaf" role="status">
      {message}
    </p>
  );
}

export function ErrorNote({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="mb-5 rounded-md border border-wagyu/30 bg-wagyu-soft px-4 py-2.5 text-sm text-wagyu-ink" role="alert">
      {message}
    </p>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-paper">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-paper-2 text-xs uppercase tracking-[0.06em] text-ink-2">
          <tr>
            {head.map((heading) => (
              <th key={heading} className="whitespace-nowrap px-4 py-3 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty && <p className="px-4 py-10 text-center text-sm text-ink-3">{empty}</p>}
    </div>
  );
}
