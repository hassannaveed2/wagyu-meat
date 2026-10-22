import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Logo } from "@/components/layout/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Review } from "@/db/queries/content";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { CartButton } from "./CartButton";
import { HeroGallery, type GallerySlide } from "./HeroGallery";

/* ---------- Building blocks ---------- */

export function Wrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1040px] px-4 sm:px-6", className)}>{children}</div>;
}

function Band({
  id,
  tint,
  className,
  children,
}: {
  id?: string;
  tint?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-12 sm:py-16", tint && "bg-v2-tint", className)}>
      {children}
    </section>
  );
}

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-v2-muted", className)}>{children}</p>
  );
}

function Heading({
  eyebrow,
  title,
  lede,
  center,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-8 sm:mb-10", center && "text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-balance font-v2-serif text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.015em] sm:text-[2.4rem]">
        {title}
      </h2>
      {lede && (
        <p className={cn("mt-2 max-w-[42rem] text-[1.05rem] leading-relaxed text-v2-muted", center && "mx-auto")}>
          {lede}
        </p>
      )}
    </div>
  );
}

function Tick({ tone = "yes", size = 22, label }: { tone?: "yes" | "no" | "varies"; size?: number; label?: string }) {
  const styles = {
    yes: "bg-v2-yes text-white",
    no: "bg-v2-no-soft text-v2-no",
    varies: "bg-v2-line text-v2-muted",
  }[tone];
  const icon: IconName = tone === "yes" ? "check" : tone === "no" ? "close" : "minus";
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full", styles)}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Icon name={icon} size={Math.round(size * 0.62)} strokeWidth={2.6} />
    </span>
  );
}

