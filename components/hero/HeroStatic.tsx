import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { OrderCta } from "@/components/order/OrderCta";

/** prefers-reduced-motion hero: the final splash still, headline and CTAs. No pin, no scrub. */
export function HeroStatic() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink text-cream" data-theme="dark" data-hero aria-label="Casa Matcha">
      <Image
        src="/hero/still-splash.png"
        alt="Matcha pouring into a Casa Matcha cup and splashing over the rim"
        fill
        priority
        sizes="100vw"
        quality={70}
        className="object-cover object-[50%_38%]"
      />
      <div className="hero-shade" />
      <div className="px-gutter relative w-full pt-[calc(var(--nav-h)+24px)] pb-[calc(var(--bar-h)+env(safe-area-inset-bottom)+32px)] md:pb-[10vh]">
        <h1 className="font-display text-[clamp(40px,10vw,64px)] leading-none font-black tracking-[-0.03em] md:text-[clamp(56px,6vw,96px)]">
          Casa Matcha
          <span className="sr-only"> — matcha and coffee in Friendswood and Webster, Texas</span>
        </h1>
        <p className="mt-3 max-w-[40ch] text-[1rem] font-medium text-cream/90 md:text-[1.15rem]">{site.heroSubhead}</p>
        <h2 className="font-display mt-8 text-[clamp(34px,9vw,56px)] leading-[0.92] font-black tracking-[-0.03em] md:text-[clamp(48px,5.5vw,92px)]">
          Real matcha. <br /> Real coffee. <br /> Real familia.
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <OrderCta className="btn btn-primary">
            Order ahead <span aria-hidden="true">→</span>
          </OrderCta>
          <Link href="/#locations" className="btn btn-outline text-cream">
            Find a location
          </Link>
          <Link href="/#drop" className="inline-flex min-h-[44px] items-center px-1 text-[0.9rem] font-semibold text-cream/85 underline-offset-4 hover:underline">
            See what&apos;s new
          </Link>
        </div>
      </div>
    </section>
  );
}
