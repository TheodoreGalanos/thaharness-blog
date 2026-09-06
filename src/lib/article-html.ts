// ABOUTME: Extracts reading metadata and safe feed content from rendered articles.
// ABOUTME: Keeps MDX imports and browser-only controls out of RSS while retaining prose and figure descriptions.
import { JSDOM } from 'jsdom';
import sanitizeHtml from 'sanitize-html';

export function articleWordCount(html: string): number {
	const doc = new JSDOM(html).window.document;
	doc
		.querySelectorAll('script, style, button, [aria-hidden="true"]')
		.forEach((node) => node.remove());
	// DOM textContent does not add the spaces a reader sees between block elements.
	doc
		.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, td, th, pre, figcaption, br')
		.forEach((node) => node.after(doc.createTextNode(' ')));
	return (doc.body.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
}

export function articleFeedHtml(html: string, url: URL): string {
	const doc = new JSDOM(html).window.document;
	doc
		.querySelectorAll('script, style, button, form, [aria-hidden="true"]')
		.forEach((node) => node.remove());
	for (const svg of doc.querySelectorAll('svg')) {
		const description = svg.getAttribute('aria-label') || svg.querySelector('title')?.textContent;
		const text = doc.createElement('p');
		text.textContent = description ?? '';
		svg.replaceWith(text);
	}
	for (const figure of doc.querySelectorAll('figure')) {
		const link = doc.createElement('a');
		link.href = url.href + (figure.id ? `#${figure.id}` : '');
		link.textContent = 'View this figure on The Harness';
		const paragraph = doc.createElement('p');
		paragraph.append(link);
		figure.append(paragraph);
	}
	for (const link of doc.querySelectorAll('a[href]'))
		link.setAttribute('href', new URL(link.getAttribute('href')!, url).href);
	for (const image of doc.querySelectorAll('img[src]'))
		image.setAttribute('src', new URL(image.getAttribute('src')!, url).href);
	return sanitizeHtml(doc.body.innerHTML, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([
			'img',
			'figure',
			'figcaption',
			'details',
			'summary',
		]),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			'*': ['id'],
			img: ['src', 'alt', 'width', 'height'],
		},
	});
}
