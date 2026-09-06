// ABOUTME: Exercises article playback without making network or speech API requests.
// ABOUTME: Covers loading on demand, media events, seeking, speed, and failures.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { JSDOM } from 'jsdom';
import { initArticleAudio } from '../src/scripts/article-audio.ts';

function setup() {
	const dom = new JSDOM(`<section data-audio-url="https://example.com/article.mp3" data-duration="120">
		<audio preload="none"></audio><button data-play disabled></button>
		<input data-seek type="range" min="0" max="120" value="0" disabled>
		<span data-elapsed></span><span data-duration-label></span>
		<button data-skip="-15" disabled></button><button data-skip="15" disabled></button>
		<select data-speed disabled><option value="1">1×</option><option value="1.15">1.15×</option></select>
		<button data-mute disabled></button><input data-volume type="range" min="0" max="1" step="0.1" value="1" disabled>
		<p data-status role="status"></p></section>`, { url: 'https://theharness.blog' });
	const root = dom.window.document.querySelector('section')!;
	const audio = root.querySelector('audio')!;
	let paused = true;
	let readyState = 0;
	let duration = NaN;
	let ended = false;
	let error: MediaError | null = null;
	let loads = 0;
	const emit = (event: string) => audio.dispatchEvent(new dom.window.Event(event));
	Object.defineProperties(audio, {
		paused: { get: () => paused }, readyState: { get: () => readyState },
		duration: { get: () => duration }, ended: { get: () => ended }, error: { get: () => error },
	});
	audio.play = async () => { paused = false; ended = false; emit('play'); emit('playing'); };
	audio.pause = () => { paused = true; emit('pause'); };
	audio.load = () => { loads++; error = null; };
	initArticleAudio(root);
	const metadata = () => { readyState = 1; duration = 120; emit('loadedmetadata'); };
	const input = (selector: string, value: string, event = 'change') => {
		const control = root.querySelector<HTMLInputElement>(selector)!;
		control.value = value;
		control.dispatchEvent(new dom.window.Event(event));
	};
	return { dom, root, audio, emit, metadata, input,
		play: root.querySelector<HTMLButtonElement>('[data-play]')!,
		seek: root.querySelector<HTMLInputElement>('[data-seek]')!,
		fail: () => { error = { code: 2 } as MediaError; emit('error'); },
		end: () => { ended = true; paused = true; audio.currentTime = 120; emit('ended'); },
		loads: () => loads,
	};
}

