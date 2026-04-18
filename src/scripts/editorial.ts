// ABOUTME: Editorial layout behaviours — scroll progress bar + chapter strip active tracking.
// ABOUTME: Progressive enhancement; the article remains fully readable if these fail.

/**
 * Compute scroll progress through an article element as a 0..1 ratio.
 * Pure function for testability — takes scroll state, returns clamped ratio.
 */
export function computeScrollProgress(
  scrollY: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number,
): number {
  const start = articleTop;
  const end = articleTop + articleHeight - viewportHeight;
  if (end <= start) return 0;
  const raw = (scrollY - start) / (end - start);
  return Math.max(0, Math.min(1, raw));
}

function setupProgressBar(): void {
  const article = document.querySelector<HTMLElement>(".editorial-body");
  const bar = document.querySelector<HTMLElement>(".editorial-progress-bar");
  if (!article || !bar) return;

  function update() {
    if (!article || !bar) return;
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const ratio = computeScrollProgress(
      window.scrollY,
      articleTop,
      rect.height,
      window.innerHeight,
    );
    bar.style.transform = `scaleX(${ratio})`;
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

/**
 * Compute which three chapter indices occupy the [left, center, right] slots
 * given the active index and total count. Clamps at list edges so the first
 * or last section still renders three items.
 */
export function computeSlotWindow(
  activeIndex: number,
  total: number,
): { left: number; center: number; right: number } {
  if (total < 3) {
    return { left: 0, center: Math.min(1, total - 1), right: total - 1 };
  }
  let start = activeIndex - 1;
  if (start < 0) start = 0;
  if (start > total - 3) start = total - 3;
  return { left: start, center: start + 1, right: start + 2 };
}

function setupChapterTracking(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    "[data-chapter-link]",
  );
  if (links.length === 0) return;

  const slugs = Array.from(links).map((link) => link.dataset.chapterLink ?? "");
  const targets = slugs
    .map((slug) => document.getElementById(slug))
    .filter((el): el is HTMLElement => el !== null);
  if (targets.length === 0) return;

  const strip = document.querySelector<HTMLElement>("[data-chapter-strip]");
  const listItems = Array.from(links).map((link) => link.closest("li"));

  let activeSlug = "";

  const applySlots = (activeIndex: number, slug: string) => {
    const { left, center, right } = computeSlotWindow(
      activeIndex,
      slugs.length,
    );
    links.forEach((link, index) => {
      const li = listItems[index];
      li?.classList.remove("is-slot-left", "is-slot-center", "is-slot-right");
      if (index === activeIndex) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
      if (index === left) li?.classList.add("is-slot-left");
      else if (index === center) li?.classList.add("is-slot-center");
      else if (index === right) li?.classList.add("is-slot-right");
    });
    activeSlug = slug;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length === 0) return;

      const topmost = visible.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
      )[0];
      const slug = topmost.target.id;
      if (slug === activeSlug) return;
      const activeIndex = slugs.indexOf(slug);
      if (activeIndex < 0) return;

      // If the strip is in compact mode, wrap slot changes in a view
      // transition so items crossfade smoothly between positions.
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };
      const compact = strip?.classList.contains("is-compact");
      if (compact && typeof doc.startViewTransition === "function") {
        doc.startViewTransition(() => applySlots(activeIndex, slug));
      } else {
        applySlots(activeIndex, slug);
      }
    },
    { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
  );

  targets.forEach((el) => observer.observe(el));
}

function setupChapterMorph(): void {
  const sentinel = document.querySelector<HTMLElement>(
    ".chapter-strip-sentinel",
  );
  const strip = document.querySelector<HTMLElement>("[data-chapter-strip]");
  if (!sentinel || !strip) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const shouldCompact = !entry.isIntersecting;
        const apply = () => strip.classList.toggle("is-compact", shouldCompact);

        // View Transitions API animates the layout change with per-item
        // stagger (see ::view-transition-group rules in global.css).
        const doc = document as Document & {
          startViewTransition?: (cb: () => void) => { finished: Promise<void> };
        };
        if (typeof doc.startViewTransition === "function") {
          doc.startViewTransition(apply);
        } else {
          apply();
        }
      }
    },
    { rootMargin: "-68px 0px 0px 0px", threshold: 0 },
  );

  observer.observe(sentinel);
}

if (typeof document !== "undefined") {
  const init = () => {
    setupProgressBar();
    setupChapterTracking();
    setupChapterMorph();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
