"use client";
import { useRef, type RefObject } from "react";
import { locations, fullAddress, type LocationId } from "@/content/locations";
import { StatusPill } from "@/components/sections/StatusPill";
import { GoLive } from "../GoLive";

type Props = { headingRef: RefObject<HTMLHeadingElement | null>; onChoose: (id: LocationId) => void };

export function LocationStep({ headingRef, onChoose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <section aria-labelledby="order-h1">
      <p className="eyebrow text-matcha-deep">Order ahead</p>
      <h1 id="order-h1" ref={headingRef} tabIndex={-1} className="font-display mt-3 text-[clamp(36px,9vw,56px)] leading-[0.95] font-black tracking-[-0.03em] outline-none md:text-[clamp(48px,4.6vw,72px)]">
        Which Casa Matcha?
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
        {locations.map((l) => (
          <article key={l.id} className="order-card flex flex-col gap-3 rounded-3xl bg-foam p-5 md:p-6" aria-labelledby={`loc-${l.id}`}>
            <div className="flex items-start justify-between gap-3">
              <h2 id={`loc-${l.id}`} className="font-display text-[1.7rem] leading-none font-black tracking-tight md:text-[2rem]">
                {l.name}
              </h2>
              <StatusPill hours={l.hours} name={l.short} className="!min-w-0" />
            </div>
            <p className="text-[0.95rem] leading-snug text-ink/75">{fullAddress(l)}</p>
            <a href={`tel:${l.phone}`} className="inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-ink underline-offset-4 hover:underline" aria-label={`Call ${l.short} · ${l.phoneDisplay}`}>
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-matcha-deep" aria-hidden="true">
                <path d="M6.6 3.2l2 3.1-1.5 1.6a11 11 0 004.9 4.9l1.6-1.5 3.1 2-1 2.5c-6.3.6-12-5.1-11.6-11.6z" fill="currentColor" />
              </svg>
              {l.short} · {l.phoneDisplay}
            </a>
            <button type="button" onClick={() => onChoose(l.id)} className="btn btn-primary mt-auto w-full">
              Order from {l.short} <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
          </article>
        ))}
        <div className="order-card order-card--off flex flex-col justify-center gap-1 rounded-3xl border border-dashed border-ink/25 p-5 text-ink/60 md:col-span-2 md:flex-row md:items-center md:justify-between md:p-6" aria-disabled="true">
          <p className="font-display text-[1.2rem] font-bold text-ink/70">Delivery</p>
          <p className="text-[0.95rem]">Delivery: available whenever you turn it on.</p>
        </div>
      </div>

      <p className="mt-6 text-[1rem] font-medium text-ink/80">Pickup is ready when you walk in. No fee.</p>

      <button type="button" onClick={() => dialog.current?.showModal()} className="mt-8 inline-flex min-h-[44px] items-center gap-1 text-[0.9rem] font-semibold text-matcha-deep underline-offset-4 hover:underline">
        For Casa Matcha: how this goes live <span aria-hidden="true">→</span>
      </button>

      <dialog
        ref={dialog}
        className="order-sheet"
        aria-labelledby="go-live-dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="order-sheet__panel !max-w-[560px] max-h-[88dvh] overflow-y-auto">
          <div className="mb-3 flex justify-end">
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="brand-toast__close !static !h-10 !w-10">
              ×
            </button>
          </div>
          <GoLive id="go-live-dialog" />
        </div>
      </dialog>
    </section>
  );
}
