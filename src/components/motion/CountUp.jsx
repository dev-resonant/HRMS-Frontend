import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/** Number that counts up to `value` once it is known. Shows "—" for non-numbers. */
export function CountUp({ value, duration = 1 }) {
  const ref = useRef(null);
  const numeric = typeof value === "number" && Number.isFinite(value);

  useGSAP(
    () => {
      if (!numeric || !ref.current) return;
      const el = ref.current;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = value.toLocaleString();
        return;
      }
      const state = { n: 0 };
      gsap.to(state, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(state.n).toLocaleString();
        },
      });
    },
    { dependencies: [value], scope: ref }
  );

  return <span ref={ref}>{numeric ? 0 : "—"}</span>;
}
