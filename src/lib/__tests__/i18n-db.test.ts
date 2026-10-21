import { describe, expect, it } from "vitest";
import { localized } from "../i18n-db";

describe("localized", () => {
  it("returns Japanese text for ja when present", () => {
    expect(localized("Ribeye", "リブロース", "ja")).toBe("リブロース");
  });
  it("falls back to English when the Japanese value is empty or missing", () => {
    expect(localized("Ribeye", "", "ja")).toBe("Ribeye");
    expect(localized("Ribeye", "   ", "ja")).toBe("Ribeye");
    expect(localized("Ribeye", null, "ja")).toBe("Ribeye");
  });
  it("returns English for en even when Japanese exists", () => {
    expect(localized("Ribeye", "リブロース", "en")).toBe("Ribeye");
  });
  it("returns an empty string when both are missing", () => {
    expect(localized(null, undefined, "en")).toBe("");
  });
});
