"use client";
import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

export const MQ = {
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  fine: "(hover: hover) and (pointer: fine)",
} as const;

export const useReducedMotion = () => useMediaQuery(MQ.reduce);
export const useIsDesktop = () => useMediaQuery(MQ.desktop, true);
export const useFinePointer = () => useMediaQuery(MQ.fine);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;
export const isFinePointer = () => typeof window !== "undefined" && window.matchMedia(MQ.fine).matches;
export const isDesktopWidth = () => typeof window !== "undefined" && window.matchMedia(MQ.desktop).matches;

type NavWithConn = Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };

/** Skip heavy GPU work on weak or data-saving devices. */
export function isLowPower(): boolean {
  if (typeof navigator === "undefined") return true;
  const n = navigator as NavWithConn;
  if ((n.hardwareConcurrency ?? 8) < 4) return true;
  if (n.connection?.saveData) return true;
  return false;
}

let webglCache: boolean | null = null;
export function canWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

const noopSubscribe = () => () => {};

/** A client-only primitive value (false on the server) without setState-in-effect. */
export function useClientValue<T extends string | number | boolean | null>(compute: () => T, serverValue: T): T {
  return useSyncExternalStore(noopSubscribe, compute, () => serverValue);
}

/** Should this device run the WebGL "moments"? Desktop, fine pointer, motion allowed, not low-power. */
export const useWebGLOk = () =>
  useClientValue(() => isFinePointer() && isDesktopWidth() && !prefersReducedMotion() && !isLowPower() && canWebGL(), false);

/** One-shot mount guard so client-only UI does not mismatch during hydration. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
