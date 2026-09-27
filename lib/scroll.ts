"use client";
import type Lenis from "lenis";
import { prefersReducedMotion } from "./media";

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function scrollToY(y: number, duration = 1.2) {
  if (lenis) {
    lenis.scrollTo(y, { duration });
    return;
  }
  window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
