"use client";
/**
 * Brand toast triggers. Each fires at most once per tab session unless
 * `force` is true (the ?demo=1 panel uses force).
 */
import { createElement } from "react";
import { BrandToast, type BrandToastProps } from "@/components/toast/BrandToast";
import { onceInSession } from "./session";
import { scrollToId } from "./scroll";
import { relativeDayLabel, daysUntil } from "./hours";
import { events } from "@/content/events";

export type ToastKey = "drop" | "copied" | "event" | "lost";
export const TOAST_DURATION = 6500;

export async function brandToast(opts: Omit<BrandToastProps, "toastId" | "duration"> & { duration?: number }) {
  const duration = opts.duration ?? TOAST_DURATION;
  const { toast } = await import("sonner");
  return toast.custom((id) => createElement(BrandToast, { ...opts, duration, toastId: id }), { duration });
}

function fire(key: ToastKey, force: boolean, run: () => void): boolean {
  if (!force && !onceInSession(`toast:${key}`)) return false;
  run();
  return true;
}

export const isEventWithinWeek = (iso: string = events.next.date) => {
  const d = daysUntil(iso);
  return d >= 0 && d <= 7;
};

export const toasts = {
  /** #1 — 2.5s after the hero has fully loaded. */
  drop: (force = false) =>
    fire("drop", force, () =>
      brandToast({
        title: "🎃 The Pumpkin Drop is here",
        body: "Pumpkin Biscoff Matcha, S'mores Cookie, Crème Cold Brew.",
        action: { label: "See the drop", onClick: () => scrollToId("drop") },
      }),
    ),


  /** #3 — after an address is copied. */
  copied: (force = false, address?: string) =>
    fire("copied", force, () =>
      brandToast({
        title: "Address copied ✓",
        body: address ?? "Paste it wherever you're headed.",
        duration: 3500,
      }),
    ),

  /** #4 — when Events enters view and the next event is within 7 days. */
  event: (force = false) =>
    fire("event", force, () =>
      brandToast({
        title: `DJ night ${relativeDayLabel(events.next.date)}`,
        body: `${events.series} · doors ${events.next.doors}`,
        action: { label: "Get tickets", href: events.next.ticketsUrl, external: true },
      }),
    ),

  /** #5 — 404 page. */
  lost: (force = false) =>
    fire("lost", force, () =>
      brandToast({
        title: "Lost in space? 🚀",
        body: "This page floated away. The matcha didn't.",
        action: { label: "Back home", href: "/" },
        duration: 8000,
      }),
    ),
};
