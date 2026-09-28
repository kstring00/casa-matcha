"use client";
import Link from "next/link";
import type { RefObject } from "react";
import type { Location } from "@/content/locations";
import { money } from "@/lib/order-demo";
import { FlowDiagram } from "../FlowDiagram";
import { GoLive } from "../GoLive";

type Props = { headingRef: RefObject<HTMLHeadingElement | null>; count: number; total: number; location: Location; onStartOver: () => void };

export function CheckoutStep({ headingRef, count, total, location, onStartOver }: Props) {
  return (
    <section aria-labelledby="order-h1">
      <p className="eyebrow text-matcha-deep">Checkout</p>
      <h1 id="order-h1" ref={headingRef} tabIndex={-1} className="font-display mt-3 text-[clamp(34px,8.5vw,56px)] leading-[0.95] font-black tracking-[-0.03em] outline-none md:text-[clamp(48px,4.6vw,72px)]">
        This is where Clover takes over.
      </h1>
      <p className="mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed text-ink/85">
        Payment, the order ticket, and the barista&apos;s printer all run through your existing Clover system. <strong className="text-ink">Nothing on this site touches cards.</strong>
      </p>

      <div className="mt-8">
        <FlowDiagram />
      </div>

      <p className="mt-8 rounded-3xl bg-foam p-5 text-[1rem] leading-relaxed md:p-6">
        <strong>Demo order:</strong> {count} {count === 1 ? "item" : "items"} for pickup at {location.name}, {money(total)} including tax and tip. Nothing was charged.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-outline">
          Back to the site
        </Link>
        <button type="button" onClick={onStartOver} className="btn btn-primary">
          Start over
        </button>
      </div>

      <div className="mt-12">
        <GoLive />
      </div>
    </section>
  );
}
