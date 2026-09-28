/**
 * Online ordering. The site runs a demo pickup flow at /order until Clover
 * Online Ordering is switched on. When the owner sends a location's Clover
 * ordering link, put it in `clover` below and every Order button for that
 * location goes straight to Clover instead of the demo.
 */
import type { LocationId } from "./locations";

export const ordering = {
  demoPath: "/order",
  /** Clover Online Ordering links per location. null = not live yet (demo flow). */
  clover: {
    webster: null,
    friendswood: null,
  } as Record<LocationId, string | null>,
  /** Sales tax applied in the demo cart. */
  taxRate: 0.0825,
  pickupFeeCents: 0,
  tipPercents: [0, 10, 15, 20] as const,
  asapMinutes: 10,
  finePrint: "Payment happens in Clover, not on this site.",
} as const;
