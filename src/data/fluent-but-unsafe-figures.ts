// ABOUTME: Figure data for the "Fluent, But Unsafe" article on review-first task construction.
// ABOUTME: Keeps coverage-autopsy, leak, triage, and reliability values separate from Astro rendering.

import type {
	LineTrajectoryBaseline,
	LineTrajectoryMarker,
	LineTrajectorySeries,
} from '../components/charts/LineTrajectory.astro';
import type {
	GroupedBarsCategory,
	GroupedBarsSeries,
	GroupedBarsValue,
} from '../components/charts/GroupedBars.astro';

// Source binding for the repository evidence summarized below. Git blob IDs bind the
// exact Markdown bytes without making the portable blog depend on the aec-bench checkout.
export const fluentUnsafeFigureProvenance = {
	courseCorrectionPath: 'docs/task-world-opportunities/long-horizon-course-correction.md',
	courseCorrectionGitBlob: '1d5a8889e39e1ca144e5a0fbe6acc84f7d310029',
	probePlanPath:
		'docs/task-world-opportunities/real-world-grounding/ssc01-review-first-conversion-plan.md',
	probePlanGitBlob: '5428bcc69434f6f27099d44ac9a6041ebc7e79eb',
	probeRunRoot: 'artefacts/local-runs/ssc01-evidence-v2/model-runs',
} as const;

// --- Figure 1: the dashboard vs the autopsy ---

// Source: course-correction record, especially the saturation findings and 143/150 audit.

export interface CoverageStatTile {
	value: string;
	label: string;
}

export interface AutopsyFinding {
	stat: string;
	text: string;
}

export interface CoverageAutopsyData {
	dashboardKicker: string;
	dashboardTiles: CoverageStatTile[];
	autopsyKicker: string;
	autopsyFindings: AutopsyFinding[];
}

export const coverageAutopsy: CoverageAutopsyData = {
	dashboardKicker: 'the tracking documents',
	dashboardTiles: [
		{ value: '19/19', label: 'engineering worlds covered' },
		{ value: '152/152', label: 'engineering packages' },
		{ value: '150', label: 'working tasks' },
		{ value: '1.0', label: 'every known-correct answer' },
	],
	autopsyKicker: 'the same tasks, reread',
	autopsyFindings: [
		{
			stat: '143 / 150',
			text: 'tasks with every input fixed to a single value — each produces the same problem every time',
		},
		{
			stat: 'full formula sheet',
			text: 'printed in the instructions, including the algebraic rearrangements',
		},
		{
			stat: '0 files',
			text: 'in the working folder — every value appears in the instructions',
		},
		{
			stat: '1 response',
			text: 'enough to solve it: no tools, no remembered state, no sequence of work',
		},
	],
};

// --- Figure 2: how 1.0 was manufactured ---

// Source: course-correction record and its linked runnable-template construction ledger.

export interface ManufacturedCeilingRow {
	task: string;
	before: string;
	pinned: string;
	after: string;
}

export const manufacturedCeilingRows: ManufacturedCeilingRow[] = [
	{
		task: 'Bearing-capacity task',
		before: '0.79',
		pinned: 'factor convention and water-table correction written into the instructions',
		after: '1.0',
	},
	{
		task: 'Pipe-support task',
		before: '0.89',
		pinned: 'exact bearing-capacity factor values written into the instructions',
		after: '1.0',
	},
	{
		task: 'Road drainage task',
		before: '0.76',
		pinned: 'roughness coefficient spelled out to defeat display rounding',
		after: '1.0',
	},
];

// --- Figure 3: anatomy of a review task ---

export interface ReviewAnatomyGate {
	label: string;
	weight: string;
	note: string;
}

export interface ReviewAnatomyVariant {
	kind: 'clean' | 'changed';
	label: string;
}

export interface ReviewAnatomyData {
	documents: string[];
	workflow: string[];
	gates: ReviewAnatomyGate[];
	variants: ReviewAnatomyVariant[];
	variantNote: string;
}

