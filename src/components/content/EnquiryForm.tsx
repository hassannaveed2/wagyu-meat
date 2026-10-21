"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { sendEnquiry, type FormState } from "@/app/[locale]/actions";
import { Button } from "@/components/ui/Button";

const input =
  "h-12 w-full rounded-[10px] border border-line bg-paper px-4 text-[0.95rem] focus:border-ink focus:outline-none";

export function EnquiryForm({ type }: { type: "corporate" | "contact" }) {
  const t = useTranslations("pages.gifting.form");
  const tContact = useTranslations("pages.contact");
  const [state, action, pending] = useActionState<FormState, FormData>(sendEnquiry, { status: "idle" });

  if (state.status === "success") {
    return (
      <p className="rounded-[14px] bg-leaf-soft p-6 text-leaf" role="status">
        {type === "corporate" ? t("sent") : tContact("sent")}
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="type" value={type} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{t("name")}</span>
        <input name="name" required minLength={2} className={input} autoComplete="name" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{t("phone")}</span>
        <input name="phone" type="tel" required className={input} autoComplete="tel" placeholder="0300 1234567" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{t("email")}</span>
        <input name="email" type="email" className={input} autoComplete="email" />
      </label>
      {type === "corporate" ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t("company")}</span>
          <input name="company" className={input} autoComplete="organization" />
        </label>
      ) : (
        <div className="hidden sm:block" />
      )}
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm font-medium">{type === "corporate" ? t("message") : tContact("form")}</span>
        <textarea name="message" required minLength={5} className={`${input} h-32 py-3`} />
      </label>
      {state.status === "error" && (
        <p className="text-sm text-wagyu sm:col-span-2" role="alert">
          {t("error")}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending}>
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
