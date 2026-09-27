"use client";
import { orderAhead, orderOptions, pickDefaultOrderLocation, orderingLocations, trackOrderClick } from "@/lib/ordering";

/**
 * Footer "Order online": a real link to the primary provider (works without JS);
 * with JS it opens the chooser when the location has more than one option.
 */
export function OrderOnlineLink({ className = "" }: { className?: string }) {
  const locs = orderingLocations();
  if (!locs.length) return null;
  const fallback = orderOptions(locs[0])[0];
  return (
    <a
      href={fallback.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        const loc = pickDefaultOrderLocation();
        if (loc && orderOptions(loc).length > 1) {
          e.preventDefault();
          orderAhead(e.currentTarget, loc);
        } else {
          trackOrderClick(fallback.provider, fallback.location);
        }
      }}
    >
      Order online
    </a>
  );
}