function CtaLink({ href, children, id, className }: { href: string; children: ReactNode; id?: string; className?: string }) {
  return (
    <Link
      id={id}
      href={href}
      className={cn(
        "flex h-[54px] items-center justify-center rounded-[14px] bg-v2-ink px-7 text-[1.05rem] font-bold text-white transition-colors hover:bg-black/80",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* ---------- Header ---------- */

export async function V2Header({ announcement }: { announcement: string }) {
  const t = await getTranslations("v2");
  const nav = [
    { href: "#problem", label: t("nav.why") },
    { href: "#benefits", label: t("nav.benefits") },
    { href: "#compare", label: t("nav.compare") },
    { href: "#how-to", label: t("nav.howTo") },
    { href: "#details", label: t("nav.details") },
    { href: "#faq", label: t("nav.faq") },
  ];
  return (
    <>
      <div className="bg-v2-ink px-4 py-2.5 text-center text-[0.78rem] font-semibold text-white">
        <span>{announcement}</span>
        <span className="mx-2 text-white/40" aria-hidden="true">
          ·
        </span>
        <Link href="/shop" className="underline underline-offset-2 hover:text-white/80">
          {t("announce.link")}
        </Link>
      </div>
      <div className="border-b border-v2-line">
        <Wrap className="flex h-10 items-center justify-between gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em]">
          <span className="flex items-center gap-1.5">
            <Icon name="pin" size={14} />
            {t("utility.country")}
          </span>
          <span className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 sm:flex">
              <Icon name="truck" size={15} />
              {t("utility.coldchain")}
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <Icon name="shield" size={15} />
              {t("utility.halal")}
            </span>
            <LanguageSwitcher className="normal-case tracking-normal" />
          </span>
        </Wrap>
      </div>
      <header className="sticky top-0 z-40 border-b border-v2-line bg-white/95 backdrop-blur">
        <Wrap className="flex h-[68px] items-center justify-between gap-3">
          <Logo className="shrink-0 whitespace-nowrap" wordmarkClassName="text-[1.05rem]! tracking-[0.1em]! sm:text-[1.35rem]! sm:tracking-[0.14em]!" />
          <div className="flex items-center gap-1 sm:gap-2">
            <nav aria-label={t("nav.label")} className="mr-2 hidden items-center lg:flex">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-2.5 py-2 text-[0.85rem] font-medium hover:bg-v2-tint"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <CartButton />
            <Link
              href="/shop"
              className="whitespace-nowrap rounded-full bg-v2-ink px-3.5 py-2.5 text-[0.8rem] font-bold text-white hover:bg-black/80 sm:px-5 sm:text-[0.85rem]"
            >
              {t("nav.cta")}
            </Link>
          </div>
        </Wrap>
      </header>
    </>
  );
}

/* ---------- Hero ---------- */

export async function V2Hero({
  slides,
  rating,
  fromPrice,
  cities,
}: {
  slides: GallerySlide[];
  rating: { average: number; count: number } | null;
  fromPrice: string;
  cities: string;
}) {
  const t = await getTranslations("v2.hero");
  const points = [t("points.halal"), t("points.graded"), t("points.coldchain")];
  const badges: { icon: IconName; label: string }[] = [
    { icon: "shield", label: t("badges.halal") },
    { icon: "star", label: t("badges.graded") },
    { icon: "certificate", label: t("badges.certificate") },
  ];
  return (
    <section id="hero" className="pb-12 pt-8 sm:pb-16 sm:pt-12">
      <Wrap className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="lg:pt-2">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 text-balance font-v2-serif text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[3.4rem]">
            {t("title")}
          </h1>
          <p className="mt-4 text-[1.1rem] leading-relaxed text-v2-muted">{t("lede")}</p>
          <ul className="mt-5 space-y-2.5">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[0.98rem]">
                <Tick size={20} />
                {point}
              </li>
            ))}
          </ul>
          {rating && (
            <p className="mt-5 flex flex-wrap items-center gap-x-1.5 text-sm">
              <Icon name="star" size={15} className="text-v2-ink" />
              <span>{t("rating", { rating: rating.average, count: rating.count })}</span>
              <span aria-hidden="true">·</span>
              <a href="#reviews" className="underline-offset-2 hover:underline">
                {t("readReviews")} →
              </a>
            </p>
          )}
          <CtaLink id="hero-cta" href="/shop" className="mt-6">
            {t("cta")}
          </CtaLink>
          <p className="mt-3 flex items-center gap-2 rounded-[10px] border border-v2-yes/30 bg-v2-yes-soft px-3.5 py-2.5 text-[0.85rem] font-medium text-[#1f6b4a]">
            <Icon name="check" size={16} strokeWidth={2.6} />
            {t("note", { price: fromPrice, cities })}
          </p>
          <ul className="mt-5 grid grid-cols-3 gap-3 border-b border-v2-line pb-5 text-center">
            {badges.map((badge) => (
              <li key={badge.label} className="flex flex-col items-center gap-1.5">
                <Icon name={badge.icon} size={20} />
                <span className="text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.06em]">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.8rem] leading-relaxed text-v2-muted">{t("fine")}</p>
        </div>
        <HeroGallery slides={slides} />
      </Wrap>
    </section>
  );
}

/* ---------- Scrolling proof strip ---------- */

export async function V2ProofStrip({ cities }: { cities: string }) {
  const t = await getTranslations("v2.proof");
  const items = [
    { title: t("halal.title"), body: t("halal.body") },
    { title: t("graded.title"), body: t("graded.body") },
    { title: t("coldchain.title"), body: t("coldchain.body") },
    { title: t("pay.title"), body: t("pay.body") },
    { title: t("cities.title"), body: t("cities.body", { cities }) },
  ];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.title} className="flex items-center gap-2 whitespace-nowrap px-7 text-sm">
          <span className="font-semibold">{item.title}</span>
          <span className="text-v2-muted">{item.body}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section className="overflow-hidden border-y border-v2-line bg-v2-tint py-6">
      <div className="v2-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/* ---------- Problem ---------- */

export async function V2Problem() {
  const t = await getTranslations("v2.problem");
  const cards = [
    { key: "local", image: "/images/bms-2.webp" },
    { key: "imported", image: "/images/bms-5.webp" },
    { key: "refrozen", image: "/images/problem-refrozen.webp" },
  ] as const;
  return (
    <Band id="problem">
      <Wrap>
        <Heading eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.key} className="overflow-hidden rounded-[14px] border border-v2-line bg-v2-tint">
              <div className="relative aspect-[1/1]">
                <Image src={card.image} alt="" fill sizes="(min-width: 768px) 330px, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-v2-serif text-[1.15rem] font-semibold">{t(`${card.key}.title`)}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-v2-muted">{t(`${card.key}.body`)}</p>
              </div>
            </article>
          ))}
        </div>
      </Wrap>
    </Band>
  );
}

