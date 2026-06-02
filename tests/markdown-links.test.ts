// ABOUTME: Tests Markdown and MDX links in blog content for malformed destinations.
// ABOUTME: Catches syntax slips that Astro can render without failing the production build.

import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const contentDir = new URL('../src/content/blog/', import.meta.url);
const inlineLinkPattern = /(?<!!)\[[^\]\n]+\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;

async function readContentFiles(dir: URL): Promise<Array<{ path: string; source: string }>> {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryUrl = new URL(entry.name, `${dir.href}/`);
			if (entry.isDirectory()) {
				return readContentFiles(entryUrl);
			}
			if (!entry.name.endsWith('.md') && !entry.name.endsWith('.mdx')) {
				return [];
			}
			return [
				{
					path: join('src/content/blog', entry.name),
					source: await readFile(entryUrl, 'utf8'),
				},
			];
		}),
	);
	return files.flat();
}

describe('blog markdown links', () => {
	it('uses valid inline Markdown link destinations', async () => {
		const files = await readContentFiles(contentDir);
		const malformed: string[] = [];

		for (const file of files) {
			for (const match of file.source.matchAll(inlineLinkPattern)) {
				const href = match[1];
				if (href.startsWith('(') || href.endsWith(')')) {
					malformed.push(`${file.path}: malformed destination "${href}"`);
					continue;
				}
				if (href.startsWith('http://') || href.startsWith('https://')) {
					assert.doesNotThrow(
						() => new URL(href),
						`${file.path}: invalid absolute URL "${href}"`,
					);
				}
			}
		}

		assert.deepEqual(malformed, []);
	});
});
