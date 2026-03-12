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
