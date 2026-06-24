// ABOUTME: Tests task-world example figure data used by the meta-harness article.
// ABOUTME: Verifies the article figures preserve the engineering failure cases.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
	bearingCapacityFigure,
	missingWalkingSpeedFigure,
} from '../src/data/task-world-figures.ts';

describe('task-world-figures', () => {
	it('keeps the bearing-capacity example as a convention failure', () => {
		assert.equal(bearingCapacityFigure.inputs.length, 8);
		assert.deepEqual(
			bearingCapacityFigure.factors.map((factor) => factor.name),
			['Nc', 'Nq', 'Ngamma'],
		);
		assert.equal(bearingCapacityFigure.remembered.answer, '910 kPa');
		assert.equal(bearingCapacityFigure.expected.answer, '1144 kPa');
		assert.deepEqual(
			bearingCapacityFigure.ledger.map((row) => row.result),
			['pass', 'pass', 'fail'],
		);
	});

	it('keeps the pedestrian-clearance example as a missing-input failure', () => {
		assert.equal(missingWalkingSpeedFigure.distance, '32.77 m');
		assert.equal(missingWalkingSpeedFigure.missingInput, 'walking speed');
		assert.equal(missingWalkingSpeedFigure.expectedSpeed, '0.80 m/s');
		assert.equal(missingWalkingSpeedFigure.expectedAnswer, 41);
		assert.deepEqual(
			missingWalkingSpeedFigure.runs.map((run) => run.answer),
			[28, 31, 31],
		);
		assert.equal(new Set(missingWalkingSpeedFigure.runs.map((run) => run.speed)).size, 3);
	});
});
