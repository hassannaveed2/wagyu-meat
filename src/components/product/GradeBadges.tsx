import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/primitives";
import type { Grade } from "@/db/queries/catalog";

const GRADE_LABEL: Record<Grade, string | null> = {
  A5: "A5",
  A4: "A4",
  "MB8-9": "MB 8–9",
  "MB6-7": "MB 6–7",
  NA: null,
};

export function GradeBadges({
  grade,
  bms,
  halal,
  tone = "glass",
  showHalal = false,
}: {
  grade: Grade;
  bms: number | null;
  halal?: boolean;
  tone?: "glass" | "solid";
  showHalal?: boolean;
}) {
  const t = useTranslations("common");
  const label = GRADE_LABEL[grade];
  return (
    <div className="flex flex-wrap gap-1.5">
      {label && <Badge tone={grade === "A5" ? "wagyu" : "ink"}>{label}</Badge>}
      {bms !== null && grade.startsWith("A") && <Badge tone={tone === "glass" ? "glass" : "gold"}>{t("bms", { value: bms })}</Badge>}
      {showHalal && halal && <Badge tone="leaf">{t("halal")}</Badge>}
    </div>
  );
}
