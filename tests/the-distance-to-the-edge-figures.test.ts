// ABOUTME: Tests the conceptual figures for The Distance to the Edge.
// ABOUTME: Protects their axis, phase-transition, placement, and accessibility contracts.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const article = readFileSync(
	new URL('../src/content/blog/the-distance-to-the-edge.mdx', import.meta.url),
	'utf8',
);
const component = readFileSync(
	new URL('../src/components/charts/LearningThresholdCurve.astro', import.meta.url),
	'utf8',
);
const distanceAxesComponent = readFileSync(
	new URL('../src/components/charts/DistanceAxesDiagram.astro', import.meta.url),
	'utf8',
);

describe('The Distance to the Edge publication contract', () => {
	it('is dated and visible in production', () => {
		assert.match(article, /^draft: false$/m);
		assert.match(article, /^pubDate: 2026-08-14$/m);
		assert.match(article, /^updatedDate: 2026-08-14$/m);
	});

	it('retains the supporting governance and authority references', () => {
		assert.match(
			article,
			/\[governance expressed in the systems where work happens\]\(\/blog\/mediation-not-intermediation\/\)/,
		);
		assert.match(
			article,
			/\[discovering, testing, promoting, and learning from them\]\(\/blog\/broad-creation-narrow-authority\/\)/,
		);
	});
});

describe('The Distance to the Edge axis figure', () => {
	it('ends the axis section with the two-dimensional comparison', () => {
		assert.match(article, /import DistanceAxesDiagram/);
		const figurePosition = article.indexOf('<DistanceAxesDiagram />');
		assert.ok(figurePosition > article.indexOf('## Distance Along Which Axis?'));
		assert.ok(figurePosition < article.indexOf('## The Edge Is a Different Regime'));
	});

	it('keeps scale separate from learning practice', () => {
		assert.match(distanceAxesComponent, /Model-building scale and resources/);
		assert.match(distanceAxesComponent, /Frontier-learning practice/);
		assert.match(distanceAxesComponent, /Applied organisation/);
		assert.match(distanceAxesComponent, /Conventional adopter/);
		assert.match(distanceAxesComponent, /Frontier AI lab/);
		assert.match(distanceAxesComponent, /Large difference in resources/);
		assert.match(distanceAxesComponent, /Smaller difference in learning practice/);
	});

	it('labels the generic positions without implying measured values', () => {
		assert.match(distanceAxesComponent, /Positions are relative and are not measured values/);
		assert.match(distanceAxesComponent, /aria-labelledby=\{titleId\}/);
		assert.match(distanceAxesComponent, /aria-describedby=\{descriptionId\}/);
		assert.match(distanceAxesComponent, /class="dad-canvas" aria-hidden="true"/);
		assert.match(distanceAxesComponent, /<figcaption class="dad-caption">/);
		assert.match(distanceAxesComponent, /@container \(max-width: 34rem\)/);
		assert.doesNotMatch(distanceAxesComponent, /role="img"/);
	});
});

describe('The Distance to the Edge threshold figure', () => {
	it('places the conceptual curve before the platform-ceiling explanation', () => {
		assert.match(article, /import LearningThresholdCurve/);
		assert.ok(
			article.indexOf('<LearningThresholdCurve />') < article.indexOf('### The platform ceiling'),
			'the figure should preview the three nonlinear effects before the threshold subsection',
		);
	});

	it('shows the regime change and the conditions that make it possible', () => {
		for (const condition of [
			'direct access',
			'real domain problems',
			'permission to experiment',
			'credible evaluation',
			'reusable infrastructure and memory',
		]) {
			assert.match(component, new RegExp(condition, 'i'));
		}
		assert.match(component, /Small number of/);
		assert.match(component, /Different learning regime/);
		assert.match(component, /Nonlinearity allows distance to compound/);
	});

	it('states that the curve is conceptual and remains accessible on narrow screens', () => {
		assert.match(component, /does not represent a measured mathematical function/);
		assert.match(component, /aria-labelledby=\{titleId\}/);
		assert.match(component, /aria-describedby=\{descriptionId\}/);
		assert.match(component, /class="ltc-canvas" aria-hidden="true"/);
		assert.match(component, /<figcaption class="ltc-caption">/);
		assert.match(component, /@container \(max-width: 34rem\)/);
		assert.doesNotMatch(component, /role="img"/);
	});
});
