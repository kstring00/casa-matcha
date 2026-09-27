"use client";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { getLocation, type LocationId } from "@/content/locations";
import { orderingFinePrint, providers } from "@/content/ordering";
import { orderOptions, orderSheet, orderingLocations, pickupLabel, useOrderSheet } from "@/lib/ordering";
import { getLenis } from "@/lib/scroll";
import { useOpenStatus } from "@/lib/use-open-status";
import { StatusPill } from "@/components/sections/StatusPill";
import { OrderLink } from "./OrderLink";

/**
 * Order chooser: bottom sheet on mobile, centered card on desktop, styled like
 * the toasts. A native <dialog> gives us focus trapping, Escape, and focus
 * return; we add backdrop tap, scroll lock and the location picker.
 */
export function OrderSheet() {
  const { open, location, opener } = useOrderSheet();
  const ref = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      openerRef.current = opener;
      d.showModal();
      document.documentElement.classList.add("sheet-open");
      getLenis()?.stop();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open, opener]);

  const onClose = () => {
    document.documentElement.classList.remove("sheet-open");
    getLenis()?.start();
    orderSheet.close();
    const back = openerRef.current;
    openerRef.current = null;
    if (back?.isConnected) back.focus({ preventScroll: true });
  };

  const locs = orderingLocations();
  const current: LocationId | null = location && locs.includes(location) ? location : (locs[0] ?? null);

  // Native <dialog> makes the page inert, but Tab can still leave for browser
  // chrome at the edges; wrap it so focus cycles inside the sheet.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const d = ref.current;
    if (!d) return;
    const focusables = Array.from(
      d.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === d)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      className="order-sheet"
      aria-labelledby="order-sheet-title"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {current && <SheetBody location={current} locs={locs} />}
    </dialog>
  );
}

function SheetBody({ location, locs }: { location: LocationId; locs: LocationId[] }) {
  const loc = getLocation(location);
  const status = useOpenStatus(loc.hours, loc.short);
  const options = orderOptions(location);
  const close = () => orderSheet.close();

  return (
    <div className="order-sheet__panel" role="document">
      <div className="flex items-start gap-3">
        <span className="brand-toast__mark" aria-hidden="true">
          <Logo variant="mark" className="h-9 w-9" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="order-sheet-title" className="font-display text-[1.45rem] leading-tight font-bold text-ink">
            Order ahead
          </h2>
          <p className="mt-0.5 text-[0.85rem] text-ink/70">Whisked to order, ready when you are.</p>
        </div>
        <button type="button" onClick={close} aria-label="Close" className="brand-toast__close !static !h-9 !w-9 shrink-0">
          ×
        </button>
      </div>

      {locs.length > 1 ? (
        <div className="mt-5" role="radiogroup" aria-label="Location">
          <div className="grid gap-1.5 rounded-2xl bg-cream p-1.5" style={{ gridTemplateColumns: `repeat(${locs.length}, minmax(0, 1fr))` }}>
            {locs.map((id) => {
              const l = getLocation(id);
              const active = id === location;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => orderSheet.setLocation(id)}
                  className={`min-h-[44px] rounded-xl px-3 text-[0.9rem] font-semibold transition-colors ${active ? "bg-ink text-cream" : "text-ink hover:bg-foam"}`}
                >
                  {l.short}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mt-5 text-[0.9rem] font-semibold text-ink">
          {loc.name} · <span className="font-normal text-ink/70">{loc.street}</span>
        </p>
      )}

      <div className="mt-3">
        <StatusPill hours={loc.hours} name={loc.short} status={status} />
      </div>

      <div className="mt-4 grid gap-2.5">
        {options.map((opt, i) => {
          const p = providers[opt.provider];
          const isPickup = opt.kind === "pickup";
          return (
            <OrderLink
              key={opt.kind}
              location={location}
              kind={opt.kind}
              onClick={close}
              autoFocus={i === 0}
              className={`order-sheet__option group ${isPickup ? "order-sheet__option--primary" : ""}`}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-display text-[1.15rem] leading-tight font-bold">
                  {isPickup ? `${pickupLabel(!!status?.isOpen)}` : "Delivery"}
                  <span className="font-body ml-2 text-[0.72rem] font-semibold tracking-wider uppercase opacity-70">{p.name}</span>
                </span>
                <span className="mt-0.5 text-[0.85rem] opacity-80">{isPickup ? "Pickup — order ahead, skip the line" : p.blurb}</span>
              </span>
              <span className="btn__arrow text-[1.3rem]" aria-hidden="true">
                →
              </span>
            </OrderLink>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[0.72rem] text-ink/60">{orderingFinePrint}</p>
    </div>
  );
}
