// ABOUTME: CLI for backfilling newsletter subscribers into the Resend broadcast segment.
// ABOUTME: Ensures pre-segment subscribers can receive broadcasts without manual dashboard edits.

import {
	loadLocalEnv,
	parseCliArgs,
	requireEnv,
	resendRequest,
} from './lib/newsletter.js';

async function main() {
	await loadLocalEnv();

	const args = parseCliArgs(process.argv.slice(2));
	const resendApiKey = requireEnv('RESEND_API_KEY');
	const newsletterSegmentId = requireEnv('RESEND_NEWSLETTER_SEGMENT_ID');
	const newsletterTopicId = requireEnv('RESEND_NEWSLETTER_TOPIC_ID');
	const contacts = args.email ? [{ email: args.email }] : await listAllContacts(resendApiKey);

	let inspectedCount = 0;
	let syncedCount = 0;

	for (const contact of contacts) {
		inspectedCount += 1;

		const isSubscribedToTopic = await hasNewsletterTopic(resendApiKey, contact.email, newsletterTopicId);

		if (!isSubscribedToTopic) {
			continue;
		}

		const alreadyInSegment = await hasNewsletterSegment(resendApiKey, contact.email, newsletterSegmentId);

		if (alreadyInSegment) {
			continue;
		}

		if (!args.dryRun) {
			const result = await resendRequest(`/contacts/${encodeURIComponent(contact.email)}/segments/${newsletterSegmentId}`, {
				apiKey: resendApiKey,
				method: 'POST',
			});

			if (!result.ok && result.status !== 409) {
				throw new Error(result.payload?.message ?? `Failed to add ${contact.email} to newsletter segment.`);
			}
		}

		syncedCount += 1;
	}

	console.log(`Inspected ${inspectedCount} contact(s).`);
	console.log(`${args.dryRun ? 'Would sync' : 'Synced'} ${syncedCount} contact(s) into the newsletter segment.`);
}

async function listAllContacts(apiKey) {
	const contacts = [];
	let after;

	while (true) {
		const query = new URLSearchParams();
		query.set('limit', '100');
		if (after) {
			query.set('after', after);
		}

		const result = await resendRequest(`/contacts?${query.toString()}`, {
			apiKey,
		});

		if (!result.ok) {
			throw new Error(result.payload?.message ?? 'Failed to list contacts.');
		}

		const batch = result.payload?.data ?? [];
		contacts.push(...batch);

		if (!result.payload?.has_more || batch.length === 0) {
			break;
		}

		after = batch.at(-1)?.id;
	}

	return contacts;
}

async function hasNewsletterTopic(apiKey, email, topicId) {
	const result = await resendRequest(`/contacts/${encodeURIComponent(email)}/topics`, {
		apiKey,
	});

	if (!result.ok) {
		throw new Error(result.payload?.message ?? `Failed to list topics for ${email}.`);
	}

	return result.payload?.data?.some((topic) => topic.id === topicId && topic.subscription === 'opt_in') ?? false;
}

async function hasNewsletterSegment(apiKey, email, segmentId) {
	const result = await resendRequest(`/contacts/${encodeURIComponent(email)}/segments`, {
		apiKey,
	});

	if (!result.ok) {
		throw new Error(result.payload?.message ?? `Failed to list segments for ${email}.`);
	}

	return result.payload?.data?.some((segment) => segment.id === segmentId) ?? false;
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}