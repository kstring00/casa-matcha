"use client";
import { directionsUrl, getLocation, locations } from "@/content/locations";
import { useSelectedLocation } from "@/lib/location-store";

/** Mobile-only bottom bar: Directions + Call for the selected location, with a toggle chip. */
export function StickyBar() {
  const [id, setId] = useSelectedLocation();
  const loc = getLocation(id);
  const other = locations.find((l) => l.id !== id) ?? loc;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:hidden" role="region" aria-label="Quick actions">
      <div className="flex items-center gap-2 rounded-2xl border border-cream/10 bg-ink/90 p-2 text-cream shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setId(other.id)}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-cream/10 px-3 text-[0.78rem] font-semibold"
          aria-label={`Showing ${loc.short}. Switch to ${other.short}`}
        >
          <span className="live-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
          {loc.short}
          <span aria-hidden="true" className="opacity-60">
            ⇄
          </span>
        </button>
        <a
          href={directionsUrl(loc)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary h-11 !min-h-0 flex-1 !px-3 text-[0.88rem]"
        >
          Directions
        </a>
        <a href={`tel:${loc.phone}`} className="btn btn-cream h-11 !min-h-0 flex-1 !px-3 text-[0.88rem]">
          Call
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        Quick actions now point to {loc.name}.
      </p>
    </div>
  );
}
