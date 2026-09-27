"use client";
import type { ReactNode, MouseEvent } from "react";
import type { LocationId } from "@/content/locations";
import { providerFor, type OrderKind } from "@/content/ordering";
import { orderUrl, trackOrderClick } from "@/lib/ordering";

type Props = {
  location: LocationId;
  kind: OrderKind;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "data-cursor"?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  autoFocus?: boolean;
};

/** A real link to one provider for one location. Renders nothing when that link is null. */
export function OrderLink({ location, kind, className, children, onClick, ...rest }: Props) {
  const url = orderUrl(location, kind);
  if (!url) return null;
  const provider = providerFor[kind];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        trackOrderClick(provider, location);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
