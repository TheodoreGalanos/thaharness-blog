// ABOUTME: Tests pure editorial layout helpers used by the article enhancement script.
// ABOUTME: Covers scroll-progress math and compact chapter-strip slot selection.

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { computeScrollProgress, computeSlotWindow } from '../src/scripts/editorial.ts';

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
});
