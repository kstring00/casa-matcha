"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useWebGLOk } from "@/lib/media";
import { revealUp } from "@/lib/motion";
import { scrollToY } from "@/lib/scroll";
import { drop } from "@/content/drop";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { OrderLink } from "@/components/order/OrderLink";
import { useSelectedLocation } from "@/lib/location-store";
import { pickupLocation } from "@/lib/ordering";
import { getLocation } from "@/content/locations";

const DropImageGL = dynamic(() => import("./DropImageGL"), { ssr: false });

type Item = (typeof drop.items)[number];

export function Drop() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = section.current;
      const el = track.current;
      if (!root || !el) return;

      revealUp(root.querySelectorAll(".drop-card"), { y: 50, rotate: -1.5, stagger: 0.1, trigger: root, start: "top 70%" });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const amount = () => Math.max(0, el.scrollWidth - window.innerWidth);
        const tween = gsap.to(el, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${amount()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const onKey = (e: KeyboardEvent) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          if (!root.contains(document.activeElement)) return;
          e.preventDefault();
          const card = root.querySelector<HTMLElement>(".drop-card");
          const step = (card?.offsetWidth ?? 400) + 32;
          const st = tween.scrollTrigger!;
          const next = gsap.utils.clamp(st.start, st.end, window.scrollY + (e.key === "ArrowRight" ? step : -step));
          scrollToY(next, 0.8);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      });
    },
    { scope: section },
  );

  return (
    <section
      id="drop"
      ref={section}
      data-theme="dark"
      className="relative overflow-x-clip bg-matcha-deep text-cream"
      aria-labelledby="drop-title"
    >
      <div className="md:flex md:h-screen md:items-center">
        <div ref={track} className="flex flex-col md:flex-row md:items-center md:gap-8 md:pl-[var(--gutter)] md:will-change-transform">
          <header className="px-gutter pt-20 pb-10 md:w-[36vw] md:shrink-0 md:px-0 md:py-0 md:pr-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow text-cream/85">{drop.eyebrow}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-matcha-light/50 px-3 py-1 text-[0.72rem] font-semibold tracking-wide text-matcha-light">
                <span className="live-dot" aria-hidden="true" />
                {drop.tag}
              </span>
            </div>
            <SplitReveal as="h2" id="drop-title" className="font-display mt-5 text-[clamp(44px,11vw,72px)] leading-[0.92] font-black tracking-[-0.03em] md:text-[clamp(56px,5.6vw,108px)]">
              {drop.title}
            </SplitReveal>
            <p className="mt-6 max-w-[34ch] text-[1.05rem] leading-relaxed text-cream/80">{drop.intro}</p>
            <p className="mt-6 hidden items-center gap-3 text-[0.8rem] text-cream/80 md:flex">
              <span aria-hidden="true">←</span> scroll or use arrow keys <span aria-hidden="true">→</span>
            </p>
          </header>

          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-20 md:contents"
            role="list"
            aria-label="Pumpkin Drop items"
            tabIndex={0}
          >
            {drop.items.map((item, i) => (
              <DropCard key={item.id} item={item} index={i} />
            ))}
            <div className="drop-card flex w-[60vw] shrink-0 snap-center items-center md:w-[26vw]" role="listitem">
              <div className="rounded-3xl border border-cream/15 p-7 md:p-9">
                <p className="font-display text-[1.6rem] leading-tight font-semibold italic md:text-[2rem]">Order at the counter. No app, no line-skipping, just say hola.</p>
                <Link href="/#locations" className="btn btn-cream mt-6" data-cursor="link">
                  Find a location <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DropCard({ item, index }: { item: Item; index: number }) {
  const gl = useWebGLOk();
  const [selected] = useSelectedLocation();
  const orderLoc = pickupLocation(selected);
  return (
    <article className="drop-card w-[78vw] shrink-0 snap-center md:w-[min(34vw,42vh)]" role="listitem">
      <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-ink/30">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 34vw, 78vw"
          quality={75}
          priority={false}
          className={`object-cover transition-transform duration-500 ease-out group-active:scale-[1.04] ${gl ? "opacity-0" : ""}`}
        />
        {gl && <DropImageGL src={item.image} width={item.width} height={item.height} />}
        <span className="absolute top-4 left-4 rounded-full bg-ink/60 px-3 py-1 text-[0.7rem] font-semibold tracking-wider text-cream backdrop-blur">
          0{index + 1}
        </span>
      </div>
      <h3 className="font-display mt-5 text-[1.6rem] leading-tight font-bold md:text-[1.9rem]">{item.name}</h3>
      <p className="mt-2 max-w-[36ch] text-[0.98rem] leading-relaxed text-cream/75">{item.line}</p>
      {orderLoc && (
        <OrderLink
          location={orderLoc}
          kind="pickup"
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[0.9rem] font-semibold text-matcha-light underline-offset-4 hover:underline"
          aria-label={`Order ${item.name} for pickup at Casa Matcha ${getLocation(orderLoc).name} on joe coffee (opens in a new tab)`}
        >
          Order this <span className="btn__arrow" aria-hidden="true">→</span>
        </OrderLink>
      )}
    </article>
  );
}
