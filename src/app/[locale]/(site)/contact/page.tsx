import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EnquiryForm } from "@/components/content/EnquiryForm";
import { PageHeader } from "@/components/shop/PageHeader";
import { Icon, WhatsAppGlyph } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { getSettings } from "@/db/queries/content";
import type { Locale } from "@/lib/i18n-db";
import { buildAlternates } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pages.contact");
  return { title: t("title"), alternates: buildAlternates(locale, "/contact") };
}

export default async function ContactPage() {
  const t = await getTranslations("pages.contact");
  const settings = await getSettings();
  const channels = [
    settings.whatsappNumber && { label: t("whatsapp"), value: settings.whatsappNumber, href: whatsappLink(settings.whatsappNumber), icon: <WhatsAppGlyph size={20} /> },
    settings.phone && { label: t("phone"), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}`, icon: <Icon name="phone" size={20} /> },
    settings.email && { label: t("email"), value: settings.email, href: `mailto:${settings.email}`, icon: <Icon name="mail" size={20} /> },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: React.ReactNode }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <Container className="grid gap-12 py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <ul className="space-y-3">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-[14px] border border-line bg-paper p-5 hover:border-ink/30"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-2 text-wagyu">{channel.icon}</span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-ink-3">{channel.label}</span>
                  <span className="font-medium">{channel.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div>
          <h2 className="display mb-6 text-2xl">{t("form")}</h2>
          <EnquiryForm type="contact" />
        </div>
      </Container>
    </>
  );
}
