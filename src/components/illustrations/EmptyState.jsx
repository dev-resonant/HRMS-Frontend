import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Illustration } from "./Illustration";
import { useReveal } from "../motion/useReveal";

/** Illustration + title + helper text (+ optional action) for empty, error and no-access states. */
export function EmptyState({ illustration = "search", title, text, action, compact = false }) {
  const ref = useRef(null);
  useReveal(ref, ":scope > *", { y: 12, stagger: 0.08, duration: 0.5 });
  return (
    <Box
      ref={ref}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.75, py: compact ? 3 : 5, px: 2 }}
    >
      <Illustration name={illustration} size={compact ? 130 : 180} />
      {title && (
        <Typography variant="h6" sx={{ mt: 1 }}>
          {title}
        </Typography>
      )}
      {text && <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>{text}</Typography>}
      {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
    </Box>
  );
}
