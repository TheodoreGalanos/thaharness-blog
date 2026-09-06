# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A blog site built with **Astro 5.x**, deployed on **Vercel** as a static site. Features client-side search via Pagefind, RSS feed, sitemap, and MDX support for rich content.

## Commands

```bash
npm run dev        # Start dev server (localhost:4321)
npm run build      # Build static site + generate Pagefind search index
npm run preview    # Preview built site locally
```

The build script chains `astro build && pagefind --site .vercel/output/static` — Pagefind runs post-build to index the static HTML output.

## Architecture

### Content Layer (Astro Content Collections)

- **Content config**: `src/content.config.ts` — defines the `blog` collection using the `glob()` loader (Astro 5+ Content Layer API). Frontmatter is validated with Zod schemas.
- **Blog posts**: `src/content/blog/` — Markdown (`.md`) and MDX (`.mdx`) files. Frontmatter fields: `title`, `description`, `pubDate`, `updatedDate` (optional), `heroImage` (optional).
- **Content is queried** via `getCollection('blog')` and `render()` from `astro:content`.

### Page Routing

- `src/pages/index.astro` — Home page
- `src/pages/blog/index.astro` — Blog listing (sorted by pubDate descending)
- `src/pages/blog/[...slug].astro` — Individual post pages (uses `getStaticPaths()`)
- `src/pages/about.astro` — About page
- `src/pages/rss.xml.js` — RSS feed endpoint

### Component & Layout Pattern

- `src/components/BaseHead.astro` — `<head>` content: meta tags, OG/Twitter cards, RSS autodiscovery, font preloads. Imported by all pages.
- `src/layouts/EditorialPost.astro` — Full HTML document wrapper for blog posts.
- Pages are full HTML documents that compose `Header`, `Footer`, and `BaseHead` components directly (no shared base layout wrapper beyond `EditorialPost`).

### Styling

- **Tailwind CSS v4** configured via `@tailwindcss/vite` plugin in `astro.config.mjs` (not the old `@astrojs/tailwind` integration).
- `src/styles/global.css` — Global styles imported through `BaseHead.astro`. Currently uses vanilla CSS with CSS custom properties.
- Components use Astro scoped `<style>` blocks for component-level styles.

### Search (Pagefind)

- Pagefind generates a static search index at build time from `.vercel/output/static/` output.
- Search assets are written to `.vercel/output/static/pagefind/`.
- `data-pagefind-body` scopes search to rendered article content. Run `npm run test:built` and `npm run test:browser` after building.

### Site Constants

- `src/consts.ts` — `SITE_TITLE` and `SITE_DESCRIPTION`, imported across pages and RSS.

### Images

- Optimised images go in `src/assets/` (processed by Astro's `<Image />` component).
- Static assets (fonts, favicons) go in `public/`.

## Deployment

The installed Vercel adapter emits `.vercel/output/`; keep the output-directory override unset. Use Node.js 22, matching `.nvmrc` and CI. The production URL in `astro.config.mjs` is `https://theharness.blog`. Preview `.vercel/output/static/` with a static HTTP server; API routes need Vercel.

## Key Conventions

- **Content Collection API**: Always use `glob()` loader + `src/content.config.ts` (not the legacy `src/content/config.ts` path).
- **Tailwind v4**: No `tailwind.config.js` — configuration is CSS-first via `@theme` directives. Use `@tailwindcss/vite`, not `@astrojs/tailwind`.
- **RSS**: Uses `@astrojs/rss`. Full posts are rendered with Astro's container and MDX renderer, then sanitised by `src/lib/article-html.ts`. This preserves component prose and excludes source imports.
- **All code files** must start with a 2-line `ABOUTME:` comment explaining what the file does.
