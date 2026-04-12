// ABOUTME: Masonry grid layout for the blog index using pretext height prediction.
// ABOUTME: Positions cards by predicting text height via canvas measurement, eliminating CLS.

import { prepare, layout } from '@chenglou/pretext';
import { buildFontString, THEME_FONTS, waitForFont } from './pretext-core.ts';

interface CardPosition {
  column: number;
  y: number;
}

/**
 * Assign cards to columns using a shortest-column-first algorithm.
 * Pure function — takes pre-computed heights, returns positions.
 */
export function assignColumns(
  heights: number[],
  columnCount: number,
  gap: number,
): CardPosition[] {
  const columnHeights = new Array(columnCount).fill(0);
  const positions: CardPosition[] = [];

  for (let i = 0; i < heights.length; i++) {
    // Find the shortest column
    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (columnHeights[c] < columnHeights[shortest]) {
        shortest = c;
      }
    }

    const y = columnHeights[shortest] > 0
      ? columnHeights[shortest] + gap
      : 0;

    positions.push({ column: shortest, y });
    columnHeights[shortest] = y + heights[i];
  }

  return positions;
}

/**
 * Predict total height of wrapped tag pills using canvas text measurement
 * plus a flex-wrap row-packing simulation. Mirrors TagPill.astro styling:
 * text-[0.6875rem] uppercase tracking-[0.05em] px-2.5 py-1 border, gap-2 wrap.
 */
function predictTagsHeight(tags: string[], innerWidth: number): number {
  if (tags.length === 0) return 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 32;

  const fontSize = 11; // 0.6875rem
  const letterSpacing = 0.05 * fontSize; // tracking-[0.05em]
  const horizontalPadding = 10 * 2; // px-2.5 → 10px each side
  const border = 2; // 1px each side
  const rowHeight = 11 + 4 * 2 + 2; // text + py-1 + border
  const pillGap = 8; // gap-2
  const rowGap = 8; // gap-2 on wrapped rows

  ctx.font = buildFontString(fontSize, THEME_FONTS.heading, 500);

  const widths = tags.map((tag) => {
    const text = tag.toUpperCase();
    const textWidth = ctx.measureText(text).width;
    return Math.ceil(textWidth + text.length * letterSpacing + horizontalPadding + border);
  });

  let rows = 1;
  let rowWidth = widths[0];
  for (let i = 1; i < widths.length; i++) {
    const next = rowWidth + pillGap + widths[i];
    if (next <= innerWidth) {
      rowWidth = next;
    } else {
      rows += 1;
      rowWidth = widths[i];
    }
  }

  return rows * rowHeight + (rows - 1) * rowGap;
}

/**
 * Predict the height of a blog card's text content using pretext.
 */
function predictCardHeight(
  title: string,
  description: string,
  tags: string[],
  cardWidth: number,
  padding: number,
): number {
  const innerWidth = cardWidth - padding * 2;

  const titleFont = buildFontString(18, THEME_FONTS.heading, 600);
  const descFont = buildFontString(14, THEME_FONTS.body);

  const titlePrepared = prepare(title, titleFont);
  const descPrepared = prepare(description, descFont);

  const titleResult = layout(titlePrepared, innerWidth, 18 * 1.15);
  const descResult = layout(descPrepared, innerWidth, 14 * 1.75);

  const dateHeight = 20;
  const tagsHeight = predictTagsHeight(tags, innerWidth);
  const tagsGap = tags.length > 0 ? 12 : 0; // mt-3 only when tags render
  const innerGaps = 12 + 8 + tagsGap; // date→title, title→desc, desc→tags
  return padding * 2 + dateHeight + titleResult.height + innerGaps + descResult.height + tagsHeight;
}

/**
 * Apply masonry layout to the blog index grid.
 * Reads card data from DOM, predicts heights, positions absolutely.
 */
export async function applyMasonryLayout(): Promise<void> {
  const grid = document.querySelector<HTMLElement>('[data-masonry-grid]');
  if (!grid) return;

  const ready = await waitForFont(THEME_FONTS.heading) && await waitForFont(THEME_FONTS.body);
  if (!ready) return;

  const cards = grid.querySelectorAll<HTMLElement>('[data-masonry-card]');
  if (cards.length === 0) return;

  // Determine column count from viewport
  const gridWidth = grid.offsetWidth;
  const gap = 24;
  const minCardWidth = 320;
  const columnCount = Math.max(1, Math.min(3, Math.floor((gridWidth + gap) / (minCardWidth + gap))));
  const cardWidth = (gridWidth - gap * (columnCount - 1)) / columnCount;

  // Predict heights
  const heights: number[] = [];
  for (const card of cards) {
    const title = card.dataset.title ?? '';
    const description = card.dataset.description ?? '';
    const tags = card.dataset.tags ? card.dataset.tags.split('|').filter(Boolean) : [];
    heights.push(predictCardHeight(title, description, tags, cardWidth, 20));
  }

  // Calculate positions
  const positions = assignColumns(heights, columnCount, gap);

  // Apply positioning
  grid.style.position = 'relative';
  const columnHeights = new Array(columnCount).fill(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const pos = positions[i];
    card.style.position = 'absolute';
    card.style.width = `${cardWidth}px`;
    card.style.left = `${pos.column * (cardWidth + gap)}px`;
    card.style.top = `${pos.y}px`;
    columnHeights[pos.column] = pos.y + heights[i];
  }

  // Set grid container height
  grid.style.height = `${Math.max(...columnHeights)}px`;

  // Mark as active for CSS transitions
  grid.classList.add('masonry-active');
}

// Auto-run in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyMasonryLayout());
  } else {
    applyMasonryLayout();
  }

  // Re-layout on resize (debounced)
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => applyMasonryLayout(), 150);
  });
}
