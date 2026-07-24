// ABOUTME: Tests the opening comparison between creation and promotion gate placement.
// ABOUTME: Keeps identical operating authority distinct from the search space each architecture preserves.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { promotionGateFigure } from '../src/data/broad-creation-narrow-authority-figures.ts';

const component = readFileSync(
	new URL('../src/components/charts/PromotionGateDiagram.astro', import.meta.url),
	'utf8',
);

describe('Two gate placement summary figure', () => {
	it('compares identical operating authority with different search costs', () => {
		assert.deepEqual(
			promotionGateFigure.placements.map((placement) => placement.label),
			['Gate on creation', 'Gate on promotion'],
		);
		assert.equal(
			new Set(promotionGateFigure.placements.map((placement) => placement.outcome)).size,
			1,
			'both architectures should end with the same operating outcome',
		);
		assert.equal(promotionGateFigure.lostIdeas.length, 9);
		assert.equal(promotionGateFigure.approvedExperiments.length, 2);
		assert.ok(
			promotionGateFigure.experiments.length >
				promotionGateFigure.approvedExperiments.length,
			'the promotion-gated architecture should preserve a visibly broader search space',
		);
		assert.match(promotionGateFigure.caption, /same narrow trickle into operation/i);
	});

	it('makes promotion evidence and reusable stepping stones explicit', () => {
		assert.deepEqual(promotionGateFigure.promotionCriteria, [
			'Evidence',
			'Named owner',
			'Scoped permissions',
			'Recovery path',
		]);
		assert.ok(
			promotionGateFigure.experiments.some((experiment) => experiment.tone === 'linked'),
			'the broad exploration panel should contain reusable linked experiments',
		);
		assert.match(component, /promotionGateFigure\.placements\.map/);
		assert.match(component, /--pgd-aperture-width/);
	});

	it('provides a labelled figure, text alternative, and narrow-screen layout', () => {
		assert.match(component, /<figure class="pgd" aria-labelledby=\{titleId\}/);
		assert.match(component, /class="pgd-description visually-hidden"/);
		assert.match(component, /<div class="pgd-canvas" aria-hidden="true">/);
		assert.doesNotMatch(component, /role="img"/);
		assert.match(component, /<figcaption class="pgd-caption">/);
		assert.match(component, /@container \(max-width: 34rem\)/);
	});
});
