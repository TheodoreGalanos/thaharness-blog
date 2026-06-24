// ABOUTME: Diagram data for the meta-harness task-world article.
// ABOUTME: Keeps composition-loop and certificate-stack labels separate from Astro components.

export interface MetaHarnessFlowStep {
	key: string;
	kicker: string;
	label: string;
	detail: string;
	emphasis?: boolean;
}

export interface CertificateStackSection {
	key: string;
	kicker: string;
	label: string;
	items: string[];
}

export interface CertificateStackData {
	meta: CertificateStackSection[];
	taskRun: CertificateStackSection;
	evidence: CertificateStackSection[];
}

export const metaHarnessFlowSteps: MetaHarnessFlowStep[] = [
	{
		key: 'problem-space',
		kicker: '01 / intake',
		label: 'describe the problem space',
		detail: 'A messy request and optional attachments become the starting material.',
	},
	{
		key: 'world-profile',
		kicker: '02 / world',
		label: 'derive the task-world profile',
		detail: 'The system names artifacts, actions, outputs, pressures, constraints, and run profiles.',
		emphasis: true,
	},
	{
		key: 'operations',
		kicker: '03 / operations',
		label: 'plan world operations',
		detail: 'Projection, difference, subset, product, and agentic proposals shape candidate worlds.',
	},
	{
		key: 'recipe',
		kicker: '04 / recipe',
		label: 'materialise comparison recipe',
		detail: 'A scriptable workspace records the task, commands, expected files, and comparison script.',
	},
	{
		key: 'review-govern',
		kicker: '05 / review',
		label: 'review and govern',
		detail: 'Reviewer evidence and governance decisions decide what may proceed or return to world generation.',
		emphasis: true,
	},
	{
		key: 'run-evidence',
		kicker: '06 / run',
		label: 'run or import evidence',
		detail: 'A Harbor workflow, imported trial, or supplied task-run artifact becomes evidence.',
	},
	{
		key: 'ledger',
		kicker: '07 / repair',
		label: 'record evidence and repair',
		detail: 'Outcomes, diagnostics, approvals, and repair proposals are kept for the next composition.',
		emphasis: true,
	},
];

export const metaHarnessCertificateStack: CertificateStackData = {
	meta: [
		{
			key: 'world',
			kicker: 'world',
			label: 'what was composed',
			items: ['problem brief', 'task-world profile', 'logic/operation profiles'],
		},
		{
			key: 'assembly',
			kicker: 'assembly',
			label: 'how it was materialised',
			items: ['recipe workspace', 'operation plan', 'comparison script'],
		},
		{
			key: 'permission',
			kicker: 'governance',
			label: 'why it could run',
			items: ['reviewer findings', 'approval facts', 'runtime decision'],
		},
	],
	taskRun: {
		key: 'ordinary-run',
		kicker: 'task run',
		label: 'ordinary task-run certificate',
		items: ['task and inputs', 'agent and tools', 'output and verifier', 'traces and review evidence'],
	},
	evidence: [
		{
			key: 'result',
			kicker: 'result',
			label: 'what happened',
			items: ['Harbor/imported evidence', 'run outcome', 'trial records'],
		},
		{
			key: 'memory',
			kicker: 'memory',
			label: 'what carries forward',
			items: ['ledger events', 'event candidates', 'repair proposal'],
		},
	],
};
