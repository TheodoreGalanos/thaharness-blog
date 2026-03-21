// ABOUTME: Astro configuration for the blog site.
// ABOUTME: Configures MDX, sitemap, and Tailwind CSS v4 via Vite plugin.

// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import rehypeFigure from 'rehype-figure';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://theharness.blog',
	adapter: vercel(),
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => !page.includes('/search/'),
		}),
	],
	markdown: {
		rehypePlugins: [rehypeFigure],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
