// ABOUTME: Tests for pull quote reflow scroll interaction.
// ABOUTME: Validates scale interpolation and height prediction for smooth transitions.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('pull-quote-reflow', () => {
  it('interpolateScale returns base at ratio 0', async () => {
    const { interpolateScale } = await import('../src/scripts/pull-quote-reflow.ts');
    const result = interpolateScale(0, 1.0, 1.08);
    assert.equal(result, 1.0);
  });

  it('interpolateScale returns target at ratio 1', async () => {
    const { interpolateScale } = await import('../src/scripts/pull-quote-reflow.ts');
    const result = interpolateScale(1, 1.0, 1.08);
    assert.ok(Math.abs(result - 1.08) < 0.001);
  });

  it('interpolateScale clamps between 0 and 1', async () => {
    const { interpolateScale } = await import('../src/scripts/pull-quote-reflow.ts');
    assert.equal(interpolateScale(-0.5, 1.0, 1.08), 1.0);
    assert.ok(Math.abs(interpolateScale(1.5, 1.0, 1.08) - 1.08) < 0.001);
  });

  it('interpolateScale returns midpoint at ratio 0.5', async () => {
    const { interpolateScale } = await import('../src/scripts/pull-quote-reflow.ts');
    const result = interpolateScale(0.5, 1.0, 1.1);
    assert.ok(Math.abs(result - 1.05) < 0.001);
  });
});
