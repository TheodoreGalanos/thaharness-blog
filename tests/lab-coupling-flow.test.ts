// ABOUTME: Tests the swimlane flow data for the aec-bench and Prime Lab coupling diagram.
// ABOUTME: Verifies sequence order, lane ownership, and cross-system handoffs.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { labCouplingFlowSteps } from '../src/data/lab-coupling-flow.ts';

describe('lab-coupling-flow', () => {
	it('keeps the article workflow in order', () => {
		assert.deepEqual(labCouplingFlowSteps.map((step) => step.label), [
			'write the task',
			'write the verifier',
			'export the environment',
			'train the adapter',
			'evaluate the adapter',
			'inspect the traces',
		]);
	});

	it('assigns each step to the system that owns it', () => {
		assert.deepEqual(labCouplingFlowSteps.map((step) => step.lane), [
			'aec-bench',
			'aec-bench',
			'aec-bench',
			'prime-lab',
			'prime-lab',
			'aec-bench',
		]);
	});

	it('marks the two cross-system handoffs', () => {
		assert.deepEqual(
			labCouplingFlowSteps
				.filter((step) => step.handoff)
				.map((step) => step.key),
			['export-environment', 'inspect-traces'],
		);
	});
});
