// ABOUTME: ASCII art section dividers rendered between h2 headings in blog posts.
// ABOUTME: Uses box-drawing characters in geometric patterns, fading in on scroll.

const PATTERNS = [
  // Horizontal line with diamond centre
  (w: number) => {
    const half = Math.floor((w - 3) / 2);
    return '─'.repeat(half) + ' ◆ ' + '─'.repeat(half);
  },
  // Dot-dash rhythm
  (w: number) => {
    const unit = '· ─ ';
    const repeats = Math.floor(w / unit.length);
    return unit.repeat(repeats).slice(0, w);
  },
  // Double-line brackets
  (w: number) => {
    const inner = w - 4;
    return '╞' + '═'.repeat(Math.floor(inner / 2)) + '◇' + '═'.repeat(Math.ceil(inner / 2)) + '╡';
  },
  // Sparse dots
  (w: number) => {
    const unit = '·     ';
    const repeats = Math.floor(w / unit.length);
    return (' '.repeat(Math.floor((w - repeats * unit.length) / 2)) + unit.repeat(repeats)).slice(0, w);
  },
  // Cross-hatch centre
  (w: number) => {
    const side = Math.floor((w - 5) / 2);
    return '┄'.repeat(side) + ' ╳╳╳ ' + '┄'.repeat(side);
  },
];

/**
 * Generate a divider pattern string for a given section index and width.
 * Cycles through patterns to provide variety between sections.
 */
export function generateDividerPattern(index: number, maxWidth: number): string {
  const patternFn = PATTERNS[index % PATTERNS.length];
  const raw = patternFn(maxWidth);
  return raw.slice(0, maxWidth);
}

/**
 * Insert ASCII dividers before each h2 in the prose content.
 * Dividers fade in on scroll via IntersectionObserver.
 */
export function insertDividers(): void {
  const prose = document.querySelector<HTMLElement>('.post-content');
  if (!prose) return;

  const headings = prose.querySelectorAll<HTMLElement>('h2');
  // Skip the first h2 — no divider needed before the first section
  const targets = Array.from(headings).slice(1);

  targets.forEach((h2, index) => {
    const divider = document.createElement('div');
    divider.className = 'ascii-divider';
    divider.setAttribute('aria-hidden', 'true');

    // Measure available width
    const width = Math.min(60, Math.floor(prose.offsetWidth / 10));
    divider.textContent = generateDividerPattern(index, width);

    h2.parentNode?.insertBefore(divider, h2);
  });

  // Fade in on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ascii-divider-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll('.ascii-divider').forEach((el) => observer.observe(el));
}

// Auto-run in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => insertDividers());
  } else {
    insertDividers();
  }
}
