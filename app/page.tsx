import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Drop } from "@/components/sections/Drop";
import { Locations } from "@/components/sections/Locations";
import { MenuHighlights } from "@/components/sections/MenuHighlights";
import { Events } from "@/components/sections/Events";
import { Familia } from "@/components/sections/Familia";
import { Reviews } from "@/components/sections/Reviews";
import { Instagram } from "@/components/sections/Instagram";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Marquee />
        <Drop />
        <Locations />
        <MenuHighlights />
        <Events />
        <Familia />
        <Reviews />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
