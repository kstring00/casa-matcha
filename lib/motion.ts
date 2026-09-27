"use client";
import { gsap } from "./gsap";
import { prefersReducedMotion } from "./media";
import { onIdle } from "./idle";

type RevealOpts = {
  y?: number;
  rotate?: number;
  stagger?: number;
  delay?: number;
  duration?: number;
  trigger?: Element | null;
  start?: string;
  clear?: boolean;
};

/**
 * Additive rise-in that plays once and never flashes on scroll-back.
 * Created on idle: these targets are below the fold, so keeping the setup out
 * of the hydration burst costs nothing visible and helps LCP/TBT.
 */
export function revealUp(targets: gsap.TweenTarget, opts: RevealOpts = {}) {
  if (prefersReducedMotion()) return;
  const { y = 40, rotate = 0, stagger = 0.08, delay = 0, duration = 1.2, trigger, start = "top 86%", clear = true } = opts;
  const ctx = gsap.context(() => {});
  const cancel = onIdle(() => {
    ctx.add(() =>
      gsap.from(targets, {
        y,
        rotation: rotate,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: "expo.out",
        ...(clear ? { clearProps: "transform,opacity" } : {}),
        scrollTrigger: { trigger: (trigger ?? (targets as Element)) as Element, start, once: true },
      }),
    );
  }, 1200);
  return () => {
    cancel();
    ctx.revert();
  };
}
