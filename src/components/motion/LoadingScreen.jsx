import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ApartmentRounded from "@mui/icons-material/ApartmentRounded";

/**
 * Branded loading state: spinning ring around the logo, pulsing, with bouncing dots.
 * fullScreen = covers the viewport (app boot, sign-out); otherwise fills its container (page loads).
 */
export function LoadingScreen({ label = "Loading", fullScreen = false }) {
  const brand = useTheme().palette.brand;
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".ls-ring", { rotation: 360, duration: 1.3, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        gsap.fromTo(".ls-logo", { scale: 0.92 }, { scale: 1.06, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".ls-dot", { y: -6, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.12 });
        gsap.from(ref.current, { opacity: 0, duration: 0.35, delay: 0.12 });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Box
      ref={ref}
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2.5,
        ...(fullScreen
          ? { position: "fixed", inset: 0, zIndex: 2000, bgcolor: "background.default" }
          : { minHeight: "60vh", width: "100%" }),
      }}
    >
      <Box sx={{ position: "relative", width: 92, height: 92, display: "grid", placeItems: "center" }}>
        <Box
          className="ls-ring"
          sx={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid", borderColor: alpha(brand.primary, 0.18), borderTopColor: brand.primary }}
        />
        <Box
          className="ls-logo"
          sx={{ width: 52, height: 52, borderRadius: "16px", display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${brand.accent}, color-mix(in srgb, ${brand.accent} 70%, ${brand.primary}))`, boxShadow: `0 10px 24px ${alpha(brand.accent, 0.35)}` }}
        >
          <ApartmentRounded sx={{ color: "#fff", fontSize: 28 }} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>{label}</Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} className="ls-dot" sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: brand.primary }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
