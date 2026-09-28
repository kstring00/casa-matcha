/**
 * Demo order state and money math. All in cents, all in memory. Nothing here
 * touches a network or storage.
 */
import type { LocationId } from "@/content/locations";
import { demoItem, type Choice, type DemoItem } from "@/content/order-menu";
import { ordering } from "@/content/ordering";
import { getLocation } from "@/content/locations";
import { nowInChicago, fmtTime, DAY_SHORT } from "./hours";
import type { DayKey } from "@/content/locations";

export type Step = 1 | 2 | 3 | 4;
export type TipPercent = (typeof ordering.tipPercents)[number];
export type Pickup = { mode: "asap" } | { mode: "schedule"; slot: string | null };

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  detail: string; // "16 oz · Oat"
  unitCents: number;
  qty: number;
};

export type OrderState = {
  step: Step;
  location: LocationId | null;
  lines: CartLine[];
  tip: TipPercent;
  pickup: Pickup;
};

export const initialState: OrderState = { step: 1, location: null, lines: [], tip: 15, pickup: { mode: "asap" } };

export type Action =
  | { type: "location"; id: LocationId; goToMenu?: boolean }
  | { type: "step"; step: Step }
  | { type: "add"; item: DemoItem; size?: Choice; milk?: Choice }
  | { type: "inc"; key: string }
  | { type: "dec"; key: string }
  | { type: "remove"; key: string }
  | { type: "tip"; tip: TipPercent }
  | { type: "pickup"; pickup: Pickup }
  | { type: "reset" };

export function unitPrice(item: DemoItem, size?: Choice, milk?: Choice) {
  return item.baseCents + (size?.deltaCents ?? 0) + (milk?.deltaCents ?? 0);
}

export function reducer(state: OrderState, a: Action): OrderState {
  switch (a.type) {
    case "location":
      return { ...state, location: a.id, step: a.goToMenu === false ? state.step : 2 };
    case "step":
      return { ...state, step: a.step };
    case "add": {
      const key = [a.item.id, a.size?.id ?? "-", a.milk?.id ?? "-"].join(":");
      const existing = state.lines.find((l) => l.key === key);
      if (existing) return { ...state, lines: state.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) };
      const detail = [a.size?.label, a.milk?.label].filter(Boolean).join(" · ");
      return {
        ...state,
        lines: [...state.lines, { key, itemId: a.item.id, name: a.item.name, detail, unitCents: unitPrice(a.item, a.size, a.milk), qty: 1 }],
      };
    }
    case "inc":
      return { ...state, lines: state.lines.map((l) => (l.key === a.key ? { ...l, qty: l.qty + 1 } : l)) };
    case "dec":
      return { ...state, lines: state.lines.map((l) => (l.key === a.key ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0) };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== a.key) };
    case "tip":
      return { ...state, tip: a.tip };
    case "pickup":
      return { ...state, pickup: a.pickup };
    case "reset":
      return initialState;
  }
}

export type Totals = { count: number; subtotal: number; tax: number; fee: number; tip: number; total: number };

export function totals(state: OrderState): Totals {
  const subtotal = state.lines.reduce((s, l) => s + l.unitCents * l.qty, 0);
  const tax = Math.round(subtotal * ordering.taxRate);
  const fee = ordering.pickupFeeCents;
  const tip = Math.round((subtotal * state.tip) / 100);
  return { count: state.lines.reduce((s, l) => s + l.qty, 0), subtotal, tax, fee, tip, total: subtotal + tax + fee + tip };
}

export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const itemFor = (line: CartLine) => demoItem(line.itemId);

/** Pickup slots in 15-minute steps within opening hours: the next ~2 hours today, else the next open morning. */
export function scheduleSlots(location: LocationId, count = 8): { value: string; label: string }[] {
  const loc = getLocation(location);
  const { day, minutes } = nowInChicago();
  const slots: { value: string; label: string }[] = [];
  const push = (dayLabel: string, dKey: DayKey, m: number) => {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push({ value: `${dKey}-${hh}:${mm}`, label: `${dayLabel} ${fmtTime(`${hh}:${mm}`)}` });
  };
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  for (let offset = 0; offset < 8 && slots.length < count; offset++) {
    const d = ((day + offset) % 7) as DayKey;
    const h = loc.hours[d];
    if (!h) continue;
    const open = toMin(h.open);
    const close = toMin(h.close);
    let start = offset === 0 ? Math.max(open, Math.ceil((minutes + 20) / 15) * 15) : open;
    if (start >= close - 15) continue;
    const label = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : DAY_SHORT[d];
    for (let m = start; m <= close - 15 && slots.length < count; m += 15) push(label, d, m);
    start = 0;
  }
  return slots;
}

export const slotLabel = (location: LocationId, value: string) => scheduleSlots(location, 64).find((s) => s.value === value)?.label ?? "Scheduled";
