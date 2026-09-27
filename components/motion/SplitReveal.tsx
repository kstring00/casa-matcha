"use client";
import { useRef, type ReactNode } from "react";
import type { SplitText } from "gsap/SplitText";
import { gsap, useGSAP } from "@/lib/gsap";
import { afterIntroIdle } from "@/lib/bus";
import { prefersReducedMotion } from "@/lib/media";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type Props = {
  as?: Tag;
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  start?: string;
  id?: string;
};

/** Headline reveal: lines rise out of a mask, 0.06s stagger, expo.out. Plays once. */
export function SplitReveal({ as = "h2", children, className, stagger = 0.06, delay = 0, start = "top 88%", id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let split: SplitText | undefined;
      let cancelled = false;
      document.fonts.ready.then(() => afterIntroIdle(async () => {
        const { SplitText } = await import("gsap/SplitText");
        gsap.registerPlugin(SplitText);
        if (cancelled || !el.isConnected) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 112,
              duration: 1.15,
              ease: "expo.out",
              stagger,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            }),
        });
      }, 1500));
      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
