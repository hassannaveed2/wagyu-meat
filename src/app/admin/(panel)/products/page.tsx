import Link from "next/link";
import { AdminLink, Flash, PageTitle, StatusPill, Table } from "@/components/admin/ui";
import { listProductsForAdmin } from "@/db/queries/admin";
import { formatPKR } from "@/lib/commerce/format";

export const metadata = { title: "Products" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const { deleted } = await searchParams;
  const rows = await listProductsForAdmin();

  return (
    <>
      <PageTitle title="Products" description="Edit names and descriptions in English and Japanese, sizes, prices and photos." action={<AdminLink href="/admin/products/new">New product</AdminLink>} />
      <Flash message={deleted ? "Product deleted." : null} />
      <Table head={["", "Product", "Origin / grade", "Sizes", "From", "Stock", "Status"]} empty={rows.length ? undefined : "No products yet."}>
        {rows.map((product) => {
          const prices = product.variants.map((v) => v.pricePKR);
          const soldOut = product.variants.filter((v) => !v.inStock).length;
          return (
            <tr key={product.id} className="hover:bg-paper-2">
              <td className="w-16 px-4 py-2">
                {product.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt="" className="h-12 w-10 rounded object-cover" />
                )}
              </td>
              <td className="px-4 py-3">
                <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-wagyu">
                  {product.nameEn}
                </Link>
                <span className="block text-xs text-ink-3" lang="ja">
                  {product.nameJa || "— no Japanese name —"}
                </span>
              </td>
              <td className="px-4 py-3 capitalize">
                {product.origin} · {product.grade}
                {product.bms ? ` · BMS ${product.bms}` : ""}
              </td>
              <td className="px-4 py-3">{product.variants.length}</td>
              <td className="px-4 py-3">{prices.length ? formatPKR(Math.min(...prices)) : "—"}</td>
              <td className="px-4 py-3">{soldOut ? <span className="text-wagyu">{soldOut} sold out</span> : "In stock"}</td>
              <td className="px-4 py-3">
                <StatusPill status={product.published ? "delivered" : "pending"} label={product.published ? "Live" : "Hidden"} />
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
