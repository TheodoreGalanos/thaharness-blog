// ABOUTME: Data for the aec-bench and Prime Lab swimlane coupling diagram.
// ABOUTME: Encodes workflow order, lane ownership, and handoff points.

export type LabCouplingLane = 'aec-bench' | 'prime-lab';

export interface LabCouplingStep {
	key: string;
	kicker: string;
	label: string;
	detail: string;
	lane: LabCouplingLane;
	handoff?: boolean;
}

export const labCouplingFlowSteps: LabCouplingStep[] = [
	{
		key: 'write-task',
		kicker: '01 / define',
		label: 'write the task',
		detail: 'Capture the work, files, prompt, and output contract as a benchmark instance.',
		lane: 'aec-bench',
	},
	{
		key: 'write-verifier',
		kicker: '02 / check',
		label: 'write the verifier',
		detail: 'Turn success into an executable check rather than a prose judgement.',
		lane: 'aec-bench',
	},
	{
		key: 'export-environment',
		kicker: '03 / handoff',
		label: 'export the environment',
		detail: 'Package the task and verifier as a trainable Verifiers environment.',
		lane: 'aec-bench',
		handoff: true,
	},
	{
		key: 'train-adapter',
		kicker: '04 / train',
		label: 'train the adapter',
		detail: 'Run hosted rollouts and training while the task reward stays attached.',
		lane: 'prime-lab',
	},
	{
		key: 'evaluate-adapter',
		kicker: '05 / compare',
		label: 'evaluate the adapter',
		detail: 'Compare adapter behaviour against the base model on held-out tasks.',
		lane: 'prime-lab',
	},
	{
		key: 'inspect-traces',
		kicker: '06 / return',
		label: 'inspect the traces',
		detail: 'Bring samples back into the aec-bench ledger for local diagnosis.',
		lane: 'aec-bench',
		handoff: true,
	},
];
