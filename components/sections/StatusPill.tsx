"use client";
import { useEffect, useState } from "react";
import type { WeekHours } from "@/content/locations";
import { getStatus, type OpenStatus } from "@/lib/hours";

/** Live "Open · closes 6:00 pm" pill, computed client-side in America/Chicago and refreshed every minute. */
export function StatusPill({ hours, name, className = "" }: { hours: WeekHours; name: string; className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getStatus(hours, name));
    tick();
    const id = window.setInterval(tick, 60_000);
    const onVis = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [hours, name]);

  const tone = !status ? "bg-ink/10 text-ink/80" : status.isOpen ? (status.closingSoon ? "bg-caramel/15 text-[#7a4210]" : "bg-matcha/12 text-matcha-deep") : "bg-ink/8 text-ink/85";
  const dot = !status ? "bg-ink/30" : status.isOpen ? (status.closingSoon ? "bg-caramel" : "bg-matcha") : "bg-ink/40";

  return (
    <span
      className={`inline-flex min-h-[30px] min-w-[11rem] items-center gap-2 rounded-full px-3 py-1 text-[0.78rem] font-semibold ${tone} ${className}`}
      aria-live="polite"
    >
      <span className={`relative inline-block h-2 w-2 rounded-full ${dot}`} aria-hidden="true">
        {status?.isOpen && !status.closingSoon && <span className="live-dot absolute inset-0 !bg-transparent text-matcha" />}
      </span>
      {status ? status.label : "Checking hours…"}
    </span>
  );
}
