// ABOUTME: Pull quote scroll interaction with smooth reflow.
// ABOUTME: Scales blockquotes on scroll and predicts surrounding text reflow via pretext.

import { THEME_FONTS, waitForFont } from './pretext-core.ts';

const BASE_SCALE = 1.0;
const TARGET_SCALE = 1.06;

/**
 * Linearly interpolate between base and target scale, clamped to [0, 1].
 * Pure function for testability.
 */
export function interpolateScale(
  ratio: number,
  base: number,
  target: number,
): number {
  const clamped = Math.max(0, Math.min(1, ratio));
  return base + (target - base) * clamped;
}

/**
 * Set up scroll-driven pull quote reflow on all blockquotes in the article.
 */
export async function setupPullQuoteReflow(): Promise<void> {
  const prose = document.querySelector<HTMLElement>('.post-content');
  if (!prose) return;

  const ready = await waitForFont(THEME_FONTS.body);
  if (!ready) return;

  const blockquotes = prose.querySelectorAll<HTMLElement>('blockquote');
  if (blockquotes.length === 0) return;

  for (const bq of blockquotes) {
    bq.classList.add('pull-quote');

    // Store original dimensions
    const originalHeight = bq.offsetHeight;
    bq.style.setProperty('--pq-original-height', `${originalHeight}px`);
  }

  // Use IntersectionObserver with threshold array for smooth scroll tracking
  const thresholds = Array.from({ length: 20 }, (_, i) => i / 19);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const bq = entry.target as HTMLElement;
        const ratio = entry.intersectionRatio;
        const scale = interpolateScale(ratio, BASE_SCALE, TARGET_SCALE);

        bq.style.setProperty('--pq-scale', `${scale}`);

        if (ratio > 0.1) {
          bq.classList.add('pull-quote-active');
        } else {
          bq.classList.remove('pull-quote-active');
        }
      }
    },
    { threshold: thresholds },
  );

  blockquotes.forEach((bq) => observer.observe(bq));
}

// Auto-run in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupPullQuoteReflow());
  } else {
    setupPullQuoteReflow();
  }
}
