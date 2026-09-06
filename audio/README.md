# Saved article audio

All **six selected English articles** are generated, saved locally, and uploaded to public Vercel Blob. They use **George — Warm, Captivating Storyteller** (`JBFqnCBsd6RMkjVDRZzb`), a British English narrator, with **Flash v2.5**. Each article was generated in one request and saved before the next began. Older articles, Mandarin, and Spanish remain deferred.

## Recordings

| Article — local MP3 | Duration | File size | Reported credits | Hosted MP3 |
| --- | ---: | ---: | ---: | --- |
| [The Distance to the Edge](generated/en/the-distance-to-the-edge-7a40a4cafba9a33d/audio.mp3) | 18:36 | 13.4 MB | 8,743 | [Open audio](https://2esltwdzzpu12rcg.public.blob.vercel-storage.com/audio/en/the-distance-to-the-edge-66b15c416693d50a.mp3) |
| [A World Worth Learning From](generated/en/a-world-worth-learning-from-339be01f879204f1/audio.mp3) | 16:40 | 12.0 MB | 7,915 | [Open audio](https://2esltwdzzpu12rcg.public.blob.vercel-storage.com/audio/en/a-world-worth-learning-from-4510fe907e497480.mp3) |
| [Broad Creation, Narrow Authority](generated/en/broad-creation-narrow-authority-ac5d09ca01346fe8/audio.mp3) | 19:16 | 13.9 MB | 9,067 | [Open audio](https://2esltwdzzpu12rcg.public.blob.vercel-storage.com/audio/en/broad-creation-narrow-authority-9cc843ec896961a9.mp3) |
| [The Attacker Moves Second. So Did I.](generated/en/the-attacker-moves-second-so-did-i-fb0c61c1686a07c8/audio.mp3) | 20:12 | 14.5 MB | 9,174 | [Open audio](https://2esltwdzzpu12rcg.public.blob.vercel-storage.com/audio/en/the-attacker-moves-second-so-did-i-af562112f1ae4963.mp3) |
| [Fluent, But Unsafe](generated/en/fluent-but-unsafe-543c45374b4a35d7/audio.mp3) | 26:28 | 19.1 MB | 12,645 | [Open audio](https://2esltwdzzpu12rcg.public.blob.vercel-storage.com/audio/en/fluent-but-unsafe-815f14e2e4a53fe0.mp3) |
| [Mediation, Not Intermediation](generated/en/mediation-not-intermediation-216d437c31137244/audio.mp3) | 4:32 | 3.3 MB | 2,108 | [Open audio](https://2esltwdzzpu12rcg.public.blob.vercel-storage.com/audio/en/mediation-not-intermediation-7d8127b6787b7c7a.mp3) |
| **Total** | **1:45:43** | **76.1 MB** | **49,652** | **6 files** |

All files are mono MP3 at 44.1 kHz and 96 kbps. Exact combined size: **76,121,606 bytes**. The remaining five generated in the final pass used **40,909 credits**. A subsequent subscription check at 2026-09-06T04:26:34.889Z confirmed **49,652 credits used** out of 90,000 and **40,348 remaining**, matching the sum of the six response cost headers. Account balances can lag behind generation; an earlier read had not yet included the last recording.

All six passed complete decoding with macOS `afconvert`, audio and text hash checks, and a reuse check with network access disabled. Each submitted request matched its saved `narration.txt` and the current prepared script. The first recording was delivered before the remaining five were authorised. Theo approved hosting the batch. Automated spoken-word accuracy checks have not been performed; website playback and player controls have been tested locally. All six hosted files passed HEAD and byte-range delivery checks.

Each linked MP3's directory also contains:

- `narration.txt`: the exact text submitted.
- `request.json`: voice, model, output format, and voice settings, without the API key.
- `receipt.json`: request and history IDs, text/audio hashes, response cost, account observations, duration, format, and decode validation.

`audio/generated/` is ignored by Git. These local media files do not enter site builds or deployments. Preserve a copy of this directory when moving the work to another machine.

## Narration source and adaptations

The initial English text came from the live sitemap and production article HTML on 6 September 2026, after [main commit `cb16d02`](https://github.com/TheodoreGalanos/thaharness-blog/commit/cb16d022bca981a719165bc667e77460c94085b3). Vercel production deployment `dpl_2uXcC43qrdsgQK7SqBmorSADqLtH` was `READY`, matched that commit, and served `theharness.blog`. All 16 published articles were prepared. The local article copies now match that main revision, including its publication flags and dates.

The selected six scripts now contain **99,108 Unicode characters** and **15,479 words**, including listening adaptations. The complete prepared archive contains **323,010 characters** and **51,008 words**. Counts include spaces, paragraph breaks, and each file's final newline. [`manifest.json`](narration/manifest.json) records per-article counts and hashes.

Three scripts needed small changes for listening:

- *A World Worth Learning From*: explain the fixed model and responsive environment directly instead of referring to orange and blue lines.
- *The Attacker Moves Second. So Did I.*: introduce the five prose descriptions without diagram boxes, and keep the explicit caveat that the proposed ledger controls are unbuilt.
- *Fluent, But Unsafe*: direct listeners to the written article for the omitted commands and panel.

The changes are recorded in [`REVIEW.md`](narration/REVIEW.md). The website articles were not edited. No unresolved visual/code references were found in the final review scan of the selected six. Six flagged passages remain in older articles outside this batch. The review detector now catches unnumbered figures, diagram boxes, table columns, and references to omitted code; a regression test reproduced those missed cases before the fix.

Formatting retains titles, section headings, paragraphs, prose lists, link labels, inline technical terms, and unique quotations. It omits figures and captions, tables, chart controls, images, code blocks, navigation, description decks, bylines, and reading-time labels. Across the archive, seven margin notes follow their complete paragraphs and 37 substantive footnotes remain as endnotes. `TL;DR` headings become `Summary`.

## Generate or reuse one article

From the repository root:

```sh
node scripts/generate-article-audio.mjs --article the-distance-to-the-edge --voice-id JBFqnCBsd6RMkjVDRZzb
```

The command reads `ELEVEN_LABS_API_KEY` from `.env`. Before a new paid request it checks the prepared text hash, unresolved review passages, included balance, model rate and request limit, and premade English voice. It uses Flash v2.5, `mp3_44100_96`, stability 0.6, similarity 0.75, style 0, speaker boost enabled, speed 1, and automatic text normalization. All six scripts fit the 40,000-character single-request limit, so no audio assembly was needed.

An unchanged rerun verifies and reuses the saved MP3 without API calls. Changed text or settings produce a different output directory. An interrupted or failed paid request is never automatically retried: inspect the receipt and ElevenLabs history first, since the request may have been billed. Concurrent invocations cannot generate the same input twice.

## Refresh the published text

The formatter reads production HTML without executing page scripts. To compare a later publication revision with these reviewed scripts:

```sh
node scripts/prepare-article-audio.mjs --output-dir /tmp/article-narration-review
```

The default output is `audio/narration`, but existing differing files cause the command to stop before writing. These scripts now contain deliberate listening edits, so use a fresh directory and compare changes. An offline repeat can use `--source-dir /path/to/published-html`; supply only already-selected published HTML snapshots named `<slug>.html`. The offline directory is an explicit input list, not a draft detector.

After any narration edit, review the text and update its counts, hash, and unresolved passages in the manifest before generation. The generator refuses text that no longer matches its manifest. The complete archive manifest is not an instruction to generate older articles.

## Credit rates and deferred work

Read-only model checks report 0.5 credits per character for Flash v2.5 and Turbo v2.5, and 1 credit per character for Multilingual v2 and Eleven v3. These are estimates from `model_rates.character_cost_multiplier` and `model_rates.cost_discount_multiplier=1`. The adapted six-script estimate was 49,554 credits; the observed cost was 49,652, a difference of 98. The cause of that small difference has not been established. Actual response costs and account deductions take precedence over the estimate.

ElevenLabs lists Turbo v2.5 as deprecated and functionally equivalent to Flash v2.5. All six recordings use Flash. Older Flash v2 and Turbo v2 support English only and have the same reported half rate. [ElevenLabs model documentation](https://elevenlabs.io/docs/overview/models)

The ten remaining English scripts contain **223,902 characters**, estimated at **111,951 credits** before review edits and retries. They exceed the remaining 40,348-credit balance and are deferred. Mandarin and Spanish have not been translated, so their character counts and costs are unknown. The 90,000 starting balance does not mean 90,000 fresh credits arrive every month; the account is Starter with overage disabled.

## Hosting decision

Use public Vercel Blob for the first version, with saved MP3 URLs served directly from the article player. Generation and upload are explicit actions. Ordinary builds and reader playback do not call ElevenLabs.

Hobby includes 1 GB storage and 10 GB Blob Data Transfer per month. The six recordings occupy 76.1 MB. The earlier estimate of about 690 complete monthly downloads assumed every file was 20 minutes at 96 kbps and the entire 10 GB allowance was available; it is shared across articles, not per article. Actual files range from about 4.5 to 26.5 minutes. [Vercel monthly allowance](https://vercel.com/kb/guide/vercel-blob-vs-netlify-blobs)

Use `preload="none"`, no autoplay, direct public URLs, and long-lived caching on immutable file names. CDN cache hits still consume Blob Data Transfer; browser reuse can avoid another download. Hobby can stop Blob access when limits are exceeded. [Blob pricing and limits](https://vercel.com/docs/vercel-blob/usage-and-pricing)

Public store `blog-article-audio` (`store_2EsLTWDZZpu12rcg`, region `iad1`) holds all six recordings. The store is connected to the blog project’s development environment for local uploads; reader playback needs only public URLs. The compact website player provides play/pause, seeking, 15-second skips, desktop volume, and only 1× / 1.15× playback. Theo removed the transcript and direct-file links from the reader interface. [The full design](../ARTICLE_AUDIO_DESIGN.md#implemented-article-player) describes the implementation and verification. The production build, built-site checks, Chromium browser suite, and unit tests have been verified under Node 22. Astro reported zero type errors. The browser suite checks all six players, their 1× / 1.15× choices, and the absence of audio requests before Play.

## Published files and delivery checks

[`published.json`](published.json) is the authoritative mapping from article slug and language to hosted MP3 URL and measured duration. It also records file size, audio/text hashes, generation request hash, and delivery checks. All six URLs passed HTTP 200 HEAD checks with exact lengths, `Content-Type: audio/mpeg`, and `Cache-Control: public, max-age=31536000`. Each also returned HTTP 206 with byte-for-byte matching 1,024-byte ranges at its start, middle, and end. These checks establish file delivery and range support. Browser checks during integration also exercised playback, pause, seeking, speed, replay, and missing-file handling.

Published filenames contain the first 16 characters of the MP3 SHA-256 hash. Uploads used `vercel blob put` with `--access public`, an explicit `--pathname`, `--content-type audio/mpeg`, and `--cache-control-max-age 31536000`; overwrite and random suffix options stayed disabled. Upload credentials were supplied through the process environment without printing them. CLI 59.11.7 rejects a lone `VERCEL_OIDC_TOKEN` without `BLOB_STORE_ID`, so the upload process supplied only the Blob read/write token from `.env.local` and omitted that incomplete OIDC pair. Production and preview do not need write credentials for this player.

For a revised recording, generate and review it explicitly, upload under its new audio hash, verify its delivery, then replace the corresponding manifest entry. Keep the local recording and the previously published Blob until its removal is explicitly approved. Ordinary builds never upload or generate audio.

## Player loading and integration

`EditorialPost.astro` selects the English recording by article slug. The player starts without a media source and adds the URL only on Play. Focus or pointer interaction warms the Blob connection without requesting the file. Astro inlines the 3,433-byte player script (1,314 bytes gzipped) only on pages that render the component, avoiding a separate script request. No speech or storage write credentials are used by the player.

The repository is reconciled with main `cb16d02`: 16 articles are published and five remain drafts. All six narrated articles now include their players in the production build. Extracting narration from that build reproduces the saved scripts exactly except for the three documented listening adaptations. The MP3s, reviewed text, and hosted metadata are unchanged; no regeneration or additional credits were needed.
