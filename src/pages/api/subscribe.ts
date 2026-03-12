// ABOUTME: Astro API route that subscribes newsletter signups through Resend on Vercel.
// ABOUTME: Validates input, writes contacts into a Resend Topic, and returns safe JSON responses.

import type { APIRoute } from 'astro';

export const prerender = false;

type SubscribePayload = {
	email?: string;
};

const resendApiKey = import.meta.env.RESEND_API_KEY;
const newsletterSegmentId = import.meta.env.RESEND_NEWSLETTER_SEGMENT_ID;
const newsletterTopicId = import.meta.env.RESEND_NEWSLETTER_TOPIC_ID;
const resendBaseUrl = 'https://api.resend.com';

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function parsePayload(request: Request): Promise<SubscribePayload> {
	const contentType = request.headers.get('content-type') ?? '';

	if (contentType.includes('application/json')) {
		return await request.json() as SubscribePayload;
	}

	if (contentType.includes('application/x-www-form-urlencoded')) {
		const formData = await request.formData();
		const emailField = formData.get('email');
		return {
			email: typeof emailField === 'string' ? emailField : undefined,
		};
	}

	return {};
}

type ResendRequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH';
	body?: unknown;
};

type ResendErrorBody = {
	message?: string;
};

async function resendRequest(path: string, options: ResendRequestOptions = {}) {
	const response = await fetch(`${resendBaseUrl}${path}`, {
		method: options.method ?? 'GET',
		headers: {
			Authorization: `Bearer ${resendApiKey}`,
			'Content-Type': 'application/json',
		},
		body: options.body === undefined ? undefined : JSON.stringify(options.body),
	});

	const responseBody = await response.json().catch(() => null) as ResendErrorBody | null;

	return {
		response,
		responseBody,
	};
}

async function restoreExistingSubscriber(email: string) {
	const encodedEmail = encodeURIComponent(email);
	const results = await Promise.all([
		resendRequest(`/contacts/${encodedEmail}/topics`, {
			method: 'PATCH',
			body: [
				{
					id: newsletterTopicId,
					subscription: 'opt_in',
				},
			],
		}),
		resendRequest(`/contacts/${encodedEmail}`, {
			method: 'PATCH',
			body: {
				unsubscribed: false,
			},
		}),
		resendRequest(`/contacts/${encodedEmail}/segments/${newsletterSegmentId}`, {
			method: 'POST',
		}),
	]);

	return results.every(({ response }) => response.ok || response.status === 409);
}

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
		status: 405,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const POST: APIRoute = async ({ request }) => {
	if (!resendApiKey || !newsletterTopicId || !newsletterSegmentId) {
		return new Response(JSON.stringify({ error: 'Newsletter is not configured yet.' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	const payload = await parsePayload(request);
	const email = payload.email?.trim().toLowerCase();

	if (!email || !isValidEmail(email)) {
		return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	const { response, responseBody } = await resendRequest('/contacts', {
		method: 'POST',
		body: {
			email,
			unsubscribed: false,
			segments: [
				{
					id: newsletterSegmentId,
				},
			],
			topics: [
				{
					id: newsletterTopicId,
					subscription: 'opt_in',
				},
			],
		},
	});

	if (response.ok) {
		return new Response(JSON.stringify({ message: 'You are subscribed. New posts will land in your inbox.' }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	const errorMessage = responseBody?.message?.toLowerCase() ?? '';

	if (response.status === 409 || errorMessage.includes('already') || errorMessage.includes('exists')) {
		const restored = await restoreExistingSubscriber(email);

		if (!restored) {
			return new Response(JSON.stringify({ error: 'Subscription exists, but segment sync failed. Please try again in a moment.' }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return new Response(JSON.stringify({ message: 'That email is already subscribed.' }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	const publicError = responseBody?.message ?? 'Subscription failed. Please try again in a moment.';

	return new Response(JSON.stringify({ error: publicError }), {
		status: 500,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};