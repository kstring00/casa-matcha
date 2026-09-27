"use client";
import Image from "next/image";
import { useRef } from "react";
import { ScrollTrigger, useIdleGSAP } from "@/lib/gsap";
import { revealUp } from "@/lib/motion";
import { formatEventDate } from "@/lib/hours";
import { toasts, isEventWithinWeek } from "@/lib/toasts";
import { events } from "@/content/events";
import { getLocation } from "@/content/locations";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";

export function Events() {
  const ref = useRef<HTMLElement>(null);
  const d = formatEventDate(events.next.date);
  const loc = getLocation(events.next.locationId);

  useIdleGSAP(() => {
      const root = ref.current;
      if (!root) return;
      revealUp(root.querySelectorAll(".ev-reveal"), { y: 30, stagger: 0.1, trigger: root, start: "top 65%" });
      revealUp(root.querySelector(".ev-photo"), { y: 60, rotate: -6, trigger: root, start: "top 60%", clear: false });
      ScrollTrigger.create({
        trigger: root,
        start: "top 55%",
        once: true,
        onEnter: () => {
          if (isEventWithinWeek()) toasts.event();
        },
      });
  }, ref);

  return (
    <section id="events" ref={ref} data-theme="dark" className="grain overflow-hidden bg-ink text-cream" aria-labelledby="events-title">
      <div className="px-gutter grid items-end gap-12 py-24 md:grid-cols-[1.25fr_0.75fr] md:py-36">
        <div>
          <span className="eyebrow ev-reveal text-caramel">{events.eyebrow} · DJ nights</span>
          <SplitReveal as="h2" id="events-title" className="font-display mt-5 text-[clamp(52px,14vw,96px)] leading-[0.86] font-light tracking-[-0.02em] italic md:text-[clamp(80px,9.5vw,180px)]">
            Matcha, Café y Perreo
          </SplitReveal>
          <p className="ev-reveal mt-7 max-w-[44ch] text-[1.05rem] leading-relaxed text-cream/80 md:text-[1.15rem]">{events.blurb}</p>

          <div className="ev-reveal mt-10 flex flex-wrap items-end gap-x-8 gap-y-4">
            <time dateTime={events.next.date} className="flex flex-col">
              <span className="eyebrow text-cream/80">{d.weekday}</span>
              <span className="font-display text-[clamp(56px,12vw,96px)] leading-[0.9] font-black tracking-[-0.04em] text-caramel md:text-[clamp(80px,8vw,140px)]">
                {d.month} {d.day}
              </span>
            </time>
            <div className="pb-2 text-[0.95rem] leading-snug text-cream/80">
              <p>
                Doors {events.next.doors} · Casa Matcha {loc.name}
              </p>
              <p className="text-cream/70">
                {loc.street}, {loc.city}
              </p>
            </div>
          </div>

          <div className="ev-reveal mt-10">
            <Magnetic>
              <a href={events.next.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-caramel !px-8 text-[1rem]">
                Get tickets <span className="btn__arrow" aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <figure className="ev-photo mx-auto w-[min(78vw,320px)] rotate-[-3deg] rounded-[6px] bg-foam p-3 pb-5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] md:mx-0 md:w-[min(30vw,380px)] md:rotate-[2.5deg]">
          <div className="relative aspect-[3/4] overflow-hidden bg-cream">
            <Image src={events.image.src} alt={events.image.alt} fill sizes="(min-width: 768px) 30vw, 78vw" quality={75} className="object-cover" />
          </div>
          <figcaption className="font-display mt-3 text-center text-[0.95rem] leading-snug italic">
            Just means a good matcha, beats, good vibes and a good time.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
