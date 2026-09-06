// ABOUTME: Tests narrative extraction and exact saved-text counts.
// ABOUTME: Covers omitted visual material and references requiring listening adaptations.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { countNarration, extractArticleNarration, readSitemapLocations } from './article-narration.js';

const page = (body) => `<html lang="en"><body><nav>Navigation</nav><article><h1>Test article</h1><p>Deck</p><div class="post-content">${body}</div></article><footer>Subscribe</footer></body></html>`;

test('extracts prose and removes complete figures, tables, code, and controls', () => {
	const result = extractArticleNarration(page(`<p>Before <em>the image</em>.</p>
		<figure><p>Chart label</p><svg><text>Hidden axis</text></svg><table><tr><td>Chart data</td></tr></table><figcaption>Caption</figcaption></figure>
		<table><tr><td>Table data</td></tr></table><pre><code>run_this()</code></pre>
		<p>Read <a href="https://example.com">the paper</a>, then inspect <code>result.json</code>.</p>
		<script>throw new Error('Must not execute')</script><button>Copy</button><p hidden>Hidden</p>`));
	assert.equal(result.text, 'Test article\n\nBefore the image.\n\nRead the paper, then inspect result.json.\n');
	assert.deepEqual(result.excluded, { figures: 1, tables: 2, codeBlocks: 1, repeatedPullquotes: 0 });
});

test('joins source wrapping without merging paragraphs or inline words', () => {
	const result = extractArticleNarration(page('<h2>TL;DR: Findings</h2><p>One\n sentence with <strong>meaning</strong> and<br>space.</p><p>Another paragraph.</p>'));
	assert.equal(result.text, 'Test article\n\nSummary: Findings\n\nOne sentence with meaning and space.\n\nAnother paragraph.\n');
});

test('preserves nested lists and their introductory text in reading order', () => {
	const result = extractArticleNarration(page('<ol start="3"><li>First item<ul><li>Nested item</li></ul>Continuation.</li><li><p>Second item.</p></li></ol>'));
	assert.equal(result.text, 'Test article\n\n3. First item\n\nNested item\n\nContinuation.\n\n4. Second item.\n');
});

test('preserves substantive footnotes once and removes reference markers and backlinks', () => {
	const result = extractArticleNarration(page('<p>A qualified claim<sup><a data-footnote-ref href="#note">1</a></sup>.</p><section data-footnotes><h2>Footnotes</h2><ol><li id="note"><p>This was tested only once. <a data-footnote-backref>↩</a></p></li></ol></section>'));
	assert.equal(result.text, 'Test article\n\nA qualified claim.\n\nNotes\n\nNote 1. This was tested only once.\n');
	assert.equal(result.footnotes, 1);
});

test('reads margin notes after the complete paragraph rather than inside its sentence', () => {
	const result = extractArticleNarration(page('<p>Check readback <span class="sidenote" role="note"> Readback verifies the saved record. </span>. Then continue <span class="sidenote" role="note"> A second explanation. </span>.</p>'));
	assert.equal(result.text, 'Test article\n\nCheck readback. Then continue.\n\nNote: Readback verifies the saved record.\n\nNote: A second explanation.\n');
	assert.equal(result.sidenotes, 2);
});

test('keeps unique and attributed pullquotes but omits exact repeated pullquotes', () => {
	const result = extractArticleNarration(page('<p>The argument matters.</p><aside class="pullquote"><blockquote>The argument matters.</blockquote></aside><aside class="pullquote"><blockquote>A unique qualification.</blockquote></aside><aside class="pullquote"><blockquote>The argument matters.</blockquote><p class="pullquote-attribution">An author</p></aside>'));
	assert.equal(result.excluded.repeatedPullquotes, 1);
	assert.match(result.text, /A unique qualification\./);
	assert.match(result.text, /The argument matters\.\n\nAn author/);
});