/* ---------- Appeal strip ---------- */

export async function V2Appeal() {
  const t = await getTranslations("v2.appeal");
  const chips: { icon: IconName; key: string }[] = [
    { icon: "shield", key: "halal" },
    { icon: "star", key: "bms" },
    { icon: "certificate", key: "certificate" },
    { icon: "search", key: "trace" },
    { icon: "snowflake", key: "frozen" },
    { icon: "check", key: "sealed" },
    { icon: "flame", key: "portioned" },
    { icon: "truck", key: "cod" },
  ];
  return (
    <Band tint className="border-y border-v2-line">
      <Wrap>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="mb-6 mt-2 font-v2-serif text-[1.6rem] font-semibold tracking-[-0.015em] sm:text-[1.9rem]">
          {t("title")}
        </h2>
        <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {chips.map((chip) => (
            <li
              key={chip.key}
              className="flex items-center gap-2.5 rounded-[10px] border border-v2-line bg-white px-4 py-3.5 text-[0.85rem] font-medium"
            >
              <Icon name={chip.icon} size={17} className="shrink-0" />
              {t(chip.key)}
            </li>
          ))}
        </ul>
      </Wrap>
    </Band>
  );
}

/* ---------- Craft ---------- */

export async function V2Craft() {
  const t = await getTranslations("v2.craft");
  const cards = [
    { key: "farm", image: "/images/origin-japan.webp" },
    { key: "cut", image: "/images/p-a5-tenderloin.webp" },
    { key: "australia", image: "/images/p-au-ribeye.webp" },
  ] as const;
  const checks = ["halal", "graded", "trace"] as const;
  return (
    <Band id="highlights">
      <Wrap>
        <Heading eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} center />
        <div className="grid gap-8 md:grid-cols-3 md:gap-5">
          {cards.map((card) => (
            <article key={card.key}>
              <div className="relative aspect-[1/1] overflow-hidden rounded-[14px]">
                <Image src={card.image} alt="" fill sizes="(min-width: 768px) 330px, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-4 text-[1.05rem] font-bold">{t(`${card.key}.title`)}</h3>
              <span className="mt-2 block h-0.5 w-8 bg-v2-ink" aria-hidden="true" />
              <p className="mt-3 text-[0.92rem] leading-relaxed text-v2-muted">{t(`${card.key}.body`)}</p>
            </article>
          ))}
        </div>
        <ul className="mt-10 grid gap-5 border-t border-v2-line pt-6 md:grid-cols-3">
          {checks.map((key) => (
            <li key={key} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-v2-ink">
                <Icon name="check" size={13} strokeWidth={2.6} />
              </span>
              <div>
                <p className="text-[0.88rem] font-bold">{t(`checks.${key}.title`)}</p>
                <p className="mt-0.5 text-[0.82rem] leading-relaxed text-v2-muted">{t(`checks.${key}.body`)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-v2-muted">{t("note")}</p>
      </Wrap>
    </Band>
  );
}

/* ---------- Benefits ---------- */

export async function V2Benefits() {
  const t = await getTranslations("v2.benefits");
  const cards = [
    { key: "melt", image: "/images/bms-12.webp" },
    { key: "graded", image: "/images/p-a5-striploin.webp" },
    { key: "halal", image: "/images/prov-farm.webp" },
    { key: "frozen", image: "/images/prov-coldchain.webp" },
  ] as const;
  return (
    <Band id="benefits" tint>
      <Wrap>
        <Heading eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <article key={card.key} className="overflow-hidden rounded-[14px] border border-v2-line bg-white">
              <div className="relative aspect-[16/9]">
                <Image src={card.image} alt="" fill sizes="(min-width: 640px) 500px, 100vw" className="object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-v2-serif text-[1.15rem] font-semibold">{t(`${card.key}.title`)}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-v2-muted">{t(`${card.key}.body`)}</p>
              </div>
            </article>
          ))}
        </div>
      </Wrap>
    </Band>
  );
}

