// ABOUTME: CLI for creating or sending Resend broadcasts for published blog posts.
// ABOUTME: Targets the newsletter segment and topic using site content as the source of truth.

import {
	buildBroadcastContent,
	getPublishedPosts,
	loadLocalEnv,
	parseCliArgs,
	readBlogPosts,
	requireEnv,
	resendRequest,
	selectPost,
} from './lib/newsletter.js';

async function main() {
	await loadLocalEnv();

	const args = parseCliArgs(process.argv.slice(2));
	const posts = getPublishedPosts(await readBlogPosts());
	const post = selectPost(posts, args.slug);
	const content = buildBroadcastContent(post);

	if (args.dryRun) {
		console.log(`Post: ${post.slug}`);
		console.log(`Subject: ${content.subject}`);
		console.log(`URL: ${content.postUrl}`);
		console.log(`Mode: ${args.send ? 'send' : 'draft'}`);
		if (args.scheduledAt) {
			console.log(`Scheduled at: ${args.scheduledAt}`);
		}
		return;
	}

	const resendApiKey = requireEnv('RESEND_API_KEY');
	const newsletterSegmentId = requireEnv('RESEND_NEWSLETTER_SEGMENT_ID');
	const newsletterTopicId = requireEnv('RESEND_NEWSLETTER_TOPIC_ID');
	const newsletterFrom = requireEnv('RESEND_NEWSLETTER_FROM');
	const newsletterReplyTo = process.env.RESEND_NEWSLETTER_REPLY_TO?.trim();

	const result = await resendRequest('/broadcasts', {
		apiKey: resendApiKey,
		method: 'POST',
		body: {
			name: content.name,
			segment_id: newsletterSegmentId,
			topic_id: newsletterTopicId,
			from: newsletterFrom,
			reply_to: newsletterReplyTo ? [newsletterReplyTo] : undefined,
			subject: content.subject,
			preview_text: content.previewText,
			html: content.html,
			text: content.text,
			send: args.send,
			scheduled_at: args.scheduledAt,
		},
	});

	if (!result.ok) {
		throw new Error(result.payload?.message ?? `Broadcast request failed with status ${result.status}`);
	}

	console.log(`Broadcast ${args.send ? 'queued' : 'created'} for ${post.slug}`);
	console.log(`Broadcast ID: ${result.payload.id}`);
	console.log(`URL: ${content.postUrl}`);
	console.log(`Subject: ${content.subject}`);
	if (args.scheduledAt) {
		console.log(`Scheduled at: ${args.scheduledAt}`);
	}
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}