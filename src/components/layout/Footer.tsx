import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon, WhatsAppGlyph } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/settings";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const PAYMENT_MARKS = ["COD", "JazzCash", "Easypaisa", "Visa", "Mastercard", "Bank transfer"];

export async function Footer({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const origin = await getTranslations("home.origin");

  const columns = [
    {
      title: t("shop"),
      links: [
        { href: "/shop/japanese-a5", label: origin("japanTitle") },
        { href: "/shop/australian-wagyu", label: origin("australiaTitle") },
        { href: "/shop/gifting", label: nav("gifting") },
        { href: "/shop", label: nav("shopAll") },
      ],
    },
    {
      title: t("help"),
      links: [
        { href: "/delivery", label: nav("delivery") },
        { href: "/track", label: nav("track") },
        { href: "/faq", label: nav("faq") },
        { href: "/contact", label: nav("contact") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/halal-provenance", label: nav("halal") },
        { href: "/wagyu-101", label: nav("wagyu101") },
        { href: "/guides", label: nav("guides") },
      ],
    },
  ];

  return (
    <footer className="seigaiha text-paper">
      <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-paper/70">{t("tagline")}</p>
            <div className="mt-6 space-y-2 text-sm text-paper/80">
              {settings.whatsappNumber && (
                <a
                  href={whatsappLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-paper"
                >
                  <WhatsAppGlyph size={16} /> {settings.whatsappNumber}
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-paper">
                  <Icon name="mail" size={16} /> {settings.email}
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">{column.title}</p>
                <ul className="space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-paper/75 hover:text-paper">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-paper/10 pt-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="display text-xl">{t("newsletter")}</p>
            <p className="mb-4 mt-1 text-sm text-paper/60">{t("newsletterBody")}</p>
            <NewsletterForm />
          </div>
          <div className="md:text-right">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-paper/50">{t("payments")}</p>
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {PAYMENT_MARKS.map((mark) => (
                <li key={mark} className="rounded-md border border-paper/15 px-2.5 py-1 text-xs text-paper/75">
                  {mark}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year: 2026 })}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-paper">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-paper">
              {t("terms")}
            </Link>
            <Link href="/refunds" className="hover:text-paper">
              {t("refunds")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
