// ABOUTME: Tests the meta-harness diagram data used by the task-world article.
// ABOUTME: Verifies the composition flow and certificate stack stay reviewable.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
	metaHarnessCertificateStack,
	metaHarnessFlowSteps,
} from '../src/data/meta-harness-diagrams.ts';

describe('meta-harness-diagrams', () => {
	it('keeps the composition loop in article order', () => {
		assert.deepEqual(metaHarnessFlowSteps.map((step) => step.label), [
			'describe the problem space',
			'derive the task-world profile',
			'plan world operations',
			'materialise comparison recipe',
			'review and govern',
			'run or import evidence',
			'record evidence and repair',
		]);
	});

	it('uses stable unique keys for flow rendering', () => {
		const keys = metaHarnessFlowSteps.map((step) => step.key);
		assert.equal(new Set(keys).size, keys.length);
	});

	it('marks the world, review, and repair stages for emphasis', () => {
		assert.deepEqual(
			metaHarnessFlowSteps
				.filter((step) => step.emphasis)
				.map((step) => step.key),
			['world-profile', 'review-govern', 'ledger'],
		);
	});

	it('wraps the ordinary task run inside the meta-harness certificate', () => {
		assert.deepEqual(
			metaHarnessCertificateStack.meta.map((section) => section.key),
			['world', 'assembly', 'permission'],
		);
		assert.equal(metaHarnessCertificateStack.taskRun.key, 'ordinary-run');
		assert.deepEqual(
			metaHarnessCertificateStack.evidence.map((section) => section.key),
			['result', 'memory'],
		);
		assert.equal(metaHarnessCertificateStack.taskRun.items.length, 4);
	});
});
