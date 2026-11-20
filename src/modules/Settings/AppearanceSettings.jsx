import { Box, ButtonBase, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { toast } from "react-toastify";
import Check from "@mui/icons-material/Check";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import { Button } from "../../components/ui/fields";
import { useAppearance } from "../../theme/useAppearance";
import { DEFAULT_PALETTE_ID } from "../../theme/palettes";

/** Colour palette picker. The choice is applied instantly and saved in this browser (localStorage). */
export function AppearanceSettings() {
  const { paletteId, palettes, setPaletteId, resetPalette } = useAppearance();

  const choose = (p) => {
    if (p.id === paletteId) return;
    setPaletteId(p.id);
    toast.success(`${p.name} palette applied`);
  };

  return (
    <Box className="hr-card" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h6">Appearance</Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.25 }}>
            Pick a colour palette. It applies immediately and is remembered on this device.
          </Typography>
        </Box>
        <Button
          kind="tertiary"
          size="sm"
          renderIcon={RestartAltRounded}
          disabled={paletteId === DEFAULT_PALETTE_ID}
          onClick={() => {
            resetPalette();
            toast.info("Default palette restored");
          }}
        >
          Reset to default
        </Button>
      </Stack>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
        {palettes.map((p) => {
          const selected = p.id === paletteId;
          const { accent, bg, soft, primary, ink } = p.colors;
          return (
            <ButtonBase
              key={p.id}
              onClick={() => choose(p)}
              aria-pressed={selected}
              aria-label={`${p.name} palette${selected ? " (selected)" : ""}`}
              sx={{
                display: "block",
                textAlign: "left",
                borderRadius: "18px",
                p: 1.5,
                border: "2px solid",
                borderColor: selected ? primary : "divider",
                bgcolor: selected ? alpha(primary, 0.06) : "#fff",
                boxShadow: selected ? `0 8px 24px ${alpha(primary, 0.22)}` : "none",
                transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: `0 10px 28px ${alpha(ink, 0.14)}` },
                "&:focus-visible": { outline: `3px solid ${alpha(primary, 0.5)}`, outlineOffset: 2 },
              }}
            >
              {/* Swatch strip */}
              <Box sx={{ display: "flex", height: 54, borderRadius: "12px", overflow: "hidden", border: "1px solid", borderColor: alpha(ink, 0.08) }}>
                {[ink, primary, soft, bg, accent].map((color) => (
                  <Box key={color} sx={{ flex: 1, bgcolor: color }} />
                ))}
              </Box>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 1.5, gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</Typography>
                {selected ? (
                  <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: primary, color: "#fff", display: "grid", placeItems: "center" }}>
                    <Check sx={{ fontSize: 15 }} />
                  </Box>
                ) : p.id === DEFAULT_PALETTE_ID ? (
                  <Chip size="small" label="Default" variant="outlined" />
                ) : null}
              </Stack>
              <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", mt: 0.25 }}>{p.description}</Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
