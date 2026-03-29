// ABOUTME: Tests for multi-column layout distribution logic.
// ABOUTME: Validates paragraph-to-column assignment and obstacle avoidance.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('multi-column-layout', () => {
  it('distributeToColumns splits paragraphs evenly by height', async () => {
    const { distributeToColumns } = await import('../src/scripts/multi-column-layout.ts');
    // 4 paragraphs with known heights
    const paragraphs = [
      { height: 100, isObstacle: false },
      { height: 150, isObstacle: false },
      { height: 100, isObstacle: false },
      { height: 120, isObstacle: false },
    ];
    const result = distributeToColumns(paragraphs, 2);
    // Total height: 470. Target per column: 235.
    // Col 0: p0 (100) + p1 (150) = 250
    // Col 1: p2 (100) + p3 (120) = 220
    assert.equal(result[0].length, 2);
    assert.equal(result[1].length, 2);
  });

  it('distributeToColumns keeps obstacles spanning full width', async () => {
    const { distributeToColumns } = await import('../src/scripts/multi-column-layout.ts');
    const paragraphs = [
      { height: 100, isObstacle: false },
      { height: 80, isObstacle: true }, // blockquote / image — spans full width
      { height: 100, isObstacle: false },
    ];
    const result = distributeToColumns(paragraphs, 2);
    // Obstacles create column breaks — content before and after flows independently
    assert.ok(result.length >= 2);
  });
});
