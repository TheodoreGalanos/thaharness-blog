// ABOUTME: Tests the Prime run flow data used by the hosted RL article diagram.
// ABOUTME: Verifies the top-down chain preserves the article sequence.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { primeRunFlowSteps } from '../src/data/prime-run-flow.ts';

describe('prime-run-flow', () => {
	it('keeps the hosted run chain in article order', () => {
		assert.deepEqual(primeRunFlowSteps.map((step) => step.label), [
			'aec-bench task suite',
			'Prime environment',
			'hosted RL run',
			'adapter deployment',
			'base-vs-adapter eval',
			'imported aec-bench traces',
		]);
	});

	it('uses stable unique keys for every step', () => {
		const keys = primeRunFlowSteps.map((step) => step.key);
		assert.equal(new Set(keys).size, keys.length);
	});

	it('marks the verifier-linked steps for visual emphasis', () => {
		assert.deepEqual(
			primeRunFlowSteps
				.filter((step) => step.emphasis)
				.map((step) => step.key),
			['prime-environment', 'imported-traces'],
		);
	});
});
