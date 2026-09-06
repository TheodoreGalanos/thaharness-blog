// ABOUTME: Evidence snapshot for the first benchmark-valid Prime ACP pump-world run.
// ABOUTME: Keeps the article figure aligned with the canonical smoke-05 run package.

export type PrimeWorldEventStatus = 'applied' | 'rejected' | 'world' | 'cutoff';

export interface PrimeWorldEvent {
	time: string;
	hour: number;
	status: PrimeWorldEventStatus;
	label: string;
	detail: string;
}

export interface PrimeServiceWindow {
	startHour: number;
	endHour: number;
	requiredScu: number;
	servedScu: number;
}

export const primeWorldTrajectory = {
	trialId: '2026-08-07-smoke-05',
	primeVersion: '0.7.0',
	model: 'Claude Sonnet 4.6',
	maxHour: 24,
	timeTicks: [
		{ hour: 0, label: 'D1 06:00' },
		{ hour: 8, label: '14:00' },
		{ hour: 11, label: '17:00' },
		{ hour: 12, label: '18:00' },
		{ hour: 20, label: 'D2 02:00' },
		{ hour: 24, label: '06:00' },
	],
	serviceWindows: [
		{ startHour: 0, endHour: 12, requiredScu: 1, servedScu: 1 },
		{ startHour: 12, endHour: 20, requiredScu: 2, servedScu: 2 },
		{ startHour: 20, endHour: 24, requiredScu: 1, servedScu: 1 },
	] satisfies PrimeServiceWindow[],
	events: [
		{
			time: 'D1 06:00',
			hour: 0,
			status: 'applied',
			label: 'Pump A verification started',
			detail: 'This matched the first major choice in the reference controller.',
		},
		{
			time: 'D1 06:00',
			hour: 0,
			status: 'rejected',
			label: 'Pump B clearance rejected',
			detail: 'The shared work lane was already occupied.',
		},
		{
			time: 'D1 14:00',
			hour: 8,
			status: 'world',
			label: 'Pump A evidence accepted',
			detail: 'The restriction still needed a host-owned Operations review.',
		},
		{
			time: 'D1 14:00',
			hour: 8,
			status: 'rejected',
			label: 'Two invalid follow-ups rejected',
			detail: 'Prime confused evidence types, then tried to resume completed work.',
		},
		{
			time: 'D1 17:00',
			hour: 11,
			status: 'applied',
			label: 'Work order closed administratively',
			detail: 'The world correctly retained the operational restriction.',
		},
		{
			time: 'D1 18:00',
			hour: 12,
			status: 'applied',
			label: 'Pumps C and A assigned',
			detail: 'Service met the two-SCU peak with no accumulated shortfall.',
		},
		{
			time: 'D2 02:00',
			hour: 20,
			status: 'world',
			label: 'Pump C inspection became due',
			detail: 'Extended duty generated a new collateral-inspection liability.',
		},
		{
			time: 'D2 06:00',
			hour: 24,
			status: 'applied',
			label: 'Pump B clearance started',
			detail: 'Prime made one more valid transition before the host cutoff.',
		},
		{
			time: '600 s wall time',
			hour: 24,
			status: 'cutoff',
			label: 'Host cancelled the active turn',
			detail: 'The next Pump C request had not reached the actor proxy.',
		},
	] satisfies PrimeWorldEvent[],
	metrics: {
		actionAttempts: 13,
		appliedTransitions: 10,
		rejectedActions: 3,
		replayedTransitions: 10,
		staleDecisions: 0,
		duplicateRequestIds: 0,
		requiredCapacitySeconds: 115_200,
		servedCapacitySeconds: 115_200,
		unservedCapacitySeconds: 0,
		completeJourneyPassedGates: 9,
		completeJourneyGateCount: 10,
		failedGate: 'terminal stewardship',
		modelCalls: 24,
		totalTokens: 439_807,
		costUsd: 1.2377754,
	},
} as const;

export type PrimeWorldTrajectoryData = typeof primeWorldTrajectory;
