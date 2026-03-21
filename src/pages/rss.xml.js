// ABOUTME: RSS feed endpoint that generates an XML feed from blog collection entries.
// ABOUTME: Renders full Markdown content in feed items for better syndication and discovery.

import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedBlogPosts } from '../utils/blog';

const parser = new MarkdownIt();

export async function GET(context) {
	const posts = getPublishedBlogPosts(await getCollection('blog'));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
			content: post.body
				? sanitizeHtml(parser.render(post.body), {
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
					})
				: undefined,
		})),
	});
}
