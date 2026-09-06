// ABOUTME: Astro configuration for the blog site.
// ABOUTME: Configures MDX, sitemap, and Tailwind CSS v4 via Vite plugin.

// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import rehypeFigure from 'rehype-figure';
import { defineConfig } from 'astro/config';
import { tagRedirects } from './src/data/tag-redirects.mjs';

const redirects = Object.fromEntries(
	Object.entries(tagRedirects).map(([from, to]) => [`/tags/${from}/`, `/tags/${to}/`]),
);

// https://astro.build/config
export default defineConfig({
	site: 'https://theharness.blog',
	adapter: vercel(),
	redirects,
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const pathname = new URL(page).pathname;
				return pathname !== '/search/' && !(pathname in redirects);
			},
		}),
	],
	markdown: {
		rehypePlugins: [rehypeFigure],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
