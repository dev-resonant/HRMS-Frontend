import { useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useReveal } from "../motion/useReveal";
import "./page.scss";

/** Standard page frame: centered content column, title/description left, actions right. */
export function PageShell({ title, description, actions, children }) {
  const ref = useRef(null);
  useReveal(ref, ":scope > *");

  return (
    <Box
      ref={ref}
      component="section"
      className="hr-page"
      sx={{ position: "relative", zIndex: 1, maxWidth: 1440, mx: "auto", p: { xs: 2, sm: 3, lg: 4 }, display: "flex", flexDirection: "column", gap: { xs: 2.5, md: 3 } }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "flex-end" }, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ color: "text.secondary", mt: 0.75, maxWidth: 720 }}>{description}</Typography>
          )}
        </Box>
        {actions && (
          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", justifyContent: { xs: "flex-start", sm: "flex-end" }, flexShrink: 0 }}>
            {actions}
          </Stack>
        )}
      </Stack>
      {children}
    </Box>
  );
}
