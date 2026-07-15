// ABOUTME: Curates the published strong-model road-review run used in Fluent, But Unsafe.
// ABOUTME: Keeps the article preview, full run page, source links, and score receipt in one record.

export type RunMomentKind = 'source' | 'calculation' | 'finding' | 'check' | 'decision';

export interface RunEvidenceItem {
	label: string;
	value: string;
	tone?: 'neutral' | 'pass' | 'fail';
}

export interface RunComparison {
	label: string;
	stated: string;
	recomputed: string;
}

export interface RunMoment {
	id: string;
	kind: RunMomentKind;
	label: string;
	title: string;
	summary: string;
	preview: boolean;
	evidence?: RunEvidenceItem[];
	comparisons?: RunComparison[];
	excerpt: string;
}

export interface RunSourceLink {
	label: string;
	description: string;
	href: string;
}

export interface PublishedRun {
	id: string;
	title: string;
	deck: string;
	receipt: {
		model: string;
		modelLabel: string;
		adapter: string;
		seed: number;
		documentCount: number;
		toolSteps: number;
		recordedScore: number;
		rescoredScore: number;
		rescoreNote: string;
		decision: string;
		commit: string;
	};
	moments: RunMoment[];
	artifacts: {
		trajectory: string;
		review: string;
		verifier: string;
		receipt: string;
	};
}

const sourceCommit = '1e78c3c7ad856a1a9124e737f1f365d5a8616957';
const sourceRoot = `https://github.com/TheodoreGalanos/aec-bench/blob/${sourceCommit}`;

export const fluentButUnsafeSourceLinks: RunSourceLink[] = [
	{
		label: 'Review instructions',
		description: 'The brief and output contract given to the model.',
		href: `${sourceRoot}/src/aec_bench/templates/builtin/civil/road_low_point_issue_review_package/instruction.md`,
	},
	{
		label: 'Document generator',
		description: 'The code that creates the seven documents and hidden changes.',
		href: `${sourceRoot}/src/aec_bench/templates/builtin/civil/road_low_point_issue_review_package/engine.py`,
	},
	{
		label: 'Verifier',
		description: 'The staged checks behind the final score.',
		href: `${sourceRoot}/src/aec_bench/templates/builtin/civil/road_low_point_issue_review_package/verify.py`,
	},
	{
		label: 'Regression tests',
		description: 'The checks that rebuild the evidence and reject unsupported reviews.',
		href: `${sourceRoot}/tests/templates/test_road_low_point_issue_review_package.py`,
	},
];

