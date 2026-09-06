// ABOUTME: Publishes full article content rendered through Astro and the MDX renderer.
// ABOUTME: Removes browser-only controls and preserves prose, evidence links and figure descriptions.
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import mdxRenderer from '@astrojs/mdx/server.js';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedBlogPosts } from '../utils/blog';
import { articleFeedHtml } from '../lib/article-html';

export async function GET(context) {
	const container = await AstroContainer.create();
	container.addServerRenderer({ name: 'astro:jsx', renderer: mdxRenderer });
	const posts = getPublishedBlogPosts(await getCollection('blog'));
	const items = [];
	for (const post of posts) {
		const { Content } = await render(post);
		const url = new URL(`/blog/${post.id}/`, context.site);
		const html = await container.renderToString(Content, { request: new Request(url) });
		items.push({ ...post.data, link: url.href, content: articleFeedHtml(html, url) });
	}
	return rss({ title: SITE_TITLE, description: SITE_DESCRIPTION, site: context.site, items });
}
