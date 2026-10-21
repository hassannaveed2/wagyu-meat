import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Flash, PageTitle } from "@/components/admin/ui";
import { getProductForEdit, listCategories } from "@/db/queries/admin";
import { getSession } from "@/lib/auth/session";
import { deleteProduct } from "../actions";

export const metadata = { title: "Edit product" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const [data, categories, session] = await Promise.all([isNew ? null : getProductForEdit(Number(id)), listCategories(), getSession()]);
  if (!isNew && !data) notFound();

  return (
    <>
      <PageTitle
        title={isNew ? "New product" : data!.product.nameEn}
        action={
          <div className="flex items-center gap-4">
            {!isNew && (
              <a href={`/en/products/${data!.product.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-2 hover:text-ink">
                View on store ↗
              </a>
            )}
            <Link href="/admin/products" className="text-sm text-ink-2 hover:text-ink">
              ← All products
            </Link>
          </div>
        }
      />
      <Flash message={saved ? "Product saved. The store updates immediately." : null} />
      <ProductForm
        product={data?.product ?? null}
        variants={(data?.variants ?? []).map((v) => ({
          sku: v.sku,
          labelEn: v.labelEn,
          labelJa: v.labelJa,
          weightGrams: v.weightGrams,
          pricePKR: v.pricePKR,
          compareAtPKR: v.compareAtPKR,
          inStock: v.inStock,
        }))}
        images={(data?.images ?? []).map((i) => ({ url: i.url, altEn: i.altEn, altJa: i.altJa }))}
        categories={categories.map((c) => ({ id: c.id, nameEn: c.nameEn, type: c.type }))}
        selectedCategoryIds={data?.categoryIds ?? []}
      />
      {!isNew && session?.role === "admin" && (
        <form action={deleteProduct} className="mt-10 border-t border-line pt-6">
          <input type="hidden" name="id" value={data!.product.id} />
          <SubmitButton variant="danger" confirm="Delete this product permanently? Past orders keep their own copy of the item.">
            Delete product
          </SubmitButton>
        </form>
      )}
    </>
  );
}
