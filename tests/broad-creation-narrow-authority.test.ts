// ABOUTME: Tests the published Broad Creation, Narrow Authority article.
// ABOUTME: Keeps its metadata, argument structure, and internal links publication-ready.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const article = readFileSync(
	new URL('../src/content/blog/broad-creation-narrow-authority.mdx', import.meta.url),
	'utf8',
);

describe('Broad Creation, Narrow Authority article', () => {
	it('uses the blog content schema and is ready to publish', () => {
		assert.match(article, /^title: "Broad Creation, Narrow Authority"$/m);
		assert.match(article, /^author: "Theodoros Galanos"$/m);
		assert.match(article, /^category: "Engineering"$/m);
		assert.match(article, /^draft: false$/m);
		assert.match(article, /^pubDate: 2026-07-24$/m);
		assert.match(article, /^updatedDate: 2026-07-24$/m);
		assert.match(article, /^featured: false$/m);
	});

	it('keeps the current capability framing without its superseded paragraph', () => {
		assert.equal(
			article.match(/The term originally described/g)?.length,
			1,
			'the revised capability paragraph should replace the earlier version',
		);
		assert.match(
			article,
			/it obscures how capable current models and their harnesses have become/,
		);
	});

	it('preserves the complete article structure and thesis', () => {
		const expectedHeadings = [
			'The gate is in the wrong place',
			'The people closest to the work',
			'The stepping stones cannot be approved in advance',
			'Cheap code, expensive ownership',
			'Govern promotion, not creation',
			'Put governance in the platform',
			'Verification everywhere, permission at the boundary',
			'An organisation that can discover',
		];

		for (const heading of expectedHeadings) {
			assert.match(article, new RegExp(`^## ${heading}$`, 'm'));
		}

		assert.match(
			article,
			/> Open-endedness belongs in discovery\. Objectives and assurance belong in operation\./,
		);
		assert.match(
			article,
			/Everyone may create\. Nobody may silently create an organisational dependency\./,
		);
	});

	it('uses internal routes for existing Harness articles', () => {
		assert.match(article, /\]\(\/blog\/mediation-not-intermediation\/\)/);
		assert.match(article, /\]\(\/blog\/fluent-but-unsafe\/\)/);
		assert.match(
			article,
			/\]\(\/blog\/where-capability-actually-lives-in-agentic-engineering\/\)/,
		);
		assert.doesNotMatch(article, /https:\/\/theharness\.blog\/blog\//);
	});

	it('places the promotion gate summary between the thesis and the first section', () => {
		assert.match(
			article,
			/^import PromotionGateDiagram from '\.\.\/\.\.\/components\/charts\/PromotionGateDiagram\.astro';$/m,
		);

		const thesisIndex = article.indexOf(
			'In practice, that means allowing broad creation while keeping authority narrow',
		);
		const figureIndex = article.indexOf('<PromotionGateDiagram />');
		const firstSectionIndex = article.indexOf('## The gate is in the wrong place');

		assert.ok(thesisIndex >= 0, 'opening thesis should remain present');
		assert.ok(figureIndex > thesisIndex, 'summary figure should follow the thesis');
		assert.ok(
			firstSectionIndex > figureIndex,
			'summary figure should introduce the article before its first section',
		);
	});

	it('states what a creation gate removes from organisational search', () => {
		assert.match(
			article,
			/A gate on creation does not make that final gate stricter\. It removes the search space above it:/,
		);
		assert.match(
			article,
			/experiments never run, stepping stones never get built, and abandoned work never becomes someone else’s starting point\./,
		);
	});

	it('places each supporting figure beside the argument it clarifies', () => {
		assert.match(
			article,
			/^import CreationAuthorityMatrix from '\.\.\/\.\.\/components\/charts\/CreationAuthorityMatrix\.astro';$/m,
		);
		assert.match(
			article,
			/^import AuthorityLadderDiagram from '\.\.\/\.\.\/components\/charts\/AuthorityLadderDiagram\.astro';$/m,
		);
		assert.match(
			article,
			/^import VerificationBoundaryDiagram from '\.\.\/\.\.\/components\/charts\/VerificationBoundaryDiagram\.astro';$/m,
		);

		const creationSection = article.indexOf('## The gate is in the wrong place');
		const creationFigure = article.indexOf('<CreationAuthorityMatrix />');
		const peopleSection = article.indexOf('## The people closest to the work');
		assert.ok(creationFigure > creationSection);
		assert.ok(peopleSection > creationFigure);

		const promotionSection = article.indexOf('## Govern promotion, not creation');
		const ladderFigure = article.indexOf('<AuthorityLadderDiagram />');
		const platformSection = article.indexOf('## Put governance in the platform');
		assert.ok(ladderFigure > promotionSection);
		assert.ok(platformSection > ladderFigure);

		const verificationSection = article.indexOf(
			'## Verification everywhere, permission at the boundary',
		);
		const verificationFigure = article.indexOf('<VerificationBoundaryDiagram />');
		const conclusionSection = article.indexOf('## An organisation that can discover');
		assert.ok(verificationFigure > verificationSection);
		assert.ok(conclusionSection > verificationFigure);
	});
});
