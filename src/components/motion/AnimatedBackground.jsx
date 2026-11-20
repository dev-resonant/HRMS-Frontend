import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

/**
 * Soft blurred colour blobs that drift slowly behind the UI, tinted by the active palette.
 * Pure transform animation (GPU friendly); static for users who prefer reduced motion.
 * intensity: 1 = app background (subtle), 2 = sign-in screens (livelier).
 */
export function AnimatedBackground({ intensity = 1 }) {
  const ref = useRef(null);
  const brand = useTheme().palette.brand;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".bg-blob").forEach((el, i) => {
          gsap.to(el, {
            x: gsap.utils.random(-90, 90),
            y: gsap.utils.random(-70, 70),
            scale: gsap.utils.random(0.9, 1.3),
            duration: gsap.utils.random(10, 18),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: -i * 3,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  const a = intensity === 2 ? 1 : 0.55;
  const blob = (sx) => ({ position: "absolute", borderRadius: "50%", filter: "blur(70px)", willChange: "transform", ...sx });

  return (
    <Box ref={ref} aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <Box className="bg-blob" sx={blob({ width: 520, height: 520, top: "-12%", right: "-6%", bgcolor: alpha(brand.soft, 0.85 * a) })} />
      <Box className="bg-blob" sx={blob({ width: 460, height: 460, bottom: "-14%", left: "8%", bgcolor: alpha(brand.primary, 0.22 * a) })} />
      <Box className="bg-blob" sx={blob({ width: 300, height: 300, top: "38%", left: "46%", bgcolor: alpha(brand.accent, 0.12 * a) })} />
      <Box className="bg-blob" sx={blob({ width: 380, height: 380, top: "6%", left: "-8%", bgcolor: alpha(brand.soft, 0.6 * a) })} />
    </Box>
  );
}
