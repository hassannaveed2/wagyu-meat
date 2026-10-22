import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Logo({
  tone = "dark",
  className,
  wordmarkClassName,
}: {
  tone?: "dark" | "light";
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Wagyu Meat">
      <span
        className="grid h-9 w-9 place-items-center rounded-[6px] bg-wagyu text-[0.95rem] font-semibold text-paper"
        style={{ fontFamily: "var(--font-display-ja), serif" }}
        aria-hidden="true"
      >
        和牛
      </span>
      <span
        className={cn(
          "font-[family-name:var(--font-display-en)] text-[1.35rem] font-semibold leading-none tracking-[0.14em]",
          tone === "dark" ? "text-ink" : "text-paper",
          wordmarkClassName,
        )}
      >
        WAGYU MEAT
      </span>
    </Link>
  );
}
