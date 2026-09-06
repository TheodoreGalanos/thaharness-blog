// ABOUTME: Controls saved article narration with the browser's native audio engine.
// ABOUTME: Loads audio only on Play and warms the connection on listener intent.

export function formatAudioTime(seconds: number): string {
	const whole = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function initArticleAudio(root: HTMLElement): void {
	const audio = root.querySelector('audio')!;
	const play = root.querySelector<HTMLButtonElement>('[data-play]')!;
	const seek = root.querySelector<HTMLInputElement>('[data-seek]')!;
	const elapsed = root.querySelector<HTMLElement>('[data-elapsed]')!;
	const durationLabel = root.querySelector<HTMLElement>('[data-duration-label]')!;
	const skips = root.querySelectorAll<HTMLButtonElement>('[data-skip]');
	const speed = root.querySelector<HTMLSelectElement>('[data-speed]')!;
	const mute = root.querySelector<HTMLButtonElement>('[data-mute]')!;
	const volume = root.querySelector<HTMLInputElement>('[data-volume]')!;
	const status = root.querySelector<HTMLElement>('[data-status]')!;
	const url = root.dataset.audioUrl!;
	let duration = Number(root.dataset.duration);
	let pending = false;
	let playAttempt = 0;
	let scrubbing = false;
	let warmed = false;

	function warmConnection() {
		if (warmed) return;
		warmed = true;
		const link = root.ownerDocument.createElement('link');
		link.rel = 'preconnect';
		link.href = new URL(url).origin;
		root.ownerDocument.head.append(link);
	}
	root.addEventListener('pointerenter', warmConnection, { once: true });
	root.addEventListener('focusin', warmConnection, { once: true });
	root.addEventListener('pointerdown', warmConnection, { once: true });

	function setState(state: 'ready' | 'loading' | 'playing' | 'paused' | 'ended' | 'error') {
		root.dataset.state = state;
		const action = state === 'loading' || state === 'playing' ? 'Pause'
			: state === 'ended' ? 'Replay' : state === 'error' ? 'Retry' : 'Play';
		play.setAttribute('aria-label', `${action} audio`);
		play.title = `${action} audio`;
		status.textContent = state === 'loading' ? 'Loading audio…'
			: state === 'error' ? 'Audio could not load. Press the play button to retry.' : '';
	}

	function updateTime(position = audio.currentTime) {
		const current = Math.max(0, Math.min(position, duration));
		seek.value = String(current);
		seek.style.setProperty('--audio-progress', `${current / duration * 100}%`);
		elapsed.textContent = formatAudioTime(current);
		durationLabel.textContent = formatAudioTime(Math.round(duration));
		seek.setAttribute('aria-valuetext', `${formatAudioTime(current)} of ${formatAudioTime(Math.round(duration))}`);
	}

	function updateMetadata() {
		const canSeek = audio.readyState >= 1 && Number.isFinite(audio.duration) && audio.duration > 0 && !audio.error;
		if (canSeek) duration = audio.duration;
		seek.max = String(duration);
		seek.disabled = !canSeek;
		for (const button of skips) button.disabled = !canSeek;
		if (!scrubbing) updateTime();
	}

	function applySpeed() {
		const rate = Number(speed.value);
		audio.defaultPlaybackRate = rate;
		audio.playbackRate = rate;
		audio.preservesPitch = true;
	}

	play.addEventListener('click', async () => {
		if (root.dataset.state !== 'error' && (pending || !audio.paused)) {
			pending = false;
			playAttempt++;
			audio.pause();
			setState('paused');
			return;
		}
		const attempt = ++playAttempt;
		pending = true;
		setState('loading');
		// Keep play() in the click handler to retain mobile user activation.
		if (!audio.hasAttribute('src')) audio.src = url;
		else if (audio.error) audio.load();
		if (audio.ended) audio.currentTime = 0;
		applySpeed();
		try {
			await audio.play();
			if (attempt === playAttempt) {
				pending = false;
				if (!audio.paused) setState('playing');
			}
		} catch {
			if (attempt !== playAttempt) return;
			pending = false;
			setState('error');
		}
	});

	audio.addEventListener('play', () => setState(audio.readyState >= 3 ? 'playing' : 'loading'));
	audio.addEventListener('playing', () => { pending = false; setState('playing'); });
	audio.addEventListener('waiting', () => { if (!audio.paused) setState('loading'); });
	audio.addEventListener('pause', () => {
		playAttempt++;
		pending = false;
		if (!audio.error) setState(audio.ended ? 'ended' : 'paused');
	});
	audio.addEventListener('ended', () => { pending = false; updateTime(); setState('ended'); });
	audio.addEventListener('error', () => {
		playAttempt++;
		pending = false;
		updateMetadata();
		setState('error');
	});
	audio.addEventListener('loadedmetadata', updateMetadata);
	audio.addEventListener('durationchange', updateMetadata);
	audio.addEventListener('timeupdate', () => { if (!scrubbing) updateTime(); });

	seek.addEventListener('input', () => { scrubbing = true; updateTime(Number(seek.value)); });
	seek.addEventListener('change', () => {
		if (!seek.disabled) audio.currentTime = Math.max(0, Math.min(Number(seek.value), duration));
		scrubbing = false;
		updateTime();
	});
	for (const button of skips) {
		button.addEventListener('click', () => {
			audio.currentTime = Math.max(0, Math.min(audio.currentTime + Number(button.dataset.skip), duration));
			updateTime();
		});
	}
	speed.addEventListener('change', applySpeed);
	audio.addEventListener('ratechange', () => { speed.value = String(audio.playbackRate); });

	function updateVolume() {
		const silent = audio.muted || audio.volume === 0;
		mute.textContent = silent ? 'Unmute' : 'Mute';
		mute.setAttribute('aria-label', silent ? 'Unmute audio' : 'Mute audio');
		volume.value = String(audio.muted ? 0 : audio.volume);
	}
	mute.addEventListener('click', () => {
		const silent = audio.muted || audio.volume === 0;
		if (audio.volume === 0) audio.volume = 1;
		audio.muted = !silent;
		updateVolume();
	});
	volume.addEventListener('input', () => {
		audio.volume = Number(volume.value);
		audio.muted = audio.volume === 0;
		updateVolume();
	});
	audio.addEventListener('volumechange', updateVolume);
	play.disabled = speed.disabled = mute.disabled = volume.disabled = false;
	setState('ready');
	updateMetadata();
	updateVolume();
}
