// ABOUTME: Protects the site-wide performance delivery contract.
// ABOUTME: Covers local fonts, route CSS, responsive media, deferred figures, and lazy browser work.

import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, it } from 'node:test';
import { JSDOM } from 'jsdom';
import { createChartHoverPanel } from '../src/scripts/chart-hover-panel.ts';

function source(path: string): string {
	return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const baseHead = source('../src/components/BaseHead.astro');
const globalStyles = source('../src/styles/global.css');
const editorialStyles = source('../src/styles/editorial.css');
const editorialLayout = source('../src/layouts/EditorialPost.astro');
const editorialScript = source('../src/scripts/editorial.ts');
const lightboxScript = source('../src/scripts/image-lightbox.ts');
const homePage = source('../src/pages/index.astro');
const subscribePage = source('../src/pages/subscribe.astro');

describe('performance delivery contract', () => {
	it('self-hosts the exact font faces without a Google Fonts dependency', () => {
		assert.doesNotMatch(baseHead, /fonts\.(?:googleapis|gstatic)\.com/);
		assert.match(baseHead, /jetbrains-mono-latin-variable\.woff2\?url/);
		assert.doesNotMatch(baseHead, /source-serif-4-latin-400\.woff2\?url/);
		assert.match(baseHead, /type="font\/woff2"/);
		assert.match(
			globalStyles,
			/@font-face[\s\S]*?font-family: "Fraunces";[\s\S]*?font-display: optional;[\s\S]*?fraunces-latin-500\.woff2/,
		);
		assert.match(globalStyles, /@font-face[\s\S]*?source-serif-4-latin-600\.woff2/);
		assert.match(globalStyles, /@font-face[\s\S]*?source-serif-4-latin-400-italic\.woff2/);
		assert.equal(
			(globalStyles.match(/font-display: optional;/g) ?? []).length,
			4,
			'display and body faces should never swap after first paint',
		);

		for (const filename of [
			'fraunces-latin-500.woff2',
			'jetbrains-mono-latin-variable.woff2',
			'source-serif-4-latin-400.woff2',
			'source-serif-4-latin-600.woff2',
			'source-serif-4-latin-400-italic.woff2',
		]) {
			const file = new URL(`../src/assets/fonts/${filename}`, import.meta.url);
			assert.equal(existsSync(file), true, `${filename} should exist`);
			assert.ok(statSync(file).size > 10_000, `${filename} should contain font data`);
		}
	});

	it('loads landing and editorial CSS only from the routes that need it', () => {
		assert.doesNotMatch(globalStyles, /@import "\.\/(?:landing|editorial|chart-hover-panel)\.css"/);
		assert.match(homePage, /import '\.\.\/styles\/landing\.css';/);
		assert.match(subscribePage, /import '\.\.\/styles\/landing\.css';/);
		assert.match(editorialLayout, /import '\.\.\/styles\/editorial\.css';/);
		assert.match(editorialLayout, /import '\.\.\/styles\/chart-hover-panel\.css';/);
	});

	it('keeps the remaining article screenshot on the responsive Figure path', () => {
		const articlePath = new URL(
			'../src/content/blog/the-harness-is-all-you-need.mdx',
			import.meta.url,
		);
		assert.equal(existsSync(articlePath), true);
		const article = readFileSync(articlePath, 'utf8');
		assert.match(article, /import Figure from '\.\.\/\.\.\/components\/Figure\.astro';/);
		assert.match(article, /<Figure\s+[\s\S]*?src=\{aecBenchTui\}/);
		assert.doesNotMatch(article, /!\[[^\]]*\]\([^)]*aec-bench-tui\.png\)/);
	});

	it('defers only below-the-fold figures and restores all content for print', () => {
		assert.match(
			editorialStyles,
			/@supports \(content-visibility: auto\)[\s\S]*?\.post-content > figure:nth-of-type\(n \+ 2\)[\s\S]*?content-visibility: auto;[\s\S]*?contain-intrinsic-size: auto 39rem;/,
		);
		assert.match(
			editorialStyles,
			/@media \(min-width: 769px\)[\s\S]*?\.post-content > figure:nth-of-type\(n \+ 2\)[\s\S]*?contain-intrinsic-size: auto 28\.5rem;/,
		);
		assert.match(
			editorialStyles,
			/@media print[\s\S]*?content-visibility: visible;[\s\S]*?contain-intrinsic-size: none;/,
		);
	});

	it('caches progress geometry outside the scroll animation frame', () => {
		assert.match(editorialScript, /function measureGeometry\(\)/);
		assert.match(editorialScript, /new ResizeObserver\(measureGeometry\)/);
		const updateBody = editorialScript.match(/function update\(\) \{([\s\S]*?)\n  \}/)?.[1] ?? '';
		assert.doesNotMatch(updateBody, /getBoundingClientRect/);
	});

	it('creates the lightbox lazily and delegates clicks through the prose root', () => {
		assert.doesNotMatch(lightboxScript, /querySelectorAll\(['"]img['"]\)/);
		assert.match(lightboxScript, /function ensureOverlay\(\)/);
		assert.match(lightboxScript, /prose\.addEventListener\(['"]click['"]/);
		assert.match(lightboxScript, /image\.currentSrc \|\| image\.src/);
	});
});

describe('delegated chart hover panel', () => {
	it('uses four root listeners regardless of the number of bound targets', () => {
		const dom = new JSDOM(`
			<div id="root">
				<div data-kicker></div><div data-body></div>
				<button id="first"><span id="child">first</span></button>
				<button id="second">second</button>
			</div>
		`);
		const root = dom.window.document.querySelector<HTMLElement>('#root')!;
		const first = dom.window.document.querySelector<HTMLElement>('#first')!;
		const second = dom.window.document.querySelector<HTMLElement>('#second')!;
		const child = dom.window.document.querySelector<HTMLElement>('#child')!;

		let rootListeners = 0;
		let targetListeners = 0;
		const rootAddEventListener = root.addEventListener.bind(root);
		root.addEventListener = ((...args: Parameters<typeof root.addEventListener>) => {
			rootListeners += 1;
			return rootAddEventListener(...args);
		}) as typeof root.addEventListener;
		for (const target of [first, second]) {
			const addEventListener = target.addEventListener.bind(target);
			target.addEventListener = ((...args: Parameters<typeof target.addEventListener>) => {
				targetListeners += 1;
				return addEventListener(...args);
			}) as typeof target.addEventListener;
		}

		const panel = createChartHoverPanel(root, '[data-kicker]', '[data-body]');
		assert.ok(panel);
		let firstShows = 0;
		let secondShows = 0;
		panel.bind(first, () => {
			firstShows += 1;
		});
		panel.bind(second, () => {
			secondShows += 1;
		});

		child.dispatchEvent(new dom.window.MouseEvent('mouseover', { bubbles: true }));
		second.dispatchEvent(new dom.window.FocusEvent('focusin', { bubbles: true }));

		assert.equal(firstShows, 1);
		assert.equal(secondShows, 1);
		assert.equal(rootListeners, 4);
		assert.equal(targetListeners, 0);
	});
});
