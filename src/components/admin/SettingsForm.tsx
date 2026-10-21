"use client";

import { useActionState, useState } from "react";
import { saveSettings, type SettingsState } from "@/app/admin/(panel)/settings/actions";
import type { SiteSettings } from "@/lib/settings";
import { SubmitButton } from "./SubmitButton";
import { AdminButton, Card, ErrorNote, Field, inputClass, LocalizedInput, textareaClass } from "./ui";

export function SettingsForm({ settings, products }: { settings: SiteSettings; products: { slug: string; name: string }[] }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveSettings, {});
  const [faq, setFaq] = useState(settings.faq);

  return (
    <form action={action} className="space-y-6">
      <ErrorNote message={state.error} />
      <Card title="Announcement bar">
        <LocalizedInput label="Message" name="announcement" en={settings.announcement.en} ja={settings.announcement.ja} />
      </Card>

      <Card title="Homepage hero">
        <div className="space-y-4">
          <LocalizedInput label="Eyebrow" name="heroEyebrow" en={settings.hero.eyebrow.en} ja={settings.hero.eyebrow.ja} />
          <LocalizedInput label="Headline" name="heroHeadline" en={settings.hero.headline.en} ja={settings.hero.headline.ja} />
          <LocalizedInput label="Subheading" name="heroSubheading" en={settings.hero.subheading.en} ja={settings.hero.subheading.ja} multiline rows={2} />
          <Field label="Hero image path" hint="/images/… or an /uploads/… path">
            <input name="heroImage" defaultValue={settings.hero.image} className={inputClass} />
          </Field>
          <fieldset>
            <legend className="mb-1 text-xs font-medium text-ink-2">Best sellers on the homepage (up to 4, in order of the list)</legend>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {products.map((product) => (
                <label key={product.slug} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="featuredProductSlugs"
                    value={product.slug}
                    defaultChecked={settings.featuredProductSlugs.includes(product.slug)}
                    className="accent-[var(--color-wagyu)]"
                  />
                  {product.name}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Card>

      <Card title="Contact & social">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="WhatsApp number" hint="International format, e.g. +92 300 1234567">
            <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input name="phone" defaultValue={settings.phone} className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" defaultValue={settings.email} className={inputClass} />
          </Field>
          <Field label="Instagram URL">
            <input name="instagram" defaultValue={settings.instagram} className={inputClass} />
          </Field>
          <Field label="Facebook URL">
            <input name="facebook" defaultValue={settings.facebook} className={inputClass} />
          </Field>
          <Field label="TikTok URL">
            <input name="tiktok" defaultValue={settings.tiktok} className={inputClass} />
          </Field>
        </div>
      </Card>

      <Card title="Bank transfer details">
        <LocalizedInput label="Shown on the order confirmation when bank transfer is chosen" name="bankDetails" en={settings.bankDetails.en} ja={settings.bankDetails.ja} multiline rows={3} />
      </Card>

      <Card
        title="FAQ"
        action={
          <AdminButton type="button" variant="outline" onClick={() => setFaq((rows) => [...rows, { question: { en: "", ja: "" }, answer: { en: "", ja: "" } }])}>
            Add question
          </AdminButton>
        }
      >
        <div className="space-y-4">
          {faq.map((item, index) => (
            <div key={index} className="rounded-md border border-line p-3">
              <div className="grid gap-2 md:grid-cols-2">
                <input name="faq_q_en" defaultValue={item.question.en} placeholder="Question (EN)" className={inputClass} />
                <input name="faq_q_ja" defaultValue={item.question.ja} placeholder="Question (JA)" className={inputClass} lang="ja" />
                <textarea name="faq_a_en" defaultValue={item.answer.en} placeholder="Answer (EN)" rows={3} className={textareaClass} />
                <textarea name="faq_a_ja" defaultValue={item.answer.ja} placeholder="Answer (JA)" rows={3} className={textareaClass} lang="ja" />
              </div>
              <button type="button" className="mt-2 text-xs text-wagyu" onClick={() => setFaq((rows) => rows.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <SubmitButton className="shadow-[var(--shadow-pop)]">Save settings</SubmitButton>
      </div>
    </form>
  );
}
