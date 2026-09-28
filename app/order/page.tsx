import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderFlow } from "@/components/order/OrderFlow";
import { Footer } from "@/components/sections/Footer";

// Rendered per request so ?location= and ?item= deep links arrive in the HTML
// (no Suspense fallback, no layout shift, LCP text in the first paint).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order ahead",
  description: "Order ahead for pickup at Casa Matcha in Webster or Friendswood, TX. Demo ordering flow: nothing is charged.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <>
      <main id="main" data-theme="light" className="bg-cream text-ink">
        <Suspense fallback={<div className="min-h-[60svh]" aria-busy="true" />}>
          <OrderFlow />
        </Suspense>
      </main>
      <Footer compact />
    </>
  );
}
