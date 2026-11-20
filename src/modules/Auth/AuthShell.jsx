import { useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import { AnimatedBackground } from "../../components/motion/AnimatedBackground";
import { useReveal } from "../../components/motion/useReveal";

/** Centered card used by every signed-out page, over a drifting colour background. */
export function AuthShell({ title, tagline, children, maxWidth = 440 }) {
  const brand = useTheme().palette.brand;
  const cardRef = useRef(null);
  useReveal(cardRef, ".auth-item", { y: 16, duration: 0.55, stagger: 0.09, delay: 0.1 });

  return (
    <Box sx={{ position: "relative", minHeight: "100dvh", display: "grid", placeItems: "center", p: 2, overflow: "hidden" }}>
      <AnimatedBackground intensity={2} />
      <Paper
        ref={cardRef}
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth,
          p: { xs: 3, sm: 4.5 },
          borderRadius: "28px",
          border: "1px solid",
          borderColor: alpha("#fff", 0.7),
          backgroundColor: alpha("#fff", 0.94),
          boxShadow: `0 24px 70px ${alpha(brand.ink, 0.18)}`,
        }}
      >
        <Box className="auth-item" sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 1.75,
              borderRadius: "18px",
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(135deg, ${brand.accent}, color-mix(in srgb, ${brand.accent} 70%, ${brand.primary}))`,
              boxShadow: `0 10px 24px ${alpha(brand.accent, 0.4)}`,
            }}
          >
            <ApartmentRounded sx={{ color: "#fff", fontSize: 30 }} />
          </Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {tagline && (
            <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
              {tagline}
            </Typography>
          )}
        </Box>
        <Box className="auth-item">{children}</Box>
      </Paper>
    </Box>
  );
}
