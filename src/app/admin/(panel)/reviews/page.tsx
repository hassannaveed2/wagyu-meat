import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, Checkbox, Field, Flash, inputClass, PageTitle, StatusPill, Table, textareaClass } from "@/components/admin/ui";
import { listProductsForAdmin, listReviews } from "@/db/queries/admin";
import { addReview, deleteReview, setReviewApproval } from "../content-actions";

export const metadata = { title: "Reviews" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function ReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  const { saved } = await searchParams;
  const [rows, products] = await Promise.all([listReviews(), listProductsForAdmin()]);
  const samples = rows.filter(({ review }) => review.name.startsWith("Sample")).length;

  return (
    <>
      <PageTitle title="Reviews" description="Only approved reviews appear on the store." />
      <Flash message={saved ? "Review added." : null} />
      {samples > 0 && (
        <p className="mb-5 rounded-md border border-gold bg-gold-soft px-4 py-2.5 text-sm text-[#6b5126]">
          {samples} sample reviews were added for design previews. Delete them before launch.
        </p>
      )}
      <Table head={["Review", "Product", "Rating", "Status", ""]} empty={rows.length ? undefined : "No reviews yet."}>
        {rows.map(({ review, productName }) => (
          <tr key={review.id} className="align-top">
            <td className="max-w-md px-4 py-3">
              <p className="font-medium">
                {review.name}
                {review.city && <span className="font-normal text-ink-3"> · {review.city}</span>}
                {review.verified && <span className="ml-2 text-xs text-leaf">verified</span>}
              </p>
              <p className="mt-1 text-ink-2">{review.body}</p>
            </td>
            <td className="px-4 py-3 text-ink-2">{productName ?? "Store"}</td>
            <td className="px-4 py-3">{"★".repeat(review.rating)}</td>
            <td className="px-4 py-3">
              <StatusPill status={review.approved ? "delivered" : "pending"} label={review.approved ? "Shown" : "Hidden"} />
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              <div className="flex gap-2">
                <form action={setReviewApproval}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="approved" value={String(!review.approved)} />
                  <SubmitButton variant="outline">{review.approved ? "Hide" : "Approve"}</SubmitButton>
                </form>
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={review.id} />
                  <SubmitButton variant="danger" confirm="Delete this review?">
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Card title="Add a customer review" className="mt-6">
        <form action={addReview} className="grid gap-3 sm:grid-cols-4">
          <Field label="Customer name">
            <input name="name" required className={inputClass} />
          </Field>
          <Field label="City">
            <input name="city" className={inputClass} />
          </Field>
          <Field label="Rating">
            <select name="rating" defaultValue="5" className={inputClass}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </Field>
          <Field label="Product">
            <select name="productId" className={inputClass}>
              <option value="">Store review</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nameEn}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Review" className="sm:col-span-4">
            <textarea name="body" required rows={3} className={textareaClass} />
          </Field>
          <div className="flex items-center gap-4 sm:col-span-4">
            <Checkbox name="verified" label="Verified buyer (matches a real order)" />
            <SubmitButton>Add review</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
