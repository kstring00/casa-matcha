"use client";
import { useState } from "react";
import { useClientValue } from "@/lib/media";
import { toasts } from "@/lib/toasts";
import { clearSessionFlags } from "@/lib/session";

/** Hidden client-demo panel: add ?demo=1 to the URL. Fires every toast on demand. */
export function DemoPanel() {
  const on = useClientValue(() => new URLSearchParams(window.location.search).get("demo") === "1", false);
  const [open, setOpen] = useState(true);
  if (!on) return null;

  const items: { label: string; run: () => void }[] = [
    { label: "1 · Pumpkin Drop", run: () => toasts.drop(true) },
    { label: "2 · Opening joe coffee…", run: () => toasts.opening("joe coffee") },
    { label: "2 · Opening DoorDash…", run: () => toasts.opening("DoorDash") },
    { label: "3 · Address copied", run: () => toasts.copied(true, "1199 E NASA Pkwy, Webster, TX 77058") },
    { label: "4 · DJ night", run: () => toasts.event(true) },
    { label: "5 · Lost in space", run: () => toasts.lost(true) },
  ];

  return (
    <div className="fixed top-[calc(var(--nav-h)+8px)] right-3 z-[70] w-[15.5rem] rounded-2xl border border-matcha/40 bg-foam/95 p-3 text-ink shadow-xl backdrop-blur md:top-auto md:right-auto md:bottom-6 md:left-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-matcha-deep">Demo · toasts</p>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full px-2 text-sm font-bold" aria-expanded={open}>
          {open ? "–" : "+"}
        </button>
      </div>
      {open && (
        <div className="mt-2 grid gap-1.5">
          {items.map((it) => (
            <button key={it.label} type="button" onClick={it.run} className="rounded-xl bg-cream px-3 py-2 text-left text-[0.82rem] font-semibold hover:bg-matcha hover:text-foam">
              {it.label}
            </button>
          ))}
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            <button type="button" onClick={clearSessionFlags} className="rounded-xl border border-ink/15 px-2 py-2 text-[0.75rem] font-semibold">
              Reset session
            </button>
            <button
              type="button"
              onClick={() => {
                clearSessionFlags();
                window.location.reload();
              }}
              className="rounded-xl border border-ink/15 px-2 py-2 text-[0.75rem] font-semibold"
            >
              Replay curtain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
