// ABOUTME: RSS feed endpoint that generates an XML feed from blog collection entries.
// ABOUTME: Uses @astrojs/rss with SITE_TITLE and SITE_DESCRIPTION from consts.

import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedBlogPosts } from '../utils/blog';

export async function GET(context) {
	const posts = getPublishedBlogPosts(await getCollection('blog'));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
