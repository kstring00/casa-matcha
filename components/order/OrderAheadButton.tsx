"use client";
import type { ReactNode } from "react";
import type { LocationId } from "@/content/locations";
import { anyOrdering, orderAhead, orderOptions, hasOrdering } from "@/lib/ordering";

type Props = {
  className?: string;
  children: ReactNode;
  /** Target a specific location (sticky bar). Omit to use "open now, else Webster". */
  location?: LocationId;
  "data-cursor"?: string;
};

/**
 * "Order ahead" entry point. With one option for the target location it goes
 * straight to that provider; with several it opens the chooser sheet. Renders
 * nothing when there is nothing to order from.
 */
export function OrderAheadButton({ className, children, location, ...rest }: Props) {
  if (location ? !hasOrdering(location) : !anyOrdering()) return null;
  const single = location ? orderOptions(location).length === 1 : false;
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => orderAhead(e.currentTarget, location)}
      aria-haspopup={single ? undefined : "dialog"}
      {...rest}
    >
      {children}
    </button>
  );
}
