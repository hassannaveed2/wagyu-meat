import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, Checkbox, Field, Flash, inputClass, PageTitle, textareaClass } from "@/components/admin/ui";
import { listCities } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth/session";
import { saveCity } from "../content-actions";

export const metadata = { title: "Cities & delivery" };
// Admin pages read the session and live data on every request.
export const instant = false;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type CityRow = Awaited<ReturnType<typeof listCities>>[number];

function CityForm({ city }: { city?: CityRow }) {
  return (
    <form action={saveCity} className="space-y-4">
      {city && <input type="hidden" name="id" value={city.id} />}
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Slug">
          <input name="slug" defaultValue={city?.slug} required pattern="[a-z0-9-]+" className={inputClass} />
        </Field>
        <Field label="Name (EN)">
          <input name="nameEn" defaultValue={city?.nameEn} required className={inputClass} />
        </Field>
        <Field label="Name (JA)">
          <input name="nameJa" defaultValue={city?.nameJa} className={inputClass} lang="ja" />
        </Field>
        <Field label="Delivery fee (Rs)">
          <input name="deliveryFeePKR" type="number" min={0} defaultValue={city?.deliveryFeePKR ?? 1500} className={inputClass} />
        </Field>
        <Field label="Free delivery from (Rs)">
          <input name="freeDeliveryThresholdPKR" type="number" min={0} defaultValue={city?.freeDeliveryThresholdPKR ?? 25000} className={inputClass} />
        </Field>
        <Field label="Lead time (hours)" hint="Minimum notice before a delivery day.">
          <input name="leadTimeHours" type="number" min={0} defaultValue={city?.leadTimeHours ?? 24} className={inputClass} />
        </Field>
      </div>
      <fieldset>
        <legend className="mb-1 text-xs font-medium text-ink-2">Delivery days</legend>
        <div className="flex flex-wrap gap-3">
          {DAYS.map((day, index) => (
            <label key={day} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" name="deliveryDays" value={index} defaultChecked={city?.deliveryDays.includes(index)} className="accent-[var(--color-wagyu)]" />
              {day}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Time slots" hint="One per line: English | Japanese">
        <textarea name="slots" rows={3} defaultValue={(city?.slots ?? []).map((slot) => `${slot.en} | ${slot.ja}`).join("\n")} className={textareaClass} />
      </Field>
      <div className="flex items-center gap-6">
        <Checkbox name="active" label="Active (shown at checkout)" defaultChecked={city?.active ?? true} />
        <Field label="Sort" className="w-24">
          <input name="sortOrder" type="number" defaultValue={city?.sortOrder ?? 0} className={inputClass} />
        </Field>
      </div>
      <SubmitButton>{city ? "Save city" : "Add city"}</SubmitButton>
    </form>
  );
}

export default async function CitiesPage({ searchParams }: PageProps<"/admin/cities">) {
  await requireAdmin("admin");
  const { saved } = await searchParams;
  const rows = await listCities();
  return (
    <>
      <PageTitle title="Cities & delivery" description="Delivery fees, free-delivery thresholds, days and time slots per city." />
      <Flash message={saved ? "Saved. Checkout uses the new schedule immediately." : null} />
      <div className="space-y-4">
        {rows.map((city) => (
          <Card key={city.id} title={`${city.nameEn}${city.active ? "" : " (inactive)"}`}>
            <CityForm city={city} />
          </Card>
        ))}
        <Card title="Add a city">
          <CityForm />
        </Card>
      </div>
    </>
  );
}
