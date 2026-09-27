import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { menu } from "@/content/menu";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Menu",
  description: "Matcha, café and pan dulce at Casa Matcha in Friendswood and Webster, TX. Whisked to order, every cup.",
  alternates: { canonical: "/menu" },
};

const groups: { title: string; ids: string[] }[] = [
  { title: "Matcha", ids: ["iced-matcha", "dirty-matcha", "strawberry-matcha", "fruity-pebbles-matcha"] },
  { title: "Café", ids: ["sea-salt-cold-brew"] },
  { title: "Bakery", ids: ["conchas"] },
];

export default function MenuPage() {
  return (
    <>
      <main id="main" data-theme="light" className="bg-cream px-gutter pt-[calc(var(--nav-h)+48px)] pb-24 text-ink">
        <header className="max-w-[60ch]">
          <p className="eyebrow text-matcha-deep">Menu</p>
          <h1 className="font-display mt-4 text-[clamp(40px,9vw,64px)] leading-[0.95] font-black tracking-[-0.03em] md:text-[clamp(56px,5.5vw,88px)]">Whisked to order. Every cup.</h1>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink/80">
            The full printed menu is coming online soon. Until then, these are the ones people drive across the Bay Area for. Seasonal drops rotate, so ask what&apos;s new at the counter or check{" "}
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              Instagram
            </a>
            .
          </p>
        </header>
        <div className="mt-14 space-y-14">
          {groups.map((g) => (
            <section key={g.title} aria-labelledby={`menu-${g.title}`}>
              <h2 id={`menu-${g.title}`} className="font-display text-[2rem] font-bold">
                {g.title}
              </h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {g.ids
                  .map((id) => menu.items.find((m) => m.id === id)!)
                  .map((item) => (
                    <li key={item.id} className="flex gap-4 rounded-2xl bg-foam p-3">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Image src={item.image} alt={item.alt} fill sizes="80px" quality={70} className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-display text-[1.15rem] leading-tight font-bold">{item.name}</h3>
                        <p className="mt-1 text-[0.9rem] leading-snug text-ink/70">{item.line}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <Link href="/#locations" className="btn btn-primary mt-14">
          Find a location <span aria-hidden="true">→</span>
        </Link>
      </main>
      <Footer compact />
    </>
  );
}
