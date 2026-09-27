"use client";
import { useEffect } from "react";
import { afterIntroIdle } from "@/lib/bus";

/**
 * Microsoft Clarity, loaded after the intro and only when
 * NEXT_PUBLIC_CLARITY_ID is set. The queue stub means order-click events fired
 * before the tag loads are still recorded.
 */
export function Clarity() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!id || document.getElementById("ms-clarity")) return;
    return afterIntroIdle(() => {
      if (!window.clarity) {
        const stub = ((...args: unknown[]) => {
          (stub.q = stub.q || []).push(args);
        }) as NonNullable<Window["clarity"]>;
        window.clarity = stub;
      }
      const s = document.createElement("script");
      s.id = "ms-clarity";
      s.async = true;
      s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
      document.head.appendChild(s);
    }, 4000);
  }, []);
  return null;
}
