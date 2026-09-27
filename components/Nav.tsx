"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollToId } from "@/lib/scroll";

const links = [
  { href: "#drop", label: "The Drop" },
  { href: "#locations", label: "Locations" },
  { href: "#menu", label: "Menu" },
  { href: "#events", label: "Events" },
];

type Theme = "light" | "dark";

/** Fixed nav that recolors itself to whatever section (data-theme) is under it. */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let raf = 0;
    const probe = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const y = Math.min(window.innerHeight - 1, 40);
      const els = document.elementsFromPoint(Math.floor(window.innerWidth * 0.5), y);
      for (const el of els) {
        if (nav.contains(el)) continue;
        const themed = el.closest<HTMLElement>("[data-theme]");
        if (themed) {
          setTheme(themed.dataset.theme === "dark" ? "dark" : "light");
          return;
        }
      }
      setTheme("light");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#") || window.location.pathname !== "/") return;
    e.preventDefault();
    scrollToId(href.slice(1));
    history.replaceState(null, "", href);
  };

  return (
    <header
      ref={ref}
      className={`nav pointer-events-none fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] ${scrolled ? "is-scrolled" : ""}`}
      data-theme={theme}
    >
      <div className="px-gutter flex h-full items-center justify-between gap-4">
        <Link href="/" className="pointer-events-auto flex items-center gap-2.5" aria-label="Casa Matcha, home">
          <Logo variant="mark" className="h-10 w-10 md:h-11 md:w-11" />
          <span className="font-display hidden text-[1.05rem] font-bold tracking-tight sm:inline">Casa Matcha</span>
        </Link>

        <nav aria-label="Primary" className="pointer-events-auto hidden md:block">
          <ul className="nav__pill flex items-center gap-7 rounded-full px-6 py-2.5 text-[0.9rem] font-semibold">
            {links.map((l) => (
              <li key={l.href}>
                <a href={`/${l.href}`} onClick={(e) => go(e, l.href)} className="nav__link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pointer-events-auto">
          <Magnetic>
            <Link
              href="/#locations"
              onClick={(e) => go(e, "#locations")}
              className={`btn ${theme === "dark" ? "btn-cream" : "btn-ink"} !min-h-[42px] !px-4 text-[0.85rem] md:!min-h-[46px] md:!px-5`}
            >
              <span className="md:hidden">Locations</span>
              <span className="hidden md:inline">Find a location</span>
              <span className="btn__arrow hidden md:inline" aria-hidden="true">
                →
              </span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
