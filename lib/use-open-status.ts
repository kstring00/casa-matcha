"use client";
import { useEffect, useState } from "react";
import type { WeekHours } from "@/content/locations";
import { getStatus, type OpenStatus } from "./hours";

/** Live open/closed status, computed client-side in America/Chicago and refreshed every minute. */
export function useOpenStatus(hours: WeekHours, name: string): OpenStatus | null {
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
  return status;
}
