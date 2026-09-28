"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FrameLoader, drawCover, progressToFrame, type FrameManifest } from "@/lib/frames";
import { afterIntroIdle, bus, introState } from "@/lib/bus";
import { canWebGL, isDesktopWidth, isLowPower, useMounted, useReducedMotion } from "@/lib/media";
import { scrollToId, scrollToY } from "@/lib/scroll";
import { toasts } from "@/lib/toasts";
import { site } from "@/content/site";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroStatic } from "./HeroStatic";
import { OrderCta } from "@/components/order/OrderCta";
import desktopManifest from "@/public/hero/frames/manifest.json";
import mobileManifest from "@/public/hero/frames-m/manifest.json";

const MatchaDust = dynamic(() => import("./MatchaDust"), { ssr: false });

const DESKTOP = { dir: "/hero/frames", manifest: desktopManifest as FrameManifest };
const MOBILE = { dir: "/hero/frames-m", manifest: mobileManifest as FrameManifest };
const POSTER_DESKTOP = `${DESKTOP.dir}/f-001.webp`;
const POSTER_MOBILE = `${MOBILE.dir}/f-001.webp`;

const HEADLINE = ["REAL MATCHA.", "REAL COFFEE.", "REAL FAMILIA."];

export function Hero() {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  if (mounted && reduced) return <HeroStatic />;
  return <HeroMotion />;
}

