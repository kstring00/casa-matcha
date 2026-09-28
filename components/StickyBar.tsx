"use client";
import { usePathname } from "next/navigation";
import { directionsUrl, getLocation, locations } from "@/content/locations";
import { useSelectedLocation } from "@/lib/location-store";
import { OrderCta } from "@/components/order/OrderCta";

/**
 * Mobile-only bottom bar: Order (filled) · Directions · Call for the selected
 * location, plus the toggle chip. Hidden on /order, which has its own bar.
 */
export function StickyBar() {
  const pathname = usePathname();
  const [id, setId] = useSelectedLocation();
  if (pathname?.startsWith("/order")) return null;
  const loc = getLocation(id);
  const other = locations.find((l) => l.id !== id) ?? loc;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:hidden" role="region" aria-label="Quick actions">
      <div className="sticky-bar flex items-center gap-1.5 rounded-2xl border border-cream/10 bg-ink/90 p-1.5 text-cream shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setId(other.id)}
          className="flex h-11 shrink-0 items-center gap-1 rounded-xl bg-cream/10 px-2.5 text-[0.72rem] font-bold tracking-wide"
          aria-label={`Showing ${loc.short}. Switch to ${other.short}`}
        >
          {loc.short}
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 opacity-70" aria-hidden="true">
            <path d="M3 5h8.5L9.5 3M13 11H4.5l2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <OrderCta location={id} className="btn btn-primary h-11 !min-h-0 flex-1 !px-3 text-[0.88rem]">
          Order
        </OrderCta>
        <a
          href={directionsUrl(loc)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline h-11 !min-h-0 shrink-0 !px-3 text-[0.85rem] text-cream"
          aria-label={`Directions to Casa Matcha ${loc.name}`}
        >
          Directions
        </a>
        <a href={`tel:${loc.phone}`} className="btn btn-outline h-11 !min-h-0 shrink-0 !px-3 text-[0.85rem] text-cream" aria-label={`Call ${loc.short} · ${loc.phoneDisplay}`}>
          <svg viewBox="0 0 20 20" className="bar-call-icon h-4 w-4" aria-hidden="true">
            <path d="M6.6 3.2l2 3.1-1.5 1.6a11 11 0 004.9 4.9l1.6-1.5 3.1 2-1 2.5c-6.3.6-12-5.1-11.6-11.6z" fill="currentColor" />
          </svg>
          <span className="bar-call-text">Call</span>
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        Quick actions now point to {loc.name}.
      </p>
    </div>
  );
}
