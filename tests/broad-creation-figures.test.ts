// ABOUTME: Tests the supporting diagrams for the Broad Creation, Narrow Authority article.
// ABOUTME: Protects their argument, accessibility, direct labelling, and responsive contracts.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
	authorityLadderFigure,
	creationAuthorityFigure,
	verificationBoundaryFigure,
} from '../src/data/broad-creation-narrow-authority-figures.ts';

const readComponent = (name: string) =>
	readFileSync(new URL(`../src/components/charts/${name}.astro`, import.meta.url), 'utf8');

describe('Broad Creation supporting figures', () => {
	it('separates creation method from consequential authority', () => {
		assert.deepEqual(
			creationAuthorityFigure.examples.map((example) => example.authority),
			['high', 'high', 'low', 'low'],
		);
		assert.deepEqual(
			creationAuthorityFigure.examples.map((example) => example.method),
			['human', 'ai', 'human', 'ai'],
		);
		assert.match(creationAuthorityFigure.caption, /Risk runs vertically/);
	});

	it('makes every increase in authority carry a matching obligation', () => {
		assert.equal(authorityLadderFigure.rungs.length, 5);
		for (const rung of authorityLadderFigure.rungs) {
			assert.ok(rung.gain.length > 0);
			assert.ok(rung.obligation.length > 0);
		}
		assert.equal(authorityLadderFigure.rungs.at(-1)?.id, 'shared-reliance');
	});

	it('keeps verification pervasive and human permission selective', () => {
		assert.deepEqual(
			verificationBoundaryFigure.stages.map((stage) => stage.label),
			['Create', 'Iterate', 'Permission', 'Operate'],
		);
		assert.deepEqual(verificationBoundaryFigure.humanJudgements, [
			'Purpose',
			'Unusual risk',
			'Contested trade-offs',
		]);
		assert.equal(verificationBoundaryFigure.verificationChecks.length, 5);
	});

	it('gives every diagram a single accessible text alternative and mobile layout', () => {
		for (const name of [
			'CreationAuthorityMatrix',
			'AuthorityLadderDiagram',
			'VerificationBoundaryDiagram',
		]) {
			const component = readComponent(name);
			assert.match(component, /<figure/);
			assert.match(component, /class="visually-hidden"/);
			assert.match(component, /aria-hidden="true"/);
			assert.match(component, /<figcaption/);
			assert.match(component, /@container \(max-width: 34rem\)/);
			assert.doesNotMatch(component, /role="img"/);
		}
	});
});