export const reviewTaskAnatomy: ReviewAnatomyData = {
	documents: [
		'Document register',
		'Road geometry',
		'Drainage design package',
		'Equipment layout',
		'Power & network schedule',
		'Traffic operations case',
		'Criteria memo + review comments',
	],
	workflow: ['Inventory', 'Identity', 'Recompute', 'Status', 'Findings & requests', 'Decision'],
	gates: [
		{ label: 'Checklist answers', weight: '0.30', note: 'count only with supporting calculations or sources' },
		{ label: 'Evidence checked from documents', weight: '0.20', note: 'values reproduced from the documents' },
		{ label: 'Findings tied to evidence and requests', weight: '0.20', note: 'every failure cited; every gap requested' },
		{ label: 'Final issue decision', weight: '0.20', note: 'supported by evidence; agrees with the rest of the review' },
		{ label: 'Cross-document consistency and claim limits', weight: '0.10', note: 'details stay consistent; no overclaims' },
	],
	variants: [
		{ kind: 'clean', label: 'Clean' },
		{ kind: 'changed', label: 'Missing level' },
		{ kind: 'changed', label: 'Stale revision' },
		{ kind: 'changed', label: 'Datum conflict' },
		{ kind: 'changed', label: 'Copied scenario' },
		{ kind: 'changed', label: 'Critical comment open' },
		{ kind: 'changed', label: 'Minor comment carried' },
		{ kind: 'changed', label: 'Criterion failure masked' },
	],
	variantNote: 'The model sees the documents, but not which version it received.',
};

// --- Figure 4: the leak, as a trajectory (LineTrajectory) ---

// Source: course-correction narrative plus the review-first conversion plan's contamination audit.

export const leakTrajectorySeries: LineTrajectorySeries[] = [
	{
		key: 'leak',
		label: 'small model, one version with a planted defect',
		points: [
			{ cycle: 1, value: 0.78 },
			{ cycle: 2, value: 0.7 },
			{ cycle: 3, value: 0.56 },
			{ cycle: 4, value: 0.81 },
			{ cycle: 5, value: 0.85 },
			{ cycle: 6, value: 1.0 },
		],
	},
];

export const leakTrajectoryBaseline: LineTrajectoryBaseline = {
	value: 1.0,
	label: 'perfect score',
	note: 'reached by editing the instructions, not by improving the review',
};

export const leakTrajectoryMarkers: LineTrajectoryMarker[] = [
	{
		cycle: 2,
		value: 0.7,
		label: 'evidence rules tightened',
		labelLines: ['evidence rules', 'tightened'],
		labelAnchor: 'start',
		labelDx: 12,
	},
	{
		cycle: 4,
		value: 0.81,
		label: 'review-boundary rules added',
		labelLines: ['review-boundary', 'rules added'],
		labelAnchor: 'end',
		labelDx: -12,
	},
	{
		cycle: 5,
		value: 0.85,
		label: 'rules added to keep one defect to one item',
		labelLines: ['one-defect boundary', 'rule added'],
		labelAnchor: 'end',
		labelDx: -12,
	},
	{ cycle: 6, value: 1.0, label: 'expected answer spelled out' },
];

// --- Figure 5: one definition, two models, split verdict (GroupedBars) ---

// Source: review-first conversion plan, post-triage probe table and reliability summary.

export const triageSplitCategories: GroupedBarsCategory[] = [
	{ key: 'strong-pending', label: 'Strong model — missing-value rule', description: 'wording change meant to stop one problem spreading' },
	{ key: 'small-pending', label: 'Small model — missing-value rule', description: 'same wording change, same task version' },
	{ key: 'strong-ledger', label: 'Strong model — evidence-scoring fix', description: 'each correct evidence item earns credit' },
];

export const triageSplitSeries: GroupedBarsSeries[] = [
	{ key: 'before', label: 'before the fix' },
	{ key: 'after', label: 'after the fix' },
];

export const triageSplitValues: GroupedBarsValue[] = [
	{ category: 'strong-pending', series: 'before', value: 0.88 },
	{ category: 'strong-pending', series: 'after', value: 0.95, note: 'the error shrank to one item — the definition worked' },
	{ category: 'small-pending', series: 'before', value: 0.75 },
	{ category: 'small-pending', series: 'after', value: 0.72, note: 'the error remains — the wording was not the cause' },
	{ category: 'strong-ledger', series: 'before', value: 0.95 },
	{ category: 'strong-ledger', series: 'after', value: 0.99, note: 'each correct evidence item now earns credit' },
];

