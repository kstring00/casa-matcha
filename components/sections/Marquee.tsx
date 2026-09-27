"use client";
import { Fragment, useRef } from "react";
import { gsap, ScrollTrigger, useIdleGSAP } from "@/lib/gsap";
import { prefersReducedMotion, isFinePointer } from "@/lib/media";
import { site } from "@/content/site";

/** Two opposite rows. Speed and direction follow scroll velocity; hover pauses. */
export function Marquee() {
  const ref = useRef<HTMLElement>(null);

  useIdleGSAP(() => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>(".marquee__row");
      const tweens = rows.map((row, i) => {
        const track = row.querySelector<HTMLElement>(".marquee__track")!;
        const dir = i % 2 === 0 ? -1 : 1;
        return gsap.fromTo(
          track,
          { xPercent: dir === -1 ? 0 : -50 },
          { xPercent: dir === -1 ? -50 : 0, duration: 38, ease: "none", repeat: -1 },
        );
      });

      let hover = false;
      let current = 1;
      let velocity = 0;
      const blurOk = isFinePointer();
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          velocity = self.getVelocity();
        },
      });
      const tick = () => {
        const dir = velocity < -60 ? -1 : 1;
        const boost = Math.min(Math.abs(velocity) / 700, 3.2);
        const target = hover ? 0 : dir * (1 + boost);
        current += (target - current) * 0.07;
        velocity *= 0.9;
        tweens.forEach((t) => t.timeScale(current));
        if (blurOk) {
          const blur = Math.max(0, Math.abs(current) - 1.15) * 1.6;
          rows.forEach((r) => (r.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ""));
        }
      };
      gsap.ticker.add(tick);
      const enter = () => (hover = true);
      const leave = () => (hover = false);
      rows.forEach((r) => {
        r.addEventListener("pointerenter", enter);
        r.addEventListener("pointerleave", leave);
      });
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        tweens.forEach((t) => t.kill());
        rows.forEach((r) => {
          r.removeEventListener("pointerenter", enter);
          r.removeEventListener("pointerleave", leave);
        });
      };
  }, ref);

  const Copy = ({ hidden }: { hidden?: boolean }) => (
    <span className="marquee__copy" aria-hidden={hidden ? "true" : undefined}>
      {site.marquee.map((w) => (
        <Fragment key={w}>
          {w}
          <span className="marquee__dot" aria-hidden="true" />
        </Fragment>
      ))}
    </span>
  );

  return (
    <section ref={ref} aria-label="On the menu" data-theme="light" className="border-y border-ink/10 bg-cream py-6 text-ink md:py-9">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`marquee__row font-display text-[clamp(30px,6.5vw,88px)] leading-[1.15] font-light italic ${i === 1 ? "mt-1 text-matcha-deep md:mt-2" : ""}`}
        >
          <div className="marquee__track">
            <Copy />
            <Copy hidden />
          </div>
        </div>
      ))}
    </section>
  );
}
