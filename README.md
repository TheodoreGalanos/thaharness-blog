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

Use Node.js 22 (`nvm use`). Run commands from the project root.

| Command | Purpose |
| :--- | :--- |
| `npm ci` | Install the locked dependencies |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the site and Pagefind index into `.vercel/output/static/` |
| `python3 -m http.server 4330 --directory .vercel/output/static` | Preview the built static pages, including search |
| `npm run astro -- check` | Run Astro type/content validation |
| `npm test` | Run unit and content checks |
| `npm run check:seo` | Build and verify article metadata, sitemap pages, and retired tag redirects |
| `npm run test:built` | Check the deployable HTML, links, metadata and RSS |
| `npm run test:browser` | Test built reader journeys in Chromium |

## Content Model

Blog content lives in `src/content/blog/`.

The collection schema is defined in `src/content.config.ts` and currently supports:

- `title`
- `seoTitle` (optional descriptive search title; preserves the visible essay title)
- `description`
- `author`
- `category`
- `tags`
- `featured`
- `featuredRank`
- `pubDate`
- `updatedDate`
- `heroImage`

Posts are rendered through `src/pages/blog/[...slug].astro` and `src/layouts/EditorialPost.astro`.

Use 3–4 focused tags per article, and reuse existing topics before creating a new one. Tags must be lowercase words separated by hyphens; the collection schema caps each article at four. Choose the main subjects, not every technology or term mentioned. Drafts follow the same tag convention.

When retiring a public tag, add its closest active topic to `src/data/tag-redirects.mjs`. Astro emits permanent redirects through the Vercel adapter, and retired URLs are excluded from the sitemap. Keep redirect destinations on tags with published articles, and do not reuse retired tag names.

The build runs `scripts/finalize-tag-redirects.mjs` to make those redirects accept URLs with or without a trailing slash. The installed Vercel adapter otherwise emits slashless patterns that miss the public sitemap URLs. `npm run check:seo` verifies both forms in the final deployment artifact.

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

The three reading paths are defined in `src/data/topics.ts` and use the existing tag URLs. Article reading times and RSS are derived from rendered MDX, so imports and component code do not count as prose. RSS uses Astro's experimental container API; the build tests protect this integration when Astro changes. Article sharing images are generated at `/og/<slug>.png` using the existing Sharp dependency.

## Verification

Run `npm test`, `npm run astro -- check`, `npm run build`, `npm run test:built`, and `npm run test:browser`. Install a test browser once with `npx playwright install chromium`. On macOS, an installed Chrome can be used through `PLAYWRIGHT_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.

The GitHub Actions workflow runs these checks on Node.js 22. Browser tests cover search, first-click theme changes, blocked storage, mobile navigation, reading depth, chapter jumps, contrast, responsive overflow and signup error/retry states. Signup responses are intercepted; these tests do not send email. A static preview cannot execute `/api/subscribe` or Vercel analytics.

## Deployment

This site is configured for production at `https://theharness.blog` in `astro.config.mjs`.

For Vercel:

1. Import the repository into Vercel.
2. Keep the framework as Astro or let Vercel auto-detect it.
3. Use Node.js 22 and `npm run build` as the build command.
4. Keep the output-directory override unset. The installed Vercel adapter emits Build Output API files under `.vercel/output/`. Pagefind must index `.vercel/output/static/` after Astro finishes.
5. Add `theharness.blog` in the project domain settings.
6. Point DNS at Vercel using either nameservers or the records Vercel provides.

After a deployment, confirm its source commit in Vercel, open `/search/`, search for `HVAC`, and follow a result. Check `/pagefind/pagefind-ui.js`, `/rss.xml`, and an article's `og:image` URL return successfully. Verify fonts load from `/_astro/`, with no Google Fonts requests. A successful local build or preview does not prove the production domain serves the same commit.

## Newsletter

The site includes a newsletter signup form backed by a Vercel API function and Resend.

Required environment variables:

- `RESEND_API_KEY`
- `RESEND_NEWSLETTER_FROM`
- `RESEND_NEWSLETTER_SEGMENT_ID`
- `RESEND_NEWSLETTER_TOPIC_ID`

Optional environment variables:

- `RESEND_NEWSLETTER_REPLY_TO`
- `NEWSLETTER_SITE_URL` (defaults to `https://theharness.blog`)

Setup flow:

1. Create a Topic in Resend for newsletter subscribers.
2. Create a Segment in Resend for newsletter delivery.
3. Copy the Topic ID into `RESEND_NEWSLETTER_TOPIC_ID` and the Segment ID into `RESEND_NEWSLETTER_SEGMENT_ID`.
4. Add all required variables to local `.env` and the Vercel project settings.
5. Existing subscribers created before the segment rollout can be backfilled with `npm run newsletter:sync-segment`.
6. Create a draft broadcast for the newest post with `npm run newsletter:broadcast`.
7. Send immediately with `npm run newsletter:broadcast -- --send` or target a specific post with `npm run newsletter:broadcast -- --slug your-post-slug --send`.

Useful commands:

- `npm run newsletter:broadcast` creates a draft broadcast in Resend for the latest published post.
- `npm run newsletter:broadcast -- --slug where-capability-actually-lives-in-agentic-engineering --send` sends that post immediately.
- `npm run newsletter:broadcast -- --send --scheduled-at "2026-03-10T14:00:00Z"` schedules the latest post.
- `npm run newsletter:sync-segment` backfills topic subscribers into the delivery segment.
- `npm run newsletter:sync-segment -- --email you@example.com` backfills one address.

## Notes

- Generated folders such as `dist/`, `.astro/`, `.vscode/`, and local planning notes under `docs/` are gitignored.
- If you want to keep long-form internal documentation in-repo later, move it out of `docs/` or remove that ignore rule deliberately.
