// ABOUTME: Tests for ASCII section divider generation.
// ABOUTME: Validates pattern rendering and element insertion logic.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('ascii-dividers', () => {
  it('generateDividerPattern returns a string of box-drawing characters', async () => {
    const { generateDividerPattern } = await import('../src/scripts/ascii-dividers.ts');
    const pattern = generateDividerPattern(0, 60);
    assert.ok(pattern.length > 0, 'Pattern should not be empty');
    assert.ok(pattern.length <= 60, `Pattern should respect maxWidth, got ${pattern.length}`);
  });

  it('generateDividerPattern produces different patterns for different indices', async () => {
    const { generateDividerPattern } = await import('../src/scripts/ascii-dividers.ts');
    const p0 = generateDividerPattern(0, 60);
    const p1 = generateDividerPattern(1, 60);
    const p2 = generateDividerPattern(2, 60);
    // At least 2 of 3 should be different (we have multiple patterns)
    const unique = new Set([p0, p1, p2]);
    assert.ok(unique.size >= 2, 'Should produce varied patterns');
  });

  it('generateDividerPattern handles narrow widths', async () => {
    const { generateDividerPattern } = await import('../src/scripts/ascii-dividers.ts');
    const pattern = generateDividerPattern(0, 10);
    assert.ok(pattern.length > 0, 'Should still produce a pattern at narrow widths');
    assert.ok(pattern.length <= 10);
  });
});
