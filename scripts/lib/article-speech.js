// ABOUTME: Generates a single saved narration with explicit credit and input checks.
// ABOUTME: Reuses verified recordings and records interrupted requests without automatic retries.
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { countNarration } from './article-narration.js';

const MODEL = 'eleven_flash_v2_5';
const FORMAT = 'mp3_44100_96';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

async function readJson(path) {
	return JSON.parse(await readFile(path, 'utf8'));
}

async function saveReceipt(directory, receipt) {
	const temporary = resolve(directory, 'receipt.json.tmp');
	await writeFile(temporary, `${JSON.stringify(receipt, null, 2)}\n`);
	await rename(temporary, resolve(directory, 'receipt.json'));
}

async function reuseSaved(directory, requestHash) {
	let receipt;
	try {
		receipt = await readJson(resolve(directory, 'receipt.json'));
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
		// A directory without a receipt may belong to an interrupted or concurrent run.
		try {
			await readFile(resolve(directory, 'request.json'));
		} catch (requestError) {
			if (requestError.code === 'ENOENT') return null;
			throw requestError;
		}
	}
	if (receipt?.status !== 'saved' || receipt.requestHash !== requestHash) {
		throw new Error(`An unfinished generation exists in ${directory}. Inspect its files and ElevenLabs history before retrying; it may have been billed.`);
	}
	const audio = await readFile(resolve(directory, 'audio.mp3'));
	if (sha256(audio) !== receipt.audio.sha256 || audio.length !== receipt.audio.bytes) {
		throw new Error(`Saved audio failed its hash check in ${directory}; no new request was made.`);
	}
	return { ...receipt, directory, reused: true };
}

