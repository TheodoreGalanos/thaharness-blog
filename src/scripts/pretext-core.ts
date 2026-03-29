// ABOUTME: Shared pretext initialisation, font config, and helper wrappers.
// ABOUTME: Provides theme-aware font strings and measurement utilities for all pretext features.

export const THEME_FONTS = {
  heading: 'JetBrains Mono',
  body: 'Source Serif 4',
} as const;

/**
 * Build a CSS font string for pretext's prepare() function.
 * Matches the format: "[weight] <size>px <family>"
 */
export function buildFontString(
  sizePx: number,
  family: string,
  weight?: number,
): string {
  const prefix = weight ? `${weight} ` : '';
  return `${prefix}${sizePx}px "${family}"`;
}

/**
 * Wait for a specific font to be loaded before running pretext measurement.
 * Returns true if the font loaded, false if it timed out.
 */
export async function waitForFont(family: string, timeoutMs = 3000): Promise<boolean> {
  try {
    await document.fonts.load(`16px "${family}"`);
    return document.fonts.check(`16px "${family}"`);
  } catch {
    return false;
  }
}
