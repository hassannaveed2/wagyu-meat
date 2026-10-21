"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { SETTINGS_TAG } from "@/db/queries/content";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { settingsSchema } from "@/lib/settings";

const pair = (formData: FormData, name: string) => ({
  en: String(formData.get(`${name}En`) ?? "").trim(),
  ja: String(formData.get(`${name}Ja`) ?? "").trim(),
});

export type SettingsState = { error?: string };

export async function saveSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin("admin");

  const questionsEn = formData.getAll("faq_q_en").map(String);
  const faq = questionsEn
    .map((questionEn, index) => ({
      question: { en: questionEn.trim(), ja: String(formData.getAll("faq_q_ja")[index] ?? "").trim() },
      answer: {
        en: String(formData.getAll("faq_a_en")[index] ?? "").trim(),
        ja: String(formData.getAll("faq_a_ja")[index] ?? "").trim(),
      },
    }))
    .filter((item) => item.question.en && item.answer.en);

  const parsed = settingsSchema.safeParse({
    announcement: pair(formData, "announcement"),
    whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    instagram: String(formData.get("instagram") ?? "").trim(),
    facebook: String(formData.get("facebook") ?? "").trim(),
    tiktok: String(formData.get("tiktok") ?? "").trim(),
    bankDetails: pair(formData, "bankDetails"),
    hero: {
      eyebrow: pair(formData, "heroEyebrow"),
      headline: pair(formData, "heroHeadline"),
      subheading: pair(formData, "heroSubheading"),
      image: String(formData.get("heroImage") ?? "").trim() || "/images/hero-a5.webp",
    },
    featuredProductSlugs: formData.getAll("featuredProductSlugs").map(String),
    faq,
  });
  if (!parsed.success) return { error: "Some settings are invalid. Check the fields and try again." };
  if (!/^\/(images|uploads)\/[a-z0-9-]+\.(webp|jpg|png)$/.test(parsed.data.hero.image)) {
    return { error: "Hero image must be a /images/… or /uploads/… path." };
  }

  await db.insert(siteSettings).values({ id: 1, data: parsed.data }).onDuplicateKeyUpdate({ set: { data: parsed.data } });
  updateTag(SETTINGS_TAG);
  redirect("/admin/settings?saved=1");
}
