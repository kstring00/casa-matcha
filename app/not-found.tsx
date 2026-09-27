import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LostToast } from "@/components/LostToast";

export const metadata: Metadata = { title: "Lost in space", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" data-theme="dark" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-gutter text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[...Array(28)].map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-cream/70"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, opacity: 0.3 + ((i * 7) % 6) / 10 }}
          />
        ))}
      </div>
      <div className="relative flex max-w-[34rem] flex-col items-center text-center">
        <div className="drift text-cream">
          <Logo variant="mark" className="h-40 w-40 md:h-56 md:w-56" />
        </div>
        <p className="eyebrow mt-4 text-matcha-light">404</p>
        <h1 className="font-display mt-3 text-[clamp(44px,11vw,72px)] leading-[0.92] font-black tracking-[-0.03em] md:text-[clamp(64px,6vw,104px)]">Lost in space?</h1>
        <p className="mt-5 max-w-[36ch] text-[1.05rem] leading-relaxed text-cream/75">This page floated off somewhere past NASA Pkwy. The matcha is still where you left it.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back home <span aria-hidden="true">→</span>
          </Link>
          <Link href="/#locations" className="btn btn-outline text-cream">
            Find a location
          </Link>
        </div>
      </div>
      <LostToast />
    </main>
  );
}
