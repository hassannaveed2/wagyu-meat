import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  tone = "paper",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "paper-2" | "dark";
  id?: string;
}) {
  const tones = {
    paper: "bg-paper text-ink",
    "paper-2": "bg-paper-2 text-ink",
    dark: "seigaiha text-paper",
  };
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:mb-12",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow mb-3", tone === "dark" && "text-gold")}>{eyebrow}</p>}
        <h2 className="display text-[2rem] sm:text-[2.6rem]">{title}</h2>
        {lede && (
          <p className={cn("mt-4 text-[1.02rem] leading-relaxed", tone === "dark" ? "text-paper/75" : "text-ink-2")}>
            {lede}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

const BADGE_TONES = {
  wagyu: "bg-wagyu text-paper",
  gold: "bg-gold-soft text-[#6b5126]",
  leaf: "bg-leaf-soft text-leaf",
  ink: "bg-ink text-paper",
  outline: "border border-line bg-paper text-ink-2",
  glass: "bg-paper/90 text-ink backdrop-blur",
} as const;

export function Badge({
  children,
  tone = "outline",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em]",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stars({ rating, size = 16, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex text-gold", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} className={i <= Math.round(rating) ? "" : "opacity-25"} />
      ))}
    </span>
  );
}

/** Native details/summary accordion: keyboard and screen-reader friendly without JS. */
export function Accordion({
  items,
  className,
  defaultOpen,
}: {
  items: { id: string; title: ReactNode; content: ReactNode }[];
  className?: string;
  defaultOpen?: string;
}) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.id} className="group" open={item.id === defaultOpen}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-ink [&::-webkit-details-marker]:hidden">
            <span>{item.title}</span>
            <Icon
              name="plus"
              size={18}
              className="shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <div className="pb-6 text-ink-2 leading-relaxed">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
