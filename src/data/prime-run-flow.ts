// ABOUTME: Data for the Prime hosted run flow diagram in the trainable aec-bench article.
// ABOUTME: Keeps the top-down chain labels, descriptions, and emphasis markers typed.

export interface PrimeRunFlowStep {
	key: string;
	kicker: string;
	label: string;
	detail: string;
	emphasis?: boolean;
}

export const primeRunFlowSteps: PrimeRunFlowStep[] = [
	{
		key: 'task-suite',
		kicker: '01 / suite',
		label: 'aec-bench task suite',
		detail: 'The benchmark tasks, files, prompts, output contracts, and task-local verifiers.',
	},
	{
		key: 'prime-environment',
		kicker: '02 / env',
		label: 'Prime environment',
		detail: 'The suite is packaged as a Verifiers environment with reward tied to the same checks.',
		emphasis: true,
	},
	{
		key: 'hosted-run',
		kicker: '03 / train',
		label: 'hosted RL run',
		detail: 'Lab handles rollout collection, training steps, checkpoints, and run telemetry.',
	},
	{
		key: 'adapter-deployment',
		kicker: '04 / deploy',
		label: 'adapter deployment',
		detail: 'The trained policy adapter is deployed back onto the base model for comparison.',
	},
	{
		key: 'base-vs-adapter',
		kicker: '05 / compare',
		label: 'base-vs-adapter eval',
		detail: 'The adapter and base model are run through the same held-out evaluation frame.',
	},
	{
		key: 'imported-traces',
		kicker: '06 / ledger',
		label: 'imported aec-bench traces',
		detail: 'Hosted samples return to the aec-bench ledger for local inspection and reporting.',
		emphasis: true,
	},
];
