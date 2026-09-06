// ABOUTME: Generates or reuses one saved English article narration.
// ABOUTME: Loads local credentials without including them in CLI output.
import { parseArgs } from 'node:util';
import { generateArticleSpeech } from './lib/article-speech.js';

try {
	const { values } = parseArgs({
		options: { article: { type: 'string' }, 'voice-id': { type: 'string' } },
		allowPositionals: false,
	});
	try {
		process.loadEnvFile('.env');
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}
	const result = await generateArticleSpeech({
		slug: values.article, voiceId: values['voice-id'], apiKey: process.env.ELEVEN_LABS_API_KEY,
	});
	console.log(JSON.stringify(result, null, 2));
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
