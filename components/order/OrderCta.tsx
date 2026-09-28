"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LocationId } from "@/content/locations";
import { cloverUrl, orderHref, trackOrderClick } from "@/lib/ordering";

type Props = {
  className?: string;
  children: ReactNode;
  location?: LocationId | null;
  /** Pre-highlight a menu item in the demo (drop items). */
  item?: string;
  "data-cursor"?: string;
  "aria-label"?: string;
};

/** Every Order button on the site: the /order demo now, the location's Clover link once it is live. */
export function OrderCta({ className, children, location, item, ...rest }: Props) {
  const href = orderHref(location, item);
  const onClick = () => trackOrderClick(location);
  if (cloverUrl(location)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
