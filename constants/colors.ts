import type { Palette, ColorSwatch } from "@/types";

// ─── Palette 1: Originals ─────────────────────────────────
const originals: ColorSwatch[] = [
  { id: "o1", hex: "#E63946", label: "Crimson" },
  { id: "o2", hex: "#F4845F", label: "Coral" },
  { id: "o3", hex: "#F7B267", label: "Marigold" },
  { id: "o4", hex: "#F25C54", label: "Tomato" },
  { id: "o5", hex: "#F4A261", label: "Sandy" },
  { id: "o6", hex: "#2A9D8F", label: "Teal" },
  { id: "o7", hex: "#264653", label: "Charcoal" },
  { id: "o8", hex: "#6A4C93", label: "Purple" },
  { id: "o9", hex: "#1982C4", label: "Ocean" },
  { id: "o10", hex: "#8AC926", label: "Lime" },
  { id: "o11", hex: "#FF595E", label: "Watermelon" },
  { id: "o12", hex: "#FFCA3A", label: "Sunflower" },
  { id: "o13", hex: "#6A0572", label: "Plum" },
  { id: "o14", hex: "#1B4332", label: "Forest" },
  { id: "o15", hex: "#3A86A0", label: "Steel Blue" },
];

// ─── Palette 2: Earth Tones ───────────────────────────────
const earthTones: ColorSwatch[] = [
  { id: "e1", hex: "#8B5E3C", label: "Walnut" },
  { id: "e2", hex: "#A0785A", label: "Sienna" },
  { id: "e3", hex: "#C9A87C", label: "Wheat" },
  { id: "e4", hex: "#6B4226", label: "Cocoa" },
  { id: "e5", hex: "#D4A373", label: "Camel" },
  { id: "e6", hex: "#588157", label: "Sage" },
  { id: "e7", hex: "#3A5A40", label: "Moss" },
  { id: "e8", hex: "#A3B18A", label: "Olive" },
  { id: "e9", hex: "#DDA15E", label: "Amber" },
  { id: "e10", hex: "#BC6C25", label: "Rust" },
  { id: "e11", hex: "#606C38", label: "Fern" },
  { id: "e12", hex: "#283618", label: "Pine" },
  { id: "e13", hex: "#FEFAE0", label: "Cream" },
  { id: "e14", hex: "#CCD5AE", label: "Pistachio" },
  { id: "e15", hex: "#B08968", label: "Tan" },
];

// ─── Palette 3: Pastels ───────────────────────────────────
const pastels: ColorSwatch[] = [
  { id: "p1", hex: "#FFB5A7", label: "Peach" },
  { id: "p2", hex: "#FCD5CE", label: "Blush" },
  { id: "p3", hex: "#F8EDEB", label: "Linen" },
  { id: "p4", hex: "#F9DCC4", label: "Apricot" },
  { id: "p5", hex: "#FEC89A", label: "Cantaloupe" },
  { id: "p6", hex: "#D8E2DC", label: "Mint Cream" },
  { id: "p7", hex: "#ECE4DB", label: "Champagne" },
  { id: "p8", hex: "#FFE5D9", label: "Seashell" },
  { id: "p9", hex: "#CDB4DB", label: "Lilac" },
  { id: "p10", hex: "#A2D2FF", label: "Baby Blue" },
  { id: "p11", hex: "#BDE0FE", label: "Powder Blue" },
  { id: "p12", hex: "#FFAFCC", label: "Rose Pink" },
  { id: "p13", hex: "#B5E48C", label: "Spring Green" },
  { id: "p14", hex: "#90DBF4", label: "Sky" },
  { id: "p15", hex: "#F1C0E8", label: "Orchid" },
];

// ─── Palette 4: Landscapes ────────────────────────────────
const landscapes: ColorSwatch[] = [
  { id: "l1", hex: "#0077B6", label: "Deep Sea" },
  { id: "l2", hex: "#0096C7", label: "Pacific" },
  { id: "l3", hex: "#00B4D8", label: "Lagoon" },
  { id: "l4", hex: "#48CAE4", label: "Glacier" },
  { id: "l5", hex: "#90E0EF", label: "Ice" },
  { id: "l6", hex: "#023E8A", label: "Navy Depths" },
  { id: "l7", hex: "#03045E", label: "Midnight" },
  { id: "l8", hex: "#2D6A4F", label: "Emerald" },
  { id: "l9", hex: "#40916C", label: "Meadow" },
  { id: "l10", hex: "#52B788", label: "Jade" },
  { id: "l11", hex: "#74C69D", label: "Seafoam" },
  { id: "l12", hex: "#95D5B2", label: "Celadon" },
  { id: "l13", hex: "#D4A276", label: "Sandstone" },
  { id: "l14", hex: "#E76F51", label: "Terracotta" },
  { id: "l15", hex: "#F4A261", label: "Dune" },
];

// ─── Palette 5: Metals ────────────────────────────────────
const metals: ColorSwatch[] = [
  { id: "m1", hex: "#ADB5BD", label: "Silver" },
  { id: "m2", hex: "#6C757D", label: "Pewter" },
  { id: "m3", hex: "#495057", label: "Gunmetal" },
  { id: "m4", hex: "#343A40", label: "Iron" },
  { id: "m5", hex: "#212529", label: "Obsidian" },
  { id: "m6", hex: "#D4AF37", label: "Gold" },
  { id: "m7", hex: "#C5932A", label: "Brass" },
  { id: "m8", hex: "#B08D57", label: "Bronze" },
  { id: "m9", hex: "#E8D5B7", label: "Champagne Gold" },
  { id: "m10", hex: "#B76E79", label: "Rose Gold" },
  { id: "m11", hex: "#8D6E63", label: "Copper" },
  { id: "m12", hex: "#78909C", label: "Blue Steel" },
  { id: "m13", hex: "#90A4AE", label: "Titanium" },
  { id: "m14", hex: "#546E7A", label: "Dark Steel" },
  { id: "m15", hex: "#CFD8DC", label: "Platinum" },
];

// ─── Exported Palettes ────────────────────────────────────
export const PALETTES: Palette[] = [
  { id: "originals", label: "Originals", colors: originals },
  { id: "earth-tones", label: "Earth Tones", colors: earthTones },
  { id: "pastels", label: "Pastels", colors: pastels },
  { id: "landscapes", label: "Landscapes", colors: landscapes },
  { id: "metals", label: "Metals", colors: metals },
];

// ─── Flat array of all 75 colors ──────────────────────────
export const ALL_COLORS: ColorSwatch[] = PALETTES.flatMap((p) => p.colors);

// ─── Random color picker ──────────────────────────────────
export function getRandomColor(): ColorSwatch {
  return ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
}
