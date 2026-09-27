"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { afterIntroIdle } from "@/lib/bus";

const BrandToaster = dynamic(() => import("@/components/toast/BrandToaster").then((m) => m.BrandToaster), { ssr: false });
const DemoPanel = dynamic(() => import("@/components/DemoPanel").then((m) => m.DemoPanel), { ssr: false });

export function Providers() {
  // Toast UI (sonner) is mounted after the intro so its chunk never sits in front of the LCP.
  const [ready, setReady] = useState(false);
  useEffect(
    () =>
      afterIntroIdle(() => {
        document.documentElement.classList.add("fonts-late");
        setReady(true);
      }, 1500),
    [],
  );
  return (
    <>
      <SmoothScroll />
      <Cursor />
      {ready && <BrandToaster />}
      {ready && <DemoPanel />}
    </>
  );
}
