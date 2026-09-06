// ABOUTME: Extracts narrative text from rendered articles while omitting figures and tables.
// ABOUTME: Preserves prose notes and footnotes and flags passages needing listening review.
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';

const OMIT = [
	'figure', 'figcaption', 'table', 'img', 'picture', 'svg', 'canvas',
	'pre', 'script', 'style', 'button', 'input', 'select', 'textarea', 'nav',
	'[hidden]', '[aria-hidden="true"]', '[role="img"]',
	'[data-footnote-ref]', '[data-footnote-backref]', '.katex-display',
	'math[display="block"]',
].join(',');
const CONTAINERS = new Set(['DIV', 'SECTION', 'ASIDE', 'BLOCKQUOTE', 'UL', 'OL', 'LI']);
const INLINE = new Set(['A', 'EM', 'STRONG', 'B', 'I', 'SPAN', 'CODE', 'SUP', 'SUB', 'S', 'DEL', 'ABBR', 'CITE', 'MARK', 'SMALL', 'BR']);
const VISUAL_REFERENCE = /\b(?:figures?\s+\d+|tables?\s+\d+|(?:this|that|the|following|one)\s+(?:figure|table|chart|diagram|graph|panel)|(?:orange|blue|green|red|dashed|solid)\s+(?:line|curve)|(?:shown|see|commands?|code|boxes|panels?)\s+(?:above|below)|(?:right|left)[ -]hand\s+column|walking\s+the\s+boxes)\b/i;

function plainText(node) {
	if (node.nodeType === 3) return node.textContent;
	if (node.nodeType !== 1) return '';
	if (node.tagName === 'BR') return ' ';
	return [...node.childNodes].map(plainText).join('');
}

function normalize(text) {
	return text.replace(/\s+/gu, ' ').trim();
}

function moveSidenotes(body, document) {
	const groups = new Map();
	for (const note of body.querySelectorAll('.sidenote')) {
		const paragraph = note.closest('p');
		if (!paragraph) throw new Error('Margin note has no paragraph; review its placement.');
		const text = normalize(plainText(note));
		if (!groups.has(paragraph)) groups.set(paragraph, []);
		if (text) groups.get(paragraph).push(text);
		const before = note.previousSibling;
		const after = note.nextSibling;
		if (before?.nodeType === 3 && after?.nodeType === 3 && /^\s*[.,;:!?]/u.test(after.textContent)) {
			before.textContent = before.textContent.trimEnd();
			after.textContent = after.textContent.trimStart();
		}
		note.remove();
	}
	let count = 0;
	for (const [paragraph, notes] of groups) {
		let previous = paragraph;
		for (const text of notes) {
			const explanation = document.createElement('p');
			explanation.textContent = `Note: ${text}`;
			previous.after(explanation);
			previous = explanation;
			count += 1;
		}
	}
	return count;
}

function paragraphs(element) {
	const result = [];
	let inline = '';
	const flush = () => {
		const text = normalize(inline);
		if (text) result.push(text);
		inline = '';
	};

	for (const node of element.childNodes) {
		if (node.nodeType === 3 || (node.nodeType === 1 && INLINE.has(node.tagName))) {
			inline += plainText(node);
			continue;
		}
		if (node.nodeType !== 1) continue;
		flush();
		if (node.tagName === 'HR') continue;
		if (/^(P|H[1-6])$/.test(node.tagName)) {
			let text = normalize(plainText(node));
			if (/^Estimated reading time:\s*\d+\s+minutes?$/i.test(text)) continue;
			if (/^H[1-6]$/.test(node.tagName)) {
				text = text.replace(/^TL;DR\b/i, 'Summary');
			}
			if (text) result.push(text);
			continue;
		}
		if (!CONTAINERS.has(node.tagName)) {
			throw new Error(`Unrecognised article element <${node.tagName.toLowerCase()}>; review its narration treatment.`);
		}
		const nested = paragraphs(node);
		if (node.tagName === 'LI' && element.tagName === 'OL' && nested.length) {
			const items = [...element.children].filter((child) => child.tagName === 'LI');
			const start = Number(element.getAttribute('start') ?? 1);
			nested[0] = `${start + items.indexOf(node)}. ${nested[0]}`;
		}
		result.push(...nested);
	}
	flush();
	return result;
}

export function countNarration(text) {
	return {
		characters: [...text].length,
		utf16CodeUnits: text.length,
		utf8Bytes: Buffer.byteLength(text),
		words: text.trim().split(/\s+/u).filter(Boolean).length,
		sha256: createHash('sha256').update(text).digest('hex'),
	};
}

export function extractArticleNarration(html) {
	const dom = new JSDOM(html);
	try {
		const { document } = dom.window;
		const bodies = document.querySelectorAll('.post-content');
		const titles = document.querySelectorAll('article h1');
		if (bodies.length !== 1 || titles.length !== 1) {
			throw new Error('Expected exactly one article title and one .post-content body.');
		}
		const language = document.documentElement.lang;
		if (language && !/^en(?:-|$)/i.test(language)) {
			throw new Error(`Expected English source HTML, received lang="${language}".`);
		}
		const title = normalize(plainText(titles[0]));
		if (!title) throw new Error('Article title is empty.');
		const body = bodies[0];
		const excluded = {
			figures: body.querySelectorAll('figure').length,
			tables: body.querySelectorAll('table').length,
			codeBlocks: body.querySelectorAll('pre').length,
			repeatedPullquotes: 0,
		};
		body.querySelectorAll(OMIT).forEach((node) => node.remove());
		const sidenotes = moveSidenotes(body, document);
		for (const quote of body.querySelectorAll('.pullquote')) {
			// An attribution may carry information absent from the repeated prose.
			if (quote.querySelector('.pullquote-attribution')) continue;
			const text = normalize(plainText(quote));
			if (text && [...body.querySelectorAll('p')].some((paragraph) =>
				!paragraph.closest('.pullquote') && normalize(plainText(paragraph)).includes(text))) {
				quote.remove();
				excluded.repeatedPullquotes += 1;
			}
		}
		const notes = [];
		for (const section of body.querySelectorAll('[data-footnotes]')) {
			for (const note of section.querySelectorAll(':scope > ol > li')) {
				const text = paragraphs(note).join(' ');
				if (text) notes.push(text);
			}
			section.remove();
		}
		const narrative = paragraphs(body);
		if (!narrative.length) throw new Error('Article has no narrative after exclusions.');
		const blocks = [title, ...narrative];
		if (notes.length) blocks.push('Notes', ...notes.map((note, index) => `Note ${index + 1}. ${note}`));
		const text = `${blocks.join('\n\n')}\n`;
		const review = blocks.flatMap((paragraph, index) => {
			const reasons = [];
			if (VISUAL_REFERENCE.test(paragraph)) reasons.push('Reference to visual material');
			if (/\blink when it ships\b/i.test(paragraph)) reasons.push('Editorial placeholder in published text');
			return reasons.length ? [{ paragraph: index + 1, reasons, text: paragraph }] : [];
		});
		return { title, text, ...countNarration(text), excluded, footnotes: notes.length, sidenotes, review };
	} finally {
		dom.window.close();
	}
}

export function readSitemapLocations(xml) {
	const dom = new JSDOM(xml, { contentType: 'text/xml' });
	try {
		const { document } = dom.window;
		const kind = document.documentElement.localName;
		if (!['sitemapindex', 'urlset'].includes(kind)) throw new Error('Expected a sitemap index or URL set.');
		return { kind, urls: [...document.querySelectorAll('loc')].map((node) => node.textContent.trim()) };
	} finally {
		dom.window.close();
	}
}
