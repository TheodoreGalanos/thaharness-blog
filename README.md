# The Harness

The Harness is a static Astro blog for writing about agentic systems, harness engineering, and engineering workflows.

The site is deployed as a static build, uses Astro content collections for posts, Tailwind CSS v4 for styling, and Pagefind for client-side search.

## Stack

- Astro 5
- Astro content collections
- MDX support
- Tailwind CSS v4 via Vite
- Pagefind search
- RSS and sitemap generation
- Static deployment on Vercel

## Local Development

Run everything from the project root.

| Command | Purpose |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the static site and Pagefind index into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- check` | Run Astro type/content validation |

## Content Model

Blog content lives in `src/content/blog/`.

The collection schema is defined in `src/content.config.ts` and currently supports:

- `title`
- `description`
- `author`
- `category`
- `tags`
- `featured`
- `featuredRank`
- `pubDate`
- `updatedDate`
- `heroImage`

Posts are rendered through `src/pages/blog/[...slug].astro` and `src/layouts/BlogPost.astro`.

## Project Structure

```text
.
├── public/                # Static assets such as fonts and favicons
├── src/
│   ├── assets/            # Processed images
│   ├── components/        # Shared Astro components
│   ├── content/           # Blog posts
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route entrypoints
│   ├── styles/            # Global CSS
│   ├── consts.ts          # Site-wide constants
│   └── content.config.ts  # Content collection schema
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Search and Indexing

Pagefind is generated as part of `npm run build`.

The search index currently targets elements marked with `data-pagefind-body`, which keeps indexing focused on article content rather than the full page chrome.

## Deployment

This site is configured for production at `https://theharness.blog` in `astro.config.mjs`.

For Vercel:

1. Import the repository into Vercel.
2. Keep the framework as Astro or let Vercel auto-detect it.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory if Vercel asks.
5. Add `theharness.blog` in the project domain settings.
6. Point DNS at Vercel using either nameservers or the records Vercel provides.

## Notes

- Generated folders such as `dist/`, `.astro/`, `.vscode/`, and local planning notes under `docs/` are gitignored.
- If you want to keep long-form internal documentation in-repo later, move it out of `docs/` or remove that ignore rule deliberately.
