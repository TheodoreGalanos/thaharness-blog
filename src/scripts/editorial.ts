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

  let animationFrame: number | null = null;
  let articleTop = 0;
  let articleHeight = 0;

  function update() {
    animationFrame = null;
    if (!article || !bar) return;
    const ratio = computeScrollProgress(
      window.scrollY,
      articleTop,
      articleHeight,
      window.innerHeight,
    );
    bar.style.transform = `scaleX(${ratio})`;
  }

  function scheduleUpdate() {
    if (animationFrame !== null) return;
    animationFrame = window.requestAnimationFrame(update);
  }

  function measureGeometry() {
    if (!article) return;
    const rect = article.getBoundingClientRect();
    articleTop = rect.top + window.scrollY;
    articleHeight = rect.height;
    scheduleUpdate();
  }

  measureGeometry();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", measureGeometry, { passive: true });
  window.addEventListener("load", measureGeometry, { once: true });

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(measureGeometry);
    resizeObserver.observe(article);
  }

  void document.fonts?.ready.then(measureGeometry);
}

export function computeAnchorScrollTop(
  targetViewportTop: number,
  scrollY: number,
  anchorOffset: number,
): number {
  return Math.max(0, scrollY + targetViewportTop - anchorOffset);
}

export function computeCssLengthPixels(
  value: string,
  rootFontSize: number,
  elementFontSize: number,
): number | null {
  const match = value.trim().match(/^(-?\d*\.?\d+)(px|rem|em)?$/);
  if (!match) return null;

  const amount = Number.parseFloat(match[1]);
  const unit = match[2] ?? "px";
  if (!Number.isFinite(amount)) return null;

  if (unit === "rem") return amount * rootFontSize;
  if (unit === "em") return amount * elementFontSize;
  return amount;
}

export function shouldShowChapterRail(
  overviewBottom: number,
  headerHeight: number,
): boolean {
  return overviewBottom <= headerHeight;
}

function revealActiveRailLink(): void {
  const rail = document.querySelector<HTMLElement>(".chapter-rail.is-visible");
  const list = rail?.querySelector<HTMLOListElement>(".chapter-rail-list");
  const activeLink = list?.querySelector<HTMLAnchorElement>(
    '[data-chapter-rail-link][aria-current="true"]',
  );
  if (!list || !activeLink) return;

  const left = Math.max(
    0,
    activeLink.offsetLeft - (list.clientWidth - activeLink.offsetWidth) / 2,
  );
  list.scrollTo({ left, behavior: "auto" });
}

function setupChapterRail(): void {
  const overview = document.querySelector<HTMLElement>(".chapter-strip");
  const rail = document.querySelector<HTMLElement>(".chapter-rail");
  if (!overview || !rail || typeof IntersectionObserver === "undefined") return;

  const siteHeader = document.querySelector<HTMLElement>("body > header");
  let observer: IntersectionObserver | null = null;
  let visible = false;

  const setVisible = (nextVisible: boolean) => {
    if (visible === nextVisible) return;
    visible = nextVisible;
    rail.classList.toggle("is-visible", nextVisible);
    rail.setAttribute("aria-hidden", String(!nextVisible));
    rail.inert = !nextVisible;
    if (nextVisible) revealActiveRailLink();
  };

  const observeOverview = () => {
    observer?.disconnect();
    const headerHeight = Math.ceil(
      siteHeader?.getBoundingClientRect().height ?? 64,
    );
    observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(
          shouldShowChapterRail(entry.boundingClientRect.bottom, headerHeight),
        );
      },
      {
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0,
      },
    );
    observer.observe(overview);
  };

  observeOverview();
  if (siteHeader && typeof ResizeObserver !== "undefined") {
    const headerObserver = new ResizeObserver(observeOverview);
    headerObserver.observe(siteHeader);
  } else {
    window.addEventListener("resize", observeOverview, { passive: true });
  }
}

function setupChapterTracking(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    "[data-chapter-link]",
  );
  if (links.length === 0) return;

  const slugs = [
    ...new Set(
      Array.from(links).map((link) => link.dataset.chapterLink ?? ""),
    ),
  ];
  const targets = slugs
    .map((slug) => document.getElementById(slug))
    .filter((el): el is HTMLElement => el !== null);
  if (targets.length === 0) return;

  let activeSlug = "";

  const applyActiveState = (slug: string) => {
    links.forEach((link) => {
      if (link.dataset.chapterLink === slug) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    activeSlug = slug;
    revealActiveRailLink();
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
      if (!slugs.includes(slug)) return;
      applyActiveState(slug);
    },
    {
      rootMargin: `-${Math.round(getEditorialAnchorOffset())}px 0px -60% 0px`,
      threshold: 0,
    },
  );

  targets.forEach((el) => observer.observe(el));
}

function getEditorialAnchorOffset(): number {
  const layout = document.querySelector<HTMLElement>(".editorial-layout");
  const source = layout ?? document.documentElement;
  const sourceStyle = getComputedStyle(source);
  const rootStyle = getComputedStyle(document.documentElement);
  const value = computeCssLengthPixels(
    sourceStyle.getPropertyValue("--editorial-anchor-offset"),
    Number.parseFloat(rootStyle.fontSize),
    Number.parseFloat(sourceStyle.fontSize),
  );
  return value ?? 132;
}

function scrollToHashTarget(hash: string, behavior: ScrollBehavior): boolean {
  if (!hash.startsWith("#")) return false;
  const id = window.decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return false;

  const scrollTop = computeAnchorScrollTop(
    target.getBoundingClientRect().top,
    window.scrollY,
    getEditorialAnchorOffset(),
  );
  window.scrollTo({ top: scrollTop, behavior });
  return true;
}

function setupFootnoteAnchorScrolling(): void {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>(
      "a[data-footnote-ref], a[data-footnote-backref]",
    );
    if (!link?.hash) return;
    if (!document.getElementById(window.decodeURIComponent(link.hash.slice(1)))) {
      return;
    }

    event.preventDefault();
    history.pushState(null, "", link.hash);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    scrollToHashTarget(link.hash, behavior);
  });

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      scrollToHashTarget(window.location.hash, "auto");
    });
  }
}

if (typeof document !== "undefined") {
  const init = () => {
    setupProgressBar();
    setupChapterRail();
    setupChapterTracking();
    setupFootnoteAnchorScrolling();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
