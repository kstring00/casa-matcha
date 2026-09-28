"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import { locations, getLocation, type LocationId } from "@/content/locations";
import { ordering } from "@/content/ordering";
import { demoMenu } from "@/content/order-menu";
import { initialState, reducer, totals, money, type Step } from "@/lib/order-demo";
import { DemoBadge } from "./DemoBadge";
import { LocationStep } from "./steps/LocationStep";
import { MenuStep } from "./steps/MenuStep";
import { CartStep } from "./steps/CartStep";
import { CheckoutStep } from "./steps/CheckoutStep";

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Location" },
  { n: 2, label: "Menu" },
  { n: 3, label: "Cart" },
  { n: 4, label: "Checkout" },
];

const isLocation = (v: string | null): v is LocationId => v === "webster" || v === "friendswood";

/** The four-step demo: Location · Menu · Cart · Checkout. State lives in memory only. */
export function OrderFlow() {
  const params = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const loc = params.get("location");
    return isLocation(loc) ? { ...init, location: loc, step: 2 as Step } : init;
  });
  const highlight = params.get("item");
  const t = totals(state);
  const [announce, setAnnounce] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    headingRef.current?.focus({ preventScroll: true });
  }, [state.step]);

  const reachable = (s: Step) => s === 1 || (s <= 3 && !!state.location) || (s === 4 && !!state.location && state.lines.length > 0);
  const go = (s: Step) => reachable(s) && dispatch({ type: "step", step: s });
  const loc = state.location ? getLocation(state.location) : null;

  return (
    <div className="order-flow pt-[var(--nav-h)]">
      <nav aria-label="Order progress" className="order-progress">
        <ol className="px-gutter mx-auto flex max-w-[64rem] items-center gap-1 py-3 md:gap-2">
          {STEPS.map((s, i) => {
            const done = s.n < state.step;
            const current = s.n === state.step;
            return (
              <li key={s.n} className="flex min-w-0 flex-1 items-center gap-1 md:gap-2">
                <button
                  type="button"
                  onClick={() => go(s.n)}
                  disabled={!reachable(s.n) || current}
                  aria-current={current ? "step" : undefined}
                  className={`order-progress__step ${current ? "is-current" : done ? "is-done" : ""}`}
                >
                  <span className="order-progress__num" aria-hidden="true">
                    {done ? "✓" : s.n}
                  </span>
                  <span className="sr-only">{done ? "Done: " : `Step ${s.n}: `}</span>
                  <span className="order-progress__label">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="order-progress__bar" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={`px-gutter mx-auto max-w-[64rem] pt-8 md:pt-12 ${state.step === 2 ? "pb-[calc(112px+env(safe-area-inset-bottom))]" : "pb-16 md:pb-24"}`}>
        {state.step === 1 && (
          <LocationStep
            headingRef={headingRef}
            onChoose={(id) => {
              dispatch({ type: "location", id });
              setAnnounce(`${getLocation(id).name} selected. Menu.`);
            }}
          />
        )}
        {state.step === 2 && loc && (
          <MenuStep
            headingRef={headingRef}
            location={loc}
            highlight={highlight}
            onAdd={(item, size, milk) => {
              dispatch({ type: "add", item, size, milk });
              setAnnounce(`Added ${item.name}${size ? `, ${size.label}` : ""}${milk ? `, ${milk.label}` : ""}.`);
            }}
            onChangeLocation={() => go(1)}
          />
        )}
        {state.step === 3 && loc && (
          <CartStep
            headingRef={headingRef}
            state={state}
            totals={t}
            location={loc}
            dispatch={dispatch}
            onBackToMenu={() => go(2)}
            onCheckout={() => go(4)}
          />
        )}
        {state.step === 4 && loc && (
          <CheckoutStep headingRef={headingRef} count={t.count} total={t.total} location={loc} onStartOver={() => dispatch({ type: "reset" })} />
        )}
      </div>

      {state.step === 2 && (
        <div className="order-total-bar" role="region" aria-label="Running total">
          <div className="mx-auto flex max-w-[64rem] items-center gap-3">
            <p className="min-w-0 flex-1 text-[0.85rem] leading-tight font-semibold md:text-[0.95rem]" aria-live="polite">
              {t.count === 0 ? (
                <>
                  Add something to start · <span className="tabular-nums">{money(0)}</span>
                </>
              ) : (
                <>
                  {t.count} {t.count === 1 ? "item" : "items"} · <span className="tabular-nums">{money(t.subtotal)}</span>
                </>
              )}
            </p>
            <button type="button" onClick={() => go(3)} disabled={t.count === 0} className="btn btn-primary !min-h-[48px] shrink-0 !px-4 disabled:cursor-not-allowed disabled:opacity-50 md:!px-6">
              View cart <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
      <DemoBadge />
      <span className="sr-only">{`${locations.length} locations · ${demoMenu.length} items · ${ordering.demoPath}`}</span>
      <Link href="/" className="sr-only">
        Back to the site
      </Link>
    </div>
  );
}
