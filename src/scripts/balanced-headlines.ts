// ABOUTME: Balanced headline width calculator using pretext measurement.
// ABOUTME: Binary-searches for the tightest container width that preserves line count.

import { prepare, layout } from '@chenglou/pretext';
import { buildFontString, THEME_FONTS, waitForFont } from './pretext-core.ts';

type MeasureFn = (width: number) => { lineCount: number; height: number };

/**
 * Binary search for the narrowest width that keeps the same line count.
 * Pure function — takes a measurement callback so it's testable without canvas.
 */
export function findBalancedWidth(
  measure: MeasureFn,
  maxWidth: number,
  baselineLineCount: number,
): number {
  if (baselineLineCount <= 1) return maxWidth;

  const minWidth = maxWidth * 0.5;
  let lo = minWidth;
  let hi = maxWidth;

  while (hi - lo > 4) {
    const mid = Math.round((lo + hi) / 2);
    const { lineCount } = measure(mid);
    if (lineCount <= baselineLineCount) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return hi;
}

/**
 * Apply balanced widths to all matching headline elements on the page.
 * Progressively enhances — if pretext or fonts fail, headlines stay unchanged.
 */
export async function balanceHeadlines(
  selector = 'h1, h2.font-heading',
): Promise<void> {
  const ready = await waitForFont(THEME_FONTS.heading);
  if (!ready) return;

  const headlines = document.querySelectorAll<HTMLElement>(selector);

  for (const el of headlines) {
    const text = el.textContent?.trim();
    if (!text) continue;

    const style = getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.15;
    const fontWeight = parseInt(style.fontWeight, 10) || 500;
    const containerWidth = el.offsetWidth;

    if (containerWidth <= 0) continue;

    const font = buildFontString(fontSize, THEME_FONTS.heading, fontWeight);
    const prepared = prepare(text, font);

    const baseline = layout(prepared, containerWidth, lineHeight);
    if (baseline.lineCount <= 1) continue;

    const measure: MeasureFn = (width) => layout(prepared, width, lineHeight);
    const balanced = findBalancedWidth(measure, containerWidth, baseline.lineCount);

    if (balanced < containerWidth) {
      el.style.maxWidth = `${balanced}px`;
    }
  }
}

// Auto-run when loaded in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => balanceHeadlines());
  } else {
    balanceHeadlines();
  }
}
