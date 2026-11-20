import { useContext } from "react";
import { AppearanceContext } from "./AppearanceContext";

/** { paletteId, palettes, setPaletteId(id), resetPalette() } */
export const useAppearance = () => useContext(AppearanceContext);
