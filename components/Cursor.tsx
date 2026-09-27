"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/media";

type State = "default" | "link" | "play";

/**
 * Cream dot that becomes an arrow over links and a PLAY ring over the hero.
 * Desktop pointers only. The dot snaps to the pointer (no lag, so it is never
 * "lost"); only the ring trails.
 */
export function Cursor() {
  const dotRoot = useRef<HTMLDivElement>(null);
  const ringRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotEl = dotRoot.current;
    const ringEl = ringRoot.current;
    if (!dotEl || !ringEl || !isFinePointer() || prefersReducedMotion()) return;
    const html = document.documentElement;
    html.classList.add("cursor-on");

    const dot = dotEl.querySelector<HTMLElement>(".cursor__dot")!;
    const ring = ringEl.querySelector<HTMLElement>(".cursor__ring")!;
    const label = ringEl.querySelector<HTMLElement>(".cursor__label")!;
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.22, ease: "power3.out" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.22, ease: "power3.out" });

    let state: State = "default";
    const setState = (next: State) => {
      if (next === state) return;
      state = next;
      dotEl.dataset.state = next;
      ringEl.dataset.state = next;
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

    const show = () => {
      dotEl.style.opacity = "1";
      ringEl.style.opacity = "1";
    };
    const hide = () => {
      dotEl.style.opacity = "0";
      ringEl.style.opacity = "0";
    };
    const onMove = (e: PointerEvent) => {
      gsap.set(dotEl, { x: e.clientX, y: e.clientY });
      ringX(e.clientX);
      ringY(e.clientY);
      show();
      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button'], summary");
      const wanted = (target?.getAttribute("data-cursor") as State | "none" | null) ?? (target ? "link" : "default");
      setState(wanted === "none" ? "default" : wanted);
    };

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
    <>
      <div ref={ringRoot} className="cursor-ring" data-state="default" aria-hidden="true">
        <div className="cursor__ring">
          <span className="cursor__label" />
        </div>
      </div>
      <div ref={dotRoot} className="cursor" data-state="default" aria-hidden="true">
        <div className="cursor__dot" />
      </div>
    </>
  );
}
