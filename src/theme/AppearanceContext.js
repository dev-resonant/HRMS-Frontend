import { createContext } from "react";
import { DEFAULT_PALETTE_ID, PALETTES } from "./palettes";

export const AppearanceContext = createContext({
  paletteId: DEFAULT_PALETTE_ID,
  palettes: PALETTES,
  setPaletteId: () => {},
  resetPalette: () => {},
});
