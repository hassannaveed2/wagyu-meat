import { z } from "zod";

const text = z.object({ en: z.string().default(""), ja: z.string().default("") });
export type LocalizedText = z.infer<typeof text>;

const faqItem = z.object({ question: text, answer: text });

export const settingsSchema = z.object({
  announcement: text,
  whatsappNumber: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  instagram: z.string().default(""),
  facebook: z.string().default(""),
  tiktok: z.string().default(""),
  bankDetails: text,
  hero: z.object({
    eyebrow: text,
    headline: text,
    subheading: text,
    image: z.string().default("/images/hero-a5.webp"),
  }),
  featuredProductSlugs: z.array(z.string()).default([]),
  faq: z.array(faqItem).default([]),
});

export type SiteSettings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: SiteSettings = settingsSchema.parse({
  announcement: {
    en: "Free cold-chain delivery over Rs 25,000 · Karachi · Lahore · Islamabad",
    ja: "25,000ルピー以上で冷凍配送無料・カラチ・ラホール・イスラマバード",
  },
  whatsappNumber: "+923000000000",
  phone: "+92 300 0000000",
  email: "hello@wagyumeat.pk",
  bankDetails: { en: "", ja: "" },
  hero: {
    eyebrow: { en: "Halal Japanese A5 · Now in Pakistan", ja: "ハラール認証の日本産A5和牛・パキスタン初上陸" },
    headline: { en: "The world's finest beef, delivered frozen to your door", ja: "世界最高峰の和牛を、ご自宅まで冷凍でお届け" },
    subheading: {
      en: "Certified Japanese A5 and Australian wagyu, graded for marbling and cut for Pakistani kitchens.",
      ja: "格付け済みの日本産A5和牛とオーストラリア産和牛を、パキスタンのご家庭向けにカットしてお届けします。",
    },
  },
  featuredProductSlugs: [],
  faq: [],
});

export function parseSettings(raw: unknown): SiteSettings {
  const result = settingsSchema.safeParse(raw);
  return result.success ? result.data : DEFAULT_SETTINGS;
}
