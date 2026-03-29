// ABOUTME: Tests for the balanced-headlines module.
// ABOUTME: Validates the width-search algorithm that finds the tightest balanced wrap.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('balanced-headlines', () => {
  it('findBalancedWidth returns maxWidth when text fits on one line', async () => {
    const { findBalancedWidth } = await import('../src/scripts/balanced-headlines.ts');
    const measureFn = (_width: number) => ({ lineCount: 1, height: 30 });
    const result = findBalancedWidth(measureFn, 400, 1);
    assert.equal(result, 400);
  });

  it('findBalancedWidth narrows a two-line headline to balance lines', async () => {
    const { findBalancedWidth } = await import('../src/scripts/balanced-headlines.ts');
    // Simulate: text wraps to 2 lines at 400px, but also wraps to 2 lines
    // at 300px (balanced). At 250px it wraps to 3 lines.
    const measureFn = (width: number) => {
      if (width >= 300) return { lineCount: 2, height: 60 };
      return { lineCount: 3, height: 90 };
    };
    const result = findBalancedWidth(measureFn, 400, 2);
    // Should find ~300 as the tightest width that keeps 2 lines
    assert.ok(result >= 295 && result <= 305, `Expected ~300, got ${result}`);
  });

  it('findBalancedWidth does not go below minimum width', async () => {
    const { findBalancedWidth } = await import('../src/scripts/balanced-headlines.ts');
    // Text always wraps to 2+ lines even at tiny widths
    const measureFn = (_width: number) => ({ lineCount: 2, height: 60 });
    const result = findBalancedWidth(measureFn, 400, 2);
    // Should clamp to some reasonable minimum, not collapse to 0
    assert.ok(result >= 200, `Expected >= 200, got ${result}`);
  });
});
