import type { DayKey, WeekHours } from "@/content/locations";

export const TZ = "America/Chicago";
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** Current weekday + minutes-since-midnight in Central time, wherever the visitor is. */
export function nowInChicago(date: Date = new Date()): { day: DayKey; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  const day = Math.max(0, DAY_SHORT.indexOf(get("weekday") as (typeof DAY_SHORT)[number])) as DayKey;
  const hour = (parseInt(get("hour"), 10) || 0) % 24;
  const minute = parseInt(get("minute"), 10) || 0;
  return { day, minutes: hour * 60 + minute };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** "18:00" → "6:00 pm"; compact → "6pm" (or "2:30pm" when minutes matter). */
export function fmtTime(hhmm: string, compact = false): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  if (compact) return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
  return `${h12}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

export type OpenStatus = {
  isOpen: boolean;
  closingSoon: boolean;
  /** Pill text: "Open · closes 6:00 pm" / "Closed · opens 8:00 am" / "Opens Mon 8:00 am" */
  label: string;
  /** Toast text: "Webster is open until 6pm" / "We open tomorrow at 8am" */
  sentence: string;
};

export function getStatus(hours: WeekHours, name: string, date: Date = new Date()): OpenStatus {
  const { day, minutes } = nowInChicago(date);
  const today = hours[day];
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    const closingSoon = toMin(today.close) - minutes <= 30;
    return {
      isOpen: true,
      closingSoon,
      label: closingSoon ? `Closing soon · ${fmtTime(today.close)}` : `Open · closes ${fmtTime(today.close)}`,
      sentence: `${name} is open until ${fmtTime(today.close, true)}`,
    };
  }
  for (let offset = 0; offset < 8; offset++) {
    const d = ((day + offset) % 7) as DayKey;
    const h = hours[d];
    if (!h) continue;
    if (offset === 0 && minutes >= toMin(h.open)) continue; // today's already over
    const time = fmtTime(h.open);
    const compact = fmtTime(h.open, true);
    if (offset === 0) return { isOpen: false, closingSoon: false, label: `Closed · opens ${time}`, sentence: `We open today at ${compact}` };
    if (offset === 1) return { isOpen: false, closingSoon: false, label: `Closed · opens ${time}`, sentence: `We open tomorrow at ${compact}` };
    return { isOpen: false, closingSoon: false, label: `Opens ${DAY_SHORT[d]} ${time}`, sentence: `We open ${DAY_SHORT[d]} at ${compact}` };
  }
  return { isOpen: false, closingSoon: false, label: "Closed", sentence: `${name} is closed` };
}

/** Rows for the hours table, merging identical consecutive days ("Mon – Tue"). */
export function hoursRows(hours: WeekHours): { days: string; time: string; today: boolean }[] {
  const order: DayKey[] = [1, 2, 3, 4, 5, 6, 0];
  const { day: todayKey } = nowInChicago();
  const rows: { start: DayKey; end: DayKey; time: string; today: boolean }[] = [];
  for (const d of order) {
    const h = hours[d];
    const time = h ? `${fmtTime(h.open, true)} – ${fmtTime(h.close, true)}` : "Closed";
    const last = rows[rows.length - 1];
    if (last && last.time === time) {
      last.end = d;
      last.today = last.today || d === todayKey;
    } else rows.push({ start: d, end: d, time, today: d === todayKey });
  }
  return rows.map((r) => ({
    days: r.start === r.end ? DAY_SHORT[r.start] : `${DAY_SHORT[r.start]} – ${DAY_SHORT[r.end]}`,
    time: r.time,
    today: r.today,
  }));
}

/** schema.org OpeningHoursSpecification, grouped by identical hours. */
export function openingHoursSpec(hours: WeekHours) {
  const groups = new Map<string, DayKey[]>();
  (Object.keys(hours) as unknown as DayKey[]).forEach((k) => {
    const d = Number(k) as DayKey;
    const h = hours[d];
    if (!h) return;
    const key = `${h.open}-${h.close}`;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  });
  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.map((d) => DAY_LONG[d]),
      opens,
      closes,
    };
  });
}

/** Calendar-day difference between now and an ISO date, in Central time. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const toUtcMidnight = (d: Date) => Date.UTC(...(fmt.format(d).split("-").map(Number) as [number, number, number]).map((v, i) => (i === 1 ? v - 1 : v)) as [number, number, number]);
  return Math.round((toUtcMidnight(new Date(iso)) - toUtcMidnight(now)) / 86400000);
}

/** "tonight" / "tomorrow" / "this Friday" / "Fri, Oct 2". */
export function relativeDayLabel(iso: string, now: Date = new Date()): string {
  const days = daysUntil(iso, now);
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long" }).format(new Date(iso));
  if (days === 0) return "tonight";
  if (days === 1) return "tomorrow";
  if (days > 1 && days < 7) return `this ${weekday}`;
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric" }).format(new Date(iso));
}

export function formatEventDate(iso: string) {
  const d = new Date(iso);
  return {
    weekday: new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long" }).format(d),
    month: new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short" }).format(d),
    day: new Intl.DateTimeFormat("en-US", { timeZone: TZ, day: "numeric" }).format(d),
    time: new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(d).replace(":00", "").toLowerCase(),
    year: new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric" }).format(d),
  };
}
