export const PALETTES = [
  { bg: "#D8CFC4", text: "#393938", stroke: "#5C5248" }, // Sandstone Beige
  { bg: "#C5B09E", text: "#2A2725", stroke: "#8A7F73" }, // Warm Clay
  { bg: "#8A7F73", text: "#EAE8E2", stroke: "#C5B9AB" }, // Slate Earth
  { bg: "#4A4540", text: "#EDE8E1", stroke: "#B7AC9E" }, // Basalt Dark
  { bg: "#EDE8E1", text: "#393938", stroke: "#D4C9B8" }, // Warm Linen
  { bg: "#D4C9B8", text: "#1C1B1B", stroke: "#6B615B" }, // Soft Taupe
];

/**
 * Returns an inline SVG data URL for a theme-matched color box placeholder.
 * @param {string} text - Title/text to display on placeholder
 * @param {number|string} index - Seed index to vary color palette
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} SVG Data URL
 */
export function getPlaceholderImage(text = "STONEZA", index = 0, width = 600, height = 600) {
  let hash = 0;
  if (typeof index === "number") {
    hash = index;
  } else if (typeof index === "string") {
    for (let i = 0; i < index.length; i++) {
      hash += index.charCodeAt(i);
    }
  } else if (text) {
    for (let i = 0; i < text.length; i++) {
      hash += text.charCodeAt(i);
    }
  }

  const palette = PALETTES[Math.abs(hash) % PALETTES.length];
  const label = (text || "STONEZA").toUpperCase().slice(0, 30);
  const fontSize = Math.max(12, Math.min(width, height) / 18);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${palette.bg}"/>
    <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="${palette.stroke}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.3"/>
    <text x="50%" y="47%" dominant-baseline="middle" text-anchor="middle" fill="${palette.text}" font-family="sans-serif" font-size="${fontSize}px" font-weight="600" letter-spacing="4px" opacity="0.85">${label}</text>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="${palette.text}" font-family="sans-serif" font-size="${Math.max(10, fontSize * 0.6)}px" font-weight="400" letter-spacing="2px" opacity="0.5">STONEZA</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
