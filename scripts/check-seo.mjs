// ABOUTME: Validates generated article metadata, sitemap pages, and retired tag routes.
// ABOUTME: Run with npm run check:seo to inspect a fresh Vercel production build.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import config from '../astro.config.mjs';
import { tagRedirects } from '../src/data/tag-redirects.mjs';

const site = new URL(config.site);
const output = new URL('../.vercel/output/', import.meta.url);
const content = new URL('../src/content/blog/', import.meta.url);
const articles = readdirSync(content)
	.filter(file => /\.mdx?$/.test(file))
	.map(file => ({ slug: file.replace(/\.mdx?$/, ''), ...matter(readFileSync(new URL(file, content), 'utf8')).data }));
const published = articles.filter(article => !article.draft);
const activeTags = new Set(published.flatMap(article => article.tags));
const sitemap = new JSDOM(readFileSync(new URL('static/sitemap-0.xml', output), 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('loc')].map(node => node.textContent);
const routes = JSON.parse(readFileSync(new URL('config.json', output), 'utf8')).routes;
const documents = new Map();

function pageFile(pathname) {
	return new URL(`static${pathname}index.html`, output);
}

function one(document, selector, label) {
	const nodes = document.querySelectorAll(selector);
	assert.equal(nodes.length, 1, `${label}: expected one ${selector}`);
	return nodes[0];
}

for (const article of articles) {
	assert.ok(article.tags.length <= 4, `${article.slug}: use at most four tags`);
	assert.equal(new Set(article.tags).size, article.tags.length, `${article.slug}: duplicate tags`);
	for (const tag of article.tags) {
		assert.match(tag, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${article.slug}: invalid tag`);
		assert.ok(!(tag in tagRedirects), `${article.slug}: ${tag} has been retired`);
	}
	if (article.draft) {
		assert.ok(!existsSync(pageFile(`/blog/${article.slug}/`)), `${article.slug}: draft was built`);
	}
}

assert.equal(new Set(urls).size, urls.length, 'Sitemap must not contain duplicate URLs');
for (const url of urls) {
	const { pathname, origin, search, hash } = new URL(url);
	assert.equal(origin, site.origin, `${url}: incorrect sitemap host`);
	assert.equal(search + hash, '', `${url}: sitemap URL contains a query or fragment`);
	assert.notEqual(pathname, '/search/', 'Search must not appear in the sitemap');
	const dom = new JSDOM(readFileSync(pageFile(pathname), 'utf8'));
	const document = dom.window.document;
	documents.set(pathname, document);
	assert.equal(one(document, 'link[rel="canonical"]', url).getAttribute('href'), url);
	assert.ok(one(document, 'title', url).textContent.trim(), `${url}: missing title`);
	assert.ok(one(document, 'meta[name="description"]', url).content.trim(), `${url}: missing description`);
	assert.ok(!document.querySelector('meta[name="robots"]')?.content.includes('noindex'), `${url}: noindex page in sitemap`);
	for (const property of ['og:url', 'twitter:url']) {
		assert.equal(one(document, `meta[property="${property}"]`, url).content, url);
	}
	JSON.parse(one(document, 'script[type="application/ld+json"]', url).textContent);
	for (const link of document.querySelectorAll('a[href^="/tags/"]')) {
		assert.ok(existsSync(pageFile(new URL(link.getAttribute('href'), site).pathname)), `${url}: broken tag link ${link.getAttribute('href')}`);
	}
}

const titles = new Set();
const descriptions = new Set();
for (const article of published) {
	const pathname = `/blog/${article.slug}/`;
	const document = documents.get(pathname);
	assert.ok(document, `${article.slug}: missing from sitemap`);
	assert.equal(one(document, 'h1', pathname).textContent, article.title);
	assert.equal(document.title, article.seoTitle ?? article.title);
	assert.equal(document.querySelector('meta[name="description"]').content, article.description);
	assert.ok(!titles.has(document.title), `${article.slug}: duplicate published title`);
	assert.ok(!descriptions.has(article.description), `${article.slug}: duplicate published description`);
	titles.add(document.title);
	descriptions.add(article.description);
	assert.deepEqual([...document.querySelectorAll('meta[property="article:tag"]')].map(node => node.content), article.tags);
	const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
	const posts = graph.filter(node => node['@type'] === 'BlogPosting');
	assert.equal(posts.length, 1, `${article.slug}: expected one BlogPosting`);
	const post = posts[0];
	assert.equal(post.headline, article.title);
	assert.equal(post.description, article.description);
	assert.equal(post.mainEntityOfPage, new URL(pathname, site).href);
	assert.equal(post.author.name, article.author);
	assert.equal(post.author.url, new URL('/about/', site).href);
	assert.equal(post.datePublished, new Date(article.pubDate).toISOString());
	assert.equal(post.dateModified, new Date(article.updatedDate ?? article.pubDate).toISOString());
	assert.equal(post.keywords, article.tags.join(', '));
	assert.ok(!post.image?.includes(new URL('/social-card.png', site).href), `${article.slug}: site logo is not an article image`);
	const image = new URL(one(document, 'meta[property="og:image"]', pathname).content);
	if (image.origin === site.origin) {
		assert.ok(existsSync(new URL(`static${image.pathname}`, output)), `${article.slug}: missing sharing image`);
	}
}

for (const tag of activeTags) {
	assert.ok(documents.has(`/tags/${tag}/`), `${tag}: active topic missing from sitemap`);
}
for (const [from, to] of Object.entries(tagRedirects)) {
	assert.ok(!activeTags.has(from), `${from}: active tag conflicts with redirect`);
	assert.ok(activeTags.has(to), `${from}: redirect destination has no published articles`);
	assert.ok(!documents.has(`/tags/${from}/`), `${from}: retired tag in sitemap`);
	for (const suffix of ['', '/']) {
		const route = routes.find(route => route.src && new RegExp(route.src).test(`/tags/${from}${suffix}`));
		assert.ok(route, `${from}: missing Vercel redirect`);
		assert.equal(route.status, 301, `${from}: redirect must be permanent`);
		assert.equal(route.headers?.Location, `/tags/${to}/`, `${from}: incorrect redirect destination`);
	}
}

console.log(`SEO checks passed: ${articles.length} article tag sets, ${published.length} published articles, ${urls.length} sitemap pages, ${activeTags.size} topics, ${Object.keys(tagRedirects).length} permanent redirects.`);
