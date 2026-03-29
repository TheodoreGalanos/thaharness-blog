// ABOUTME: Tests for masonry layout positioning calculations.
// ABOUTME: Validates column assignment and card positioning from predicted heights.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('masonry-index', () => {
  it('assignColumns places cards in shortest column first', async () => {
    const { assignColumns } = await import('../src/scripts/masonry-index.ts');
    const heights = [100, 150, 80, 120];
    const result = assignColumns(heights, 2, 24);
    // Card 0 -> col 0 (both empty, pick first). col0 = 100
    // Card 1 -> col 1 (0 < 100).              col1 = 150
    // Card 2 -> col 0 (100 < 150).             col0 = 100 + 24 + 80 = 204
    // Card 3 -> col 1 (150 < 204).             col1 = 150 + 24 + 120 = 294
    assert.equal(result.length, 4);
    assert.equal(result[0].column, 0);
    assert.equal(result[1].column, 1);
    assert.equal(result[2].column, 0); // col 0 shorter after card 0
    assert.equal(result[3].column, 1); // col 1 shorter (150 vs 204)
  });

  it('assignColumns handles single column', async () => {
    const { assignColumns } = await import('../src/scripts/masonry-index.ts');
    const heights = [100, 200];
    const result = assignColumns(heights, 1, 24);
    assert.equal(result[0].column, 0);
    assert.equal(result[1].column, 0);
    assert.equal(result[0].y, 0);
    assert.equal(result[1].y, 124); // 100 + 24 gap
  });

  it('assignColumns returns correct y positions', async () => {
    const { assignColumns } = await import('../src/scripts/masonry-index.ts');
    const heights = [100, 150, 80];
    const result = assignColumns(heights, 2, 20);
    assert.equal(result[0].y, 0); // first card, col 0
    assert.equal(result[1].y, 0); // first card, col 1
    assert.equal(result[2].y, 120); // col 0: 100 + 20 gap
  });
});
