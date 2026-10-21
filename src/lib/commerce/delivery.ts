// Pakistan Standard Time is UTC+5 with no daylight saving, so a fixed offset is exact.
const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type DeliverySchedule = {
  /** 0 = Sunday … 6 = Saturday */
  deliveryDays: number[];
  leadTimeHours: number;
};

/** Midnight in Pakistan for the calendar day containing `date`. */
function pktMidnight(date: Date): Date {
  const shifted = new Date(date.getTime() + PKT_OFFSET_MS);
  const utcMidnight = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
  return new Date(utcMidnight - PKT_OFFSET_MS);
}

function pktWeekday(date: Date): number {
  return new Date(date.getTime() + PKT_OFFSET_MS).getUTCDay();
}

/** "YYYY-MM-DD" for the Pakistan calendar day of `date`. */
export function toDateKey(date: Date): string {
  return new Date(date.getTime() + PKT_OFFSET_MS).toISOString().slice(0, 10);
}

/** Pakistan midnight for a "YYYY-MM-DD" key. */
export function fromDateKey(key: string): Date {
  return new Date(Date.parse(`${key}T00:00:00Z`) - PKT_OFFSET_MS);
}

/**
 * The next `count` delivery days. A day qualifies when the earliest possible
 * dispatch (now + lead time) is before that day ends in Pakistan.
 */
export function nextDeliveryDates(now: Date, schedule: DeliverySchedule, count = 6): Date[] {
  if (schedule.deliveryDays.length === 0) return [];
  const earliest = now.getTime() + schedule.leadTimeHours * 60 * 60 * 1000;
  const dates: Date[] = [];
  let day = pktMidnight(now);
  // Bounded scan: a schedule with at least one weekday fills `count` within count weeks.
  for (let i = 0; i < count * 7 + 7 && dates.length < count; i++) {
    const endOfDay = day.getTime() + DAY_MS;
    if (endOfDay > earliest && schedule.deliveryDays.includes(pktWeekday(day))) {
      dates.push(day);
    }
    day = new Date(day.getTime() + DAY_MS);
  }
  return dates;
}

export type DeliverySelection = { ok: true; slot: string } | { ok: false; error: "date" | "slot" };

/** Server-side check that a chosen date and slot are among those currently offered. */
export function checkDeliverySelection(
  now: Date,
  city: DeliverySchedule & { slots: string[] },
  dateKey: string,
  slotIndex: number,
): DeliverySelection {
  const offered = nextDeliveryDates(now, city).map(toDateKey);
  if (!offered.includes(dateKey)) return { ok: false, error: "date" };
  const slot = Number.isInteger(slotIndex) ? city.slots[slotIndex] : undefined;
  if (!slot) return { ok: false, error: "slot" };
  return { ok: true, slot };
}
