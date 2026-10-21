"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import { CitySelector } from "./CitySelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export type MenuGroup = { key: "origin" | "cut" | "occasion"; items: { slug: string; name: string }[] };

export function Header({ announcement, menu }: { announcement: string; menu: MenuGroup[] }) {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
  const openCart = useCart((state) => state.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const groupLabel = { origin: t("byOrigin"), cut: t("byCut"), occasion: t("byOccasion") };
  const links = [
    { href: "/wagyu-101", label: t("wagyu101") },
    { href: "/guides", label: t("guides") },
    { href: "/gifting", label: t("gifting") },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        {t("skipToContent")}
      </a>
      <div className="bg-sumi text-paper">
        <div className="mx-auto flex h-9 max-w-[1240px] items-center justify-center gap-6 px-4 sm:justify-between sm:px-6 lg:px-8">
          <p className="truncate text-center text-[0.75rem] tracking-wide text-paper/85">{announcement}</p>
          <div className="hidden items-center gap-5 sm:flex">
            <CitySelector tone="light" />
            <LanguageSwitcher tone="light" />
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-paper/95 backdrop-blur transition-shadow",
          scrolled ? "border-line shadow-[0_6px_24px_-18px_rgb(25_21_18/0.5)]" : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          <button
            type="button"
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            <Icon name="menu" size={22} />
          </button>

          <Logo className="lg:mr-6" />

          <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
            <div className="group relative">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[0.95rem] font-medium hover:bg-ink/5"
              >
                {t("shop")}
                <Icon name="chevronDown" size={15} className="transition-transform group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="grid w-[760px] grid-cols-[1fr_1fr_1fr_220px] gap-6 rounded-[14px] border border-line bg-paper p-6 shadow-[var(--shadow-pop)]">
                  {menu.map((group) => (
                    <div key={group.key}>
                      <p className="eyebrow mb-3">{groupLabel[group.key]}</p>
                      <ul className="space-y-1.5">
                        {group.items.map((item) => (
                          <li key={item.slug}>
                            <Link href={`/shop/${item.slug}`} className="text-[0.92rem] text-ink-2 hover:text-wagyu">
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link href="/shop" className="group/promo relative block overflow-hidden rounded-[10px]">
                    <Image
                      src="/images/origin-japan.webp"
                      alt=""
                      width={440}
                      height={330}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/promo:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-sumi/80 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 text-sm font-medium text-paper">
                      {t("shopAll")} →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[0.95rem] font-medium hover:bg-ink/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/track"
              className="hidden rounded-full px-3 py-2 text-sm text-ink-2 hover:bg-ink/5 hover:text-ink xl:inline-flex"
            >
              {t("track")}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"
              aria-label={`${t("cart")} (${count})`}
            >
              <Icon name="cart" size={22} />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-wagyu px-1 text-[0.68rem] font-semibold leading-5 text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("menu")}>
          <button
            type="button"
            className="absolute inset-0 bg-sumi/50 backdrop-blur-[2px]"
            aria-label={t("close")}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,380px)] animate-fade-up flex-col bg-paper shadow-[var(--shadow-pop)]">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"
                onClick={() => setMobileOpen(false)}
                aria-label={t("close")}
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto px-4 py-5"
              onClick={(event) => {
                // Close the drawer when any link inside it is followed.
                if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              <Link href="/shop" className="display mb-5 block text-2xl">
                {t("shopAll")}
              </Link>
              {menu.map((group) => (
                <div key={group.key} className="mb-6">
                  <p className="eyebrow mb-2">{groupLabel[group.key]}</p>
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {group.items.map((item) => (
                      <li key={item.slug}>
                        <Link href={`/shop/${item.slug}`} className="block py-1.5 text-[0.95rem] text-ink-2">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="hairline my-5" />
              <ul className="space-y-1">
                {[...links, { href: "/delivery", label: t("delivery") }, { href: "/halal-provenance", label: t("halal") }, { href: "/track", label: t("track") }, { href: "/faq", label: t("faq") }, { href: "/contact", label: t("contact") }].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-2 text-[1.02rem] font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-4">
              <CitySelector tone="dark" dropUp />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
