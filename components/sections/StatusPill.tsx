"use client";
import type { WeekHours } from "@/content/locations";
import type { OpenStatus } from "@/lib/hours";
import { useOpenStatus } from "@/lib/use-open-status";

type Props = { hours: WeekHours; name: string; className?: string; status?: OpenStatus | null };

/** Live "Open · closes 6:00 pm" pill. Pass `status` to share one computation with siblings. */
export function StatusPill({ hours, name, className = "", status: given }: Props) {
  const own = useOpenStatus(hours, name);
  const status = given === undefined ? own : given;

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
