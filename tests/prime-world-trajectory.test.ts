// ABOUTME: Tests the evidence snapshot behind the Prime ACP world-run figure.
// ABOUTME: Protects the split evaluation verdict and conserved service measures.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { primeWorldTrajectory } from '../src/data/prime-world-trajectory.ts';

describe('prime-world-trajectory', () => {
	it('preserves the recorded action and replay counts', () => {
		assert.equal(primeWorldTrajectory.metrics.actionAttempts, 13);
		assert.equal(primeWorldTrajectory.metrics.appliedTransitions, 10);
		assert.equal(primeWorldTrajectory.metrics.rejectedActions, 3);
		assert.equal(primeWorldTrajectory.metrics.replayedTransitions, 10);
		assert.equal(primeWorldTrajectory.metrics.staleDecisions, 0);
		assert.equal(primeWorldTrajectory.metrics.duplicateRequestIds, 0);
	});

	it('keeps required and served capacity equal', () => {
		assert.equal(primeWorldTrajectory.metrics.requiredCapacitySeconds, 115_200);
		assert.equal(primeWorldTrajectory.metrics.servedCapacitySeconds, 115_200);
		assert.equal(primeWorldTrajectory.metrics.unservedCapacitySeconds, 0);
		assert.ok(
			primeWorldTrajectory.serviceWindows.every(
				(window) => window.requiredScu === window.servedScu,
			),
		);
	});

	it('keeps the failed score tied to the single unavailable host gate', () => {
		assert.equal(primeWorldTrajectory.metrics.completeJourneyPassedGates, 9);
		assert.equal(primeWorldTrajectory.metrics.completeJourneyGateCount, 10);
		assert.equal(primeWorldTrajectory.metrics.failedGate, 'terminal stewardship');
	});
});
