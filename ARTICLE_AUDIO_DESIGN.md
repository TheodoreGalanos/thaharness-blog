# Saved article audio

Status: All six selected English articles are generated, saved locally, and uploaded to public Vercel Blob. Each passed full-file decoding, exact-input and audio hash checks, and reuse with network access disabled. Theo approved hosting the batch on 6 September 2026. [The published manifest](audio/published.json) records all six URLs after their size, content type, caching, and byte-range checks passed. The compact website player is implemented. The final ElevenLabs account check confirmed 49,652 credits used and 40,348 remaining. See [all recordings](audio/README.md#recordings).

## Agreed behaviour

The first batch is English narration of the six most recently published articles, from *The Distance to the Edge* (14 August 2026) through *Mediation, Not Intermediation* (8 July 2026). The selected files and costs are listed in [audio/README.md](audio/README.md#recordings). Older articles, Mandarin, and Spanish are deferred. Use an English narrator for this batch; any later language expansion uses a suitable narrator for each language.

Generate the files once and save them. Readers play the saved files; page views and playback never call ElevenLabs. Regeneration is an explicit publishing action when the narrative or voice changes.

Exclude figures, tables, captions, chart labels, and interactive controls. Preserve the article's argument and substantive caveats. Translation must preserve the article rather than summarise it or turn it into a podcast conversation.

## Current evidence

| Item | Observed state |
| --- | --- |
| Published scope | The live sitemap lists 16 article routes. The selected first batch contains only the latest six, in English: six final audio files. |
| Local content | 21 source articles: 16 marked published and 5 drafts. |
| Publication mismatch | Resolved against main `cb16d02`: article prose, publication flags, and dates match main; the reduced tags are retained. |
| Formatted English text | 16 saved text files contain exactly 323,010 Unicode characters and approximately 51,008 words. Counts and hashes were verified against the files. See [audio/README.md](audio/README.md). |
| Extraction exclusions | The formatter removed 97 figure elements, 18 tables (including tables inside figures), and 45 code blocks. It retained narrative footnotes and unique pullquotes. |
| Estimated English duration | About 5–5.7 hours at 150–170 words per minute. This is an estimate, not measured audio. |
| ElevenLabs account | Active Starter subscription, billed annually, with monthly character refresh. After all six recordings: `character_count=49652`, `character_limit=90000`, leaving 40,348 credits. Overage disabled. |
| Next ElevenLabs refresh | 15 September 2026, 8:03 pm Australia/Melbourne, according to `next_character_count_reset_unix`. |
| Credential | `ELEVEN_LABS_API_KEY` is present in `.env`; model and subscription reads succeeded. Preserve this exact variable name. |
| Voice discovery and generation | Voices Read returned 21 voices with custom-rate voices excluded. George (`JBFqnCBsd6RMkjVDRZzb`), a premade British English narrator, generated all six articles with Flash v2.5. Every TTS request succeeded with HTTP 200. |
| Saved recordings | Six mono 44.1 kHz / 96 kbps MP3 files: 1 hour 45 minutes 43 seconds and 76,121,606 bytes in total. Full decoding and saved hashes passed for every file. The 49,652-credit sum of response costs matches the final account deduction. |
| Vercel | Project `thaharness-blog`, domain `theharness.blog`, Astro framework, Hobby team. Production deployment `dpl_2uXcC43qrdsgQK7SqBmorSADqLtH` reported `READY` and matched main commit `cb16d022bca981a719165bc667e77460c94085b3`. The saved text was refreshed from this live production revision. |
| Build | `npm run build` passed, including Pagefind. The local adapter warned that Node 26 falls back to Node 22 for Functions; Vercel project settings report Node 24. This existing mismatch is outside the audio change. |

The English count is exact for the saved scripts. Narration-only edits in three selected articles replace references to omitted diagram colours, boxes, table columns, and code with wording that works when heard. Claims and caveats remain, including the fact that the proposed ledger controls are unbuilt. These adaptations are recorded in [the review list](audio/narration/REVIEW.md). The review detector was fixed to catch unnumbered references; the selected six have no unresolved flags, while six flagged passages remain in older articles outside the batch.

The first batch used live published text. The current checkout has since been reconciled with the matching main revision, preserving the saved recordings and reviewed narration text. For later articles, extract from the production HTML of the intended publication revision using the same extraction code. Development pages are unsuitable as a publication list because `src/utils/blog.ts` deliberately includes drafts in development.

## Generation and playback

```mermaid
flowchart LR
    A[Published article HTML] --> B[Reviewed English narrative]
    B --> C[Reviewed Mandarin and Spanish translations]
    B --> D[Local ElevenLabs generation script]
    C --> D
    D --> E[Finished MP3 files and metadata]
    E --> F[Public object storage]
    F --> G[Article audio player on Vercel]
```

Generation runs locally as an explicit command. Normal Astro builds consume saved metadata and never translate, generate, or upload audio. The browser uses public file URLs directly. This needs no speech API route, background service, queue, database, or runtime ElevenLabs secret.

### 1. Extract the narrative

Use the installed `jsdom` dependency to parse rendered HTML. The article body has a stable `.post-content` container in `src/layouts/EditorialPost.astro`. Rendering first resolves MDX imports and custom components without teaching a second Markdown parser every component convention.

Include the title, headings, paragraphs, prose lists, quotations, and relevant narrative footnotes in reading order. Preserve inline code when it is part of a sentence. Read link labels without URL destinations. The initial assumption is to omit the description deck, byline, reading-time labels, source-only bibliography entries, and fenced code; these are reviewable narration choices.

Remove entire `figure`, `table`, image, SVG, canvas, code-block, script, style, and UI subtrees before reading text. Do not use a blanket rule that deletes every `aside`: `Pullquote.astro` uses an aside for actual prose. Do not delete all footnotes: several contain qualifications needed to understand the claims. The formatter keeps 37 footnotes as numbered endnotes and moves 7 margin notes after their paragraphs. Omit reference markers and backlinks.

Keep unique pullquotes. Remove a repeated pullquote only when its wording is already present in the narrative. Flag unknown content structures and visual references for review. Do not invent descriptions of omitted graphics. Any adaptation needed to make a paragraph understandable without its figure should be a visible edit to the narration script.

The existing newsletter helper uses regexes for short summaries. It is not a full-article narration extractor.

### 2. Translate and review (deferred)

Translation is outside the selected English batch. The following design applies only if Mandarin and Spanish are resumed.

Save one reviewed text script for each article and language. Keep a glossary for recurring terms, names, model identifiers, and abbreviations such as AEC-Bench, harness, RLM, HVAC, and AS/NZS references. Check numbers, negation, qualifications, and section coverage against English.

Translation is a separate text step. Multilingual TTS speaks the text supplied to it; selecting a multilingual model does not translate English. The translation provider is still to be selected. This design does not require adding another paid API: prepared and reviewed translations can be supplied as files.

Dialect choices remain open. Suggested sample targets are Australian English, standard Mainland Mandarin, and broadly understandable Latin American Spanish. These are proposals, not approved voice selections. Mandarin script choice and spoken accent are separate decisions.

### 3. Generate with ElevenLabs

Read-only API calls confirmed these limits and rates for the account:

| Model ID | Characters per request | Reported character cost multiplier | Proposed use |
| --- | ---: | ---: | --- |
| `eleven_multilingual_v2` | 10,000 | 1 | Preferred baseline for consistent long-form narration. |
| `eleven_v3` | 5,000 | 1 | Optional expressive sample; not the default for the archive. |
| `eleven_flash_v2_5` | 40,000 | 0.5 | Selected model; used for all six saved recordings. |
| `eleven_turbo_v2_5` | 40,000 | 0.5 | Same cost as Flash; deprecated by ElevenLabs. |

All four advertise support for English, Chinese/Mandarin, and Spanish. ElevenLabs describes Multilingual v2 as stable for long-form output. Turbo provides no further saving over Flash. The older Flash v2 and Turbo v2 have the same multiplier but support English only. V3 Conversational also reports 0.5; it has not been tested for this file workflow. Flash v2.5 is the selected model for this batch. [Models](https://elevenlabs.io/docs/overview/models)

Use `POST /v1/text-to-speech/{voice_id}` with `xi-api-key`, the reviewed `text`, an explicit `model_id`, and pinned voice settings. The selected delivery format is mono MP3 at 44.1 kHz and 96 kbps. The API supports these formats directly. `language_code` is not supported by Multilingual v2, so do not treat it as a translation or language-selection switch for that model. [Create speech](https://elevenlabs.io/docs/api-reference/text-to-speech/convert)

All six selected English scripts fit Flash's 40,000-character request limit. The implemented command sends one complete article per request and saves the returned MP3 directly. It rejects larger inputs. Chunking is deferred until an article actually requires it. If needed, split at paragraph or sentence boundaries and use request stitching; never split Mandarin by spaces or slice through a Unicode character. Request-ID stitching allows up to three preceding IDs, no older than two hours, and is unavailable for v3. [Request stitching](https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/request-stitching)

Use alias pronunciation rules for Multilingual v2, with a pinned dictionary version. Its dictionary phoneme tags are not supported. Keep pronunciation substitutions distinct from the wording of the readable transcript. [Pronunciation dictionaries](https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries)

For the initial script, Node's built-in `fetch` is sufficient for the small REST surface. No ElevenLabs SDK is required. Discover voices with the current paginated `GET /v2/voices` endpoint and check native-language suitability, model compatibility, availability, and any custom rate before sampling. [Voice API](https://elevenlabs.io/docs/api-reference/voices/search)

### 4. Save files and resume safely

Reviewed text and extraction counts are saved in the repository. Local generation receipts record measured duration, byte size, source-text hash, and request-settings hash alongside the audio. When adding website playback, publish a small article manifest with the hosted URL and needed playback metadata. Keep API keys out of all artifacts.

The implemented command stores an MP3, the exact submitted text, request settings, and a receipt under the ignored `audio/generated/en/` directory. The directory name includes a hash of the text, voice, model, format, and voice settings. A matching rerun verifies the saved audio hash and reuses the file without any API requests. A changed input creates a separate output directory. The command uses exclusive directory creation to prevent concurrent duplicate requests.

The command stops on API errors and never automatically retries a paid request. An interrupted paid request may have completed remotely: inspect its receipt and ElevenLabs history before retrying. Save response IDs and reported usage when available and keep a separate regeneration allowance. Account deductions can lag behind the TTS response: the first request initially showed no balance change, then a later read confirmed the 8,743-credit deduction.

For this batch, ElevenLabs returns the complete MP3 and no assembly is required. macOS `afinfo` measured the first file; `afconvert` decoded all six completely, and the decoded sample counts provided their durations. The decoder required execution outside the filesystem sandbox to initialise. Browser seeking has been verified during player integration. Full spoken-word accuracy has not been checked automatically. For future multi-request articles, use a media tool for assembly; do not concatenate MP3 byte buffers and assume correct duration metadata.

Use a filename derived from the content/settings hash for each published revision. Upload and verify the finished file before updating the manifest. Retain a local copy of finished audio. No upload or publishing step is part of the normal site build.

## Budget

### Completed six-article English batch

The final scripts contain **99,108 characters** and **15,479 words** after listening adaptations. The estimated half-rate cost was 49,554 credits. Actual response costs totalled **49,652 credits**: 8,743 for the first article and 40,909 for the other five. The final subscription check confirmed the same 49,652-credit deduction from the 90,000 starting balance, leaving **40,348 credits**. The cause of the 98-credit difference from the text estimate has not been established.

The measured combined duration is **1 hour 45 minutes 43 seconds**, with **76,121,606 bytes** of MP3 audio. Figures, tables, and code blocks were excluded. All remaining visual and code references found in the selected scripts were adapted before their paid requests.

### Older articles and other languages (deferred)

The ten remaining prepared English articles contain **223,902 characters**, estimated at **111,951 credits** using Flash's reported 0.5 rate before further review edits or retries. That exceeds the remaining balance. Mandarin and Spanish must be counted after translation; English characters are not a reliable proxy for Chinese characters.

The starting balance does not imply that 90,000 fresh credits arrive every month. Use authenticated quota and actual response costs to plan this account. No plan upgrade, overage, or credit purchase has been made. [Subscription API](https://elevenlabs.io/docs/api-reference/user/subscription/get)

## Vercel hosting

Vercel explicitly supports large audio files as a Blob use case. Public Blob URLs can be used directly by the browser. Hobby is restricted to non-commercial personal use; adding narration does not itself resolve or change that requirement. This design assumes the blog qualifies. [Blob overview](https://vercel.com/docs/vercel-blob), [fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)

Prefer public object storage over adding the archive to Git and the deployment source. Vercel's documented 100 MB Hobby / 1 GB Pro upload limit refers specifically to source uploads through the CLI, not a universal per-audio-file limit. Keeping hundreds of megabytes of audio outside the deploy also keeps code checkout and builds small. [Deployment limits](https://vercel.com/docs/limits)

Public Vercel Blob is selected for the first version. Hobby includes 1 GB storage and 10 GB Blob transfer per month. This transfer allowance is shared by the audio downloads; it is not per article or per language. Blob becomes unavailable when Hobby limits are exceeded, rather than automatically charging overage. The documented recovery period is 30 days; do not assume a calendar-month reset. [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing), [monthly allowance](https://vercel.com/kb/guide/vercel-blob-vs-netlify-blobs)

Public store `blog-article-audio` (`store_2EsLTWDZZpu12rcg`) is in `iad1`, under the blog's existing Hobby team. The team had no Blob stores before this upload. It is connected to the `thaharness-blog` development environment for local upload credentials. Production and preview playback use public URLs and need no Blob write token. The CLI saved development credentials in ignored `.env.local`; `.env` and its ElevenLabs key were preserved. No DNS change or website deployment is needed to publish these MP3s. Current-cycle transfer already consumed has not been measured.

Published paths use `audio/en/<slug>-<first-16-characters-of-audio-sha256>.mp3`, with `audio/mpeg` and `cacheControlMaxAge=31536000`. Uploads refuse overwrites. [The published manifest](audio/published.json) is the saved mapping from article slug to URL, measured duration, size, text/audio hashes, and delivery verification. It contains no credentials. Each delivery check requires HTTP 200 for HEAD, exact length, the configured cache lifetime, and HTTP 206 responses whose first, middle, and last 1,024 bytes match the local MP3.

### File size and transfer

Arithmetic estimates for one complete 20-minute download, using decimal MB/GB:

| MP3 bitrate | File size | Complete downloads per month using the full 10 GB |
| --- | ---: | ---: |
| 64 kbps | 9.6 MB | About 1,040 |
| 96 kbps | 14.4 MB | About 690 |
| 128 kbps | 19.2 MB | About 520 |

These are not listener forecasts. They exclude existing usage, extra range requests, retries, and container overhead; partial listening and browser cache reuse can reduce transfers. If all three languages total 15–17 hours, 96 kbps delivery would require roughly 648–734 MB. Translated audio durations remain unmeasured.

### Playback optimisation

- Use one English player per available article. Show a language selector only when more languages exist. Use `preload="none"`, no autoplay, and saved duration metadata. Attach the audio URL on the first explicit play action so opening an article does not download audio; preload alone is a browser hint.
- Serve the public storage URL directly. Proxying audio through an Astro API route adds a server hop and can add delivery charges.
- Use `Content-Type: audio/mpeg`, a stable length, and byte-range support. Verify HTTP 206 and seeking on a real hosted file. Blob documents range requests. [Blob examples](https://vercel.com/docs/vercel-blob/examples)
- Give immutable file names a long cache lifetime. Set Blob's `cacheControlMaxAge` at upload; a header in the blog's `vercel.json` does not configure a separate Blob URL. Public Blob defaults to a month of browser/CDN caching and supports ETags. [Public Blob caching](https://vercel.com/docs/vercel-blob/public-storage)
- CDN caching reduces origin work but does not eliminate delivery transfer. Blob cache hits still count toward transfer and Edge Requests. [Blob usage](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- The finished files are mono 96 kbps MP3. Use these exports directly; additional codecs, adaptive streaming, and a player framework are unnecessary for this batch.
- Provide accessible controls, the two selected speeds, and an English narration label. Theo removed the transcript and direct-file links from the reader interface. Report playback errors without affecting the written article.

### Implemented article player

`src/components/ArticleAudio.astro` sits below the article metadata and tags, before `ChapterStrip`, at the existing 42 rem header width. `EditorialPost.astro` matches its `slug` to the English recording in `audio/published.json`. An article without a recording renders no player and includes no player script.

The player uses the existing editorial colours and fonts. Theo requested a smaller control area: the play icon is 18 px inside a 44 px button, and the initial desktop player height dropped from about 230 px to 160 px. Buttons retain 44 px tap targets. Normal loading, playback, pause, and completion keep the same height.

| Control | Behaviour |
| --- | --- |
| Play / pause / replay | One primary button. The first press attaches the public MP3 URL and starts playback. |
| Seek bar | Keyboard-operable position slider with elapsed and total time. Dragging previews the time; releasing commits one seek. |
| Back / forward 15 seconds | Move within the recording, clamped to its start and end. |
| Playback speed | **1× and 1.15× only**, default 1×, with pitch preserved. Selection remains through pause and replay and resets on a new page load. |
| Volume | Mute and volume controls on desktop; use device volume on narrow screens and touch devices. |

The label is **Listen to this article**, with **English · AI narration**. There are no transcript or direct-file links in the player, following Theo's review. Reviewed narration text remains an authoring input in `audio/narration/en/`; no transcript endpoint is published. When JavaScript is disabled, the player is hidden and the written article remains available.

`src/scripts/article-audio.ts` controls a native `<audio>` element without a library. Duration is rendered from the manifest. The element starts with `preload="none"` and no `src`, so page load, focus, and speed selection cannot fetch the MP3. Pointer entry, focus, or pointer down warms the storage connection once with `rel="preconnect"`. Playback starts directly in the click handler, retaining the user activation needed on mobile. The built script is inlined by Astro, so it needs no separate script request. [Preconnect behaviour](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect), [media play method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)

Speed uses `HTMLMediaElement.playbackRate` and requires no additional recording or speech request. A complete listen still transfers the same MP3 bytes. The browser controls buffering after Play and can fetch ahead; pausing is not a guarantee that all network transfer stops immediately. The public URLs retain their one-year caching and byte-range support. No credentials, audio proxy, or speech API are involved in reader playback.

Media events drive loading, playing, paused, ended, and error states. Errors expose an explicit retry button; failed requests do not retry automatically. Pausing during startup cancels the pending play attempt, including native pauses, without reporting a false error. Time updates do not trigger document layout measurements or scroll work. Playback stops when leaving the article; cross-page playback, saved positions, and audio chapter timestamps remain outside this version.

The controller tests cover lazy loading, connection warming, speed, seek commit and bounds, pause/resume, pending-play cancellation, error/retry, replay, and volume. Production-build browser checks use temporary local instrumentation that does not enter the site build. One first-play measurement at 1× reached the browser's `playing` event in **604 ms**; cached resume/replay measurements were **6–9 ms** on that same connection. These are local observations, not a latency guarantee. The browser showed no media source, no media network activity, and no Blob resource requests before Play. Desktop and narrow-screen checks confirmed no horizontal overflow and a stable player height during normal playback.

All six narrated articles appear in the production build after reconciliation with main `cb16d02`. The five remaining drafts stay excluded. Built article narration matches the saved scripts apart from the three documented listening adaptations; recordings and hosted metadata are unchanged.

## Implementation and validation order

1. Completed: extract the published narrative, preserve margin notes and footnotes, count exact text, and protect reviewed output. Narration-only adaptations in three articles are recorded in `audio/narration/REVIEW.md`.
2. Completed: generate all six selected English articles sequentially with George and Flash v2.5, saving each MP3 before the next request.
3. Completed: verify full-file decoding, measured duration and size, exact submitted text, audio hashes, final account deduction, and saved-file reuse without API access. All 126 tests passed, including the regression for previously missed unnumbered visual/code references.
4. Listen to the remaining five recordings for pronunciation, completeness, pauses, and consistency. A successful decode does not establish spoken-word accuracy.
5. Completed: create public Vercel Blob hosting, upload all six files, and save their public metadata. All six passed content type, exact length, one-year cache lifetime, and HTTP 206 checks with matching bytes at three positions.
6. Implemented and verified locally: the compact player above, with two speed choices and no transcript or direct-file links. After reconciliation, unit tests, five built-site tests, 14 Chromium browser tests, the production build, and SEO checks passed under Node 22. Astro reported zero type errors. All six production article pages render their correct recordings and speed choices without requesting audio before Play. Browser checks covered desktop and a narrow Chromium viewport, including 1.15× through pause, resume, and replay; physical iOS/Safari testing remains unperformed. The local publication revision now matches main `cb16d02`. Generation of older articles and other languages remains deferred.

## Remaining decisions and limits

- George, a British English narrator, is used for all six selected articles.
- TTS permission, all six MP3 decodes, saved-file reuse, the full batch credit deduction, and hosted delivery are verified. Theo approved the batch for hosting; automated spoken-word accuracy checks have not been performed. Browser playback and the control interactions were checked locally against the hosted MP3s.
- Translation is deferred; a provider and review process will be needed only if other languages are resumed.
- The selected six-article batch is complete. The ten deferred English articles exceed the remaining balance.
- All six files are hosted in Vercel Blob. The team had no Blob stores before this upload. Vercel transfer already consumed this cycle has not been measured.
- English preparation and single-article generation are implemented in `scripts/prepare-article-audio.mjs`, `scripts/generate-article-audio.mjs`, and their library modules. The player is implemented in `src/components/ArticleAudio.astro` and `src/scripts/article-audio.ts`, with behavioural tests in `tests/article-audio.test.ts`.

Audio Native, dubbing, and Studio were reviewed but are not required for the agreed implementation. Audio Native supplies a hosted player and requires Creator or above; dubbing starts from audio/video; Studio API access is available on request. Direct TTS provides the saved-file workflow without these dependencies. [Audio Native](https://elevenlabs.io/docs/eleven-creative/audio-tools/audio-native), [dubbing](https://elevenlabs.io/docs/overview/capabilities/dubbing), [Studio API](https://elevenlabs.io/docs/api-reference/studio-api-information)
