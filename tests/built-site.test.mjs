// ABOUTME: Checks the deployable HTML, search assets, and full-content RSS feed.
// ABOUTME: Runs after the production build to catch failures invisible to source tests.
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const root = resolve(process.env.SITE_OUTPUT ?? '.vercel/output/static');
const read = (path) => readFile(resolve(root, path), 'utf8');
const documentAt = async (path) => new JSDOM(await read(path)).window.document;

test('search scripts are shipped with the deployment', async () => {
  for (const file of ['pagefind/pagefind-ui.js', 'pagefind/pagefind-ui.css', 'pagefind/pagefind.js']) {
    await access(resolve(root, file));
  }
});

test('CSS contains no invalid custom-property shorthand', async () => {
  for (const name of await readdir(resolve(root, '_astro'))) {
    if (name.endsWith('.css')) assert.doesNotMatch(await read(`_astro/${name}`), /(?:color|width):--[\w-]+/);
  }
});

test('RSS contains article prose without executable MDX source', async () => {
  const feed = new JSDOM(await read('rss.xml'), { contentType: 'text/xml' }).window.document;
  const items = [...feed.querySelectorAll('item')];
  assert.ok(items.length > 0);
  for (const item of items) {
    const html = item.getElementsByTagName('content:encoded')[0]?.textContent;
    assert.ok(html && html.length > 500, item.querySelector('title')?.textContent);
    const body = new JSDOM(html).window.document;
    assert.doesNotMatch(body.body.textContent, /import\s+[\w{*].*\sfrom\s['"]|<[A-Z][A-Za-z]+[\s/>]/);
    assert.equal(body.querySelector('script,style,button,form'), null);
    for (const image of body.querySelectorAll('img')) assert.match(image.src, /^https:\/\//);
  }
});

test('article metadata has a real word count and its own sharing image', async () => {
  const images = new Set();
  for (const slug of await readdir(resolve(root, 'blog'))) {
    if (slug === 'index.html') continue;
    const doc = await documentAt(`blog/${slug}/index.html`);
    const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)
      .find((entry) => entry['@type'] === 'BlogPosting');
    assert.ok(schema.wordCount > 0);
    assert.doesNotMatch(doc.querySelector('.post-content').textContent, /Estimated reading time:/);
    assert.ok(doc.querySelector('.related-posts a'));
    const image = new URL(schema.image[0]);
    assert.ok(!images.has(image.pathname), `Shared article image: ${slug}`);
    images.add(image.pathname);
    await access(resolve(root, image.pathname.slice(1)));
  }
});

test('reader pages have one main heading and valid internal links', async () => {
  const pages = new Map();
  async function collect(directory = '') {
    for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
      if (entry.name.startsWith('_') || entry.name === 'pagefind') continue;
      const path = `${directory}${entry.name}`;
      if (entry.isDirectory()) await collect(`${path}/`);
      else if (entry.name.endsWith('.html')) pages.set(path, await documentAt(path));
    }
  }
  await collect();
  for (const [path, doc] of pages) {
    assert.equal(doc.querySelectorAll('h1').length, 1, path);
    assert.ok(doc.querySelector('main#main-content'), path);
    for (const link of doc.querySelectorAll('a[href]')) {
      const url = new URL(link.getAttribute('href'), `https://theharness.blog/${path}`);
      if (url.origin !== 'https://theharness.blog') continue;
      let destination = decodeURIComponent(url.pathname.slice(1));
      if (!destination || destination.endsWith('/')) destination += 'index.html';
      else if (!destination.split('/').at(-1).includes('.')) destination += '/index.html';
      await access(resolve(root, destination));
      if (url.hash && pages.has(destination)) {
        assert.ok(pages.get(destination).getElementById(decodeURIComponent(url.hash.slice(1))), `${path}: ${url.href}`);
      }
    }
  }
});
