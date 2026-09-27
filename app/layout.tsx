import type { Metadata, Viewport } from "next";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { localBusinessJsonLd } from "@/lib/schema";
import { Providers } from "@/components/Providers";
import { Curtain } from "@/components/Curtain";
import { Nav } from "@/components/Nav";
import { StickyBar } from "@/components/StickyBar";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
});

// Italic is only used below the fold (marquee, events, quotes), so it is not
// preloaded: keeps 80 KB off the LCP critical path.
const frauncesItalic = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: "italic",
  display: "swap",
  preload: false,
  variable: "--font-fraunces-italic",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Casa Matcha" },
  description: site.description,
  applicationName: site.name,
  keywords: ["matcha", "coffee shop", "Friendswood TX", "Webster TX", "Latino-owned", "conchas", "cold brew", "Bay Area Houston"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint: skips the curtain on repeat visits / reduced motion. */
const bootScript = `(function(){var d=document.documentElement;try{d.classList.add('js');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r)d.classList.add('reduce-motion');if(r||sessionStorage.getItem('cm:curtain'))d.classList.add('no-curtain');}catch(e){d.classList.add('no-curtain')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${frauncesItalic.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-body bg-cream text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Curtain />
        <Nav />
        {children}
        <StickyBar />
        <Providers />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </body>
    </html>
  );
}
