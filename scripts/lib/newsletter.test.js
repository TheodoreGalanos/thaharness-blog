// ABOUTME: Unit tests for newsletter helper logic used by Resend broadcast scripts.
// ABOUTME: Verifies post selection and email payload generation stay stable.

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBroadcastContent, getPublishedPosts, selectPost } from './newsletter.js';

test('getPublishedPosts filters drafts and sorts newest first', () => {
	const posts = [
		{ slug: 'older', draft: false, pubDate: new Date('2026-03-08') },
		{ slug: 'draft-post', draft: true, pubDate: new Date('2026-03-10') },
		{ slug: 'newer', draft: false, pubDate: new Date('2026-03-09') },
	];

	assert.deepEqual(getPublishedPosts(posts).map((post) => post.slug), ['newer', 'older']);
});

test('selectPost returns the latest post when no slug is provided', () => {
	const posts = [
		{ slug: 'second' },
		{ slug: 'first' },
	];

	assert.equal(selectPost(posts).slug, 'second');
});

test('buildBroadcastContent includes the post url and unsubscribe token', () => {
	const broadcast = buildBroadcastContent({
		slug: 'where-capability-actually-lives-in-agentic-engineering',
		title: 'Where Capability Actually Lives in Agentic Engineering',
		description: 'A post about harnesses, orchestration, and reliable engineering work.',
		author: 'Theodoros Galanos',
		category: 'Engineering',
		pubDate: new Date('2026-03-10'),
		body: 'Useful agent performance depends on staying attached to the artifact.',
	});

	assert.equal(broadcast.subject, 'Where Capability Actually Lives in Agentic Engineering | The Harness');
	assert.match(broadcast.html, /https:\/\/theharness\.blog\/blog\/where-capability-actually-lives-in-agentic-engineering\//);
	assert.match(broadcast.text, /Manage your subscription: \{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/);
	assert.match(broadcast.html, /Read the post/);
});