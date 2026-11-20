import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Fade-and-rise entrance for the elements matching `selector` inside `scope`.
 * Skipped for users who prefer reduced motion; inline styles are cleared afterwards
 * so hover/layout transforms keep working.
 */
export function useReveal(scope, selector = ":scope > *", { y = 18, x = 0, stagger = 0.06, duration = 0.55, delay = 0, scale = 1, dependencies = [] } = {}) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(selector, { y, x, scale, opacity: 0, duration, stagger, delay, ease: "power3.out", clearProps: "transform,opacity" });
      });
      return () => mm.revert();
    },
    { scope, dependencies }
  );
}
