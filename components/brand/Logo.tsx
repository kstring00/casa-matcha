import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  /** "badge" = full circular badge with arched text; "mark" = astronaut only (uses currentColor). */
  variant?: "badge" | "mark";
  title?: string;
};

/** Astronaut mark, inline so it can take currentColor and stay crisp at any size. */
export function Logo({ variant = "mark", title, className, ...rest }: Props) {
  if (variant === "badge") {
    return (
      <svg viewBox="0 0 200 200" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...rest}>
        {title && <title>{title}</title>}
        <defs>
          <path id="cm-arc-top" d="M 30 100 A 70 70 0 0 1 170 100" />
          <path id="cm-arc-bottom" d="M 36 118 A 66 66 0 0 0 164 118" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--foam)" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fontFamily="var(--font-bricolage), Arial Black, sans-serif" fontWeight="800" fontSize="15" letterSpacing="2.5" fill="currentColor">
          <textPath href="#cm-arc-top" startOffset="50%" textAnchor="middle">
            CASA MATCHA
          </textPath>
        </text>
        <text fontFamily="var(--font-bricolage), Arial Black, sans-serif" fontWeight="800" fontSize="13" letterSpacing="3" fill="currentColor">
          <textPath href="#cm-arc-bottom" startOffset="50%" textAnchor="middle">
            AND COFFEE
          </textPath>
        </text>
        <g transform="translate(100 100) scale(0.62) translate(-100 -100)">
          <Astronaut />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="40 40 120 120" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...rest}>
      {title && <title>{title}</title>}
      <Astronaut />
    </svg>
  );
}

function Astronaut() {
  return (
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <g fill="currentColor" stroke="none">
        <path d="M58 82l1.8 4.8 4.8 1.8-4.8 1.8L58 95l-1.8-4.8-4.8-1.8 4.8-1.8z" />
        <path d="M140 70l1.3 3.5 3.5 1.3-3.5 1.3-1.3 3.5-1.3-3.5-3.5-1.3 3.5-1.3z" />
        <path d="M136 126l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1z" />
        <circle cx="66" cy="124" r="1.8" />
      </g>
      <path d="M56 140c10-10 26-14 44-14s34 4 44 14c-8 10-24 16-44 16s-36-6-44-16z" />
      <g fill="currentColor" stroke="none">
        <circle cx="78" cy="138" r="2.6" />
        <circle cx="114" cy="142" r="2.2" />
        <circle cx="97" cy="133" r="1.8" />
      </g>
      <path d="M86 122c-2 6-1 10 3 12M110 122c3 6 3 10-1 12" />
      <rect x="83" y="92" width="32" height="32" rx="10" />
      <path d="M90 99h18" />
      <path d="M113 100c8-4 13-11 14-20" />
      <path d="M84 103c-6 3-9 8-8 14" />
      <circle cx="99" cy="76" r="16" />
      <path d="M88 74c2-7 7-9 11-9s10 3 11 10c-3 3-7 5-11 5s-8-2-11-6z" fill="currentColor" />
      <path d="M94 70c2-1.6 4-2.2 6-2.2" stroke="var(--foam)" strokeWidth="1.6" />
      <path d="M123 70h12l-1.6 13h-8.8z" />
      <path d="M122 70h14" />
      <path d="M131 66c0-2 1-3 1-5" strokeWidth="2.2" />
    </g>
  );
}
