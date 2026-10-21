import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, Field, Flash, inputClass, LocalizedInput, PageTitle } from "@/components/admin/ui";
import { listCategories } from "@/db/queries/admin";
import { saveCategory } from "../content-actions";

export const metadata = { title: "Categories" };
// Admin pages read the session and live data on every request.
export const instant = false;

type CategoryRow = Awaited<ReturnType<typeof listCategories>>[number];

function CategoryForm({ category }: { category?: CategoryRow }) {
  return (
    <form action={saveCategory} className="space-y-3">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Slug">
          <input name="slug" defaultValue={category?.slug} required pattern="[a-z0-9-]+" className={inputClass} />
        </Field>
        <Field label="Type">
          <select name="type" defaultValue={category?.type ?? "cut"} className={inputClass}>
            <option value="origin">Origin</option>
            <option value="cut">Cut</option>
            <option value="occasion">Occasion</option>
          </select>
        </Field>
        <Field label="Image path">
          <input name="image" defaultValue={category?.image ?? ""} placeholder="/images/…" className={inputClass} />
        </Field>
        <Field label="Sort">
          <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className={inputClass} />
        </Field>
      </div>
      <LocalizedInput label="Name" name="name" en={category?.nameEn} ja={category?.nameJa} required />
      <LocalizedInput label="Description" name="description" en={category?.descriptionEn} ja={category?.descriptionJa} multiline rows={2} />
      <SubmitButton>{category ? "Save" : "Add category"}</SubmitButton>
    </form>
  );
}

export default async function CategoriesPage({ searchParams }: PageProps<"/admin/categories">) {
  const { saved } = await searchParams;
  const rows = await listCategories();
  return (
    <>
      <PageTitle title="Categories" description="Origins, cuts and occasions used for shop filters and the mega menu." />
      <Flash message={saved ? "Saved." : null} />
      <div className="space-y-4">
        {rows.map((category) => (
          <details key={category.id} className="rounded-lg border border-line bg-paper">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-3 text-sm">
              <span className="font-medium">
                {category.nameEn} <span className="text-ink-3">· {category.nameJa}</span>
              </span>
              <span className="text-xs uppercase text-ink-3">{category.type}</span>
            </summary>
            <div className="border-t border-line p-5">
              <CategoryForm category={category} />
            </div>
          </details>
        ))}
        <Card title="Add a category">
          <CategoryForm />
        </Card>
      </div>
    </>
  );
}
