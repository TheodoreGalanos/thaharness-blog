// ABOUTME: Tests pure editorial layout helpers used by the article enhancement script.
// ABOUTME: Covers scroll-progress math and compact chapter-strip slot selection.

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	computeAnchorScrollTop,
	computeCssLengthPixels,
	computeScrollProgress,
	computeSlotWindow,
} from '../src/scripts/editorial.ts';

describe('editorial helpers', () => {
	it('computeScrollProgress clamps before and after the article', () => {
		assert.equal(computeScrollProgress(0, 100, 1000, 400), 0);
		assert.equal(computeScrollProgress(900, 100, 1000, 400), 1);
	});

	it('computeScrollProgress returns the in-article ratio', () => {
		assert.equal(computeScrollProgress(400, 100, 1000, 400), 0.5);
	});

	it('computeSlotWindow centers the active chapter away from edges', () => {
		assert.deepEqual(computeSlotWindow(3, 8), { left: 2, center: 3, right: 4 });
	});

	it('computeSlotWindow clamps at the first and last chapters', () => {
		assert.deepEqual(computeSlotWindow(0, 8), { left: 0, center: 1, right: 2 });
		assert.deepEqual(computeSlotWindow(7, 8), { left: 5, center: 6, right: 7 });
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
});
