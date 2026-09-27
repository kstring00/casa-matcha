"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useIdleGSAP } from "@/lib/gsap";
import { revealUp } from "@/lib/motion";
import { menu } from "@/content/menu";
import { SplitReveal } from "@/components/motion/SplitReveal";

const aspects = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-square"];
const tagLabel: Record<string, string> = { signature: "Signature", seasonal: "Seasonal", favorite: "Fan favorite", bakery: "Bakery" };

export function MenuHighlights() {
  const ref = useRef<HTMLElement>(null);
  useIdleGSAP(() => {
      const tiles = ref.current?.querySelectorAll(".tile");
      if (tiles?.length) revealUp(tiles, { y: 40, rotate: -2, stagger: 0.07, trigger: ref.current, start: "top 72%" });
  }, ref);

  return (
    <section id="menu" ref={ref} data-theme="light" className="bg-foam px-gutter py-24 text-ink md:py-36" aria-labelledby="menu-title">
      <header className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow text-matcha-deep">{menu.eyebrow}</span>
          <SplitReveal as="h2" id="menu-title" className="font-display mt-4 max-w-[14ch] text-[clamp(40px,10vw,64px)] leading-[0.95] font-black tracking-[-0.03em] md:text-[clamp(56px,5.6vw,96px)]">
            {menu.title}
          </SplitReveal>
        </div>
        <Link href={menu.fullMenuHref} className="btn btn-outline self-start md:self-auto">
          Full menu <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </header>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-6">
        {menu.items.map((item, i) => (
          <li key={item.id} className="tile mb-3 break-inside-avoid md:mb-6">
            <figure>
              <div className={`tile-img relative overflow-hidden rounded-2xl bg-cream ${aspects[i % aspects.length]}`}>
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 30vw, 50vw" quality={75} className="object-cover" />
                <span className="absolute top-3 left-3 rounded-full bg-foam/90 px-2.5 py-1 text-[0.66rem] font-bold tracking-wider text-matcha-deep uppercase backdrop-blur">
                  {tagLabel[item.tag]}
                </span>
              </div>
              <figcaption className="mt-3 md:mt-4">
                <h3 className="font-display text-[1.2rem] leading-tight font-bold md:text-[1.5rem]">{item.name}</h3>
                <p className="mt-1 text-[0.9rem] leading-snug text-ink/70 md:text-[0.98rem]">{item.line}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
