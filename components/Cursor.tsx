"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/media";

type State = "default" | "link" | "play";

/** Cream dot that becomes an arrow over links and a PLAY ring over the hero. Desktop pointers only. */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const html = document.documentElement;
    html.classList.add("cursor-on");

    const dot = el.querySelector<HTMLElement>(".cursor__dot")!;
    const ring = el.querySelector<HTMLElement>(".cursor__ring")!;
    const label = el.querySelector<HTMLElement>(".cursor__label")!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.16, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.16, ease: "power3.out" });

    let state: State = "default";
    const setState = (next: State) => {
      if (next === state) return;
      state = next;
      el.dataset.state = next;
      label.textContent = next === "play" ? "PLAY" : next === "link" ? "→" : "";
      gsap.to(ring, {
        scale: next === "default" ? 0 : next === "play" ? 1 : 0.62,
        opacity: next === "default" ? 0 : 1,
        duration: 0.4,
        ease: "expo.out",
        overwrite: true,
      });
      gsap.to(dot, { scale: next === "default" ? 1 : 0, duration: 0.25, ease: "power2.out", overwrite: true });
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.style.opacity = "1";
      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button'], summary");
      const wanted = (target?.getAttribute("data-cursor") as State | "none" | null) ?? (target ? "link" : "default");
      setState(wanted === "none" ? "default" : wanted);
    };
    const hide = () => (el.style.opacity = "0");
    const show = () => (el.style.opacity = "1");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);

    return () => {
      html.classList.remove("cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div ref={root} className="cursor" data-state="default" aria-hidden="true">
      <div className="cursor__ring">
        <span className="cursor__label" />
      </div>
      <div className="cursor__dot" />
    </div>
  );
}
