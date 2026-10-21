"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ProductCard, type CardProduct } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { filtersToQuery, parseFilters, type Filters, type Sort } from "./filters";

export type ShopProduct = CardProduct & { origin: "japan" | "australia"; categorySlugs: string[]; sortOrder: number };
type Option = { slug: string; name: string };
const ORIGIN_SLUGS: Record<string, "japan" | "australia"> = { "japanese-a5": "japan", "australian-wagyu": "australia" };
const QUERY_EVENT = "wm:query";

function subscribeToQuery(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(QUERY_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(QUERY_EVENT, onChange);
  };
}


export function ShopBrowser({
  products,
  origins,
  cuts,
  occasions,
  initial,
}: {
  products: ShopProduct[];
  origins: Option[];
  cuts: Option[];
  occasions: Option[];
  initial: Partial<Filters>;
}) {
  const t = useTranslations("shop");
  const [sheetOpen, setSheetOpen] = useState(false);
  // The query string is the source of truth, so filtered views can be shared and survive reloads.
  const search = useSyncExternalStore(subscribeToQuery, () => window.location.search, () => "");
  const filters = useMemo(() => parseFilters(search, initial), [search, initial]);

  const setFilters = (update: (current: Filters) => Filters) => {
    const qs = filtersToQuery(update(filters), initial);
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    window.dispatchEvent(new Event(QUERY_EVENT));
  };
  const visible = useMemo(() => {
    const list = products.filter((product) => {
      if (filters.origin && product.origin !== ORIGIN_SLUGS[filters.origin]) return false;
      if (filters.cut && !product.categorySlugs.includes(filters.cut)) return false;
      if (filters.occasion && !product.categorySlugs.includes(filters.occasion)) return false;
      return true;
    });
    const sorted = [...list];
    if (filters.sort === "price-asc") sorted.sort((a, b) => a.fromPricePKR - b.fromPricePKR);
    else if (filters.sort === "price-desc") sorted.sort((a, b) => b.fromPricePKR - a.fromPricePKR);
    else if (filters.sort === "bms") sorted.sort((a, b) => (b.bms ?? 0) - (a.bms ?? 0));
    else sorted.sort((a, b) => a.sortOrder - b.sortOrder);
    return sorted;
  }, [products, filters]);

  const hasFilters = Boolean(filters.origin || filters.cut || filters.occasion);
  const clear = () => setFilters((current) => ({ ...current, origin: null, cut: null, occasion: null }));
  const toggle = (key: "origin" | "cut" | "occasion", slug: string) =>
    setFilters((current) => ({ ...current, [key]: current[key] === slug ? null : slug }));

  const groups = [
    { key: "origin" as const, label: t("origin"), options: origins },
    { key: "cut" as const, label: t("cut"), options: cuts },
    { key: "occasion" as const, label: t("occasion"), options: occasions },
  ];

  const filterPanel = (
    <div className="space-y-7">
      {groups.map((group) => (
        <fieldset key={group.key}>
          <legend className="eyebrow mb-3">{group.label}</legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const active = filters[group.key] === option.slug;
              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => toggle(group.key, option.slug)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink/40 hover:text-ink",
                  )}
                >
                  {option.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      {hasFilters && (
        <button type="button" onClick={clear} className="text-sm text-wagyu underline underline-offset-4">
          {t("clear")}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">{filterPanel}</div>
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-ink-2" aria-live="polite">
            {t("results", { count: visible.length })}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm lg:hidden"
            >
              <Icon name="filter" size={16} />
              {t("filters")}
              {hasFilters && <span className="h-2 w-2 rounded-full bg-wagyu" />}
            </button>
            <label className="sr-only" htmlFor="shop-sort">
              {t("sort")}
            </label>
            <select
              id="shop-sort"
              value={filters.sort}
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as Sort }))}
              className="h-10 rounded-full border border-line bg-paper px-4 text-sm"
            >
              <option value="featured">{t("sortFeatured")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
              <option value="bms">{t("sortBms")}</option>
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-line py-20 text-center">
            <p className="text-ink-2">{t("empty")}</p>
            <button type="button" onClick={clear} className="mt-4 text-sm font-medium text-wagyu underline underline-offset-4">
              {t("clear")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 3} />
            ))}
          </div>
        )}
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("filters")}>
          <button type="button" className="absolute inset-0 bg-sumi/50" onClick={() => setSheetOpen(false)} aria-label={t("showResults", { count: visible.length })} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-fade-up overflow-y-auto rounded-t-[18px] bg-paper px-5 pb-6 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            {filterPanel}
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="mt-8 h-12 w-full rounded-full bg-ink text-paper"
            >
              {t("showResults", { count: visible.length })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
