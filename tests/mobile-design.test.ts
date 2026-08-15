// ABOUTME: Protects the responsive editorial navigation and mobile interaction contract.
// ABOUTME: Covers stable chapter chrome, touch targets, chart containment, and reduced motion.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string): string {
	return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const editorialLayout = source('../src/layouts/EditorialPost.astro');
const editorialStyles = source('../src/styles/editorial.css');
const editorialScript = source('../src/scripts/editorial.ts');
const chapterStrip = source('../src/components/ChapterStrip.astro');
const header = source('../src/components/Header.astro');
const figure = source('../src/components/Figure.astro');
const footer = source('../src/components/Footer.astro');
const tagPill = source('../src/components/TagPill.astro');
const statusBar = source('../src/components/landing/StatusBar.astro');
const landingStyles = source('../src/styles/landing.css');
const globalStyles = source('../src/styles/global.css');
const barsWithBaseline = source(
	'../src/components/charts/BarsWithBaseline.astro',
);
const mobilePlotComponents = [
	'LineTrajectory.astro',
	'QualityVsCost.astro',
	'OutcomeDistribution.astro',
].map((name) => source(`../src/components/charts/${name}`));
const interactiveChartComponents = [
	'LineTrajectory.astro',
	'GroupedBars.astro',
	'StackedBars.astro',
	'HorizontalStackedBars.astro',
].map((name) => source(`../src/components/charts/${name}`));

describe('mobile design contract', () => {
	it('keeps the full chapter overview stable and reserves the sticky rail', () => {
		assert.match(
			editorialStyles,
			/@media \(max-width: 768px\) \{[\s\S]*?\.chapter-strip-list a \{[\s\S]*?min-height: 2\.75rem;/,
		);
		assert.match(
			chapterStrip,
			/class="chapter-rail"[\s\S]*?aria-hidden="true"[\s\S]*?inert/,
		);
		assert.match(
			editorialStyles,
			/\.chapter-rail \{[\s\S]*?position: sticky;[\s\S]*?height: var\(--chapter-rail-height\);[\s\S]*?visibility: hidden;/,
		);
		assert.match(
			editorialStyles,
			/\.chapter-rail\.is-visible \{\s*visibility: visible;\s*pointer-events: auto;/,
		);
		assert.doesNotMatch(
			editorialStyles,
			/\.chapter-strip\.is-compact|view-transition-name/,
		);
		assert.doesNotMatch(
			editorialScript,
			/setupChapterMorph|startViewTransition|computeSlotWindow/,
		);
		assert.doesNotMatch(editorialLayout, /chapter-strip-sentinel/);
	});

	it('keeps mobile navigation and compact controls tappable', () => {
		assert.match(header, /aria-label="The Harness home"/);
		assert.match(
			header,
			/class="[^\"]*hidden sm:inline[^\"]*"[^>]*>The Harness<\/span>/,
		);
		assert.match(tagPill, /min-h-11/);
		assert.match(footer, /flex flex-wrap/);
		assert.match(footer, /min-h-11 min-w-11/);
		for (const component of interactiveChartComponents) {
			assert.match(component, /min-height: 2\.75rem;/);
		}
	});

	it('keeps the landing status bar on one row on narrow phones', () => {
		assert.match(statusBar, /class="status-bar-build"/);
		assert.match(
			landingStyles,
			/@media \(max-width: 639px\) \{[\s\S]*?flex-wrap: nowrap;[\s\S]*?\.status-bar-build \{\s*display: none;/,
		);
	});

	it('contains fixed-canvas charts without shrinking their labels', () => {
		for (const component of mobilePlotComponents) {
			assert.match(component, /Swipe for full chart/);
			assert.match(
				component,
				/@media \(max-width: 600px\) \{[\s\S]*?overflow-x: auto;[\s\S]*?max-width: none;/,
			);
		}
	});

	it('keeps edge-aligned chart labels inside their chart', () => {
		assert.match(barsWithBaseline, /baselinePct >= 75 && 'is-near-end'/);
		assert.match(
			barsWithBaseline,
			/\.bwb-baseline-label\.is-near-end \{\s*transform: translateX\(-100%\);\s*flex-direction: row-reverse;/,
		);
	});

	it('coalesces progress updates and respects reduced motion', () => {
		assert.match(editorialScript, /requestAnimationFrame\(update\)/);
		assert.match(
			editorialScript,
			/addEventListener\("scroll", scheduleUpdate/,
		);
		assert.doesNotMatch(
			editorialLayout,
			/transition: transform 0\.1s linear/,
		);
		assert.match(
			globalStyles,
			/@media \(prefers-reduced-motion: reduce\) \{\s*html \{\s*scroll-behavior: auto;/,
		);
		assert.match(editorialScript, /prefers-reduced-motion: reduce/);
	});

	it('uses responsive candidates for imported editorial images', () => {
		assert.match(figure, /layout="constrained"/);
		assert.match(
			figure,
			/sizes="\(min-width: 1000px\) 960px, calc\(100vw - 2\.5rem\)"/,
		);
	});
});