/* ---------- Compare ---------- */

type Mark = "yes" | "no" | "varies";

export async function V2Compare() {
  const t = await getTranslations("v2.compare");
  const columns = ["ours", "local", "imported", "unlabelled"] as const;
  const rows: { key: string; marks: [Mark, Mark, Mark, Mark] }[] = [
    { key: "halal", marks: ["yes", "yes", "varies", "varies"] },
    { key: "bms", marks: ["yes", "no", "varies", "no"] },
    { key: "trace", marks: ["yes", "no", "varies", "no"] },
    { key: "frozen", marks: ["yes", "no", "no", "varies"] },
  ];
  return (
    <Band id="compare">
      <Wrap>
        <Heading eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
        <div className="overflow-x-auto rounded-[14px] border border-v2-line">
          <table className="w-full min-w-[620px] border-collapse text-[0.88rem]">
            <thead>
              <tr>
                <th scope="col" className="w-[34%] p-4 text-left font-medium text-v2-muted">
                  <span className="sr-only">{t("feature")}</span>
                </th>
                {columns.map((column, i) => (
                  <th
                    key={column}
                    scope="col"
                    className={cn("p-4 text-center font-v2-serif text-[0.95rem] font-semibold", i === 0 && "bg-v2-yes-soft")}
                  >
                    {t(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-v2-line">
                  <th scope="row" className="p-4 text-left font-medium">
                    {t(`rows.${row.key}`)}
                  </th>
                  {row.marks.map((mark, i) => (
                    <td key={columns[i]} className={cn("p-4 text-center", i === 0 && "bg-v2-yes-soft")}>
                      <Tick tone={mark} label={t(mark)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Wrap>
    </Band>
  );
}

/* ---------- Daily difference ---------- */

export async function V2Daily() {
  const t = await getTranslations("v2.daily");
  const rows = ["choosing", "delivery", "cooking", "serving"] as const;
  return (
    <Band id="daily-difference" tint>
      <Wrap>
        <div className="mb-8 grid items-center gap-8 md:grid-cols-2">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="mt-2 text-balance font-v2-serif text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.015em] sm:text-[2.4rem]">
              {t("title")}
            </h2>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-v2-muted">{t("lede")}</p>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[14px]">
            <Image src="/images/occ-yakiniku.webp" alt="" fill sizes="(min-width: 768px) 500px, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="overflow-hidden rounded-[14px] border border-v2-line bg-white">
          <div className="hidden grid-cols-[1fr_2fr_2fr] text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-v2-muted md:grid">
            <span className="px-5 py-3.5">{t("moment")}</span>
            <span className="px-5 py-3.5">{t("typical")}</span>
            <span className="bg-v2-yes-soft px-5 py-3.5">{t("ours")}</span>
          </div>
          {rows.map((key) => (
            <div key={key} className="grid border-t border-v2-line first:border-t-0 md:grid-cols-[1fr_2fr_2fr] md:first:border-t">
              <p className="px-5 pb-1 pt-4 font-v2-serif font-semibold md:py-5">{t(`rows.${key}.moment`)}</p>
              <p className="flex gap-3 px-5 py-2 text-[0.88rem] text-v2-muted md:py-5">
                <Tick tone="no" size={22} label={t("typical")} />
                {t(`rows.${key}.typical`)}
              </p>
              <p className="flex gap-3 bg-v2-yes-soft px-5 py-3 text-[0.88rem] md:py-5">
                <Tick size={22} label={t("ours")} />
                {t(`rows.${key}.ours`)}
              </p>
            </div>
          ))}
        </div>
      </Wrap>
    </Band>
  );
}

/* ---------- How to ---------- */

export async function V2HowTo() {
  const t = await getTranslations("v2.howTo");
  const steps = [
    { key: "thaw", image: "/images/p-a5-ribeye.webp" },
    { key: "sear", image: "/images/guide-sear.webp" },
    { key: "slice", image: "/images/occ-steak.webp" },
  ] as const;
  return (
    <Band id="how-to">
      <Wrap>
        <Heading eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.key} className="overflow-hidden rounded-[14px] border border-v2-line bg-v2-tint">
              <div className="relative aspect-[4/3]">
                <Image src={step.image} alt="" fill sizes="(min-width: 768px) 330px, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-v2-muted">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-v2-serif text-[1.15rem] font-semibold">{t(`${step.key}.title`)}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-v2-muted">{t(`${step.key}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Wrap>
    </Band>
  );
}

/* ---------- Details ---------- */

export async function V2Details({ cities }: { cities: string }) {
  const t = await getTranslations("v2.details");
  const rows = [
    [t("origin"), t("originValue")],
    [t("grades"), t("gradesValue")],
    [t("halal"), t("halalValue")],
    [t("packing"), t("packingValue")],
    [t("delivery"), cities],
    [t("payment"), t("paymentValue")],
  ];
  return (
    <Band id="details" tint>
      <Wrap className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
          <Image src="/images/p-gift-box.webp" alt="" fill sizes="(min-width: 768px) 500px, 100vw" className="object-cover" />
        </div>
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="mt-2 text-balance font-v2-serif text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.015em] sm:text-[2.4rem]">
            {t("title")}
          </h2>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-v2-muted">{t("lede")}</p>
          <dl className="mt-5">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 border-b border-v2-line py-3 text-[0.88rem]">
                <dt className="text-v2-muted">{label}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Wrap>
    </Band>
  );
}

/* ---------- FAQ ---------- */

export async function V2Faq({ items }: { items: { question: string; answer: string }[] }) {
  const t = await getTranslations("v2.faq");
  if (items.length === 0) return null;
  return (
    <Band id="faq">
      <Wrap>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="mb-6 mt-2 font-v2-serif text-[1.85rem] font-semibold tracking-[-0.015em] sm:text-[2.4rem]">
          {t("title")}
        </h2>
        <div className="border-t border-v2-line">
          {items.map((item) => (
            <details key={item.question} className="group border-b border-v2-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.95rem] font-medium">
                {item.question}
                <Icon name="plus" size={16} className="v2-faq-icon shrink-0 transition-transform" />
              </summary>
              <p className="pb-5 pr-8 text-[0.92rem] leading-relaxed text-v2-muted">{item.answer}</p>
            </details>
          ))}
        </div>
        <Link href="/faq" className="mt-5 inline-block text-sm font-semibold underline-offset-2 hover:underline">
          {t("more")} →
        </Link>
      </Wrap>
    </Band>
  );
}

/* ---------- Reviews ---------- */

export async function V2Reviews({ reviews }: { reviews: Review[] }) {
  const t = await getTranslations("v2.reviews");
  const common = await getTranslations("common");
  if (reviews.length === 0) return null;
  const hasSamples = reviews.some((review) => review.name.startsWith("Sample"));
  return (
    <Band id="reviews">
      <Wrap>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="mb-6 mt-2 font-v2-serif text-[1.85rem] font-semibold tracking-[-0.015em] sm:text-[2.4rem]">
          {t("title")}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <figure key={review.id} className="flex flex-col rounded-[14px] border border-v2-line p-5">
              <p className="tracking-[0.12em]" role="img" aria-label={common("rating", { rating: review.rating })}>
                {"★★★★★".slice(0, review.rating)}
                <span className="text-v2-line">{"★★★★★".slice(review.rating)}</span>
              </p>
              <blockquote className="mt-3 flex-1 text-[0.92rem] leading-relaxed">“{review.body}”</blockquote>
              <figcaption className="mt-4 text-[0.8rem]">
                <span className="font-semibold">
                  {review.name}
                  {review.city && `, ${review.city}`}
                </span>
                {review.name.startsWith("Sample") && (
                  <span className="ml-2 rounded bg-v2-tint px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-v2-muted">
                    {common("sample")}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        {hasSamples && <p className="mt-4 text-xs text-v2-muted">{t("sampleNote")}</p>}
      </Wrap>
    </Band>
  );
}

/* ---------- Final offer ---------- */

export async function V2Offer({
  products,
  threshold,
}: {
  products: { slug: string; name: string; price: string }[];
  threshold: string;
}) {
  const t = await getTranslations("v2");
  const bar = [t("utility.halal"), t("hero.badges.graded"), t("utility.coldchain")];
  const points = [t("final.points.compare"), t("final.points.slot"), t("final.points.pay")];
  return (
    <Band id="final" className="pt-4 sm:pt-6">
      <Wrap>
        <div className="overflow-hidden rounded-[18px] border border-v2-line">
          <ul className="grid grid-cols-3 bg-v2-ink px-3 py-3 text-center text-[0.72rem] font-semibold text-white sm:text-[0.8rem]">
            {bar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="grid items-center gap-8 bg-v2-tint p-6 sm:p-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>{t("final.eyebrow")}</Eyebrow>
              <h2 className="mt-2 text-balance font-v2-serif text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.015em] sm:text-[2.3rem]">
                {t("final.title")}
              </h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-v2-muted">{t("final.body", { threshold })}</p>
              <ul className="mt-5 list-disc space-y-1.5 pl-5 text-[0.88rem]">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border border-v2-line bg-white p-5">
              <p className="text-center text-sm font-semibold">{t("final.card")}</p>
              <ul className="mt-3">
                {products.map((product) => (
                  <li key={product.slug} className="border-b border-v2-line last:border-b-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex items-baseline justify-between gap-4 py-3 text-[0.88rem] hover:text-v2-muted"
                    >
                      <span>{product.name}</span>
                      <span className="shrink-0 whitespace-nowrap">
                        <span className="mr-1 text-[0.72rem] text-v2-muted">{t("final.from")}</span>
                        <span className="text-[1.05rem] font-bold">{product.price}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <CtaLink href="/shop" className="mt-3 h-[50px] text-[0.98rem]">
                {t("hero.cta")}
              </CtaLink>
              <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-v2-muted">{t("final.note")}</p>
            </div>
          </div>
        </div>
      </Wrap>
    </Band>
  );
}

/* ---------- Footer ---------- */

export async function V2Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const v2 = await getTranslations("v2.footer");
  const links = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/refunds", label: t("refunds") },
    { href: "/contact", label: nav("contact") },
  ] as const;
  return (
    <footer className="border-t border-v2-line pb-28 pt-10">
      <Wrap>
        <Logo />
        <p className="mt-4 max-w-md text-[0.85rem] leading-relaxed text-v2-muted">{t("tagline")}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.85rem]">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul aria-label={v2("languages")} className="mt-3 flex gap-3 text-[0.8rem] text-v2-muted">
          {routing.locales.map((locale) => (
            <li key={locale}>
              <Link href="/v2" locale={locale} lang={locale} className="hover:text-v2-ink">
                {locale === "en" ? "English" : "日本語"}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-v2-muted">{t("rights", { year: 2026 })}</p>
      </Wrap>
    </footer>
  );
}