export const fluentButUnsafeRun: PublishedRun = {
	id: 'lh01-freeboard-sonnet',
	title: 'One road review, from documents to decision',
	deck: 'A strong model received seven synthetic project documents, recomputed the design evidence, isolated one critical defect, and refused to approve the work.',
	receipt: {
		model: 'au.anthropic.claude-sonnet-4-6',
		modelLabel: 'Claude Sonnet 4.6',
		adapter: 'pydantic_ai',
		seed: 20260706,
		documentCount: 7,
		toolSteps: 16,
		recordedScore: 0.95,
		rescoredScore: 1,
		rescoreNote:
			'The response did not change. A wording-only verifier correction accepted “does not constitute” as equivalent to “does not claim”.',
		decision: 'Not ready to issue',
		commit: sourceCommit,
	},
	moments: [
		{
			id: 'inventory',
			kind: 'source',
			label: 'Source check',
			title: 'Seven files, no shortcuts',
			summary:
				'The model began with the document register and opened every source before drawing a conclusion.',
			preview: true,
			evidence: [
				{ label: 'Register', value: 'DOC-REG-SSC01-01' },
				{ label: 'Design sources', value: 'Road, drainage, equipment, power, traffic and criteria' },
			],
			excerpt:
				'“I’ll start by inventorying the source packet, then work through each review item systematically.”',
		},
		{
			id: 'claimed-adequate',
			kind: 'source',
			label: 'Source claim',
			title: 'The design says “adequate”',
			summary:
				'The equipment drawing claimed 0.285 m of freeboard and called it adequate. The criteria required at least 0.350 m above the controlling water level.',
			preview: false,
			evidence: [
				{ label: 'Design claim', value: '0.285 m — adequate', tone: 'fail' },
				{ label: 'Criterion', value: '≥ 0.350 m above controlling water', tone: 'neutral' },
			],
			excerpt:
				'CAB-01 pad level: 43.775 m AHD. Assessed freeboard: 0.285 m. Assessment: adequate.',
		},
		{
			id: 'recompute',
			kind: 'calculation',
			label: 'Recomputation',
			title: 'Most of the maths checks out',
			summary:
				'Runoff, gutter spread, hydraulic level and the controlling water level all reproduced the design values. The review did not turn one suspicion into a general rejection.',
			preview: true,
			comparisons: [
				{ label: 'Peak runoff', stated: '0.319 m³/s', recomputed: '0.3189 m³/s' },
				{ label: 'Gutter spread', stated: '4.563 m', recomputed: '4.5628 m' },
				{ label: 'Hydraulic level', stated: '42.889 m', recomputed: '42.8885 m' },
				{ label: 'Controlling water', stated: '43.613 m', recomputed: '43.6132 m' },
			],
			excerpt:
				'Controlling WL = max(43.613194, 42.888509) = 43.613194 m AHD. Package claims: 43.613 m AHD. Match: True.',
		},
		{
			id: 'defect',
			kind: 'finding',
			label: 'Critical finding',
			title: 'One number does not',
			summary:
				'Against the controlling water level, the cabinet had only 0.162 m of freeboard—0.188 m short of the requirement.',
			preview: true,
			evidence: [
				{ label: 'Cabinet pad', value: '43.775 m AHD' },
				{ label: 'Controlling water', value: '43.613 m AHD' },
				{ label: 'Actual freeboard', value: '0.162 m', tone: 'fail' },
				{ label: 'Required', value: '0.350 m', tone: 'neutral' },
			],
			excerpt:
				'43.775 − 43.613 = 0.162 m. Required freeboard: 0.350 m. Deficit: 0.188 m. FINDING: critical fail.',
		},
		{
			id: 'root-cause',
			kind: 'calculation',
			label: 'Root cause',
			title: 'The wrong level was used',
			summary:
				'Back-calculation showed that the design had measured from the road surface rather than the higher controlling water level.',
			preview: false,
			evidence: [
				{ label: 'Implied reference', value: '43.490 m — pavement level', tone: 'fail' },
				{ label: 'Correct reference', value: '43.613 m — controlling water', tone: 'neutral' },
				{ label: 'Required pad level', value: '≥ 43.963 m AHD', tone: 'neutral' },
			],
			excerpt:
				'43.775 − 0.285 = 43.490 m AHD. The package computed freeboard above pavement, not above the controlling water level.',
		},
		{
			id: 'localise',
			kind: 'check',
			label: 'Localisation',
			title: 'Keep the finding local',
			summary:
				'The model left the independently sound checks alone. Only the equipment-exposure item failed.',
			preview: false,
			evidence: [
				{ label: 'VMS margin', value: '6.43 characters — pass', tone: 'pass' },
				{ label: 'Battery runtime', value: '9.41 hours — pass', tone: 'pass' },
				{ label: 'Network headroom', value: '9.21 Mbps — pass', tone: 'pass' },
				{ label: 'RLR-04', value: 'Equipment exposure — fail', tone: 'fail' },
			],
			excerpt:
				'RLR-03: PASS. RLR-04: FAIL (critical). RLR-05: PASS. RLR-06: PASS.',
		},
		{
			id: 'decision',
			kind: 'decision',
			label: 'Decision',
			title: 'Turn the finding into an action',
			summary:
				'The final decision followed the evidence: do not issue the work, raise or redesign the cabinet pad, correct the calculation, and review the next revision.',
			preview: true,
			evidence: [
				{ label: 'Decision', value: 'Not ready to issue', tone: 'fail' },
				{ label: 'Action', value: 'Raise CAB-01 to ≥ 43.963 m AHD and reissue' },
				{ label: 'Hidden condition', value: 'Freeboard-deficient version' },
			],
			excerpt:
				'NOT READY TO ISSUE. One critical failure is outstanding. The cabinet pad level is geometrically insufficient by 0.188 m.',
		},
	],
	artifacts: {
		trajectory: '/runs/road-low-point-review/trajectory.jsonl',
		review: '/runs/road-low-point-review/review.md',
		verifier: '/runs/road-low-point-review/verifier.json',
		receipt: '/runs/road-low-point-review/receipt.json',
	},
};
