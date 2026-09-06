// ABOUTME: Keeps saved narrations attached to articles included in production builds.
// ABOUTME: Catches stale draft flags and missing article files before deployment.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import matter from 'gray-matter';

const manifest = JSON.parse(readFileSync(new URL('../audio/published.json', import.meta.url), 'utf8'));

for (const recording of manifest.articles) {
	test(`${recording.slug}: hosted narration belongs to a published article`, () => {
		const file = new URL(`../src/content/blog/${recording.slug}.mdx`, import.meta.url);
		const { data } = matter(readFileSync(file, 'utf8'));
		assert.notEqual(data.draft, true, 'An article with published audio must be included in production');
		assert.equal(data.title, recording.title);
	});
}
