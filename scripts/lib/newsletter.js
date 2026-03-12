// ABOUTME: Newsletter helpers for turning blog posts into Resend broadcast payloads.
// ABOUTME: Reads content files, selects target posts, and renders email-safe HTML/text.

import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';

const DEFAULT_SITE_URL = 'https://theharness.blog';
const DEFAULT_UNSUBSCRIBE_URL = '{{{RESEND_UNSUBSCRIBE_URL}}}';
const CONTENT_DIRECTORY = new URL('../../src/content/blog/', import.meta.url);
const ENV_FILE_NAMES = ['.env', '.env.local'];
const VALUE_ARGUMENTS = new Set(['--slug', '--scheduled-at', '--email']);
const STRIP_MARKDOWN_PATTERNS = [
	[/^>\s?/gm, ''],
	[/```[\s\S]*?```/g, ''],
	[/`([^`]+)`/g, '$1'],
	[/!?\[([^\]]*)\]\([^)]*\)/g, '$1'],
	[/\*\*([^*]+)\*\*/g, '$1'],
	[/__([^_]+)__/g, '$1'],
	[/\*([^*]+)\*/g, '$1'],
	[/_([^_]+)_/g, '$1'],
	[/^#{1,6}\s+/gm, ''],
	[/^-\s+/gm, ''],
	[/^\d+\.\s+/gm, ''],
	[/<[^>]+>/g, ''],
	[/\{[^}]+\}/g, ''],
];

export async function loadLocalEnv() {
	for (const fileName of ENV_FILE_NAMES) {
		const fileUrl = new URL(`../../${fileName}`, import.meta.url);
		const fileContents = await readOptionalFile(fileUrl);

		if (!fileContents) {
			continue;
		}

		for (const entry of parseEnvEntries(fileContents)) {
			if (!process.env[entry.key]) {
				process.env[entry.key] = entry.value;
			}
		}
	}
}

export function requireEnv(name) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export function parseCliArgs(argv) {
	const args = {
		send: false,
		dryRun: false,
		scheduledAt: undefined,
		slug: undefined,
		email: undefined,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];

		if (argument === '--send') {
			args.send = true;
			continue;
		}

		if (argument === '--dry-run') {
			args.dryRun = true;
			continue;
		}

		if (!VALUE_ARGUMENTS.has(argument)) {
			throw new Error(`Unknown argument: ${argument}`);
		}

		const value = argv[index + 1];

		if (!value) {
			throw new Error(`Missing value for ${argument}`);
		}

		if (argument === '--slug') {
			args.slug = value;
		}

		if (argument === '--scheduled-at') {
			args.scheduledAt = value;
		}

		if (argument === '--email') {
			args.email = value.trim().toLowerCase();
		}

		index += 1;
	}

	if (args.scheduledAt && !args.send) {
		throw new Error('--scheduled-at requires --send.');
	}

	return args;
}

export async function resendRequest(pathname, { apiKey, method = 'GET', body } = {}) {
	const response = await fetch(`https://api.resend.com${pathname}`, {
		method,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: body === undefined ? undefined : JSON.stringify(body),
	});

	const payload = await response.json().catch(() => null);

	return {
		ok: response.ok,
		status: response.status,
		payload,
	};
}

export function normalizeSiteUrl(siteUrl = DEFAULT_SITE_URL) {
	return siteUrl.replace(/\/+$/, '');
}

export async function readBlogPosts() {
	const files = await walkMarkdownFiles(CONTENT_DIRECTORY);
	return Promise.all(files.map(async (fileUrl) => readBlogPost(fileUrl)));
}

export function getPublishedPosts(posts) {
	return [...posts]
		.filter((post) => !post.draft)
		.sort((left, right) => right.pubDate.valueOf() - left.pubDate.valueOf());
}

export function selectPost(posts, slug) {
	if (slug) {
		const matchedPost = posts.find((post) => post.slug === slug);

		if (!matchedPost) {
			throw new Error(`No published post found for slug: ${slug}`);
		}

		return matchedPost;
	}

	const [latestPost] = posts;

	if (!latestPost) {
		throw new Error('No published posts were found.');
	}

	return latestPost;
}

