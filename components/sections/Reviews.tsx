"use client";
import { useRef, useState } from "react";
import { gsap, useIdleGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { reviews } from "@/content/reviews";
import { SplitReveal } from "@/components/motion/SplitReveal";

/** Draggable + inertia carousel. Cards scale 1 at center, 0.92 at the edges. Arrow keys move it too. */
export function Reviews() {
  const section = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const goToRef = useRef<(i: number) => void>(() => {});

  useIdleGSAP(() => {
      const el = track.current;
      const box = wrap.current;
      if (!el || !box) return;
      const cards = Array.from(el.children) as HTMLElement[];
      const reduce = prefersReducedMotion();
      let cancelled = false;
      let cleanup: (() => void) | undefined;

      const points = () => cards.map((c) => -(c.offsetLeft + c.offsetWidth / 2 - box.clientWidth / 2));
      const update = () => {
        const center = box.getBoundingClientRect().left + box.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        cards.forEach((card, i) => {
          const r = card.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - center);
          const n = Math.min(1, d / (box.clientWidth * 0.8));
          if (d < bestD) {
            bestD = d;
            best = i;
          }
          gsap.set(card, { scale: 1 - n * 0.08, opacity: 1 - n * 0.35 });
        });
        setIndex(best);
      };

      const goTo = (i: number) => {
        const p = points();
        const clamped = gsap.utils.clamp(0, p.length - 1, i);
        gsap.to(el, { x: p[clamped], duration: reduce ? 0 : 0.7, ease: "power3.out", onUpdate: update, onComplete: update });
      };
      goToRef.current = goTo;

      gsap.set(el, { x: points()[0] });
      update();

      Promise.all([import("gsap/Draggable"), import("gsap/InertiaPlugin")]).then(([{ Draggable }, { InertiaPlugin }]) => {
        if (cancelled) return;
        gsap.registerPlugin(Draggable, InertiaPlugin);
        const bounds = () => {
          const p = points();
          return { minX: Math.min(...p), maxX: Math.max(...p) };
        };
        const [drag] = Draggable.create(el, {
          type: "x",
          inertia: true,
          edgeResistance: 0.82,
          bounds: bounds(),
          snap: (v: number) => gsap.utils.snap(points(), v),
          onDrag: update,
          onThrowUpdate: update,
          onThrowComplete: update,
          dragClickables: true,
        });
        const onResize = () => {
          drag.applyBounds(bounds());
          gsap.set(el, { x: points()[index] });
          update();
        };
        window.addEventListener("resize", onResize);
        cleanup = () => {
          window.removeEventListener("resize", onResize);
          drag.kill();
        };
      });

      return () => {
        cancelled = true;
        cleanup?.();
      };
  }, section);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToRef.current(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToRef.current(index - 1);
    }
  };

  return (
    <section id="reviews" ref={section} data-theme="light" className="overflow-hidden bg-foam py-24 text-ink md:py-36" aria-labelledby="reviews-title">
      <header className="px-gutter mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow text-matcha-deep">Google reviews</span>
          <SplitReveal as="h2" id="reviews-title" className="font-display mt-4 text-[clamp(40px,10vw,64px)] leading-[0.95] font-black tracking-[-0.03em] md:text-[clamp(56px,5.6vw,96px)]">
            Familia says
          </SplitReveal>
        </div>
        <p className="text-[0.85rem] font-semibold tracking-wider text-ink/70 uppercase">
          drag <span aria-hidden="true">↔</span> or use arrow keys
        </p>
      </header>

      <div
        ref={wrap}
        className="relative outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer reviews"
        tabIndex={0}
        onKeyDown={onKey}
      >
        <ul ref={track} className="flex cursor-grab items-stretch gap-5 active:cursor-grabbing md:gap-8" aria-live="polite">
          {reviews.map((r, i) => (
            <li
              key={r.name}
              className="review-card flex w-[82vw] shrink-0 flex-col justify-between rounded-[28px] bg-cream p-7 md:w-[36rem] md:p-10"
              aria-roledescription="slide"
              aria-label={`Review ${i + 1} of ${reviews.length}`}
            >
              <div>
                <div className="flex items-center gap-2" aria-label={`${r.rating} out of 5 stars`} role="img">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" className={`h-5 w-5 ${s < r.rating ? "text-caramel" : "text-ink/15"}`} aria-hidden="true">
                      <path fill="currentColor" d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.6l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="font-display mt-6 text-[1.35rem] leading-snug font-medium md:text-[1.75rem]">&ldquo;{r.quote}&rdquo;</blockquote>
              </div>
              <footer className="mt-8 flex items-center justify-between text-[0.9rem]">
                <span className="font-semibold">{r.name}</span>
                <span className="flex items-center gap-2 text-ink/75">
                  Google
                  {r.sample && <span className="rounded-full bg-caramel px-2 py-0.5 text-[0.65rem] font-bold tracking-wider text-ink uppercase">sample</span>}
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-gutter mt-8 flex items-center gap-3">
        <button type="button" onClick={() => goToRef.current(index - 1)} className="btn btn-outline !min-h-[44px] !px-4" aria-label="Previous review" disabled={index === 0}>
          ←
        </button>
        <button type="button" onClick={() => goToRef.current(index + 1)} className="btn btn-outline !min-h-[44px] !px-4" aria-label="Next review" disabled={index === reviews.length - 1}>
          →
        </button>
        <div className="ml-2 flex gap-2" aria-hidden="true">
          {reviews.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-matcha" : "w-1.5 bg-ink/20"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
