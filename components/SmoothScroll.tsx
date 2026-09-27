"use client";
import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { MQ } from "@/lib/media";
import { afterIntroIdle } from "@/lib/bus";

/** Lenis smooth scroll on desktop pointers only; loaded after idle so it never sits on the critical path. */
export function SmoothScroll() {
  useEffect(() => {
    const ok = window.matchMedia(`${MQ.desktop} and ${MQ.fine}`).matches && !window.matchMedia(MQ.reduce).matches;
    if (!ok) return;
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    let cancelled = false;

    const cancelIdle = afterIntroIdle(async () => {
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 0.95, anchors: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }, 1200);

    return () => {
      cancelled = true;
      cancelIdle();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