export function buildBroadcastContent(post, options = {}) {
	const siteUrl = normalizeSiteUrl(options.siteUrl ?? process.env.NEWSLETTER_SITE_URL ?? DEFAULT_SITE_URL);
	const unsubscribeUrl = options.unsubscribeUrl ?? DEFAULT_UNSUBSCRIBE_URL;
	const postUrl = `${siteUrl}/blog/${post.slug}/`;
	const summary = post.description?.trim() || summarizeMarkdown(post.body, 220);
	const formattedDate = formatDate(post.pubDate);
	const readingTime = estimateReadingTime(post.body);
	const metadataLine = `${post.category} | ${formattedDate} | ${readingTime} min read`;
	const subject = `${post.title} | The Harness`;
	const previewText = `${post.title} is live on The Harness.`;
	const name = `${post.slug}-newsletter`;

	const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4efe6;color:#1d1f1d;font-family:Georgia, 'Times New Roman', serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fbf8f2;border:1px solid #d9d0c0;">
            <tr>
              <td style="padding:32px 32px 12px;font-family:'JetBrains Mono', monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6c685d;">
                The Harness
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 12px;font-family:'JetBrains Mono', monospace;font-size:12px;line-height:1.7;color:#6c685d;">
                ${escapeHtml(metadataLine)}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 16px;font-size:34px;line-height:1.2;font-weight:600;color:#1d1f1d;">
                ${escapeHtml(post.title)}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;font-size:18px;line-height:1.7;color:#2b312c;">
                ${escapeHtml(summary)}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:15px;line-height:1.7;color:#4f574e;">
                By ${escapeHtml(post.author)}. The full essay is live now on the site.
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;">
                <a href="${postUrl}" style="display:inline-block;background:#b55e31;border:1px solid #b55e31;color:#fbf8f2;padding:14px 20px;text-decoration:none;font-family:'JetBrains Mono', monospace;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Read the post</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:14px;line-height:1.7;color:#4f574e;">
                Prefer the raw link? <a href="${postUrl}" style="color:#b55e31;">${escapeHtml(postUrl)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px;border-top:1px solid #d9d0c0;font-size:13px;line-height:1.7;color:#6c685d;">
                You are receiving this because you subscribed to The Harness newsletter.<br />
                <a href="${unsubscribeUrl}" style="color:#6c685d;">Manage your subscription</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

	const text = [
		'The Harness',
		'',
		post.title,
		metadataLine,
		'',
		summary,
		'',
		`By ${post.author}.`,
		'',
		`Read the full post: ${postUrl}`,
		'',
		`Manage your subscription: ${unsubscribeUrl}`,
	].join('\n');

	return {
		name,
		subject,
		previewText,
		html,
		text,
		postUrl,
		metadataLine,
	};
}

async function walkMarkdownFiles(directoryUrl) {
	const entries = await readdir(directoryUrl, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);

		if (entry.isDirectory()) {
			files.push(...await walkMarkdownFiles(entryUrl));
			continue;
		}

		if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
			files.push(entryUrl);
		}
	}

	return files;
}

async function readBlogPost(fileUrl) {
	const rawSource = await readFile(fileUrl, 'utf8');
	const parsedFile = matter(rawSource);
	const relativePath = fileUrl.pathname.replace(CONTENT_DIRECTORY.pathname, '');
	const slug = relativePath.replace(/\.(md|mdx)$/i, '');
	const pubDate = new Date(parsedFile.data.pubDate);

	if (Number.isNaN(pubDate.valueOf())) {
		throw new TypeError(`Invalid pubDate in ${relativePath}`);
	}

	return {
		slug,
		title: String(parsedFile.data.title ?? '').trim(),
		description: String(parsedFile.data.description ?? '').trim(),
		author: String(parsedFile.data.author ?? 'Theodoros Galanos').trim(),
		category: String(parsedFile.data.category ?? 'Writing').trim(),
		pubDate,
		draft: Boolean(parsedFile.data.draft),
		body: parsedFile.content.trim(),
		filePath: relativePath,
	};
}

function estimateReadingTime(body) {
	const wordCount = body.split(/\s+/).filter(Boolean).length;
	return Math.max(3, Math.ceil(wordCount / 180));
}

function summarizeMarkdown(body, maxLength) {
	const firstParagraph = stripMarkdown(body)
		.split(/\n+/)
		.map((paragraph) => paragraph.trim())
		.find(Boolean) ?? '';

	if (firstParagraph.length <= maxLength) {
		return firstParagraph;
	}

	return `${firstParagraph.slice(0, maxLength).trimEnd()}...`;
}

function stripMarkdown(markdown) {
	return STRIP_MARKDOWN_PATTERNS.reduce(
		(currentValue, [pattern, replacement]) => currentValue.replaceAll(pattern, replacement),
		markdown,
	).trim();
}

function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function formatDate(date) {
	return new Intl.DateTimeFormat('en', {
		dateStyle: 'long',
	}).format(date);
}

async function readOptionalFile(fileUrl) {
	try {
		return await readFile(fileUrl, 'utf8');
	} catch {
		return '';
	}
}

function parseEnvEntries(fileContents) {
	return fileContents
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => parseEnvLine(line))
		.filter(Boolean);
}

function parseEnvLine(line) {
	const separatorIndex = line.indexOf('=');

	if (separatorIndex === -1) {
		return null;
	}

	const key = line.slice(0, separatorIndex).trim();
	const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim());

	return { key, value };
}

function stripWrappingQuotes(value) {
	if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
		return value.slice(1, -1);
	}

	return value;
}