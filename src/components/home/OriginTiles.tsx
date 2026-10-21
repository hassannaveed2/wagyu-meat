import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import { formatPKR } from "@/lib/commerce/format";

export async function OriginTiles({ fromJapan, fromAustralia }: { fromJapan: number; fromAustralia: number }) {
  const t = await getTranslations("home.origin");
  const tiles = [
    { href: "/shop/japanese-a5", image: "/images/origin-japan.webp", title: t("japanTitle"), body: t("japanBody"), from: fromJapan, mark: "A5" },
    { href: "/shop/australian-wagyu", image: "/images/origin-australia.webp", title: t("australiaTitle"), body: t("australiaBody"), from: fromAustralia, mark: "MB" },
  ];

  return (
    <Section>
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
        <div className="grid gap-5 md:grid-cols-2">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-[14px] bg-sumi p-6 text-paper sm:p-8"
            >
              <Image
                src={tile.image}
                alt=""
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-sumi/90 via-sumi/30 to-transparent" />
              <span className="absolute right-6 top-6 grid h-14 w-14 place-items-center rounded-full border border-gold/60 font-[family-name:var(--font-display-en)] text-xl text-gold backdrop-blur-sm">
                {tile.mark}
              </span>
              <div className="flex w-full items-end justify-between gap-4">
                <div>
                  <h3 className="display text-3xl sm:text-4xl">{tile.title}</h3>
                  <p className="mt-2 text-paper/80">{tile.body}</p>
                  <p className="mt-3 text-sm font-medium text-gold">{t("fromPrice", { price: formatPKR(tile.from) })}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform group-hover:translate-x-1">
                  <Icon name="arrowRight" size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
