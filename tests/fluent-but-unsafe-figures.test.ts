// ABOUTME: Tests the empirical figure data used by Fluent, But Unsafe.
// ABOUTME: Binds coverage, contamination, and reliability claims to their source records.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	coverageAutopsy,
	fluentUnsafeFigureProvenance,
	leakTrajectoryMarkers,
	leakTrajectorySeries,
	manufacturedCeilingRows,
	reviewTaskAnatomy,
	staticReviewProbeMap,
} from '../src/data/fluent-but-unsafe-figures.ts';

describe('fluent-but-unsafe figures', () => {
	it('preserves the coverage dashboard and autopsy counts', () => {
		assert.deepEqual(
			coverageAutopsy.dashboardTiles.map((tile) => tile.value),
			['19/19', '152/152', '150', '1.0'],
		);
		assert.equal(coverageAutopsy.autopsyFindings[0].stat, '143 / 150');
	});

	it('preserves the three manufactured ceiling examples', () => {
		assert.deepEqual(
			manufacturedCeilingRows.map((row) => [row.before, row.after]),
			[
				['0.79', '1.0'],
				['0.89', '1.0'],
				['0.76', '1.0'],
			],
		);
	});

	it('preserves the contaminated trajectory', () => {
		assert.deepEqual(
			leakTrajectorySeries[0].points.map((point) => point.value),
			[0.78, 0.7, 0.56, 0.81, 0.85, 1],
		);
	});

	it('keeps crowded trajectory annotations to two display lines', () => {
		assert.deepEqual(
			leakTrajectoryMarkers.map((marker) => [
				marker.cycle,
				marker.labelLines,
				marker.labelAnchor,
				marker.labelDx,
			]),
			[
				[2, ['evidence rules', 'tightened'], 'start', 12],
				[4, ['review-boundary', 'rules added'], 'end', -12],
				[5, ['one-defect boundary', 'rule added'], 'end', -12],
				[6, undefined, undefined, undefined],
			],
		);

		const component = readFileSync(
			new URL('../src/components/charts/LineTrajectory.astro', import.meta.url),
			'utf8',
		);
		assert.match(component, /displayLabel: m\.labelLines\?\.join\('\\n'\) \?\? m\.label/);
		assert.match(component, /anchor: m\.labelAnchor/);
		assert.match(component, /lineAnchor: 'bottom'/);
	});

	it('shows all eight hidden review-material versions inside the task anatomy figure', () => {
		assert.deepEqual(
			reviewTaskAnatomy.variants.map((variant) => [variant.kind, variant.label]),
			[
				['clean', 'Clean'],
				['changed', 'Missing level'],
				['changed', 'Stale revision'],
				['changed', 'Datum conflict'],
				['changed', 'Copied scenario'],
				['changed', 'Critical comment open'],
				['changed', 'Minor comment carried'],
				['changed', 'Criterion failure masked'],
			],
		);
		assert.equal(
			reviewTaskAnatomy.variantNote,
			'The model sees the documents, but not which version it received.',
		);
	});

	it('preserves all twenty-one static-review runs without inventing failure labels', () => {
		const breadth = staticReviewProbeMap.sections.find((section) => section.key === 'breadth');
		const reliability = staticReviewProbeMap.sections.find((section) => section.key === 'reliability');

		assert.ok(breadth);
		assert.ok(reliability);
		assert.equal(staticReviewProbeMap.sections.length, 2);

		const breadthPoints = breadth.rows.flatMap((row) => row.points);
		const reliabilityPoints = reliability.rows.flatMap((row) => row.points);
		const allPoints = [...breadthPoints, ...reliabilityPoints];

		assert.equal(breadthPoints.length, 11);
		assert.equal(reliabilityPoints.length, 10);
		assert.equal(allPoints.length, 21);
		assert.deepEqual(
			breadth.rows.map((row) => [row.key, row.points.map((point) => point.reward)]),
			[
				['LH-01', [0.86, 1]],
				['LH-02', [0.78]],
				['LH-03', [0.77]],
				['LH-04', [0.88]],
				['LH-05', [0.97]],
				['LH-06', [0.76]],
				['LH-07', [0.99]],
				['LH-08', [0.95, 0.72, 0.72]],
			],
		);
		assert.deepEqual(
			allPoints.reduce<Record<string, number>>((counts, point) => {
				counts[point.model] = (counts[point.model] ?? 0) + 1;
				return counts;
			}, {}),
			{ small: 18, strong: 3 },
		);
		assert.deepEqual(
			reliability.rows.map((row) => row.points.map((point) => point.reward)),
			[
				[0.63, 0.59, 1, 0.94, 0.95],
				[0.78, 0.83, 0.86, 0.92, 0.83],
			],
		);
		assert.deepEqual(
			reliabilityPoints.filter((point) => point.emphasis === 'phantom').map((point) => point.reward),
			[0.63, 0.59],
		);
		assert.equal(
			Math.round(
				(reliability.rows[1].points.reduce((sum, point) => sum + point.reward, 0) /
					reliability.rows[1].points.length) *
					1000,
			) / 1000,
			0.844,
		);
		assert.equal(
			Math.round(
				(reliability.rows[0].points.reduce((sum, point) => sum + point.reward, 0) /
					reliability.rows[0].points.length) *
					1000,
			) / 1000,
			0.822,
		);
		assert.deepEqual(
			reliability.rows.map((row) => row.points.filter((point) => point.reward === 1).length),
			[1, 0],
		);
		assert.ok(
			reliabilityPoints
				.filter((point) => point.finding === 'No individual failure label recorded')
				.every((point) => point.annotation === undefined && point.emphasis === undefined),
		);
	});

	it('uses the complete run map and plain-language accounting in the article', () => {
		const article = readFileSync(
			new URL('../src/content/blog/fluent-but-unsafe.mdx', import.meta.url),
			'utf8',
		);

		assert.match(article, /import StaticReviewProbeMap/);
		assert.doesNotMatch(article, /ReliabilityDotStrip/);
		assert.match(article, /I ran the models twenty-one times/);
		assert.doesNotMatch(article, /\bcampaign\b/i);
		assert.doesNotMatch(article, /\bhonest(?:ly)?\b/i);
		assert.doesNotMatch(article, /earlier reasoning|raw conversation history/);
		assert.match(article, /without labels or expected answers/);
		assert.match(article, /^### Defect localisation$/m);
		assert.match(article, /^### Decision consistency$/m);
		assert.match(article, /^### False-positive control$/m);
	});

	it('records the exact source documents and git blobs', () => {
		assert.deepEqual(fluentUnsafeFigureProvenance, {
			courseCorrectionPath: 'docs/task-world-opportunities/long-horizon-course-correction.md',
			courseCorrectionGitBlob: '1d5a8889e39e1ca144e5a0fbe6acc84f7d310029',
			probePlanPath:
				'docs/task-world-opportunities/real-world-grounding/ssc01-review-first-conversion-plan.md',
			probePlanGitBlob: '5428bcc69434f6f27099d44ac9a6041ebc7e79eb',
			probeRunRoot: 'artefacts/local-runs/ssc01-evidence-v2/model-runs',
		});
	});
});
