"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { saveProduct, uploadImage, type SaveState } from "@/app/admin/(panel)/products/actions";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { SubmitButton } from "./SubmitButton";
import { AdminButton, Card, Checkbox, ErrorNote, Field, inputClass, LocalizedInput } from "./ui";

type Product = Record<string, unknown> & { id?: number };
type VariantRow = {
  sku: string;
  labelEn: string;
  labelJa: string;
  weightGrams: number | string;
  pricePKR: number | string;
  compareAtPKR: number | string | null;
  inStock: boolean;
};
type ImageRow = { url: string; altEn: string; altJa: string };
type CategoryOption = { id: number; nameEn: string; type: string };

const s = (value: unknown) => (value == null ? "" : String(value));

export function ProductForm({
  product,
  variants: initialVariants,
  images: initialImages,
  categories,
  selectedCategoryIds,
}: {
  product: Product | null;
  variants: VariantRow[];
  images: ImageRow[];
  categories: CategoryOption[];
  selectedCategoryIds: number[];
}) {
  const [state, action] = useActionState<SaveState, FormData>(saveProduct, {});
  const [variants, setVariants] = useState<VariantRow[]>(
    initialVariants.length ? initialVariants : [{ sku: "", labelEn: "", labelJa: "", weightGrams: 200, pricePKR: "", compareAtPKR: null, inStock: true }],
  );
  const [images, setImages] = useState<ImageRow[]>(initialImages);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const p = product ?? {};

  const updateVariant = (index: number, patch: Partial<VariantRow>) =>
    setVariants((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const moveImage = (index: number, delta: number) =>
    setImages((rows) => {
      const next = [...rows];
      const target = index + delta;
      if (target < 0 || target >= next.length) return rows;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  function onFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    startUpload(async () => {
      const data = new FormData();
      data.set("file", file);
      const result = await uploadImage(data);
      if (result.url) setImages((rows) => [...rows, { url: result.url!, altEn: "", altJa: "" }]);
      else setUploadError(result.error ?? "Upload failed.");
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  const grouped = ["origin", "cut", "occasion"].map((type) => ({ type, items: categories.filter((c) => c.type === type) }));

  return (
    <form action={action} className="space-y-6">
      {p.id != null && <input type="hidden" name="id" value={s(p.id)} />}
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <ErrorNote message={state.error} />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card title="Content">
            <div className="space-y-4">
              <LocalizedInput label="Name" name="name" en={s(p.nameEn)} ja={s(p.nameJa)} required />
              <LocalizedInput label="Short description (cards & meta)" name="short" en={s(p.shortEn)} ja={s(p.shortJa)} multiline rows={2} />
              <LocalizedInput label="Description (Markdown)" name="description" en={s(p.descriptionEn)} ja={s(p.descriptionJa)} multiline rows={8} />
              <LocalizedInput label="Region / origin line" name="region" en={s(p.regionEn)} ja={s(p.regionJa)} hint="e.g. Kagoshima, Japan" />
              <LocalizedInput label="What's in the box (Markdown, bundles only)" name="contents" en={s(p.contentsEn)} ja={s(p.contentsJa)} multiline rows={4} />
              <LocalizedInput label="How to cook (Markdown)" name="cooking" en={s(p.cookingEn)} ja={s(p.cookingJa)} multiline rows={5} />
              <LocalizedInput label="Storage notes (leave empty for the standard text)" name="storageNotes" en={s(p.storageNotesEn)} ja={s(p.storageNotesJa)} multiline rows={3} />
              <LocalizedInput label="Portion guide" name="serving" en={s(p.servingEn)} ja={s(p.servingJa)} />
            </div>
          </Card>

          <Card
            title="Sizes & prices"
            action={
              <AdminButton
                type="button"
                variant="outline"
                onClick={() => setVariants((rows) => [...rows, { sku: "", labelEn: "", labelJa: "", weightGrams: "", pricePKR: "", compareAtPKR: null, inStock: true }])}
              >
                <Icon name="plus" size={14} /> Add size
              </AdminButton>
            }
          >
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="grid gap-2 rounded-md border border-line p-3 md:grid-cols-[1.1fr_1.2fr_1.2fr_0.8fr_0.9fr_0.9fr_auto] md:items-end">
                  <Field label="SKU">
                    <input className={inputClass} value={variant.sku} onChange={(e) => updateVariant(index, { sku: e.target.value })} required />
                  </Field>
                  <Field label="Label (EN)">
                    <input className={inputClass} value={variant.labelEn} onChange={(e) => updateVariant(index, { labelEn: e.target.value })} required placeholder="300 g steak" />
                  </Field>
                  <Field label="Label (JA)">
                    <input className={inputClass} value={variant.labelJa} onChange={(e) => updateVariant(index, { labelJa: e.target.value })} lang="ja" />
                  </Field>
                  <Field label="Weight g">
                    <input className={inputClass} type="number" min={0} value={variant.weightGrams} onChange={(e) => updateVariant(index, { weightGrams: e.target.value })} />
                  </Field>
                  <Field label="Price Rs">
                    <input className={inputClass} type="number" min={1} value={variant.pricePKR} onChange={(e) => updateVariant(index, { pricePKR: e.target.value })} required />
                  </Field>
                  <Field label="Was Rs">
                    <input className={inputClass} type="number" min={0} value={variant.compareAtPKR ?? ""} onChange={(e) => updateVariant(index, { compareAtPKR: e.target.value || null })} />
                  </Field>
                  <div className="flex items-center gap-3 pb-2">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={variant.inStock} onChange={(e) => updateVariant(index, { inStock: e.target.checked })} className="accent-[var(--color-wagyu)]" />
                      In stock
                    </label>
                    <button
                      type="button"
                      aria-label="Remove size"
                      disabled={variants.length === 1}
                      onClick={() => setVariants((rows) => rows.filter((_, i) => i !== index))}
                      className="text-ink-3 hover:text-wagyu disabled:opacity-30"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Images" action={<span className="text-xs text-ink-3">First image is the main photo</span>}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div key={image.url} className="rounded-md border border-line p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt="" className="aspect-[4/5] w-full rounded object-cover" />
                  <input
                    className={cn(inputClass, "mt-2 h-8 text-xs")}
                    placeholder="Alt text (EN)"
                    value={image.altEn}
                    onChange={(e) => setImages((rows) => rows.map((row, i) => (i === index ? { ...row, altEn: e.target.value } : row)))}
                  />
                  <div className="mt-2 flex justify-between text-ink-3">
                    <button type="button" onClick={() => moveImage(index, -1)} aria-label="Move left" className="hover:text-ink">
                      <Icon name="chevronLeft" size={16} />
                    </button>
                    <button type="button" onClick={() => setImages((rows) => rows.filter((_, i) => i !== index))} className="text-xs hover:text-wagyu">
                      Remove
                    </button>
                    <button type="button" onClick={() => moveImage(index, 1)} aria-label="Move right" className="hover:text-ink">
                      <Icon name="chevronRight" size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="grid aspect-[4/5] cursor-pointer place-items-center rounded-md border border-dashed border-line text-center text-sm text-ink-3 hover:border-ink hover:text-ink">
                <span>
                  <Icon name="plus" size={20} className="mx-auto mb-1" />
                  {uploading ? "Uploading…" : "Upload image"}
                </span>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </div>
            {uploadError && <p className="mt-2 text-sm text-wagyu">{uploadError}</p>}
          </Card>

          <Card title="SEO">
            <div className="space-y-4">
              <LocalizedInput label="Meta title" name="metaTitle" en={s(p.metaTitleEn)} ja={s(p.metaTitleJa)} />
              <LocalizedInput label="Meta description" name="metaDescription" en={s(p.metaDescriptionEn)} ja={s(p.metaDescriptionJa)} multiline rows={2} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publish">
            <div className="space-y-3">
              <Checkbox name="published" label="Published on the store" defaultChecked={p.published === undefined ? true : Boolean(p.published)} />
              <Checkbox name="featured" label="Featured" defaultChecked={Boolean(p.featured)} />
              <Checkbox name="bestSeller" label="Best seller" defaultChecked={Boolean(p.bestSeller)} />
              <Field label="Sort order">
                <input name="sortOrder" type="number" min={0} defaultValue={s(p.sortOrder ?? 0)} className={inputClass} />
              </Field>
              <SubmitButton className="w-full">Save product</SubmitButton>
            </div>
          </Card>

          <Card title="Details">
            <div className="space-y-3">
              <Field label="URL slug" hint="Lowercase, dashes. Used in /products/…">
                <input name="slug" defaultValue={s(p.slug)} required pattern="[a-z0-9-]+" className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Origin">
                  <select name="origin" defaultValue={s(p.origin) || "japan"} className={inputClass}>
                    <option value="japan">Japan</option>
                    <option value="australia">Australia</option>
                  </select>
                </Field>
                <Field label="Grade">
                  <select name="grade" defaultValue={s(p.grade) || "A5"} className={inputClass}>
                    {["A5", "A4", "MB8-9", "MB6-7", "NA"].map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="BMS (1–12)">
                  <input name="bms" type="number" min={1} max={12} defaultValue={s(p.bms)} className={inputClass} />
                </Field>
                <Field label="Type">
                  <select name="productType" defaultValue={s(p.productType) || "steak"} className={inputClass}>
                    {["steak", "sliced", "burger", "bundle", "gift-card"].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Storage">
                  <select name="storage" defaultValue={s(p.storage) || "frozen"} className={inputClass}>
                    <option value="frozen">Frozen</option>
                    <option value="chilled">Chilled</option>
                  </select>
                </Field>
                <Field label="Brand">
                  <input name="brand" defaultValue={s(p.brand)} className={inputClass} />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Certification">
            <div className="space-y-3">
              <Checkbox name="halalCertified" label="Halal certified" defaultChecked={p.halalCertified === undefined ? true : Boolean(p.halalCertified)} />
              <Field label="Halal certifying body" hint="Shown on the product page when filled in.">
                <input name="halalBody" defaultValue={s(p.halalBody)} className={inputClass} />
              </Field>
              <Checkbox name="authenticityCertificate" label="Certificate of authenticity included" defaultChecked={Boolean(p.authenticityCertificate)} />
            </div>
          </Card>

          <Card title="Categories">
            <div className="space-y-4">
              {grouped.map((group) => (
                <div key={group.type}>
                  <p className="mb-1.5 text-xs font-medium uppercase text-ink-3">{group.type}</p>
                  <div className="flex flex-col gap-1.5">
                    {group.items.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="categoryIds"
                          value={category.id}
                          defaultChecked={selectedCategoryIds.includes(category.id)}
                          className="accent-[var(--color-wagyu)]"
                        />
                        {category.nameEn}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