function HeroMotion() {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dust, setDust] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);

  preload(POSTER_MOBILE, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  preload(POSTER_DESKTOP, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });

  useGSAP(
    () => {
      const root = section.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isDesktop = isDesktopWidth();
      const set = isDesktop ? DESKTOP : MOBILE;
      const total = set.manifest.total;
      const progressEl = root.querySelector<HTMLElement>(".hero-progress")!;

      let drawn = -1;
      let lastP = 0;
      let width = 0;
      let height = 0;

      const draw = (p: number) => {
        const idx = loader.nearestLoaded(progressToFrame(p, total));
        if (idx < 0 || idx === drawn) return;
        const img = loader.images[idx];
        if (!img) return;
        drawCover(ctx, img, canvas.width, canvas.height, 0.5, 0.38);
        drawn = idx;
      };

      const loader = new FrameLoader(
        set.dir,
        set.manifest,
        (fraction) => {
          gsap.set(progressEl, { scaleX: fraction });
          if (fraction >= 1) gsap.to(progressEl, { opacity: 0, duration: 0.6, delay: 0.3 });
          // A newly arrived frame may be closer to where we are.
          draw(lastP);
        },
        () => {
          introState.heroLoaded = true;
          bus.emit("hero:loaded");
          window.setTimeout(() => toasts.drop(), 2500);
        },
      );

      const size = () => {
        const w = root.clientWidth;
        const h = root.clientHeight;
        // Ignore height-only changes on mobile (URL bar) to avoid redraw churn.
        if (!isDesktop && w === width && Math.abs(h - height) < 140 && width) return;
        width = w;
        height = h;
        const dpr = Math.min(window.devicePixelRatio || 1, isDesktop ? 1.5 : 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        drawn = -1;
        draw(lastP);
      };
      size();
      loader.start((cb) => afterIntroIdle(cb, 2500));
      window.addEventListener("resize", size);

      /* ---------- scroll choreography ---------- */
      const pinLen = isDesktop ? 3 : 2;
      const proxy = { p: 0 };
      let prev = 0;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * pinLen}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (prev < 0.55 && p >= 0.55) bus.emit("hero:burst", { strength: 1 });
            else if (prev >= 0.55 && p < 0.55) bus.emit("hero:burst", { strength: 0.35 });
            prev = p;
          },
        },
      });

      tl.to(proxy, {
        p: 1,
        duration: 1,
        onUpdate: () => {
          lastP = proxy.p;
          draw(proxy.p);
        },
      }, 0);

      // 15–30%: wordmark drifts up and fades.
      tl.to(".hero-wordmark", { y: -90, opacity: 0, duration: 0.15, ease: "power2.in" }, 0.15);
      tl.to(".hero-cue-top", { opacity: 0, duration: 0.06 }, 0.1);
      // 22–52%: the pour line.
      tl.fromTo(".hero-pour", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.22);
      tl.to(".hero-pour", { opacity: 0, y: -26, duration: 0.08, ease: "power2.in" }, 0.44);
      // 55 / 63 / 74%: headline lines slam in on splash beats (frames 57, 65, 79).
      [0.55, 0.63, 0.74].forEach((t, i) => {
        tl.fromTo(
          `.hero-line-${i}`,
          { yPercent: 130, rotate: 5, scale: 1.12, opacity: 0 },
          { yPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: 0.05, ease: "expo.out" },
          t,
        );
      });
      // 82–92%: headline settles small; CTAs and cue arrive.
      tl.to(".hero-headline", { scale: isDesktop ? 0.56 : 0.78, transformOrigin: "left bottom", duration: 0.1, ease: "power2.inOut" }, 0.82);
      tl.fromTo(".hero-cta", { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.08, stagger: 0.025, ease: "power2.out" }, 0.87);
      tl.fromTo(".hero-cue-end", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.94);

      /* ---------- intro is CSS; hand control to GSAP once each animation ends ---------- */
      root.querySelectorAll<HTMLElement>(".hero-letter, .hero-sub, .hero-cue-top").forEach((el) => {
        const anims = el.getAnimations();
        if (!anims.length) el.classList.add("is-in");
        else Promise.allSettled(anims.map((a) => a.finished)).then(() => el.classList.add("is-in"));
      });

      /* ---------- click the hero: play the pour ---------- */
      const play = (e: MouseEvent) => {
        if ((e.target as Element | null)?.closest("a, button")) return;
        const st = tl.scrollTrigger;
        if (!st) return;
        const target = st.progress > 0.9 ? st.start : st.end;
        scrollToY(target, 3.2);
      };
      root.addEventListener("click", play);

      /* ---------- particles gate ---------- */
      const wantDust = isDesktop && !isLowPower() && canWebGL();
      const cancelDust = wantDust ? afterIntroIdle(() => setDust(true), 3000) : () => {};
      const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
      io.observe(root);

      return () => {
        window.removeEventListener("resize", size);
        root.removeEventListener("click", play);
        loader.destroy();
        io.disconnect();
        cancelDust();
        ScrollTrigger.getAll().forEach((t) => t.trigger === root && t.kill());
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="relative h-[100lvh] w-full overflow-hidden bg-ink text-cream"
      data-theme="dark"
      data-hero
      data-cursor="play"
      aria-label="Casa Matcha"
    >
      <div className="hero-stage hero-canvas-wrap">
        <picture>
          <source media="(max-width: 767px)" srcSet={POSTER_MOBILE} width={540} height={960} />
          <img
            src={POSTER_DESKTOP}
            width={1080}
            height={810}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="sync"
            className="hero-poster"
          />
        </picture>
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
        {dust && <MatchaDust active={heroVisible} />}
        <div className="hero-shade" />
      </div>

      <div className="hero-progress" aria-hidden="true" />

      {/* 0–15%: wordmark */}
      <div className="hero-wordmark pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-gutter text-center">
        <h1 className="font-display text-[clamp(56px,19vw,110px)] leading-[0.86] font-black tracking-[-0.03em] text-cream md:text-[clamp(96px,10.5vw,200px)]">
          <span aria-hidden="true" className="flex flex-col items-center md:flex-row md:gap-[0.22em]">
            {["CASA", "MATCHA"].map((word, w) => (
              <span key={word} className="hero-mask">
                {word.split("").map((ch, i) => (
                  <span key={i} className="hero-letter" style={{ ["--i" as string]: w * 4 + i }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span className="sr-only">Casa Matcha — matcha and coffee in Friendswood and Webster, Texas</span>
        </h1>
        <p className="hero-sub mt-5 max-w-[34ch] text-[0.95rem] font-medium text-cream/90 md:mt-7 md:text-[1.15rem]">
          {site.heroSubhead}
        </p>
      </div>

      <div className="hero-cue-top pointer-events-none absolute bottom-[calc(var(--bar-h)+env(safe-area-inset-bottom)+22px)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/80 md:bottom-8">
        <span className="scroll-cue__line" />
        <span className="eyebrow !tracking-[0.3em]">scroll</span>
      </div>

      {/* 15–50%: pour line */}
      <p className="hero-pour font-display pointer-events-none absolute left-[var(--gutter)] bottom-[calc(var(--bar-h)+env(safe-area-inset-bottom)+22vh)] max-w-[14ch] text-[clamp(28px,5vw,64px)] leading-[1.02] italic font-light text-cream opacity-0 md:bottom-[16vh]">
        Whisked to order. <br className="hidden md:inline" />
        Every cup.
      </p>

      {/* 50–100%: headline + CTAs */}
      <div className="hero-bottom absolute left-[var(--gutter)] right-[var(--gutter)] flex flex-col items-start">
        <h2 className="hero-headline font-display text-[clamp(34px,11.5vw,72px)] leading-[0.9] font-black tracking-[-0.03em] text-cream md:text-[clamp(64px,8.6vw,150px)]">
          {HEADLINE.map((line, i) => (
            <span key={line} className={`hero-line hero-line-${i}`}>
              {line}
            </span>
          ))}
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-8 md:gap-4">
          <div className="hero-cta opacity-0">
            <Magnetic>
              <OrderCta className="btn btn-primary" data-cursor="link">
                Order ahead <span className="btn__arrow" aria-hidden="true">→</span>
              </OrderCta>
            </Magnetic>
          </div>
          <div className="hero-cta opacity-0">
            <Magnetic>
              <Link href="/#locations" onClick={(e) => { e.preventDefault(); scrollToId("locations"); }} className="btn btn-outline text-cream" data-cursor="link">
                Find a location
              </Link>
            </Magnetic>
          </div>
          <div className="hero-cta opacity-0">
            <Link href="/#drop" onClick={(e) => { e.preventDefault(); scrollToId("drop"); }} className="inline-flex min-h-[44px] items-center gap-1 px-1 text-[0.9rem] font-semibold text-cream/85 underline-offset-4 hover:underline" data-cursor="link">
              See what&apos;s new
            </Link>
          </div>
        </div>
        <div className="hero-cue-end mt-6 hidden items-center gap-3 text-cream/70 opacity-0 md:flex">
          <span className="scroll-cue__line !h-8 !w-px" />
          <span className="eyebrow !tracking-[0.3em]">scroll</span>
        </div>
      </div>
    </section>
  );
}
