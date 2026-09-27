"use client";
/**
 * Everything the order buttons share: which options a location has, which
 * location to default to, click tracking, the "Opening …" toast, and the
 * order-sheet store.
 */
import { useSyncExternalStore } from "react";
import { locations, defaultLocationId, getLocation, type LocationId } from "@/content/locations";
import { ordering, providers, providerFor, joeSupportsScheduledOrders, type OrderKind, type OrderProvider } from "@/content/ordering";
import { getStatus } from "./hours";
import { toasts } from "./toasts";

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

export type OrderOption = { kind: OrderKind; provider: OrderProvider; url: string; location: LocationId };

/** Non-null options for a location, pickup first. */
export function orderOptions(id: LocationId): OrderOption[] {
  const links = ordering[id];
  const out: OrderOption[] = [];
  (["pickup", "delivery"] as const).forEach((kind) => {
    const url = links[kind];
    if (url) out.push({ kind, provider: providerFor[kind], url, location: id });
  });
  return out;
}

export const hasOrdering = (id: LocationId) => orderOptions(id).length > 0;
export const orderUrl = (id: LocationId, kind: OrderKind) => ordering[id][kind];

/** Locations that have at least one order link, default location first. */
export function orderingLocations(): LocationId[] {
  const ids = locations.map((l) => l.id);
  return [defaultLocationId, ...ids.filter((i) => i !== defaultLocationId)].filter(hasOrdering);
}

export const anyOrdering = () => orderingLocations().length > 0;

/** Sheet default: whichever ordering location is open right now, else Webster (the default), else the first with links. */
export function pickDefaultOrderLocation(): LocationId | null {
  const candidates = orderingLocations();
  if (!candidates.length) return null;
  const open = candidates.find((id) => {
    const l = getLocation(id);
    return getStatus(l.hours, l.short).isOpen;
  });
  return open ?? (candidates.includes(defaultLocationId) ? defaultLocationId : candidates[0]);
}

/** First location that has a pickup link, preferring `prefer`. Used by "Order this →" in the Drop. */
export function pickupLocation(prefer?: LocationId): LocationId | null {
  if (prefer && orderUrl(prefer, "pickup")) return prefer;
  return orderingLocations().find((id) => !!orderUrl(id, "pickup")) ?? null;
}

/** Button label for the pickup option given the live status. */
export function pickupLabel(isOpen: boolean) {
  return !isOpen && joeSupportsScheduledOrders ? "Order for later" : "Order pickup";
}

export function providerName(p: OrderProvider) {
  return providers[p].name;
}

/** Microsoft Clarity custom event + the short "Opening …" toast. Call on every order click. */
export function trackOrderClick(provider: OrderProvider, location: LocationId) {
  try {
    window.clarity?.("event", `order_click_${provider}_${location}`);
  } catch {
    /* analytics must never break the click */
  }
  toasts.opening(providerName(provider));
}

/** Open an order URL in a new tab from a click handler (popup-blocker safe) with tracking. */
export function goToOrder(opt: OrderOption) {
  trackOrderClick(opt.provider, opt.location);
  window.open(opt.url, "_blank", "noopener,noreferrer");
}

/* ---------- order sheet store ---------- */
type SheetState = { open: boolean; location: LocationId | null; opener: HTMLElement | null };
let sheet: SheetState = { open: false, location: null, opener: null };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export const orderSheet = {
  get: () => sheet,
  subscribe(cb: () => void) {
    subs.add(cb);
    return () => {
      subs.delete(cb);
    };
  },
  open(opts: { opener?: HTMLElement | null; location?: LocationId | null } = {}) {
    sheet = { open: true, location: opts.location ?? pickDefaultOrderLocation(), opener: opts.opener ?? null };
    emit();
  },
  setLocation(location: LocationId) {
    sheet = { ...sheet, location };
    emit();
  },
  close() {
    if (!sheet.open) return;
    sheet = { ...sheet, open: false };
    emit();
  },
};

const serverSheet: SheetState = { open: false, location: null, opener: null };
export const useOrderSheet = () => useSyncExternalStore(orderSheet.subscribe, orderSheet.get, () => serverSheet);

/**
 * "Order ahead" behaviour shared by the hero, sticky bar and footer:
 * one option → go straight there; several → open the chooser.
 */
export function orderAhead(opener: HTMLElement | null, location?: LocationId | null) {
  const loc = location ?? pickDefaultOrderLocation();
  if (!loc) return;
  const opts = orderOptions(loc);
  if (opts.length === 1) goToOrder(opts[0]);
  else if (opts.length > 1) orderSheet.open({ opener, location: loc });
}
