"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { isDesktopWidth, isFinePointer, prefersReducedMotion } from "@/lib/media";

/** Pulls the child toward the pointer by up to `strength` px. Desktop pointers only. */
export function Magnetic({ children, strength = 10, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || !isDesktopWidth() || prefersReducedMotion()) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    const xTo = gsap.quickTo(target, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.45, ease: "power3.out" });
    const clamp = gsap.utils.clamp(-strength, strength);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(clamp((e.clientX - (r.left + r.width / 2)) * 0.3));
      yTo(clamp((e.clientY - (r.top + r.height / 2)) * 0.3));
    };
    const onLeave = () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block ${className}`} style={{ padding: 14, margin: -14 }}>
      {children}
    </div>
  );
}
