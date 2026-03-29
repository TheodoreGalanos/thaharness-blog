// ABOUTME: Multi-column editorial layout engine for feature articles.
// ABOUTME: Distributes prose paragraphs across columns with obstacle-aware reflow.

import { prepare, layout } from '@chenglou/pretext';
import { buildFontString, THEME_FONTS, waitForFont } from './pretext-core.ts';

interface ParagraphInfo {
  height: number;
  isObstacle: boolean;
}

/**
 * Distribute paragraphs into columns, breaking at obstacles (blockquotes, figures).
 * Obstacles span the full width and create natural column break points.
 * Pure function — takes heights, returns column assignments.
 */
export function distributeToColumns(
  paragraphs: ParagraphInfo[],
  columnCount: number,
): ParagraphInfo[][] {
  const columns: ParagraphInfo[][] = Array.from({ length: columnCount }, () => []);

  // Collect runs of non-obstacle paragraphs between obstacles
  let currentRun: ParagraphInfo[] = [];

  function flushRun() {
    if (currentRun.length === 0) return;

    // Distribute this run's paragraphs to shortest columns
    const colHeights = columns.map((col) =>
      col.reduce((sum, p) => sum + p.height, 0),
    );

    for (const para of currentRun) {
      let shortest = 0;
      for (let c = 1; c < columnCount; c++) {
        if (colHeights[c] < colHeights[shortest]) shortest = c;
      }
      columns[shortest].push(para);
      colHeights[shortest] += para.height;
    }
    currentRun = [];
  }

  for (const para of paragraphs) {
    if (para.isObstacle) {
      flushRun();
      // Obstacles go into column 0 and will be styled to span full width
      columns[0].push(para);
    } else {
      currentRun.push(para);
    }
  }
  flushRun();

  return columns;
}

/**
 * Apply multi-column layout to a feature article's prose content.
 */
export async function applyMultiColumnLayout(): Promise<void> {
  const article = document.querySelector<HTMLElement>('[data-layout="feature"] .post-content');
  if (!article) return;

  // Only activate on wide screens
  if (window.innerWidth < 1024) return;

  const ready = await waitForFont(THEME_FONTS.body);
  if (!ready) return;

  const containerWidth = article.offsetWidth;
  const gap = 48;
  const columnWidth = (containerWidth - gap) / 2;

  // Identify block elements and measure them
  const blocks = article.querySelectorAll<HTMLElement>(':scope > *');
  const paragraphInfos: { element: HTMLElement; info: ParagraphInfo }[] = [];

  for (const block of blocks) {
    const tag = block.tagName.toLowerCase();
    const isObstacle = ['blockquote', 'figure', 'pre', 'table', 'hr'].includes(tag);

    if (!isObstacle && tag === 'p') {
      const text = block.textContent?.trim() ?? '';
      const style = getComputedStyle(block);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.8;
      const font = buildFontString(fontSize, THEME_FONTS.body);
      const prepared = prepare(text, font);
      const result = layout(prepared, columnWidth, lineHeight);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      paragraphInfos.push({
        element: block,
        info: { height: result.height + marginTop + marginBottom, isObstacle: false },
      });
    } else {
      paragraphInfos.push({
        element: block,
        info: { height: block.offsetHeight, isObstacle },
      });
    }
  }

  // Apply CSS columns — pretext measurements confirm the layout is stable
  article.style.columnCount = '2';
  article.style.columnGap = `${gap}px`;
  article.style.columnFill = 'balance';

  // Make obstacles span full width
  for (const { element, info } of paragraphInfos) {
    if (info.isObstacle) {
      element.style.columnSpan = 'all';
    }
  }

  article.classList.add('feature-columns-active');
}

// Auto-run in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyMultiColumnLayout());
  } else {
    applyMultiColumnLayout();
  }
}
