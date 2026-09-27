"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useIdleGSAP } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/media";
import { hoursRows } from "@/lib/hours";
import { toasts } from "@/lib/toasts";
import { useOpenStatus } from "@/lib/use-open-status";
import { orderOptions, pickupLabel } from "@/lib/ordering";
import { OrderLink } from "@/components/order/OrderLink";
import { locations, directionsUrl, fullAddress, type Location } from "@/content/locations";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { StatusPill } from "./StatusPill";

export function Locations() {
  const section = useRef<HTMLElement>(null);

  useIdleGSAP(() => {
      const root = section.current;
      if (!root) return;
      const reduce = prefersReducedMotion();
      const cards = gsap.utils.toArray<HTMLElement>(".loc-card");

      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>(".loc-img")!;
        const text = card.querySelectorAll<HTMLElement>(".loc-text > *");
        if (!reduce) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 78%", once: true } });
          tl.fromTo(img, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "expo.out" });
          tl.fromTo(img.firstElementChild, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "expo.out", clearProps: "transform" }, 0);
          tl.from(text, { y: 26, opacity: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", clearProps: "all" }, 0.45);
        }
        if (isFinePointer() && !reduce) {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
          gsap.set(card, { transformPerspective: 1400 });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ry(px * 4);
            rx(-py * 4);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
        }
      });

  }, section);

  return (
    <section id="locations" ref={section} data-theme="light" className="bg-cream px-gutter py-24 text-ink md:py-36" aria-labelledby="locations-title">
      <header className="mb-12 max-w-[40rem] md:mb-16">
        <span className="eyebrow text-matcha-deep">Two spots, one familia</span>
        <SplitReveal as="h2" id="locations-title" className="font-display mt-4 text-[clamp(40px,10vw,64px)] leading-[0.95] font-black tracking-[-0.03em] md:text-[clamp(56px,5.6vw,96px)]">
          Friendswood & Webster, TX
        </SplitReveal>
        <p className="mt-5 max-w-[42ch] text-[1.05rem] leading-relaxed text-ink/75">Both in Houston&apos;s Bay Area, both whisking. Tap an address to copy it.</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {locations.map((loc) => (
          <LocationCard key={loc.id} loc={loc} />
        ))}
      </div>
    </section>
  );
}

function LocationCard({ loc }: { loc: Location }) {
  const [copied, setCopied] = useState(false);
  const address = fullAddress(loc);
  const status = useOpenStatus(loc.hours, loc.short);
  const options = orderOptions(loc.id);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toasts.copied(false, address);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy the address", address);
    }
  };

  return (
    <article id={loc.id} className="loc-card grid overflow-hidden rounded-[28px] bg-foam shadow-[0_30px_80px_-40px_rgba(23,26,20,0.35)] sm:grid-cols-[0.9fr_1.1fr]">
      <div className="loc-img relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-[420px]">
        <Image
          src={loc.image.src}
          alt={loc.image.alt}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
          quality={75}
          className="object-cover"
        />
      </div>
      <div className="loc-text flex flex-col gap-5 p-6 md:p-9">
        <h3 className="font-display text-[2.2rem] leading-none font-black tracking-tight md:text-[2.6rem]">{loc.name}</h3>
        <button
          type="button"
          onClick={copy}
          className="group -mx-2 rounded-xl px-2 py-1 text-left text-[1.05rem] leading-snug transition-colors hover:bg-ink/5"
        >
          <span className="sr-only">Copy address: </span>
          <span className="block font-semibold">{loc.street}</span>
          <span className="block text-ink/75">
            {loc.city}, {loc.state} {loc.zip}
          </span>
          <span className="mt-1 block text-[0.72rem] font-semibold tracking-wider text-matcha-deep uppercase">
            {copied ? "Copied ✓" : "Tap to copy"}
          </span>
        </button>
        {loc.callout && (
          <p className="rounded-2xl border border-matcha/30 bg-matcha/8 px-4 py-3 text-[0.9rem] leading-snug text-matcha-deep">
            <span aria-hidden="true">🚀 </span>
            {loc.callout}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <a href={directionsUrl(loc)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" aria-label={`Directions to Casa Matcha ${loc.name} (opens Google Maps)`}>
            Directions <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a href={`tel:${loc.phone}`} className="btn btn-outline" aria-label={`Call Casa Matcha ${loc.name} at ${loc.phoneDisplay}`}>
            {loc.phoneDisplay}
          </a>
        </div>
        <table className="mt-1 w-full text-[0.92rem]">
          <caption className="sr-only">Hours for Casa Matcha {loc.name}</caption>
          <tbody>
            {hoursRows(loc.hours).map((r) => (
              <tr key={r.days} className="hours-row border-t border-ink/8" data-today={r.today}>
                <th scope="row" className="py-1.5 pr-4 text-left font-medium text-ink/70">
                  {r.days}
                </th>
                <td className="py-1.5 text-right tabular-nums">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="loc-order mt-1 flex flex-col gap-3 border-t border-ink/8 pt-5">
          <StatusPill hours={loc.hours} name={loc.short} status={status} className="self-start" />
          {options.length ? (
            <div className="flex flex-wrap gap-3">
              {options.map((opt) => (
                <OrderLink
                  key={opt.kind}
                  location={loc.id}
                  kind={opt.kind}
                  className={opt.kind === "pickup" ? "btn btn-primary" : "btn btn-outline"}
                  aria-label={`${opt.kind === "pickup" ? pickupLabel(!!status?.isOpen) : "Delivery"} from Casa Matcha ${loc.name} on ${opt.provider === "joe" ? "joe coffee" : "DoorDash"} (opens in a new tab)`}
                >
                  {opt.kind === "pickup" ? pickupLabel(!!status?.isOpen) : "Delivery"}
                  <span className="btn__arrow" aria-hidden="true">↗</span>
                </OrderLink>
              ))}
            </div>
          ) : (
            <p className="text-[0.9rem] text-ink/70">Online ordering for {loc.name} is coming soon. Order at the counter, or order from Webster.</p>
          )}
        </div>
      </div>
    </article>
  );
}
