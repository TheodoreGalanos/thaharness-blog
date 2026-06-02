// ABOUTME: Shared hover-panel helpers for interactive chart components.
// ABOUTME: Keeps repeated text-panel DOM wiring out of individual chart scripts.

export interface ChartHoverPanel {
	set(kicker: string, body: string): void;
	reset(): void;
	bind(target: Element, show: () => void, hide?: () => void): void;
}

export function createChartHoverPanel(
	root: HTMLElement,
	kickerSelector: string,
	bodySelector: string,
): ChartHoverPanel | null {
	const kickerEl = root.querySelector<HTMLElement>(kickerSelector);
	const bodyEl = root.querySelector<HTMLElement>(bodySelector);
	if (!kickerEl || !bodyEl) return null;

	const panel: ChartHoverPanel = {
		set(kicker, body) {
			kickerEl.textContent = kicker;
			bodyEl.textContent = body;
			root.classList.add('is-active');
		},
		reset() {
			root.classList.remove('is-active');
		},
		bind(target, show, hide = panel.reset) {
			target.addEventListener('mouseenter', show);
			target.addEventListener('focus', show);
			target.addEventListener('mouseleave', hide);
			target.addEventListener('blur', hide);
		},
	};

	return panel;
}
