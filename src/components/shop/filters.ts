export type Sort = "featured" | "price-asc" | "price-desc" | "bms";
export type Filters = { origin: string | null; cut: string | null; occasion: string | null; sort: Sort };

export const SORTS: Sort[] = ["featured", "price-asc", "price-desc", "bms"];
const KEYS = ["origin", "cut", "occasion"] as const;
/** Written to the URL when the shopper clears a filter that the page sets by default. */
const ALL = "all";

/** Reads filters from a query string; absent keys fall back to the page's defaults. */
export function parseFilters(search: string, defaults: Partial<Filters>): Filters {
  const query = new URLSearchParams(search);
  const read = (key: (typeof KEYS)[number]) => {
    const value = query.get(key);
    if (value === ALL) return null;
    return value ?? defaults[key] ?? null;
  };
  const sort = query.get("sort");
  return {
    origin: read("origin"),
    cut: read("cut"),
    occasion: read("occasion"),
    sort: SORTS.includes(sort as Sort) ? (sort as Sort) : "featured",
  };
}

/** Serialises filters, leaving out anything that matches the page's defaults. */
export function filtersToQuery(filters: Filters, defaults: Partial<Filters>): string {
  const query = new URLSearchParams();
  for (const key of KEYS) {
    const value = filters[key];
    const fallback = defaults[key] ?? null;
    if (value === fallback) continue;
    query.set(key, value ?? ALL);
  }
  if (filters.sort !== "featured") query.set("sort", filters.sort);
  return query.toString();
}
