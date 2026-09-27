import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Casa Matcha handles your information on this website. Short version: we barely collect any.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <main id="main" data-theme="light" className="bg-cream px-gutter pt-[calc(var(--nav-h)+48px)] pb-24 text-ink">
        <article className="mx-auto max-w-[68ch]">
          <p className="eyebrow text-matcha-deep">Privacy policy</p>
          <h1 className="font-display mt-4 text-[clamp(40px,9vw,64px)] leading-[0.95] font-black tracking-[-0.03em] md:text-[clamp(56px,5.5vw,88px)]">Your data, kept simple.</h1>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink/80">Effective September 26, 2026. This policy covers the website at {site.url.replace("https://", "")}, run by {site.legalName} (&ldquo;Casa Matcha&rdquo;, &ldquo;we&rdquo;).</p>

          <div className="prose-cm mt-10 space-y-8 text-[1.02rem] leading-relaxed text-ink/85">
            <section>
              <h2 className="font-display text-[1.6rem] font-bold">What we collect</h2>
              <p className="mt-2">This site has no accounts, forms, or checkout. We do not ask for your name, email, or phone number, and we do not sell or share personal information.</p>
              <p className="mt-2">Our hosting provider (Vercel) keeps standard server logs, such as IP address, browser type, pages requested, and timestamps, for security and to keep the site running. These logs are retained for a limited time and are not used to identify you.</p>
            </section>
            <section>
              <h2 className="font-display text-[1.6rem] font-bold">Cookies and storage</h2>
              <p className="mt-2">We do not use advertising cookies. The site stores a few small flags in your browser&apos;s session storage (for example, whether you have already seen the intro animation or a notification) so we do not repeat them. That data never leaves your device and clears when you close the tab.</p>
            </section>
            <section>
              <h2 className="font-display text-[1.6rem] font-bold">Third-party links</h2>
              <p className="mt-2">Buttons on this site open Google Maps (directions), Instagram (our profile), Eventbrite (tickets), and our ordering partners joe coffee (pickup) and DoorDash (delivery). Once you leave, those services&apos; own privacy policies apply, and any order you place is handled by them, not by this site. Your phone&apos;s dialer handles &ldquo;Call&rdquo; buttons; we never see the call.</p>
            </section>
            {process.env.NEXT_PUBLIC_CLARITY_ID && (
              <section>
                <h2 className="font-display text-[1.6rem] font-bold">Analytics</h2>
                <p className="mt-2">We use Microsoft Clarity to understand how people use the site, for example how many visitors tap an order button. Clarity collects usage data such as pages viewed, clicks and scrolling, and may set cookies. It is governed by the{" "}
                  <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Microsoft Privacy Statement</a>.
                </p>
              </section>
            )}
            <section>
              <h2 className="font-display text-[1.6rem] font-bold">Hours and location features</h2>
              <p className="mt-2">Open/closed status is calculated in your browser from our published hours and the current time in Central Time. We do not request or store your location.</p>
            </section>
            <section>
              <h2 className="font-display text-[1.6rem] font-bold">Children</h2>
              <p className="mt-2">This site is not directed at children under 13 and we do not knowingly collect information from them.</p>
            </section>
            <section>
              <h2 className="font-display text-[1.6rem] font-bold">Changes and contact</h2>
              <p className="mt-2">If we ever add analytics, a newsletter, or online ordering, we will update this page first. Questions? Message us on Instagram at{" "}
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  {site.instagram.handle}
                </a>{" "}
                or ask at the counter.
              </p>
            </section>
          </div>

          <Link href="/" className="btn btn-ink mt-12">
            ← Back to Casa Matcha
          </Link>
        </article>
      </main>
      <Footer compact />
    </>
  );
}
