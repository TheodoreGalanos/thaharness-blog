// ABOUTME: Shared hover-panel helpers for interactive chart components.
// ABOUTME: Keeps repeated text-panel DOM wiring out of individual chart scripts.

export interface ChartHoverPanel {
	set(kicker: string, body: string): void;
	reset(): void;
	bind(target: Element, show: () => void, hide?: () => void): void;
}

interface BoundInteraction {
	target: Element;
	show: () => void;
	hide: () => void;
}

export function createChartHoverPanel(
	root: HTMLElement,
	kickerSelector: string,
	bodySelector: string,
): ChartHoverPanel | null {
	const kickerEl = root.querySelector<HTMLElement>(kickerSelector);
	const bodyEl = root.querySelector<HTMLElement>(bodySelector);
	if (!kickerEl || !bodyEl) return null;
	const bindings = new Map<Element, Omit<BoundInteraction, 'target'>>();

	function findBinding(event: Event): BoundInteraction | null {
		for (const eventTarget of event.composedPath()) {
			if (eventTarget === root) break;
			const target = eventTarget as Element;
			const binding = bindings.get(target);
			if (binding) return { target, ...binding };
		}
		return null;
	}

	function movedWithinTarget(event: Event, target: Element): boolean {
		const relatedTarget = (event as MouseEvent | FocusEvent).relatedTarget;
		const NodeConstructor = root.ownerDocument.defaultView?.Node;
		return Boolean(
			NodeConstructor &&
				relatedTarget instanceof NodeConstructor &&
				target.contains(relatedTarget),
		);
	}

	function showBoundTarget(event: Event): void {
		const binding = findBinding(event);
		if (!binding || movedWithinTarget(event, binding.target)) return;
		binding.show();
	}

	function hideBoundTarget(event: Event): void {
		const binding = findBinding(event);
		if (!binding || movedWithinTarget(event, binding.target)) return;
		binding.hide();
	}

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
			bindings.set(target, { show, hide });
		},
	};

	root.addEventListener('mouseover', showBoundTarget);
	root.addEventListener('mouseout', hideBoundTarget);
	root.addEventListener('focusin', showBoundTarget);
	root.addEventListener('focusout', hideBoundTarget);

	return panel;
}
