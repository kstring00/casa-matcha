"use client";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { markIntroDone } from "@/lib/bus";
import { sessionSet } from "@/lib/session";

/**
 * 900ms brand curtain. The animation itself is CSS (starts at first paint, no JS
 * needed); this component only records the visit and removes the panel when the
 * CSS animations finish. Skipped by the head boot script on repeat visits and
 * for prefers-reduced-motion.
 */
export function Curtain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finish = () => {
      el.remove();
      markIntroDone();
    };
    if (document.documentElement.classList.contains("no-curtain")) {
      finish();
      return;
    }
    sessionSet("curtain");
    let done = false;
    const once = () => {
      if (done) return;
      done = true;
      finish();
    };
    const anims = el.getAnimations({ subtree: true });
    if (!anims.length) once();
    else Promise.allSettled(anims.map((a) => a.finished)).then(once);
    const fallback = window.setTimeout(once, 1500);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div ref={ref} className="curtain" aria-hidden="true">
      <div className="curtain__green" />
      <div className="curtain__cream">
        <div className="curtain__mark">
          <Logo variant="badge" className="h-28 w-28 md:h-36 md:w-36" />
        </div>
      </div>
    </div>
  );
}
