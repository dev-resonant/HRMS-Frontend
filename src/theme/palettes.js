/**
 * Colour palettes. Every palette defines the same five roles:
 *   accent  – highlight (logo tile, active-menu marker, focus accents)
 *   bg      – page background
 *   soft    – tinted surfaces (table headers, chips, hero gradients)
 *   primary – buttons, links, selected states
 *   ink     – text, sidebar background
 */
export const DEFAULT_PALETTE_ID = "ocean";

export const PALETTES = [
  {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Crisp red accents on cool steel and navy.",
    colors: { accent: "#E63946", bg: "#F1FAEE", soft: "#A8DADC", primary: "#457B9D", ink: "#1D3557" },
  },
  {
    id: "sunset",
    name: "Desert Sunset",
    description: "Warm terracotta with deep teal.",
    colors: { accent: "#E76F51", bg: "#FDF8EE", soft: "#F4D58D", primary: "#2A9D8F", ink: "#264653" },
  },
  {
    id: "forest",
    name: "Forest Calm",
    description: "Natural greens with a copper highlight.",
    colors: { accent: "#D9822B", bg: "#F2F8F3", soft: "#B7E4C7", primary: "#2D6A4F", ink: "#1B4332" },
  },
  {
    id: "violet",
    name: "Midnight Violet",
    description: "Rich purples with a hot pink spark.",
    colors: { accent: "#FF5C8A", bg: "#F6F3FF", soft: "#D9CCFF", primary: "#6C4DD3", ink: "#2D1E5F" },
  },
  {
    id: "rose",
    name: "Rose Quartz",
    description: "Soft pinks balanced by a teal accent.",
    colors: { accent: "#1D7A8C", bg: "#FFF6F8", soft: "#F7C6D9", primary: "#B5446E", ink: "#4A1D2C" },
  },
  {
    id: "slate",
    name: "Graphite",
    description: "Neutral and professional with a coral accent.",
    colors: { accent: "#F0544F", bg: "#F5F7FA", soft: "#CBD2D9", primary: "#52606D", ink: "#1F2933" },
  },
];

export const getPalette = (id) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];
