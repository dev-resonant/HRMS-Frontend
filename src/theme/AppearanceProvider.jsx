import { useCallback, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppearanceContext } from "./AppearanceContext";
import { buildTheme } from "./buildTheme";
import { DEFAULT_PALETTE_ID, PALETTES, getPalette } from "./palettes";

const STORAGE_KEY = "hrms.appearance.palette";

// "Local db for now": the choice lives in this browser's localStorage.
const readStored = () => {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return PALETTES.some((p) => p.id === id) ? id : DEFAULT_PALETTE_ID;
  } catch {
    return DEFAULT_PALETTE_ID;
  }
};

export function AppearanceProvider({ children }) {
  const [paletteId, setId] = useState(readStored);

  const setPaletteId = useCallback((id) => {
    if (!PALETTES.some((p) => p.id === id)) return;
    setId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage unavailable (private mode) – the choice just won't persist */
    }
  }, []);

  const resetPalette = useCallback(() => setPaletteId(DEFAULT_PALETTE_ID), [setPaletteId]);

  const theme = useMemo(() => buildTheme(getPalette(paletteId)), [paletteId]);
  const value = useMemo(() => ({ paletteId, palettes: PALETTES, setPaletteId, resetPalette }), [paletteId, setPaletteId, resetPalette]);

  return (
    <AppearanceContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
}