test('retains visual references and editorial placeholders without flagging ordinary domain terms', () => {
	const result = extractArticleNarration(page('<p>The orange line shows the result.</p><p>Link when it ships.</p><p>The dependency graph is intact. Engineering work includes diagrams.</p>'));
	assert.equal(result.review.length, 2);
	assert.equal(result.review[0].paragraph, 2);
	assert.match(result.text, /The orange line/);
});

test('flags unnumbered figure, diagram-box, table-column, and omitted-code references for narration review', () => {
	const references = [
		'The proposed harness, in one figure:',
		'Walking the boxes:',
		'Trace that write through the boxes above.',
		'The right-hand column is unbuilt.',
		'The commands below run the model shown in the figure.',
		'The panel below follows four moments.',
	];
	const result = extractArticleNarration(page(references.map(text => `<p>${text}</p>`).join('')));
	assert.deepEqual(result.review.map(item => item.text), references);
	for (const text of references) assert.ok(result.text.includes(text));
});

test('rejects missing, ambiguous, empty, non-English, or unknown article structure', () => {
	assert.throws(() => extractArticleNarration('<h1>No article</h1>'), /exactly one/);
	assert.throws(() => extractArticleNarration(page('<div class="post-content">Duplicate</div>')), /exactly one/);
	assert.throws(() => extractArticleNarration(page('<figure>A chart</figure>')), /no narrative/);
	assert.throws(() => extractArticleNarration(page('<p>Texto</p>').replace('lang="en"', 'lang="es"')), /Expected English/);
	assert.throws(() => extractArticleNarration(page('<details><summary>Interactive content</summary></details>')), /Unrecognised/);
});

test('counts exact Unicode characters including whitespace rather than bytes or UTF-16 units', () => {
	const result = countNarration('A 中文 😀\n');
	assert.equal(result.characters, 7);
	assert.equal(result.utf16CodeUnits, 8);
	assert.equal(result.utf8Bytes, 14);
	assert.equal(result.words, 3);
});

test('parses namespaced sitemap indexes and rejects non-sitemap documents', () => {
	assert.deepEqual(readSitemapLocations('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://example.com/sitemap.xml</loc></sitemap></sitemapindex>'), { kind: 'sitemapindex', urls: ['https://example.com/sitemap.xml'] });
	assert.throws(() => readSitemapLocations('<html><body>Unavailable</body></html>'), /Expected a sitemap/);
});

test('CLI saves exact counts, reruns unchanged, and protects review edits before writing new files', async (t) => {
	const directory = await mkdtemp(join(tmpdir(), 'article-narration-test-'));
	t.after(() => rm(directory, { recursive: true, force: true }));
	const source = join(directory, 'source');
	const output = join(directory, 'output');
	await mkdir(source);
	await writeFile(join(source, 'z-last.html'), page('<p>One paragraph.</p>'));
	const run = () => spawnSync(process.execPath, [
		fileURLToPath(new URL('../prepare-article-audio.mjs', import.meta.url)),
		'--source-dir', source, '--output-dir', output,
	], { encoding: 'utf8', timeout: 10_000 });
	const first = run();
	assert.equal(first.status, 0, first.stderr);
	const manifest = JSON.parse(await readFile(join(output, 'manifest.json'), 'utf8'));
	const saved = await readFile(join(output, 'en/z-last.txt'), 'utf8');
	assert.equal(manifest.totals.characters, countNarration(saved).characters);
	assert.equal(manifest.articles[0].sha256, countNarration(saved).sha256);
	assert.equal(run().status, 0);
	await writeFile(join(output, 'en/z-last.txt'), 'My reviewed wording.\n');
	await writeFile(join(source, 'a-first.html'), page('<p>New article.</p>'));
	const changed = run();
	assert.equal(changed.status, 1);
	assert.match(changed.stderr, /Refusing to replace different content/);
	assert.equal(await readFile(join(output, 'en/z-last.txt'), 'utf8'), 'My reviewed wording.\n');
	await assert.rejects(readFile(join(output, 'en/a-first.txt')), { code: 'ENOENT' });
});
