"use client";
import Image from "next/image";
import { useRef } from "react";
import { useIdleGSAP } from "@/lib/gsap";
import { revealUp } from "@/lib/motion";
import { instagram } from "@/content/instagram";

export function Instagram() {
  const ref = useRef<HTMLElement>(null);
  useIdleGSAP(() => {
      const root = ref.current;
      if (!root) return;
      revealUp(root.querySelector(".ig-handle"), { y: 40, trigger: root, start: "top 75%" });
      revealUp(root.querySelectorAll(".ig-tile"), { y: 30, stagger: 0.06, trigger: root, start: "top 65%" });
  }, ref);

  return (
    <section id="instagram" ref={ref} data-theme="light" className="overflow-hidden bg-cream py-24 text-ink md:py-36" aria-labelledby="ig-title">
      <div className="px-gutter">
        <span className="eyebrow text-matcha-deep">Follow along</span>
        <h2 id="ig-title" className="mt-3">
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-handle font-display inline-flex items-baseline gap-2 text-[clamp(38px,10.5vw,72px)] leading-none font-black tracking-[-0.04em] transition-colors hover:text-matcha-deep md:text-[clamp(64px,8vw,150px)]"
          >
            {instagram.handle}
            <span className="text-[0.4em] font-light text-matcha" aria-hidden="true">↗</span>
            <span className="sr-only">(opens Instagram)</span>
          </a>
        </h2>
      </div>
      <ul className="px-gutter mt-10 grid grid-cols-2 gap-2 md:mt-14 md:grid-cols-3 md:gap-4">
        {instagram.tiles.map((t) => (
          <li key={t.src}>
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="ig-tile group relative block aspect-square overflow-hidden rounded-2xl bg-foam" aria-label={`${t.alt} — open Casa Matcha on Instagram`}>
              <Image src={t.src} alt="" fill sizes="(min-width: 768px) 30vw, 50vw" quality={70} className="object-cover" />
              <span className="ig-tile__arrow absolute right-3 bottom-3 grid h-11 w-11 place-items-center rounded-full bg-matcha text-[1.2rem] text-foam" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
