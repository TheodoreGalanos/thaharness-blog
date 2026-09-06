// ABOUTME: Tests saved narration reuse and speech-generation safeguards.
// ABOUTME: Uses local fixtures and simulated API responses without paid requests.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { countNarration } from './article-narration.js';
import { generateArticleSpeech } from './article-speech.js';

async function fixture({ text = 'Test article\n\nA complete narrative.\n', review = [], balance = 90000, rate = 0.5, failPost = false } = {}) {
	const root = await mkdtemp(join(tmpdir(), 'article-speech-test-'));
	await mkdir(join(root, 'audio/narration/en'), { recursive: true });
	await writeFile(join(root, 'audio/narration/en/test-article.txt'), text);
	await writeFile(join(root, 'audio/narration/manifest.json'), JSON.stringify({ language: 'en', articles: [
		{ slug: 'test-article', title: 'Test article', url: 'https://theharness.blog/blog/test-article/', ...countNarration(text), review },
	] }));
	const calls = [];
	const audio = Buffer.alloc(2048, 42);
	const json = (value) => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
	const fetchImpl = async (url, options) => {
		calls.push({ url, options });
		if (options.method === 'POST') {
			if (failPost) throw new Error('Connection interrupted');
			return new Response(audio, { headers: { 'content-type': 'audio/mpeg', 'request-id': 'test-request', 'character-cost': '17.5' } });
		}
		if (url.endsWith('/subscription')) return json({ character_limit: balance, character_count: calls.some(c => c.options.method === 'POST') ? 17.5 : 0 });
		if (url.endsWith('/models')) return json([{ model_id: 'eleven_flash_v2_5', can_do_text_to_speech: true, max_characters_request_subscribed_user: 40000, model_rates: { character_cost_multiplier: rate, cost_discount_multiplier: 1 } }]);
		if (url.endsWith('/voices/testVoice')) return json({ voice_id: 'testVoice', name: 'Test narrator', category: 'premade', labels: { language: 'en' } });
		throw new Error(`Unexpected request: ${url}`);
	};
	const run = (overrides = {}) => generateArticleSpeech({ root, slug: 'test-article', voiceId: 'testVoice', apiKey: 'test-secret', fetchImpl, ...overrides });
	return { root, run, calls, audio, text };
}

test('saves one paid response and exact input, then reuses it without any network calls', async () => {
	const f = await fixture();
	const result = await f.run();
	assert.equal(result.status, 'saved');
	assert.equal(result.reused, false);
	assert.deepEqual(await readFile(join(result.directory, 'audio.mp3')), f.audio);
	assert.equal(await readFile(join(result.directory, 'narration.txt'), 'utf8'), f.text);
	const post = f.calls.filter(c => c.options.method === 'POST');
	assert.equal(post.length, 1);
	assert.equal(JSON.parse(post[0].options.body).text, f.text);
	assert.match(post[0].url, /output_format=mp3_44100_96/);
	assert.equal(result.observedAccountCreditChange, 17.5);
	assert.ok(!(await readFile(join(result.directory, 'request.json'), 'utf8')).includes('test-secret'));
	const reused = await f.run({ apiKey: undefined, fetchImpl: () => { throw new Error('Unexpected network call'); } });
	assert.equal(reused.reused, true);
	await writeFile(join(result.directory, 'audio.mp3'), 'corrupted');
	await assert.rejects(f.run(), /hash check/);
	assert.equal(f.calls.filter(c => c.options.method === 'POST').length, 1);
});

test('blocks changed text, unresolved passages, and oversized inputs before contacting ElevenLabs', async () => {
	const changed = await fixture();
	await writeFile(join(changed.root, 'audio/narration/en/test-article.txt'), 'An uncounted edit.');
	await assert.rejects(changed.run(), /differs from its manifest/);
	assert.equal(changed.calls.length, 0);
	const flagged = await fixture({ review: [{ text: 'See Figure 1.' }] });
	await assert.rejects(flagged.run(), /flagged narration/);
	assert.equal(flagged.calls.length, 0);
	const oversized = await fixture({ text: 'x'.repeat(40001) });
	await assert.rejects(oversized.run(), /1–40,000/);
	assert.equal(oversized.calls.length, 0);
});

test('does not generate when included credits are insufficient or the model rate changes', async () => {
	for (const options of [{ balance: 1 }, { rate: 1 }]) {
		const f = await fixture(options);
		await assert.rejects(f.run(), /Insufficient|rate changed/);
		assert.equal(f.calls.filter(c => c.options.method === 'POST').length, 0);
	}
});

test('records an uncertain paid failure and blocks automatic retries', async () => {
	const f = await fixture({ failPost: true });
	await assert.rejects(f.run(), /Connection interrupted.*No automatic paid retry/);
	await assert.rejects(f.run(), /unfinished generation/);
	assert.equal(f.calls.filter(c => c.options.method === 'POST').length, 1);
});

test('two concurrent invocations make only one paid request', async () => {
	const f = await fixture();
	const results = await Promise.allSettled([f.run(), f.run()]);
	assert.ok(results.some(result => result.status === 'fulfilled'));
	assert.equal(f.calls.filter(c => c.options.method === 'POST').length, 1);
});