describe('article audio', () => {
	it('leaves the MP3 unloaded until Play, including focus and speed changes', async () => {
		const { root, audio, input, dom, play } = setup();
		assert.equal(audio.getAttribute('src'), null);
		assert.equal(audio.preload, 'none');
		assert.equal(dom.window.document.querySelectorAll('link[rel="preconnect"]').length, 0);
		root.dispatchEvent(new dom.window.Event('pointerenter'));
		root.dispatchEvent(new dom.window.Event('focusin'));
		assert.equal(dom.window.document.querySelectorAll('link[rel="preconnect"]').length, 1);
		input('[data-speed]', '1.15');
		assert.equal(audio.getAttribute('src'), null);
		play.click();
		await Promise.resolve();
		assert.equal(audio.src, 'https://example.com/article.mp3');
		assert.equal(audio.playbackRate, 1.15);
		assert.equal(audio.preservesPitch, true);
	});

	it('tracks play, pause, waiting, and resume from media events', async () => {
		const { root, play, emit } = setup();
		play.click(); await Promise.resolve();
		assert.equal(root.dataset.state, 'playing');
		assert.equal(play.getAttribute('aria-label'), 'Pause audio');
		emit('waiting'); assert.equal(root.dataset.state, 'loading');
		play.click(); assert.equal(root.dataset.state, 'paused');
		play.click(); await Promise.resolve();
		assert.equal(root.dataset.state, 'playing');
	});

	it('enables seeking after metadata and commits a drag only on release', () => {
		const { audio, metadata, input, root, seek } = setup();
		assert.equal(seek.disabled, true);
		metadata(); assert.equal(seek.disabled, false);
		input('[data-seek]', '90', 'input');
		assert.equal(audio.currentTime, 0);
		assert.equal(root.querySelector('[data-elapsed]')!.textContent, '1:30');
		input('[data-seek]', '90');
		assert.equal(audio.currentTime, 90);
		assert.equal(audio.paused, true);
	});

	it('clamps 15-second skips to the start and end without starting playback', () => {
		const { root, audio, metadata } = setup(); metadata();
		audio.currentTime = 4;
		root.querySelector<HTMLButtonElement>('[data-skip="-15"]')!.click();
		assert.equal(audio.currentTime, 0);
		audio.currentTime = 115;
		root.querySelector<HTMLButtonElement>('[data-skip="15"]')!.click();
		assert.equal(audio.currentTime, 120);
		assert.equal(audio.paused, true);
	});

	it('ignores the rejected pending play when the listener has paused', async () => {
		const { audio, root, play } = setup();
		let reject!: (error: Error) => void;
		audio.play = () => new Promise((_, fail) => { reject = fail; });
		play.click(); assert.equal(root.dataset.state, 'loading');
		play.click();
		reject(new DOMException('Interrupted', 'AbortError'));
		await Promise.resolve();
		assert.equal(root.dataset.state, 'paused');
		assert.equal(root.querySelector('[data-status]')!.textContent, '');
	});

	it('shows a retry after a failed play and recovers on the next press', async () => {
		const { audio, play, root } = setup();
		const success = audio.play;
		audio.play = async () => { throw new Error('Network failure'); };
		play.click(); await Promise.resolve();
		assert.equal(root.dataset.state, 'error');
		assert.equal(play.getAttribute('aria-label'), 'Retry audio');
		assert.match(root.querySelector('[data-status]')!.textContent!, /retry/i);
		audio.play = success;
		play.click(); await Promise.resolve();
		assert.equal(root.dataset.state, 'playing');
	});

	it('treats a native pause during startup as cancellation, not a playback error', async () => {
		const { audio, root, play } = setup();
		let reject!: (error: Error) => void;
		audio.play = () => new Promise((_, fail) => { reject = fail; });
		play.click();
		audio.pause();
		reject(new DOMException('Interrupted', 'AbortError'));
		await Promise.resolve();
		assert.equal(root.dataset.state, 'paused');
	});

	it('reloads a failed media element only on explicit retry', async () => {
		const { fail, root, play, loads } = setup();
		play.click(); await Promise.resolve();
		fail();
		assert.equal(root.dataset.state, 'error');
		assert.equal(loads(), 0);
		play.click(); await Promise.resolve();
		assert.equal(loads(), 1);
		assert.equal(root.dataset.state, 'playing');
	});

	it('shows Replay when playback ends and starts again at zero', async () => {
		const { end, audio, play } = setup();
		end(); assert.equal(play.getAttribute('aria-label'), 'Replay audio');
		play.click(); await Promise.resolve();
		assert.equal(audio.currentTime, 0);
	});

	it('mutes, restores sound, and sets volume without loading audio', () => {
		const { root, audio, input } = setup();
		const mute = root.querySelector<HTMLButtonElement>('[data-mute]')!;
		mute.click(); assert.equal(audio.muted, true);
		mute.click(); assert.equal(audio.muted, false);
		input('[data-volume]', '0.4', 'input'); assert.equal(audio.volume, 0.4);
		assert.equal(audio.getAttribute('src'), null);
	});

	it('keeps 1.15× selected through pause and replay', async () => {
		const { audio, play, input, end } = setup();
		input('[data-speed]', '1.15');
		play.click(); await Promise.resolve();
		play.click();
		play.click(); await Promise.resolve();
		assert.equal(audio.playbackRate, 1.15);
		end();
		play.click(); await Promise.resolve();
		assert.equal(audio.playbackRate, 1.15);
		assert.equal(audio.currentTime, 0);
	});
});
