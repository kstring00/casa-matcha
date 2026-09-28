"use client";
import { useMemo, type Dispatch, type RefObject } from "react";
import type { Location } from "@/content/locations";
import { ordering } from "@/content/ordering";
import { money, scheduleSlots, type Action, type OrderState, type TipPercent, type Totals } from "@/lib/order-demo";

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  state: OrderState;
  totals: Totals;
  location: Location;
  dispatch: Dispatch<Action>;
  onBackToMenu: () => void;
  onCheckout: () => void;
};

export function CartStep({ headingRef, state, totals, location, dispatch, onBackToMenu, onCheckout }: Props) {
  const slots = useMemo(() => scheduleSlots(location.id), [location.id]);
  const scheduled = state.pickup.mode === "schedule";
  const removeLine = (key: string, qty: number, decrement: boolean) => {
    dispatch(decrement ? { type: "dec", key } : { type: "remove", key });
    if (!decrement || qty === 1) headingRef.current?.focus({ preventScroll: true });
  };

  return (
    <section aria-labelledby="order-h1">
      <p className="eyebrow text-matcha-deep">Pickup at {location.name}</p>
      <h1 id="order-h1" ref={headingRef} tabIndex={-1} className="font-display mt-3 text-[clamp(36px,9vw,56px)] leading-[0.95] font-black tracking-[-0.03em] outline-none md:text-[clamp(48px,4.6vw,72px)]">
        Your order.
      </h1>

      {state.lines.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-foam p-6">
          <p className="font-display text-[1.3rem] font-bold">Nothing in your order yet.</p>
          <button type="button" onClick={onBackToMenu} className="btn btn-primary mt-4">
            Back to the menu
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-10">
          <div className="space-y-8">
            <ul className="divide-y divide-ink/10 rounded-3xl bg-foam px-5 md:px-6" aria-label="Line items">
              {state.lines.map((l) => (
                <li key={l.key} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-[1.1rem] leading-tight font-bold">{l.name}</p>
                      <p className="mt-0.5 text-[0.85rem] text-ink/65 tabular-nums">
                        {l.detail ? `${l.detail} · ` : ""}
                        {money(l.unitCents)} each
                      </p>
                    </div>
                    <p className="font-display shrink-0 text-[1.1rem] font-bold tabular-nums">{money(l.unitCents * l.qty)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="stepper" role="group" aria-label={`Quantity for ${l.name}`}>
                      <button type="button" onClick={() => removeLine(l.key, l.qty, true)} aria-label={`Decrease ${l.name}`}>
                        −
                      </button>
                      <span className="tabular-nums" aria-live="polite">
                        {l.qty}
                      </span>
                      <button type="button" onClick={() => dispatch({ type: "inc", key: l.key })} aria-label={`Increase ${l.name}`}>
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => removeLine(l.key, l.qty, false)} className="min-h-[44px] px-2 text-[0.85rem] font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline" aria-label={`Remove ${l.name}`}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <fieldset className="rounded-3xl bg-foam p-5 md:p-6">
              <legend className="font-display px-1 text-[1.15rem] font-bold">Pickup time</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className={`choice ${!scheduled ? "is-on" : ""}`}>
                  <input type="radio" name="pickup" checked={!scheduled} onChange={() => dispatch({ type: "pickup", pickup: { mode: "asap" } })} className="sr-only" />
                  <span className="font-bold">ASAP</span>
                  <span className="text-[0.85rem] opacity-75">about {ordering.asapMinutes} min</span>
                </label>
                <label className={`choice ${scheduled ? "is-on" : ""}`}>
                  <input type="radio" name="pickup" checked={scheduled} onChange={() => dispatch({ type: "pickup", pickup: { mode: "schedule", slot: slots[0]?.value ?? null } })} className="sr-only" />
                  <span className="font-bold">Schedule</span>
                  <span className="text-[0.85rem] opacity-75">pick a time</span>
                </label>
              </div>
              {scheduled && (
                <div className="mt-3">
                  <label htmlFor="pickup-slot" className="mb-1 block text-[0.8rem] font-semibold text-ink/70">
                    Pickup time
                  </label>
                  <select
                    id="pickup-slot"
                    value={state.pickup.mode === "schedule" ? (state.pickup.slot ?? "") : ""}
                    onChange={(e) => dispatch({ type: "pickup", pickup: { mode: "schedule", slot: e.target.value } })}
                    className="min-h-[44px] w-full rounded-xl border border-ink/20 bg-foam px-3 text-[0.95rem]"
                  >
                    {slots.length === 0 && <option value="">No pickup times today</option>}
                    {slots.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </fieldset>

            <fieldset className="rounded-3xl bg-foam p-5 md:p-6">
              <legend className="font-display px-1 text-[1.15rem] font-bold">Tip</legend>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {ordering.tipPercents.map((p) => (
                  <label key={p} className={`chip justify-center !min-h-[44px] ${state.tip === p ? "is-on" : ""}`}>
                    <input type="radio" name="tip" value={p} checked={state.tip === p} onChange={() => dispatch({ type: "tip", tip: p as TipPercent })} className="sr-only" />
                    {p === 0 ? "No tip" : `${p}%`}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="md:sticky md:top-[calc(var(--nav-h)+72px)] md:self-start">
            <div className="rounded-3xl border border-matcha/40 bg-foam p-5 md:p-6">
              <h2 className="font-display text-[1.15rem] font-bold">Summary</h2>
              <dl className="mt-3 space-y-2 text-[0.95rem]">
                <Row label="Subtotal" value={totals.subtotal} />
                <Row label={`Tax (${(ordering.taxRate * 100).toFixed(2)}%)`} value={totals.tax} />
                <Row label="Pickup fee" value={totals.fee} />
                <Row label={state.tip ? `Tip (${state.tip}%)` : "Tip"} value={totals.tip} />
                <Row label="Total" value={totals.total} strong />
              </dl>
              <button type="button" onClick={onCheckout} className="btn btn-primary mt-5 w-full !min-h-[48px]">
                Continue to checkout <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
              <p className="mt-3 text-center text-[0.8rem] text-ink/65">{ordering.finePrint}</p>
            </div>
            <button type="button" onClick={onBackToMenu} className="mt-4 inline-flex min-h-[44px] items-center text-[0.9rem] font-semibold text-matcha-deep underline-offset-4 hover:underline">
              ← Add more
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "font-display mt-3 border-t border-ink/10 pt-3 text-[1.25rem] font-bold" : ""}`}>
      <dt className={strong ? "" : "text-ink/75"}>{label}</dt>
      <dd className="tabular-nums">{money(value)}</dd>
    </div>
  );
}
