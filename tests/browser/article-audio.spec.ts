// ABOUTME: Verifies the saved audio integration on every narrated production article.
// ABOUTME: Protects lazy media loading and the two approved playback speed choices.
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(readFileSync(new URL('../../audio/published.json', import.meta.url), 'utf8'));

test('all hosted narrations appear without requesting audio before Play', async ({ page }) => {
	const audioRequests: string[] = [];
	page.on('request', request => {
		if (new URL(request.url()).hostname.endsWith('.public.blob.vercel-storage.com')) {
			audioRequests.push(request.url());
		}
	});
	for (const recording of manifest.articles) {
		await page.goto(`/blog/${recording.slug}/`);
		const player = page.getByRole('region', { name: 'Article audio' });
		await expect(player).toBeVisible();
		await expect(player).toHaveAttribute('data-audio-url', recording.url);
		await expect(player.getByRole('button', { name: 'Play audio', exact: true })).toBeEnabled();
		await expect(player.locator('audio')).toHaveAttribute('preload', 'none');
		expect(await player.locator('audio').getAttribute('src')).toBeNull();
		const speed = player.getByRole('combobox', { name: 'Playback speed' });
		await expect(speed).toHaveValue('1');
		await expect(speed.locator('option')).toHaveText(['1×', '1.15×']);
		await speed.selectOption('1.15');
		await expect(player.locator('audio')).toHaveJSProperty('playbackRate', 1.15);
		await expect(player.locator('a')).toHaveCount(0);
	}
	expect(audioRequests).toEqual([]);
});
