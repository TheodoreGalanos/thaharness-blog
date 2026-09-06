// ABOUTME: Extracts published narrative text into reviewed, countable narration files.
// ABOUTME: Refuses to overwrite changed scripts when source articles are refreshed.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { countNarration, extractArticleNarration, readSitemapLocations } from './lib/article-narration.js';

const SITE = 'https://theharness.blog';

async function fetchText(url) {
	if (new URL(url).origin !== SITE) throw new Error(`Unexpected source origin: ${url}`);
	const response = await fetch(url, { signal: AbortSignal.timeout(30_000), redirect: 'error' });
	if (!response.ok) throw new Error(`Source request failed: HTTP ${response.status} for ${url}`);
	return response.text();
}

async function publishedArticleUrls() {
	const pending = [`${SITE}/sitemap-index.xml`];
	const visited = new Set();
	const articles = new Set();
	while (pending.length) {
		const url = pending.shift();
		if (visited.has(url)) continue;
		visited.add(url);
		const sitemap = readSitemapLocations(await fetchText(url));
		for (const location of sitemap.urls) {
			const entry = new URL(location);
			if (entry.origin !== SITE) throw new Error(`Unexpected sitemap origin: ${location}`);
			if (sitemap.kind === 'sitemapindex') pending.push(location);
			else if (/^\/blog\/[a-z0-9-]+\/$/.test(entry.pathname)) articles.add(location);
		}
	}
	return [...articles].sort();
}

async function readSources(sourceDir) {
	if (sourceDir) {
		const files = (await readdir(sourceDir)).filter((name) => /^[a-z0-9-]+\.html$/.test(name)).sort();
		return Promise.all(files.map(async (name) => ({
			slug: name.slice(0, -5),
			url: `${SITE}/blog/${name.slice(0, -5)}/`,
			html: await readFile(resolve(sourceDir, name), 'utf8'),
		})));
	}
	const sources = [];
	for (const url of await publishedArticleUrls()) {
		sources.push({ url, slug: new URL(url).pathname.split('/')[2], html: await fetchText(url) });
	}
	return sources;
}

async function main() {
	const { values } = parseArgs({
		options: {
			'source-dir': { type: 'string' },
			'output-dir': { type: 'string', default: 'audio/narration' },
		},
		allowPositionals: false,
	});
	const outputDir = resolve(values['output-dir']);
	const sources = await readSources(values['source-dir']);
	if (!sources.length) throw new Error('No article sources were found.');
	const articles = sources.map(({ slug, url, html }) => ({ slug, url, ...extractArticleNarration(html) }));
	const files = articles.map((article) => ({ path: `en/${article.slug}.txt`, content: article.text }));
	const manifest = {
		language: 'en',
		status: 'formatted-source-requires-narration-review',
		characterDefinition: 'Unicode code points, including spaces, paragraph breaks, and the final newline in each saved text file.',
		source: values['source-dir'] ? 'provided-html-directory' : `${SITE}/sitemap-index.xml`,
		totals: {
			articles: articles.length,
			characters: articles.reduce((sum, article) => sum + article.characters, 0),
			words: articles.reduce((sum, article) => sum + article.words, 0),
			paragraphsToReview: articles.reduce((sum, article) => sum + article.review.length, 0),
		},
		articles: articles.map(({ text, ...article }) => ({ ...article, file: `en/${article.slug}.txt` })),
	};
	files.push({ path: 'manifest.json', content: `${JSON.stringify(manifest, null, 2)}\n` });
	files.push({ path: 'REVIEW.md', content: [
		'# Narration text review',
		'',
		'Formatted English source. The text preserves the published wording, including the passages below. Review these before translation or paid generation; do not remove substantive claims merely because they discuss figures.',
		'',
		...articles.filter((article) => article.review.length).flatMap((article) => [
			`## ${article.title}`, '',
			`[Narration text](en/${article.slug}.txt) · [Published article](${article.url})`, '',
			...article.review.flatMap((item) => [`Paragraph ${item.paragraph}: ${item.reasons.join('; ')}.`, '', `> ${item.text}`, '']),
		]),
	].join('\n') });

	// Review edits must survive a rerun. Check every destination before writing any files.
	for (const file of files) {
		try {
			const existing = await readFile(resolve(outputDir, file.path), 'utf8');
			if (existing !== file.content) throw new Error(`Refusing to replace different content in ${resolve(outputDir, file.path)}. Use a fresh --output-dir to compare revisions.`);
		} catch (error) {
			if (error.code !== 'ENOENT') throw error;
		}
	}
	await mkdir(resolve(outputDir, 'en'), { recursive: true });
	for (const file of files) await writeFile(resolve(outputDir, file.path), file.content);
	// Verify the count against the saved files, not just the in-memory extraction.
	let characters = 0;
	for (const article of manifest.articles) {
		const saved = countNarration(await readFile(resolve(outputDir, article.file), 'utf8'));
		if (saved.sha256 !== article.sha256) throw new Error(`Saved text does not match ${article.slug}.`);
		characters += saved.characters;
	}
	console.log(JSON.stringify({ ...manifest.totals, savedCharacters: characters, outputDir }, null, 2));
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
