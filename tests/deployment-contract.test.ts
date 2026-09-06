// ABOUTME: Tests that generated search assets land inside the Vercel deployment artifact.
// ABOUTME: Keeps the Pagefind build target aligned with the public paths used by the search page.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(
	readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as {
	scripts: Record<string, string>;
};
const searchPage = readFileSync(
	new URL('../src/pages/search.astro', import.meta.url),
	'utf8',
);

describe('deployment contract', () => {
	it('writes Pagefind into the Vercel static output', () => {
		assert.equal(
			packageJson.scripts.build,
			'astro build && node ./scripts/finalize-tag-redirects.mjs && pagefind --site .vercel/output/static',
		);
		assert.match(searchPage, /src="\/pagefind\/pagefind-ui\.js"/);
		assert.match(searchPage, /href="\/pagefind\/pagefind-ui\.css"/);
	});
});
