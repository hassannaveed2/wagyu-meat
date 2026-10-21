import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/primitives";

export async function Hero({
  eyebrow,
  headline,
  subheading,
  image,
  rating,
}: {
  eyebrow: string;
  headline: string;
  subheading: string;
  image: string;
  rating: { average: number; count: number } | null;
}) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const proofs = [t("proofs.halal"), t("proofs.certificate"), t("proofs.coldchain")];

  return (
    <section className="relative isolate overflow-hidden bg-sumi text-paper">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[70%_center] opacity-90 max-lg:opacity-55"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sumi via-sumi/85 to-sumi/0 max-lg:bg-gradient-to-t max-lg:via-sumi/80" />

      <div className="mx-auto flex min-h-[620px] max-w-[1240px] items-center px-4 py-20 sm:px-6 lg:min-h-[680px] lg:px-8">
        <div className="max-w-xl animate-fade-up">
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="display mt-4 text-[2.6rem] sm:text-6xl lg:text-[4.1rem]">{headline}</h1>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-paper/80">{subheading}</p>

          <ul className="mt-7 space-y-2.5">
            {proofs.map((proof) => (
              <li key={proof} className="flex items-center gap-3 text-[0.95rem] text-paper/90">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                  <Icon name="check" size={14} />
                </span>
                {proof}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/shop" size="lg">
              {t("shopCta")}
            </ButtonLink>
            <ButtonLink href="/wagyu-101" size="lg" variant="outline" className="border-paper/30 text-paper hover:border-paper hover:bg-paper/10">
              {t("whatIsA5")}
            </ButtonLink>
          </div>

          {rating && (
            <p className="mt-7 flex items-center gap-2 text-sm text-paper/70">
              <Stars rating={rating.average} size={15} />
              <span>
                {rating.average.toFixed(1)} · {tc("reviews", { count: rating.count })}
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
