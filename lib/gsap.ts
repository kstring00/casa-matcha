"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { afterIntroIdle } from "./bus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
  // Mobile URL-bar show/hide fires resize events; refreshing pins on those makes the hero jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

/**
 * Like useGSAP, but the setup runs after the intro has finished and the main
 * thread is idle. For below-the-fold sections this is invisible to the user
 * and keeps the hydration burst (TBT/LCP) short. Selector text stays scoped.
 */
export function useIdleGSAP(fn: () => void | (() => void), scope: RefObject<Element | null>) {
  useGSAP(
    (_ctx, contextSafe) => {
      let cleanup: void | (() => void);
      const cancel = afterIntroIdle(
        contextSafe!(() => {
          cleanup = fn();
        }),
        1800,
      );
      return () => {
        cancel();
        cleanup?.();
      };
    },
    { scope },
  );
}

export { gsap, ScrollTrigger, useGSAP };
