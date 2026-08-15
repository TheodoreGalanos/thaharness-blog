// ABOUTME: Tests pure editorial layout helpers used by the article enhancement script.
// ABOUTME: Covers scroll-progress math and anchored article navigation.

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	computeAnchorScrollTop,
	computeCssLengthPixels,
	computeScrollProgress,
	shouldShowChapterRail,
} from '../src/scripts/editorial.ts';

describe('editorial helpers', () => {
	it('computeScrollProgress clamps before and after the article', () => {
		assert.equal(computeScrollProgress(0, 100, 1000, 400), 0);
		assert.equal(computeScrollProgress(900, 100, 1000, 400), 1);
	});

	it('computeScrollProgress returns the in-article ratio', () => {
		assert.equal(computeScrollProgress(400, 100, 1000, 400), 0.5);
	});

	it('computeAnchorScrollTop clears sticky article chrome', () => {
		assert.equal(computeAnchorScrollTop(500, 1200, 132), 1568);
	});

	it('computeAnchorScrollTop clamps above the document start', () => {
		assert.equal(computeAnchorScrollTop(40, 20, 132), 0);
	});

	it('computeCssLengthPixels resolves article anchor offsets', () => {
		assert.equal(computeCssLengthPixels('8.25rem', 16, 18), 132);
		assert.equal(computeCssLengthPixels('7em', 16, 18), 126);
		assert.equal(computeCssLengthPixels('132px', 16, 18), 132);
		assert.equal(computeCssLengthPixels('not-a-length', 16, 18), null);
	});

	it('shows the chapter rail only after the overview clears the header', () => {
		assert.equal(shouldShowChapterRail(320, 64), false);
		assert.equal(shouldShowChapterRail(65, 64), false);
		assert.equal(shouldShowChapterRail(64, 64), true);
		assert.equal(shouldShowChapterRail(-20, 64), true);
	});
});
