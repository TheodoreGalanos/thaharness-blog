// ABOUTME: Builds a distinct PNG sharing card for each published article.
// ABOUTME: Uses the article title and category without adding client-side image work.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { getPublishedBlogPosts } from '../../utils/blog';

export async function getStaticPaths() {
	return getPublishedBlogPosts(await getCollection('blog')).map((post) => ({
		params: { slug: post.id },
		props: { title: post.data.title, category: post.data.category },
	}));
}

const escapeXml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		(character) =>
			({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!,
	);

export const GET: APIRoute = async ({ props }) => {
	const lines: string[] = [];
	for (const word of props.title.split(/\s+/)) {
		const last = lines.length - 1;
		if (last < 0 || `${lines[last]} ${word}`.length > 32) lines.push(word);
		else lines[last] += ` ${word}`;
	}
	const fontSize = Math.min(68, 280 / lines.length);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#18130e"/>
    <path d="M64 134H1136M64 530H1136" stroke="#7ab5af" stroke-width="2"/>
    <text x="64" y="88" fill="#e8a84c" font-family="serif" font-size="38">The Harness</text>
    <text x="1136" y="88" text-anchor="end" fill="#b8aea4" font-family="monospace" font-size="22">${escapeXml(props.category)}</text>
    <text fill="#faf9f6" font-family="serif" font-size="${fontSize}" font-weight="500">${lines.map((line, index) => `<tspan x="64" y="${220 + index * (fontSize + 15)}">${escapeXml(line)}</tspan>`).join('')}</text>
    <text x="64" y="582" fill="#b8aea4" font-family="monospace" font-size="22">Theodoros Galanos</text>
    <text x="1136" y="582" text-anchor="end" fill="#7ab5af" font-family="monospace" font-size="22">theharness.blog</text>
  </svg>`;
	const png = await sharp(Buffer.from(svg)).png({ palette: true }).toBuffer();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
