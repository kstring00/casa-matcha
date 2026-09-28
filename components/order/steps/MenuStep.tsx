"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Location } from "@/content/locations";
import { demoMenu, type Choice, type DemoItem } from "@/content/order-menu";
import { money, unitPrice } from "@/lib/order-demo";

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  location: Location;
  highlight: string | null;
  onAdd: (item: DemoItem, size?: Choice, milk?: Choice) => void;
  onChangeLocation: () => void;
};

export function MenuStep({ headingRef, location, highlight, onAdd, onChangeLocation }: Props) {
  return (
    <section aria-labelledby="order-h1">
      <p className="eyebrow text-matcha-deep">
        Pickup at {location.name} ·{" "}
        <button type="button" onClick={onChangeLocation} className="underline underline-offset-4 hover:text-ink">
          change
        </button>
      </p>
      <h1 id="order-h1" ref={headingRef} tabIndex={-1} className="font-display mt-3 text-[clamp(36px,9vw,56px)] leading-[0.95] font-black tracking-[-0.03em] outline-none md:text-[clamp(48px,4.6vw,72px)]">
        What are you having?
      </h1>
      <p className="mt-3 text-[0.9rem] text-ink/65">Sample prices. Your real menu comes straight from Clover.</p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
        {demoMenu.map((item) => (
          <ItemCard key={item.id} item={item} highlighted={item.id === highlight} onAdd={onAdd} />
        ))}
      </ul>
    </section>
  );
}

function ItemCard({ item, highlighted, onAdd }: { item: DemoItem; highlighted: boolean; onAdd: Props["onAdd"] }) {
  const [size, setSize] = useState<Choice | undefined>(item.sizes?.[0]);
  const [milk, setMilk] = useState<Choice | undefined>(item.milks?.[0]);
  const [added, setAdded] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const price = unitPrice(item, size, milk);

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ block: "center" });
  }, [highlighted]);

  const add = () => {
    onAdd(item, size, milk);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <li ref={ref} className={`order-card flex gap-4 rounded-3xl bg-foam p-4 md:p-5 ${highlighted ? "ring-2 ring-matcha" : ""}`}>
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream md:h-32 md:w-28">
        <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 112px, 80px" quality={70} className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            {item.tag && <p className="text-[0.66rem] font-bold tracking-wider text-matcha-deep uppercase">{item.tag}</p>}
            <h2 className="font-display text-[1.25rem] leading-tight font-bold md:text-[1.4rem]">{item.name}</h2>
          </div>
          <p className="font-display shrink-0 text-[1.15rem] font-bold tabular-nums" aria-live="polite">
            {money(price)}
          </p>
        </div>
        <p className="mt-1 text-[0.88rem] leading-snug text-ink/70">{item.line}</p>

        {item.sizes && (
          <fieldset className="mt-3">
            <legend className="mb-1.5 text-[0.72rem] font-bold tracking-wider text-ink/60 uppercase">Size</legend>
            <div className="flex flex-wrap gap-1.5">
              {item.sizes.map((s) => (
                <label key={s.id} className={`chip ${size?.id === s.id ? "is-on" : ""}`}>
                  <input type="radio" name={`${item.id}-size`} value={s.id} checked={size?.id === s.id} onChange={() => setSize(s)} className="sr-only" />
                  {s.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {item.milks && (
          <fieldset className="mt-3">
            <legend className="mb-1.5 text-[0.72rem] font-bold tracking-wider text-ink/60 uppercase">Milk</legend>
            <div className="flex flex-wrap gap-1.5">
              {item.milks.map((m) => (
                <label key={m.id} className={`chip ${milk?.id === m.id ? "is-on" : ""}`}>
                  <input type="radio" name={`${item.id}-milk`} value={m.id} checked={milk?.id === m.id} onChange={() => setMilk(m)} className="sr-only" />
                  {m.label}
                  {m.deltaCents > 0 && <span className="ml-1 opacity-60">+{money(m.deltaCents).replace("$", "")}</span>}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <button type="button" onClick={add} className={`btn mt-4 !min-h-[44px] w-full md:w-auto ${added ? "btn-ink" : "btn-primary"}`} aria-label={`Add ${item.name}${size ? `, ${size.label}` : ""}${milk ? `, ${milk.label} milk` : ""}, ${money(price)}`}>
          {added ? "Added ✓" : `Add · ${money(price)}`}
        </button>
      </div>
    </li>
  );
}
