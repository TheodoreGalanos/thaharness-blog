// ABOUTME: Tests reading metadata and full-content RSS sanitisation.
// ABOUTME: Covers controls, diagram descriptions, fragment links and image URLs.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { articleFeedHtml, articleWordCount } from '../src/lib/article-html.ts';

test('counts rendered prose while excluding hidden controls and scripts', () => {
  assert.equal(articleWordCount('<p>Three useful words</p><button>Zoom</button><script>bad()</script><span aria-hidden="true">hidden</span>'), 3);
});
test('keeps adjacent blocks and line breaks as separate words', () => {
  assert.equal(articleWordCount('<h2>One</h2><p>Two<br>three</p><ul><li>Four</li><li>five</li></ul>'), 5);
});
test('retains feed prose, evidence links and accessible figure descriptions', () => {
  const result = articleFeedHtml('<p>Read <a href="#finding">the finding</a>.</p><figure id="chart"><svg aria-label="Scores across models"></svg><figcaption>Measured results.</figcaption></figure><img src="/image.webp" alt="Evidence"><script>bad()</script><button>Zoom</button>', new URL('https://theharness.blog/blog/example/'));
  assert.match(result, /Scores across models/);
  assert.match(result, /Measured results/);
  assert.match(result, /https:\/\/theharness.blog\/blog\/example\/#finding/);
  assert.match(result, /https:\/\/theharness.blog\/image.webp/);
  assert.doesNotMatch(result, /<script|<button|<svg/);
});
