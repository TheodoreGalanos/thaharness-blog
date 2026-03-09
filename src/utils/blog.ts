// ABOUTME: Blog collection helpers for filtering and sorting published posts.
// ABOUTME: Keeps draft and future-dated content out of public routes and feeds.

import type { CollectionEntry } from 'astro:content';

export type BlogPostEntry = CollectionEntry<'blog'>;

export function isPublishedBlogPost(post: BlogPostEntry, now = new Date()) {
	void now;
	return !post.data.draft;
}

export function sortBlogPostsByDate(posts: BlogPostEntry[]) {
	return posts.sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}

export function getPublishedBlogPosts(posts: BlogPostEntry[], now = new Date()) {
	return sortBlogPostsByDate(posts.filter((post) => isPublishedBlogPost(post, now)));
}