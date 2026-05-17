// ABOUTME: Tests the trainable-loop flow data used by the editorial diagram.
// ABOUTME: Verifies the meandering layout preserves the prose sequence.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
	trainableLoopRows,
	trainableLoopSteps,
} from '../src/data/trainable-loop-flow.ts';

describe('trainable-loop-flow', () => {
	it('keeps the article flow in the original order', () => {
		assert.deepEqual(trainableLoopSteps.map((step) => step.label), [
			'real task',
			'benchmark instance',
			'verifier',
			'RL environment',
			'adapter',
			'held-out eval',
			'trace analysis',
		]);
	});

	it('splits the flow into compact meandering rows', () => {
		assert.deepEqual(trainableLoopRows.map((row) => row.direction), [
			'forward',
			'reverse',
			'forward',
		]);
		assert.deepEqual(
			trainableLoopRows.map((row) => row.steps.length),
			[3, 3, 1],
		);
		assert.ok(
			trainableLoopRows.every((row) => row.steps.length <= 3),
			'each row should stay short enough for the prose column',
		);
		assert.deepEqual(
			trainableLoopRows.flatMap((row) => row.steps.map((step) => step.key)),
			trainableLoopSteps.map((step) => step.key),
		);
	});

	it('uses stable unique keys for rendering and connectors', () => {
		const keys = trainableLoopSteps.map((step) => step.key);
		assert.equal(new Set(keys).size, keys.length);
	});
});
