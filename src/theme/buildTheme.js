import { alpha, createTheme } from "@mui/material/styles";
import { bodyFont, headingFont } from "./fonts";

const heading = (weight = 700) => ({ fontFamily: headingFont, fontWeight: weight, letterSpacing: "-0.015em" });

/** Build the MUI theme for a palette definition ({ colors: { accent, bg, soft, primary, ink } }). */
export function buildTheme({ colors: c }) {
  const softShadow = `0 1px 2px ${alpha(c.ink, 0.05)}, 0 10px 30px ${alpha(c.ink, 0.06)}`;

  return createTheme({
    palette: {
      mode: "light",
      primary: { main: c.primary, dark: c.ink, light: c.soft, contrastText: "#ffffff" },
      secondary: { main: c.ink, contrastText: "#ffffff" },
      error: { main: "#D64550", contrastText: "#ffffff" },
      success: { main: "#2E8B83", light: "#BFE6E2", dark: "#1F6862", contrastText: "#ffffff" },
      warning: { main: "#C9812A", contrastText: "#ffffff" },
      info: { main: c.primary, light: c.soft, contrastText: "#ffffff" },
      background: { default: c.bg, paper: "#ffffff" },
      text: { primary: c.ink, secondary: alpha(c.ink, 0.72) },
      divider: alpha(c.ink, 0.1),
      // Brand tokens for custom components (sidebar, hero, auth screens …)
      brand: { ...c },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: bodyFont,
      fontSize: 14,
      h1: heading(800),
      h2: heading(800),
      h3: heading(700),
      h4: heading(700),
      h5: heading(700),
      h6: heading(600),
      subtitle1: { fontWeight: 500 },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: c.bg,
            backgroundImage: `radial-gradient(900px 480px at 100% -10%, ${alpha(c.soft, 0.55)}, transparent 62%), radial-gradient(700px 420px at -5% 105%, ${alpha(c.primary, 0.10)}, transparent 60%)`,
            backgroundAttachment: "fixed",
          },
          "*::-webkit-scrollbar": { width: 8, height: 8 },
          "*::-webkit-scrollbar-thumb": { background: alpha(c.ink, 0.22), borderRadius: 4 },
          a: { color: c.primary },
          "input[type=number]": { MozAppearance: "textfield" },
          "input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": { animationDuration: "0.001ms !important", transitionDuration: "0.001ms !important" },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingInline: 16,
            transition: "transform .15s ease, box-shadow .2s ease, background-color .2s ease",
            "&:active": { transform: "scale(0.97)" },
          },
          contained: { "&:hover": { boxShadow: `0 6px 16px ${alpha(c.primary, 0.32)}`, transform: "translateY(-1px)" } },
          sizeSmall: { borderRadius: 8, paddingInline: 10 },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { transition: "transform .15s ease, background-color .2s ease", "&:hover": { transform: "translateY(-1px)" } } },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" }, outlined: { borderColor: alpha(c.ink, 0.1) } } },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: softShadow,
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": { boxShadow: `0 2px 4px ${alpha(c.ink, 0.06)}, 0 16px 36px ${alpha(c.ink, 0.1)}` },
          },
        },
      },
      MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: "#fff",
            transition: "box-shadow .2s ease",
            "&.Mui-focused": { boxShadow: `0 0 0 4px ${alpha(c.primary, 0.16)}` },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { paddingBlock: 14, borderColor: alpha(c.ink, 0.07) },
          head: {
            backgroundColor: alpha(c.soft, 0.32),
            color: c.ink,
            fontWeight: 700,
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          },
        },
      },
      MuiTableRow: { styleOverrides: { root: { transition: "background-color .15s ease", "&.MuiTableRow-hover:hover": { backgroundColor: alpha(c.soft, 0.18) } } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
      MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3 } } },
      MuiTab: { styleOverrides: { root: { fontWeight: 600, minHeight: 44 } } },
      MuiDialog: {
        defaultProps: { fullWidth: true },
        styleOverrides: {
          paper: { borderRadius: 20, boxShadow: `0 24px 64px ${alpha(c.ink, 0.28)}` },
          // Tinted (not blurred) backdrop for dialogs; menus/popovers keep their invisible backdrops.
          root: { "& > .MuiBackdrop-root": { backgroundColor: alpha(c.ink, 0.35) } },
        },
      },
      MuiMenu: { styleOverrides: { paper: { borderRadius: 12, boxShadow: softShadow } } },
      MuiPopover: { styleOverrides: { paper: { borderRadius: 14, boxShadow: `0 12px 40px ${alpha(c.ink, 0.18)}` } } },
      MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: c.ink, fontSize: "0.75rem", borderRadius: 8 } } },
    },
  });
}
