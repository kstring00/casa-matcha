import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { locations, hoursSummary, directionsUrl } from "@/content/locations";

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-matcha-deep text-cream">
      {!compact && (
        <div
          aria-hidden="true"
          className="font-display pointer-events-none absolute top-[2vw] left-[28vw] leading-[0.8] font-black tracking-[-0.04em] whitespace-nowrap text-cream/[0.12] select-none"
          style={{ fontSize: "clamp(120px, 26vw, 460px)" }}
        >
          CASA MATCHA
        </div>
      )}
      <div className={`px-gutter relative ${compact ? "pt-16" : "pt-[clamp(150px,24vw,400px)]"} pb-[calc(var(--bar-h)+env(safe-area-inset-bottom)+32px)] md:pb-12`}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="badge" className="h-24 w-24 text-ink" title="Casa Matcha and Coffee" />
            <p className="font-display mt-5 max-w-[24ch] text-[1.25rem] leading-snug italic text-cream/85">{site.tagline}.</p>
          </div>
          {locations.map((l) => (
            <div key={l.id} className="text-[0.95rem] leading-relaxed">
              <h3 className="eyebrow mb-3 text-matcha-light">{l.name}</h3>
              <a href={directionsUrl(l)} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                {l.street}
                <br />
                {l.city}, {l.state} {l.zip}
              </a>
              <a href={`tel:${l.phone}`} className="mt-2 block hover:underline">
                {l.phoneDisplay}
              </a>
            </div>
          ))}
          <div className="text-[0.95rem] leading-relaxed">
            <h3 className="eyebrow mb-3 text-matcha-light">Hours</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {hoursSummary.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="text-cream/80">{h.days}</dt>
                  <dd className="tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-cream/15 pt-6 text-[0.85rem] text-cream/80 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
              Instagram {site.instagram.handle}
            </a>
            <Link href="/privacy" className="hover:text-cream">
              Privacy
            </Link>
            <Link href="/menu" className="hover:text-cream">
              Menu
            </Link>
          </div>
          <p>
            © 2026 {site.name}. {site.footerLove}
          </p>
        </div>
      </div>
    </footer>
  );
}
