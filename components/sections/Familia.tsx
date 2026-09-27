"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useIdleGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { revealUp } from "@/lib/motion";
import { SplitReveal } from "@/components/motion/SplitReveal";

const sentences = [
  "Casa Matcha started as a familia thing: a love of good matcha, a Sunday cafecito habit, and a tiny room in Webster with an astronaut on the door.",
  "We whisk every cup to order with ceremonial-grade matcha, pull real espresso, and bake conchas most mornings.",
  "Two spots now, Friendswood and Webster, same rule: if you walk in, you're familia. Buena vibra included.",
];

export function Familia() {
  const ref = useRef<HTMLElement>(null);

  useIdleGSAP(() => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const figure = root.querySelector<HTMLElement>(".fam-figure")!;
      const wipe = root.querySelector<HTMLElement>(".fam-wipe")!;
      const photo = root.querySelector<HTMLElement>(".fam-photo")!;

      gsap
        .timeline({ scrollTrigger: { trigger: figure, start: "top 75%", once: true } })
        .fromTo(photo, { scale: 1.25 }, { scale: 1.12, duration: 1.6, ease: "expo.out" }, 0)
        .to(wipe, { scaleY: 0, transformOrigin: "top", duration: 1.1, ease: "expo.inOut" }, 0.1);

      gsap.fromTo(
        photo,
        { y: -30 },
        { y: 30, ease: "none", scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: true } },
      );

      revealUp(root.querySelectorAll(".fam-text"), { y: 28, stagger: 0.1, trigger: root, start: "top 65%" });
  }, ref);

  return (
    <section id="familia" ref={ref} data-theme="light" className="bg-cream px-gutter py-24 text-ink md:py-36" aria-labelledby="familia-title">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <figure className="fam-figure relative aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-matcha-deep/10 md:max-w-[520px]">
          <div className="fam-photo absolute inset-0 scale-[1.12]">
            <Image
              src="/about/owners.jpg"
              alt="One of the Casa Matcha owners smiling and holding two iced drinks in front of a 'love you so matcha' sign"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className="object-cover"
            />
          </div>
          <div className="fam-wipe absolute inset-0 z-10 bg-matcha" aria-hidden="true" />
        </figure>
        <div>
          <span className="eyebrow fam-text text-matcha-deep">Familia</span>
          <SplitReveal as="h2" id="familia-title" className="font-display mt-4 text-[clamp(38px,9.5vw,60px)] leading-[0.95] font-black tracking-[-0.03em] md:text-[clamp(48px,4.6vw,84px)]">
            Familia-owned. Latino-owned. Proud of both.
          </SplitReveal>
          <div className="mt-7 space-y-4 text-[1.05rem] leading-relaxed text-ink/80 md:text-[1.12rem]">
            {sentences.map((s) => (
              <p key={s} className="fam-text">
                {s}
              </p>
            ))}
          </div>
          <blockquote className="fam-text font-display mt-9 border-l-2 border-matcha pl-5 text-[1.35rem] leading-snug italic text-matcha-deep md:text-[1.6rem]">
            <p>&ldquo;Matcha-te-ame. It just means a good matcha, good beats, and a good time.&rdquo;</p>
            <footer className="font-body mt-3 text-[0.8rem] font-semibold tracking-wider text-ink/75 uppercase not-italic">— the owners</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
