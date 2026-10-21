import { describe, expect, it } from "vitest";
import { filtersToQuery, parseFilters } from "../filters";

describe("shop filters in the URL", () => {
  const onJapanPage = { origin: "japanese-a5" };

  it("uses the page's own filter when the URL says nothing", () => {
    expect(parseFilters("", onJapanPage)).toEqual({ origin: "japanese-a5", cut: null, occasion: null, sort: "featured" });
  });

  it("lets a shopper clear the page's own filter", () => {
    const cleared = { origin: null, cut: null, occasion: null, sort: "featured" as const };
    const query = filtersToQuery(cleared, onJapanPage);
    expect(query).toBe("origin=all");
    expect(parseFilters(`?${query}`, onJapanPage)).toEqual(cleared);
  });

  it("omits values that match the page defaults", () => {
    expect(filtersToQuery({ origin: "japanese-a5", cut: "ribeye", occasion: null, sort: "featured" }, onJapanPage)).toBe("cut=ribeye");
  });

  it("ignores unknown sort values", () => {
    expect(parseFilters("?sort=cheapest", {}).sort).toBe("featured");
  });
});