/** Generate one complete English article; never automatically retry a paid request. */
export async function generateArticleSpeech({ slug, voiceId, apiKey, root = process.cwd(), fetchImpl = fetch }) {
	if (!/^[a-z0-9-]+$/.test(slug ?? '')) throw new Error('A valid article slug is required.');
	if (!/^[a-zA-Z0-9]+$/.test(voiceId ?? '')) throw new Error('A valid ElevenLabs voice ID is required.');
	const manifest = await readJson(resolve(root, 'audio/narration/manifest.json'));
	const article = manifest.articles.find((item) => item.slug === slug);
	if (!article || manifest.language !== 'en') throw new Error('Article is not in the prepared English manifest.');
	if (article.review.length) throw new Error('Article still has flagged narration passages; resolve them before generation.');
	const text = await readFile(resolve(root, 'audio/narration/en', `${slug}.txt`), 'utf8');
	const counts = countNarration(text);
	if (counts.sha256 !== article.sha256 || counts.characters !== article.characters) {
		throw new Error('Narration text differs from its manifest. Review and recount it before generation.');
	}
	if (!text.trim() || counts.characters > 40_000) throw new Error('Article must contain 1–40,000 characters for this single-request workflow.');
	const body = {
		text,
		model_id: MODEL,
		language_code: 'en',
		voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
		apply_text_normalization: 'auto',
	};
	const request = { voiceId, outputFormat: FORMAT, body };
	const requestHash = sha256(JSON.stringify(request));
	const directory = resolve(root, 'audio/generated/en', `${slug}-${requestHash.slice(0, 16)}`);
	const reused = await reuseSaved(directory, requestHash);
	if (reused) return reused;
	if (!apiKey) throw new Error('ELEVEN_LABS_API_KEY is missing.');
	const headers = { 'xi-api-key': apiKey };
	const get = async (path) => {
		const response = await fetchImpl(`https://api.elevenlabs.io${path}`, {
			headers, redirect: 'error', signal: AbortSignal.timeout(30_000),
		});
		if (!response.ok) throw new Error(`ElevenLabs preflight ${path}: HTTP ${response.status}`);
		return response.json();
	};
	const [subscription, models, voice] = await Promise.all([
		get('/v1/user/subscription'), get('/v1/models'), get(`/v1/voices/${voiceId}`),
	]);
	const model = models.find((item) => item.model_id === MODEL);
	const rate = model?.model_rates?.character_cost_multiplier;
	const discount = model?.model_rates?.cost_discount_multiplier;
	if (!model?.can_do_text_to_speech || rate !== 0.5 || discount !== 1) {
		throw new Error('Flash model capability or rate changed; review the budget before generation.');
	}
	if (counts.characters > model.max_characters_request_subscribed_user) throw new Error('Article exceeds the current model request limit.');
	if (voice.voice_id !== voiceId || voice.category !== 'premade' || voice.labels?.language !== 'en') {
		throw new Error('This workflow requires a premade English narrator without a Voice Library surcharge.');
	}
	const balanceBefore = subscription.character_limit - subscription.character_count;
	const estimatedCredits = counts.characters * rate * discount;
	if (!Number.isFinite(balanceBefore) || balanceBefore < estimatedCredits) throw new Error('Insufficient included credits; generation was not started.');
	await mkdir(resolve(root, 'audio/generated/en'), { recursive: true });
	// Exclusive directory creation prevents two invocations from generating the same input.
	try {
		await mkdir(directory);
	} catch (error) {
		if (error.code !== 'EEXIST') throw error;
		const existing = await reuseSaved(directory, requestHash);
		if (existing) return existing;
		throw new Error(`Generation directory already exists: ${directory}. Inspect it before retrying.`);
	}
	const receipt = {
		status: 'in_progress', title: article.title, slug, language: 'en',
		sourceUrl: article.url, textSha256: counts.sha256, characters: counts.characters, words: counts.words,
		requestHash, modelId: MODEL, outputFormat: FORMAT,
		voice: { id: voiceId, name: voice.name, labels: voice.labels },
		estimatedCredits, balanceBefore, startedAt: new Date().toISOString(),
	};
	await writeFile(resolve(directory, 'request.json'), `${JSON.stringify(request, null, 2)}\n`, { flag: 'wx' });
	await writeFile(resolve(directory, 'narration.txt'), text, { flag: 'wx' });
	await saveReceipt(directory, receipt);
	try {
		const response = await fetchImpl(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${FORMAT}`, {
			method: 'POST', redirect: 'error',
			headers: { ...headers, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
			body: JSON.stringify(body), signal: AbortSignal.timeout(15 * 60_000),
		});
		receipt.responseStatus = response.status;
		receipt.requestId = response.headers.get('request-id') ?? response.headers.get('x-request-id');
		receipt.historyItemId = response.headers.get('history-item-id');
		receipt.reportedCharacterCost = response.headers.get('character-cost');
		await saveReceipt(directory, receipt);
		if (!response.ok) throw new Error(`ElevenLabs generation: HTTP ${response.status}. Inspect request ${receipt.requestId ?? '(ID unavailable)'}.`);
		if (!/^audio\/mpeg(?:;|$)/i.test(response.headers.get('content-type') ?? '')) {
			throw new Error('ElevenLabs did not return MP3 audio.');
		}
		const audio = Buffer.from(await response.arrayBuffer());
		if (audio.length < 1_024) throw new Error('ElevenLabs returned an unexpectedly short audio file.');
		const partial = resolve(directory, 'audio.mp3.part');
		await writeFile(partial, audio, { flag: 'wx' });
		await rename(partial, resolve(directory, 'audio.mp3'));
		receipt.audio = { file: 'audio.mp3', bytes: audio.length, sha256: sha256(audio) };
		receipt.status = 'saved';
		receipt.savedAt = new Date().toISOString();
		await saveReceipt(directory, receipt);
	} catch (error) {
		receipt.status = 'failed';
		receipt.error = error.message;
		await saveReceipt(directory, receipt);
		throw new Error(`${error.message} Saved generation details in ${directory}. No automatic paid retry was attempted.`);
	}
	try {
		const after = await get('/v1/user/subscription');
		receipt.balanceAfter = after.character_limit - after.character_count;
		receipt.observedAccountCreditChange = after.character_count - subscription.character_count;
	} catch (error) {
		receipt.usageCheckError = error.message;
	}
	await saveReceipt(directory, receipt);
	return { ...receipt, directory, reused: false };
}
