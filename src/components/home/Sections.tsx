import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { Icon, WhatsAppGlyph } from "@/components/ui/Icon";
import { Container, Section, SectionHeader, Stars } from "@/components/ui/primitives";
import type { Category } from "@/db/queries/catalog";
import type { Guide, Review } from "@/db/queries/content";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

export async function OccasionTiles({ occasions }: { occasions: Category[] }) {
  const t = await getTranslations("home.occasion");
  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link key={occasion.slug} href={`/shop/${occasion.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-sumi">
                {occasion.image && (
                  <Image
                    src={occasion.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 300px, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="mt-3 flex items-center justify-between gap-2 font-medium">
                {occasion.name}
                <Icon name="arrowRight" size={16} className="text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-wagyu" />
              </h3>
              {occasion.description && <p className="mt-0.5 text-sm text-ink-2">{occasion.description}</p>}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export async function CompareTable() {
  const t = await getTranslations("home.compare");
  const rows = [
    { key: "marbling", values: ["a5Marbling", "ausMarbling", "regularMarbling"] },
    { key: "flavour", values: ["a5Flavour", "ausFlavour", "regularFlavour"] },
    { key: "portion", values: ["a5Portion", "ausPortion", "regularPortion"] },
    { key: "bestFor", values: ["a5BestFor", "ausBestFor", "regularBestFor"] },
    { key: "price", values: ["a5Price", "ausPrice", "regularPrice"] },
  ] as const;
  const columns = [t("a5"), t("aus"), t("regular")];

  return (
    <Section>
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-[14px] border border-line text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className="w-[22%] bg-paper-2 p-4" />
                {columns.map((column, index) => (
                  <th
                    key={column}
                    scope="col"
                    className={cn("p-4 font-[family-name:var(--font-display)] text-lg font-semibold", index === 0 ? "bg-wagyu text-paper" : "bg-paper-2")}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row" className="border-t border-line bg-paper p-4 font-medium text-ink">
                    {t(`rows.${row.key}`)}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={value} className={cn("border-t border-line p-4 text-ink-2", index === 0 && "bg-wagyu-soft/60 font-medium text-ink")}>
                      {t(`values.${value}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}

export async function Provenance() {
  const t = await getTranslations("home.provenance");
  const steps = ["farm", "halal", "import", "delivery"] as const;
  return (
    <section className="seigaiha relative overflow-hidden text-paper">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="eyebrow text-gold">{t("eyebrow")}</p>
          <h2 className="display mt-3 text-[2rem] sm:text-[2.6rem]">{t("title")}</h2>
          <ol className="mt-10 space-y-7">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-5">
                <span className="font-[family-name:var(--font-display-en)] text-3xl leading-none text-gold">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-medium">{t(`steps.${step}.title`)}</h3>
                  <p className="mt-1 leading-relaxed text-paper/70">{t(`steps.${step}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <ButtonLink href="/halal-provenance" variant="light" className="mt-10">
            {t("link")}
          </ButtonLink>
        </div>
        <div className="grid gap-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[14px]">
            <Image src="/images/prov-farm.webp" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[14px]">
            <Image src="/images/prov-coldchain.webp" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function GiftFeature() {
  const t = await getTranslations("home.gifts");
  return (
    <Section tone="paper-2">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
            <Image src="/images/occ-gift.webp" alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="display mt-3 text-[2rem] sm:text-[2.6rem]">{t("title")}</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-2">{t("lede")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop/gifting" size="lg">
                <Icon name="gift" size={18} />
                {t("cta")}
              </ButtonLink>
              <ButtonLink href="/gifting" size="lg" variant="outline">
                {t("corporate")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export async function GuideCard({ guide }: { guide: Guide }) {
  const t = await getTranslations("common");
  return (
    <Link href={`/guides/${guide.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-sumi">
        {guide.heroImage && (
          <Image src={guide.heroImage} alt="" fill sizes="(min-width: 1024px) 400px, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-ink-3">{t("minutes", { count: guide.readingMinutes })}</p>
      <h3 className="mt-1 text-lg font-medium leading-snug group-hover:text-wagyu">{guide.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">{guide.excerpt}</p>
    </Link>
  );
}

export async function GuideCards({ guides }: { guides: Guide[] }) {
  const t = await getTranslations("home.guides");
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          action={
            <ButtonLink href="/guides" variant="outline" size="sm">
              {t("viewAll")}
            </ButtonLink>
          }
        />
        <div className="grid gap-8 md:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export async function ReviewCard({ review }: { review: Review }) {
  const t = await getTranslations("common");
  const isSample = review.name.startsWith("Sample");
  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-paper p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 leading-relaxed text-ink-2">“{review.body}”</blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="font-medium text-ink">{review.name}</span>
        {review.city && <span className="text-ink-3"> · {review.city}</span>}
        {isSample && <span className="ml-2 rounded bg-gold-soft px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-[#6b5126]">{t("sample")}</span>}
      </figcaption>
    </figure>
  );
}

export async function ReviewCards({ reviews, rating }: { reviews: Review[]; rating: { average: number; count: number } | null }) {
  const t = await getTranslations("home.reviews");
  if (reviews.length === 0) return null;
  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          lede={rating ? t("summary", { rating: rating.average.toFixed(1), count: rating.count }) : undefined}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export async function FinalCta({ whatsappNumber }: { whatsappNumber: string }) {
  const t = await getTranslations("home.final");
  const tc = await getTranslations("common");
  return (
    <Section>
      <Container>
        <div className="relative isolate overflow-hidden rounded-[18px] bg-sumi px-6 py-14 text-center text-paper sm:px-12 sm:py-20">
          <Image src="/images/occ-steak.webp" alt="" fill sizes="1240px" className="-z-10 object-cover opacity-35" />
          <p className="eyebrow text-gold">{t("eyebrow")}</p>
          <h2 className="display mx-auto mt-3 max-w-2xl text-[2.1rem] sm:text-5xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/80">{t("body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="lg">
              {t("shop")}
            </ButtonLink>
            {whatsappNumber && (
              <ExternalButton href={whatsappLink(whatsappNumber)} size="lg" variant="whatsapp">
                <WhatsAppGlyph size={18} />
                {tc("chatOnWhatsApp")}
              </ExternalButton>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
