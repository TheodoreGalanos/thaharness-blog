// ABOUTME: Data for the trainable AEC-Bench loop diagram used in the Prime Lab article.
// ABOUTME: Keeps flow labels, row grouping, and rendering keys in one typed place.

export interface TrainableLoopStep {
	key: string;
	kicker: string;
	label: string;
	detail: string;
}

export interface TrainableLoopRow {
	key: string;
	direction: 'forward' | 'reverse';
	steps: TrainableLoopStep[];
}

export const trainableLoopSteps: TrainableLoopStep[] = [
	{
		key: 'real-task',
		kicker: '01 / source',
		label: 'real task',
		detail: 'The work starts as an engineering task with files, constraints, and a required output.',
	},
	{
		key: 'benchmark-instance',
		kicker: '02 / package',
		label: 'benchmark instance',
		detail: 'The task becomes a repeatable benchmark case with a prompt, workspace, and contract.',
	},
	{
		key: 'verifier',
		kicker: '03 / truth',
		label: 'verifier',
		detail: 'The task-local check decides whether the submitted artifact satisfies the contract.',
	},
	{
		key: 'rl-environment',
		kicker: '04 / train',
		label: 'RL environment',
		detail: 'The benchmark is exposed as a Verifiers environment with reward tied to the same check.',
	},
	{
		key: 'adapter',
		kicker: '05 / policy',
		label: 'adapter',
		detail: 'Training produces a policy adapter that should complete more of the workflow.',
	},
	{
		key: 'held-out-eval',
		kicker: '06 / check',
		label: 'held-out eval',
		detail: 'The adapter is compared against the base model on tasks outside the training slice.',
	},
	{
		key: 'trace-analysis',
		kicker: '07 / inspect',
		label: 'trace analysis',
		detail: 'Eval samples return to the AEC-Bench ledger for local inspection and diagnosis.',
	},
];

export const trainableLoopRows: TrainableLoopRow[] = [
	{
		key: 'definition',
		direction: 'forward',
		steps: trainableLoopSteps.slice(0, 3),
	},
	{
		key: 'training',
		direction: 'reverse',
		steps: trainableLoopSteps.slice(3, 6),
	},
	{
		key: 'inspection',
		direction: 'forward',
		steps: trainableLoopSteps.slice(6, 7),
	},
];
