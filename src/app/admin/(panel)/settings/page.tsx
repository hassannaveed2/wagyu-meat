import { SettingsForm } from "@/components/admin/SettingsForm";
import { Flash, PageTitle } from "@/components/admin/ui";
import { getSettingsForEdit, listProductsForAdmin } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Site settings" };
// Admin pages read the session and live data on every request.
export const instant = false;

export default async function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  await requireAdmin("admin");
  const { saved } = await searchParams;
  const [settings, products] = await Promise.all([getSettingsForEdit(), listProductsForAdmin()]);

  return (
    <>
      <PageTitle title="Site settings" description="Announcement bar, homepage hero, contact details and FAQ, in English and Japanese." />
      <Flash message={saved ? "Settings saved. The store updates immediately." : null} />
      <SettingsForm settings={settings} products={products.map((p) => ({ slug: p.slug, name: p.nameEn }))} />
    </>
  );
}
