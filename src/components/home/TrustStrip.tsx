import { getTranslations } from "next-intl/server";
import { Icon, type IconName } from "@/components/ui/Icon";

const ITEMS: { key: "halal" | "graded" | "frozen" | "delivery"; icon: IconName }[] = [
  { key: "halal", icon: "shield" },
  { key: "graded", icon: "certificate" },
  { key: "frozen", icon: "snowflake" },
  { key: "delivery", icon: "truck" },
];

export async function TrustStrip() {
  const t = await getTranslations("home.trust");
  return (
    <section className="border-b border-line bg-paper-2">
      <ul className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {ITEMS.map((item) => (
          <li key={item.key} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper text-wagyu ring-1 ring-line">
              <Icon name={item.icon} size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold">{t(`${item.key}.title`)}</p>
              <p className="mt-0.5 text-[0.82rem] leading-snug text-ink-2">{t(`${item.key}.body`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
