import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, Checkbox, Field, Flash, inputClass, LocalizedInput, PageTitle } from "@/components/admin/ui";
import { getGuideForEdit } from "@/db/queries/admin";
import { saveGuide } from "../../content-actions";

export const metadata = { title: "Edit guide" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function EditGuidePage({ params, searchParams }: PageProps<"/admin/guides/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const guide = id === "new" ? null : await getGuideForEdit(Number(id));
  if (id !== "new" && !guide) notFound();

  return (
    <>
      <PageTitle
        title={guide ? guide.titleEn : "New guide"}
        action={
          <Link href="/admin/guides" className="text-sm text-ink-2 hover:text-ink">
            ← All guides
          </Link>
        }
      />
      <Flash message={saved ? "Guide saved." : null} />
      <form action={saveGuide} className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {guide && <input type="hidden" name="id" value={guide.id} />}
        <Card title="Content">
          <div className="space-y-4">
            <LocalizedInput label="Title" name="title" en={guide?.titleEn} ja={guide?.titleJa} required />
            <LocalizedInput label="Excerpt" name="excerpt" en={guide?.excerptEn} ja={guide?.excerptJa} multiline rows={2} />
            <LocalizedInput label="Body (Markdown: ## headings, lists, | tables |)" name="body" en={guide?.bodyEn} ja={guide?.bodyJa} multiline rows={22} />
          </div>
        </Card>
        <Card title="Details">
          <div className="space-y-3">
            <Field label="URL slug">
              <input name="slug" defaultValue={guide?.slug} required pattern="[a-z0-9-]+" className={inputClass} />
            </Field>
            <Field label="Type">
              <select name="type" defaultValue={guide?.type ?? "guide"} className={inputClass}>
                <option value="guide">Guide</option>
                <option value="recipe">Recipe</option>
              </select>
            </Field>
            <Field label="Hero image path" hint="e.g. /images/guide-sear.webp or an /uploads/… path from a product image">
              <input name="heroImage" defaultValue={guide?.heroImage ?? ""} className={inputClass} />
            </Field>
            <Field label="Reading minutes">
              <input name="readingMinutes" type="number" min={1} defaultValue={guide?.readingMinutes ?? 4} className={inputClass} />
            </Field>
            <Field label="Sort">
              <input name="sortOrder" type="number" min={0} defaultValue={guide?.sortOrder ?? 0} className={inputClass} />
            </Field>
            <Checkbox name="published" label="Published" defaultChecked={guide?.published ?? true} />
            <SubmitButton className="w-full">Save guide</SubmitButton>
          </div>
        </Card>
      </form>
    </>
  );
}
