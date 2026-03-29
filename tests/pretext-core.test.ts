// ABOUTME: Tests for pretext shared core module.
// ABOUTME: Validates font config, prepare wrapper, and height measurement helper.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Since pretext needs a browser canvas, we test the pure logic parts:
// font string construction and configuration export.

describe('pretext-core', () => {
  it('buildFontString returns a valid CSS font string', async () => {
    const { buildFontString } = await import('../src/scripts/pretext-core.ts');
    const result = buildFontString(16, 'Source Serif 4');
    assert.equal(result, '16px "Source Serif 4"');
  });

  it('buildFontString handles weight parameter', async () => {
    const { buildFontString } = await import('../src/scripts/pretext-core.ts');
    const result = buildFontString(24, 'JetBrains Mono', 500);
    assert.equal(result, '500 24px "JetBrains Mono"');
  });

  it('THEME_FONTS exports heading and body font names', async () => {
    const { THEME_FONTS } = await import('../src/scripts/pretext-core.ts');
    assert.equal(THEME_FONTS.heading, 'JetBrains Mono');
    assert.equal(THEME_FONTS.body, 'Source Serif 4');
  });
});
