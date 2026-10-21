import { describe, expect, it } from "vitest";
import { checkDeliverySelection, nextDeliveryDates, toDateKey } from "../delivery";

// Delivery days use 0=Sun … 6=Sat. Times are Pakistan local (UTC+5, no DST).
const tueThuSat = { deliveryDays: [2, 4, 6], leadTimeHours: 24 };

describe("nextDeliveryDates", () => {
  it("skips a delivery day that falls inside the lead time", () => {
    // Thursday 2026-10-22 18:00 PKT
    const now = new Date("2026-10-22T18:00:00+05:00");
    const dates = nextDeliveryDates(now, tueThuSat, 3).map(toDateKey);
    expect(dates).toEqual(["2026-10-24", "2026-10-27", "2026-10-29"]);
  });

  it("allows today when the lead time still fits before end of day", () => {
    const now = new Date("2026-10-22T08:00:00+05:00");
    const dates = nextDeliveryDates(now, { deliveryDays: [2, 4, 6], leadTimeHours: 6 }, 2).map(toDateKey);
    expect(dates).toEqual(["2026-10-22", "2026-10-24"]);
  });

  it("returns an empty list when the city has no delivery days", () => {
    expect(nextDeliveryDates(new Date(), { deliveryDays: [], leadTimeHours: 24 })).toEqual([]);
  });

  it("returns six dates by default", () => {
    const now = new Date("2026-10-22T08:00:00+05:00");
    expect(nextDeliveryDates(now, tueThuSat)).toHaveLength(6);
  });
});

describe("checkDeliverySelection", () => {
  const city = { deliveryDays: [2, 4, 6], leadTimeHours: 24, slots: ["12–4 pm", "4–8 pm"] };
  const now = new Date("2026-10-22T18:00:00+05:00"); // Thursday evening

  it("accepts an offered date and slot, returning the slot label", () => {
    expect(checkDeliverySelection(now, city, "2026-10-24", 1)).toEqual({ ok: true, slot: "4–8 pm" });
  });

  it("rejects a date inside the lead time", () => {
    expect(checkDeliverySelection(now, city, "2026-10-22", 0)).toEqual({ ok: false, error: "date" });
  });

  it("rejects a non-delivery weekday", () => {
    expect(checkDeliverySelection(now, city, "2026-10-25", 0)).toEqual({ ok: false, error: "date" });
  });

  it("rejects an unknown slot", () => {
    expect(checkDeliverySelection(now, city, "2026-10-24", 5)).toEqual({ ok: false, error: "slot" });
  });
});
