// ABOUTME: @astrojs/vercel 8 emits exact slashless redirect patterns even when Astro accepts
// ABOUTME: both forms. Preserve the trailing-slash tag URLs already published in the sitemap.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { tagRedirects } from '../src/data/tag-redirects.mjs';

const file = new URL('../.vercel/output/config.json', import.meta.url);
const config = JSON.parse(readFileSync(file, 'utf8'));

for (const [from, to] of Object.entries(tagRedirects)) {
	const route = config.routes.find(route => route.src === `^/tags/${from}$`);
	assert.ok(route, `${from}: expected an Astro-generated redirect`);
	assert.equal(route.status, 301);
	assert.equal(route.headers?.Location, `/tags/${to}/`);
	route.src = `^/tags/${from}/?$`;
}

writeFileSync(file, JSON.stringify(config, null, 2));