// --- Figure 6: twenty-one static-review model runs ---

// Source: review-first conversion plan, post-triage breadth rows, and archived
// phase-C reward files under fluentUnsafeFigureProvenance.probeRunRoot.

export type StaticReviewProbeModel = 'small' | 'strong';
export type StaticReviewProbeEmphasis = 'signal' | 'phantom';

export interface StaticReviewProbePoint {
	id: string;
	reward: number;
	model: StaticReviewProbeModel;
	condition: string;
	finding: string;
	annotation?: string;
	annotationSide?: 'left' | 'right';
	emphasis?: StaticReviewProbeEmphasis;
}

export interface StaticReviewProbeRow {
	key: string;
	label: string;
	compactLabel: string;
	points: StaticReviewProbePoint[];
}

export interface StaticReviewProbeSection {
	key: 'breadth' | 'reliability';
	label: string;
	summary: string;
	rows: StaticReviewProbeRow[];
	footer?: string[];
}

export interface StaticReviewProbeMapData {
	domain: [number, number];
	ticks: number[];
	sections: StaticReviewProbeSection[];
}

export const staticReviewProbeMap: StaticReviewProbeMapData = {
	domain: [0.55, 1],
	ticks: [0.6, 0.7, 0.8, 0.9, 1],
	sections: [
		{
			key: 'breadth',
			label: 'Across all eight review tasks',
			summary: '11 model runs',
			rows: [
				{
					key: 'LH-01',
					label: 'LH-01 Drainage',
					compactLabel: '01 · low point',
					points: [
						{
							id: 'lh01-freeboard-haiku',
							reward: 0.86,
							model: 'small',
							condition: 'Genuine freeboard defect',
							finding: 'The final decision contradicted the checklist; a required connection from the finding was also missing.',
							annotation: 'decision + missing link',
							annotationSide: 'left',
							emphasis: 'signal',
						},
						{
							id: 'lh01-freeboard-sonnet',
							reward: 1,
							model: 'strong',
							condition: 'Genuine freeboard defect',
							finding: 'Complete after correcting a verifier wording inconsistency.',
							annotation: 'complete',
							annotationSide: 'left',
						},
					],
				},
				{
					key: 'LH-02',
					label: 'LH-02 Intersection',
					compactLabel: '02 · junction',
					points: [
						{
							id: 'lh02-ped-clearance-haiku',
							reward: 0.78,
							model: 'small',
							condition: 'Pedestrian clearance defect',
							finding: 'Points were lost only on the affected item.',
						},
					],
				},
				{
					key: 'LH-03',
					label: 'LH-03 Road visual',
					compactLabel: '03 · visual',
					points: [
						{
							id: 'lh03-missing-poe-haiku',
							reward: 0.77,
							model: 'small',
							condition: 'Missing PoE budget',
							finding: 'The final decision contradicted the checklist, and another checklist item also lost points.',
							annotation: 'decision disagrees',
							annotationSide: 'right',
							emphasis: 'signal',
						},
					],
				},
				{
					key: 'LH-04',
					label: 'LH-04 Detour',
					compactLabel: '04 · detour',
					points: [
						{
							id: 'lh04-battery-haiku',
							reward: 0.88,
							model: 'small',
							condition: 'Battery runtime defect',
							finding: 'Points were lost only on the affected item.',
						},
					],
				},
				{
					key: 'LH-05',
					label: 'LH-05 Bus priority',
					compactLabel: '05 · bus',
					points: [
						{
							id: 'lh05-missing-cabinet-haiku',
							reward: 0.97,
							model: 'small',
							condition: 'Missing cabinet capacity',
							finding: 'Points were lost only on the affected item.',
						},
					],
				},
				{
					key: 'LH-06',
					label: 'LH-06 Driveway',
					compactLabel: '06 · driveway',
					points: [
						{
							id: 'lh06-access-freeboard-haiku',
							reward: 0.76,
							model: 'small',
							condition: 'Access freeboard defect',
							finding: 'Points were lost only on the affected item.',
						},
					],
				},
				{
					key: 'LH-07',
					label: 'LH-07 Cabinet',
					compactLabel: '07 · cabinet',
					points: [
						{
							id: 'lh07-thermal-sonnet',
							reward: 0.99,
							model: 'strong',
							condition: 'Thermal capacity defect',
							finding: 'Only the cross-document consistency check lost points.',
							annotation: 'identity only',
							annotationSide: 'left',
							emphasis: 'signal',
						},
					],
				},
				{
					key: 'LH-08',
					label: 'LH-08 Comments',
					compactLabel: '08 · response',
					points: [
						{
							id: 'lh08-missing-chainage-sonnet',
							reward: 0.95,
							model: 'strong',
							condition: 'Missing revised chainage',
							finding: 'The defect stayed confined to one item; one checklist item and one required piece of evidence still lost points.',
						},
						{
							id: 'lh08-missing-chainage-haiku',
							reward: 0.72,
							model: 'small',
							condition: 'Missing revised chainage',
							finding: 'One defect spread into otherwise sound checklist items.',
							emphasis: 'signal',
						},
						{
							id: 'lh08-scenario-copy-haiku',
							reward: 0.72,
							model: 'small',
							condition: 'Copied scenario',
							finding: 'One defect spread into otherwise sound checklist items.',
							annotation: 'one defect spread too far',
							annotationSide: 'right',
							emphasis: 'signal',
						},
					],
				},
			],
		},
		{
			key: 'reliability',
			label: 'Repeated on one task',
			summary: '10 fresh runs · 5 clean · 5 with a defect',
			rows: [
				{
					key: 'clean',
					label: 'No planted defect',
					compactLabel: 'Clean',
					points: [
						{
							id: 'clean-01-haiku',
							reward: 0.63,
							model: 'small',
							condition: 'No planted defect',
							finding: 'Invented findings in work with no planted defect.',
							annotation: '2 invented defects',
							annotationSide: 'right',
							emphasis: 'phantom',
						},
						{
							id: 'clean-02-haiku',
							reward: 0.59,
							model: 'small',
							condition: 'No planted defect',
							finding: 'Invented findings in work with no planted defect.',
							emphasis: 'phantom',
						},
						{
							id: 'clean-03-haiku',
							reward: 1,
							model: 'small',
							condition: 'No planted defect',
							finding: 'Complete review.',
						},
						{
							id: 'clean-04-haiku',
							reward: 0.94,
							model: 'small',
							condition: 'No planted defect',
							finding: 'No specific failure pattern was recorded.',
						},
						{
							id: 'clean-05-haiku',
							reward: 0.95,
							model: 'small',
							condition: 'No planted defect',
							finding: 'No specific failure pattern was recorded.',
						},
					],
				},
				{
					key: 'defect',
					label: 'Genuine defect',
					compactLabel: 'Defect',
					points: [
						{
							id: 'freeboard-01-haiku',
							reward: 0.78,
							model: 'small',
							condition: 'Genuine freeboard defect',
							finding: 'No specific failure pattern was recorded.',
						},
						{
							id: 'freeboard-02-haiku',
							reward: 0.83,
							model: 'small',
							condition: 'Genuine freeboard defect',
							finding: 'No specific failure pattern was recorded.',
						},
						{
							id: 'freeboard-03-haiku',
							reward: 0.86,
							model: 'small',
							condition: 'Genuine freeboard defect',
							finding: 'No specific failure pattern was recorded.',
						},
						{
							id: 'freeboard-04-haiku',
							reward: 0.92,
							model: 'small',
							condition: 'Genuine freeboard defect',
							finding: 'No specific failure pattern was recorded.',
						},
						{
							id: 'freeboard-05-haiku',
							reward: 0.83,
							model: 'small',
							condition: 'Genuine freeboard defect',
							finding: 'No specific failure pattern was recorded.',
						},
					],
				},
			],
			footer: ['clean · 1/5 perfect · average 0.82', 'genuine defect · 0/5 perfect · average 0.84'],
		},
	],
};
