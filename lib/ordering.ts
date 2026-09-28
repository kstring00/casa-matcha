"use client";
/**
 * Where an Order button goes: the demo flow at /order until a location's
 * Clover Online Ordering link is filled in, then straight to Clover.
 */
import type { LocationId } from "@/content/locations";
import { ordering } from "@/content/ordering";

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

export function cloverUrl(location?: LocationId | null): string | null {
  return location ? ordering.clover[location] : null;
}

export function orderHref(location?: LocationId | null, item?: string | null): string {
  const live = cloverUrl(location);
  if (live) return live;
  const q = new URLSearchParams();
  if (location) q.set("location", location);
  if (item) q.set("item", item);
  const s = q.toString();
  return s ? `${ordering.demoPath}?${s}` : ordering.demoPath;
}

/** Microsoft Clarity custom event on every order click (no-op until Clarity is configured). */
export function trackOrderClick(location?: LocationId | null) {
  try {
    window.clarity?.("event", `order_click_${location ?? "any"}`);
  } catch {
    /* analytics must never break the click */
  }
}
