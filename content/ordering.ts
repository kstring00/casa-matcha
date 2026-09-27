/**
 * Online ordering links, keyed by location. Casa Matcha takes orders through
 * two services; the site only links to them.
 *
 *   pickup   → joe coffee (primary: lower fees for the shop, has loyalty)
 *   delivery → DoorDash (secondary)
 *
 * A null link hides that button for that location everywhere on the site.
 * VERIFY WITH OWNER: confirm which location each listing belongs to and
 * whether Friendswood has its own (see PLACEHOLDERS.md).
 */
import type { LocationId } from "./locations";

export type OrderKind = "pickup" | "delivery";
export type OrderProvider = "joe" | "doordash";

export type OrderingLinks = { pickup: string | null; delivery: string | null };

export const ordering: Record<LocationId, OrderingLinks> = {
  webster: {
    pickup: "https://joe.coffee/locations/tx/houston/casa-matcha-houston/",
    delivery: "https://www.doordash.com/store/casa-matcha-houston-35488877/",
  },
  friendswood: {
    pickup: null,
    delivery: null,
  },
};

export const providers: Record<OrderProvider, { name: string; kind: OrderKind; blurb: string }> = {
  joe: { name: "joe coffee", kind: "pickup", blurb: "Order ahead, skip the line. Earn loyalty points." },
  doordash: { name: "DoorDash", kind: "delivery", blurb: "Delivered to your door." },
};

export const providerFor: Record<OrderKind, OrderProvider> = { pickup: "joe", delivery: "doordash" };

/**
 * joe coffee lets guests schedule a pickup time, so when the shop is closed the
 * pickup button reads "Order for later". Set to false if the owner turns
 * scheduling off. VERIFY WITH OWNER.
 */
export const joeSupportsScheduledOrders = true;

export const orderingFinePrint = "Ordering is handled by joe coffee and DoorDash.";
