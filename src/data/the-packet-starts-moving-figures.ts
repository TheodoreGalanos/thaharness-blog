// ABOUTME: Public-only figure data for the A World Worth Learning From article.
// ABOUTME: Binds comparison charts to frozen SSC-03 records and stated evidence limits.

export const packetFigureProvenance = {
	manifestSha256: '470e6a7f9c05883a6f35a44f2a638f3967beaca771047d986753b356527e4c33',
	planSha256: '0fca1f1685d26756f72d4722eff262bc29e001fc084c253b3c85afffde770287',
	freezeSha256: '0569a4afed131a02b014a2b51778eed8416dda72d3aa64960f30c98c79a65f62',
	receiptSha256: '155a379304209e28c1e125831971f589b86b95d7ab0f5ec3c88add9acb36269b',
} as const;

export type LearnerUpdateLevel = 'fixed' | 'between-runs' | 'continual';

export interface EnvironmentLearnerMilestone {
	key: string;
	label: string;
	detail: string;
	worldStage: 0 | 1 | 2 | 3 | 4 | 5;
	learnerLevel: LearnerUpdateLevel;
}

export interface EnvironmentLearnerAxesData {
	title: string;
	subtitle: string;
	worldAxisLabel: string;
	learnerAxisLabel: string;
	worldStages: readonly string[];
	learnerLevels: ReadonlyArray<{
		key: LearnerUpdateLevel;
		label: string;
	}>;
	actualMilestones: EnvironmentLearnerMilestone[];
	futureMilestones: EnvironmentLearnerMilestone[];
	historyLabel: string;
	historyCarriers: readonly string[];
}

export const environmentLearnerAxesData: EnvironmentLearnerAxesData = {
	title: 'A world can keep changing while the learner stays fixed',
	subtitle: 'This article moves right. Learning would also move up.',
	worldAxisLabel: 'How much the world responds',
	learnerAxisLabel: 'How much the model changes',
	worldStages: [
		'One review',
		'New evidence arrives',
		'Agent requests evidence',
		'Calculations return results',
		'Action changes the asset',
		'Asset life continues',
	],
	learnerLevels: [
		{ key: 'continual', label: 'Model learns during use' },
		{ key: 'between-runs', label: 'Model updates between tests' },
		{ key: 'fixed', label: 'Model stays fixed' },
	],
	actualMilestones: [
		{
			key: 'part-one',
			label: 'Part 1',
			detail: 'single review',
			worldStage: 0,
			learnerLevel: 'fixed',
		},
		{
			key: 'staged-review',
			label: 'Staged evidence',
			detail: 'new documents arrive later',
			worldStage: 1,
			learnerLevel: 'fixed',
		},
		{
			key: 'evidence-requests',
			label: 'Agent chooses',
			detail: 'which evidence to inspect',
			worldStage: 2,
			learnerLevel: 'fixed',
		},
		{
			key: 'hydraulic-world',
			label: 'World responds',
			detail: 'calculations answer back',
			worldStage: 3,
			learnerLevel: 'fixed',
		},
		{
			key: 'intervention',
			label: 'Action matters',
			detail: 'the chosen action changes the asset',
			worldStage: 4,
			learnerLevel: 'fixed',
		},
	],
	futureMilestones: [
		{
			key: 'asset-stewardship',
			label: 'Asset stewardship',
			detail: 'time and consequences continue',
			worldStage: 5,
			learnerLevel: 'fixed',
		},
		{
			key: 'ordinary-rl',
			label: 'Training between runs',
			detail: 'model updates after separate tests',
			worldStage: 5,
			learnerLevel: 'between-runs',
		},
		{
			key: 'continual-learner',
			label: 'Continual learning',
			detail: 'model updates during use',
			worldStage: 5,
			learnerLevel: 'continual',
		},
	],
	historyLabel: 'What carries the past',
	historyCarriers: [
		'Same model session',
		'Written handover',
		'All documents, no prior decisions',
		'Newest documents only',
	],
};

export interface ReviewReleaseSequenceData {
	title: string;
	subtitle: string;
	releases: Array<{
		key: 'initial-review' | 'response-review' | 'closeout-review';
		label: string;
		evidence: string;
		commitment: string;
		state: string;
	}>;
	continuityLabel: string;
	continuityItems: readonly string[];
}

export const reviewReleaseSequenceData: ReviewReleaseSequenceData = {
	title: 'One record, carried forward',
	subtitle: 'New evidence arrives only after the previous review has been committed.',
	releases: [
		{
			key: 'initial-review',
			label: 'Initial review',
			evidence: 'Traceability to the governing design inputs is broken.',
			commitment: 'Open the finding, request the missing evidence, and record that the design is not ready.',
			state: 'Finding open',
		},
		{
			key: 'response-review',
			label: 'Response review',
			evidence: 'A revised run record and reissued report restore traceability; the design memo remains stale.',
			commitment: 'Close the repaired part, keep the stale memo issue open, and preserve unaffected decisions.',
			state: 'Partly resolved',
		},
		{
			key: 'closeout-review',
			label: 'Closeout review',
			evidence: 'The revised design memo and formal response arrive.',
			commitment: 'Check the accumulated evidence and record the final closeout decision.',
			state: 'Final decision',
		},
	],
	continuityLabel: 'Carried across every release',
	continuityItems: [
		'Same finding identity',
		'Same evidence request',
		'Accepted decisions persist unless their basis changes',
	],
};

// Source: immutable public TrialRecords under the manifest and plan hashes above.
// Rewards are fractions of eleven semantic verifier gates. The major-IDF current-release
// trial stopped before semantic evaluation, so it remains a failed run rather than a zero cell.
export const campaignRewardHeatmapData = {
	title: 'How each method scored',
	subtitle: '16 Claude Sonnet tests · one test per cell',
	valueFormat: 'percent',
	columns: [
		{ key: 'administrative', label: 'Administrative update' },
		{ key: 'major_idf', label: 'Larger-storm rainfall' },
		{ key: 'outlet', label: 'Outlet size' },
		{ key: 'tailwater', label: 'Downstream water level' },
	],
	rows: [
		{
			key: 'persistent',
			label: 'Same model session',
			selected: true,
			eligible: true,
			meanReward: 0.77275,
			allRecordMeanReward: 0.77275,
			note: 'The same model session continued through all three reviews. Highest average score: 77%.',
			cells: [
				{ column: 'administrative', reward: 0.5455 },
				{ column: 'major_idf', reward: 0.6364 },
				{ column: 'outlet', reward: 0.9091 },
				{ column: 'tailwater', reward: 1 },
			],
		},
		{
			key: 'artifact',
			label: 'Written handover',
			selected: false,
			eligible: true,
			meanReward: 0.704575,
			allRecordMeanReward: 0.704575,
			note: 'A new model session started at each review and received the earlier submitted reviews. Average score: 70%.',
			cells: [
				{ column: 'administrative', reward: 0.5455 },
				{ column: 'major_idf', reward: 0.8182 },
				{ column: 'outlet', reward: 0.7273 },
				{ column: 'tailwater', reward: 0.7273 },
			],
		},
		{
			key: 'raw',
			label: 'All documents, no prior decisions',
			selected: false,
			eligible: true,
			meanReward: 0.25,
			allRecordMeanReward: 0.25,
			note: 'A new model session received all released documents, but none of the agent’s earlier decisions. Average score: 25%.',
			cells: [
				{ column: 'administrative', reward: 0.4545 },
				{ column: 'major_idf', reward: 0.5455 },
				{ column: 'outlet', reward: 0 },
				{ column: 'tailwater', reward: 0 },
			],
		},
		{
			key: 'current',
			label: 'Newest documents only',
			selected: false,
			eligible: false,
			meanReward: null,
			allRecordMeanReward: 0,
			note: 'Three tests scored 0%. In one test, the agent did not finish the final review.',
			cells: [
				{ column: 'administrative', reward: 0 },
				{ column: 'major_idf', reward: 0, failed: true },
				{ column: 'outlet', reward: 0 },
				{ column: 'tailwater', reward: 0 },
			],
		},
	],
} as const;

export type CheckpointKey = 'baseline' | 'revision' | 'closeout';

export interface CheckpointTurnPoint {
	variant: 'administrative' | 'major_idf' | 'outlet' | 'tailwater';
	turns: number;
	status?: 'incomplete';
}

export interface CheckpointTurnCondition {
	key: 'persistent' | 'artifact' | 'raw' | 'current';
	label: string;
	selected: boolean;
	means: Record<CheckpointKey, number>;
	values: Record<CheckpointKey, CheckpointTurnPoint[]>;
}

// Source: recorded agent turns by checkpoint for all sixteen public TrialRecords.
// The incomplete current-release closeout used 29 requests before stopping; it is plotted
// with a distinct marker and remains part of the descriptive workload profile.
export const checkpointTurnProfileData: {
	maxTurns: number;
	checkpoints: Array<{ key: CheckpointKey; label: string }>;
	conditions: CheckpointTurnCondition[];
} = {
	maxTurns: 30,
	checkpoints: [
		{ key: 'baseline', label: 'Baseline analysis' },
		{ key: 'revision', label: 'Revision analysis' },
		{ key: 'closeout', label: 'Closeout review' },
	],
	conditions: [
		{
			key: 'persistent',
			label: 'Continuous conversation',
			selected: true,
			means: { baseline: 12.75, revision: 11, closeout: 4.5 },
			values: {
				baseline: [12, 13, 13, 13].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				revision: [9, 12, 12, 11].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				closeout: [4, 5, 5, 4].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
			},
		},
		{
			key: 'artifact',
			label: 'Written handover',
			selected: false,
			means: { baseline: 12, revision: 14.25, closeout: 14.25 },
			values: {
				baseline: [11, 13, 13, 11].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				revision: [13, 14, 14, 16].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				closeout: [16, 15, 13, 13].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
			},
		},
		{
			key: 'raw',
			label: 'All released evidence',
			selected: false,
			means: { baseline: 12, revision: 21.5, closeout: 18 },
			values: {
				baseline: [11, 12, 12, 13].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				revision: [17, 25, 21, 23].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				closeout: [15, 15, 25, 17].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
			},
		},
		{
			key: 'current',
			label: 'Latest release only',
			selected: false,
			means: { baseline: 14, revision: 21.5, closeout: 17.5 },
			values: {
				baseline: [14, 14, 15, 13].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				revision: [23, 25, 20, 18].map((turns, index) => ({
					variant: ['administrative', 'major_idf', 'outlet', 'tailwater'][index] as CheckpointTurnPoint['variant'],
					turns,
				})),
				closeout: [
					{ variant: 'administrative', turns: 12 },
					{ variant: 'major_idf', turns: 29, status: 'incomplete' },
					{ variant: 'outlet', turns: 13 },
					{ variant: 'tailwater', turns: 16 },
				],
			},
		},
	],
};

// Deterministic task mechanics from the public operation histories. The design chain's
// exact inputs remain current; the revised major chain is invalidated and recomputed.
export const reuseVsRecomputeData = {
	title: 'A revision invalidates a chain, not the whole world',
	columns: [
		{
			key: 'design',
			kicker: 'UNCHANGED DESIGN CHAIN',
			subtitle: 'exact inputs still current',
			highlight: true,
			steps: [
					{ key: 'design-hydrology', label: 'Hydrology', detail: 'reuse original run', meta: 'current' },
					{ key: 'design-outlet', label: 'Detention + outlet', detail: 'reuse original run', meta: 'current' },
					{ key: 'design-hgl', label: 'Network HGL', detail: 'reuse original run', meta: 'current' },
				],
				loop: 'Each reused result points to the original calculation record.',
			stats: [{ value: '3 results reused', highlight: true }, { value: '0 calculation budget' }],
		},
		{
			key: 'major',
			kicker: 'AFFECTED LARGER-STORM CHAIN',
			subtitle: 'source revision changes one governing input',
			steps: [
				{ key: 'major-hydrology', label: 'Hydrology', detail: 'recompute from revised source', meta: 'new' },
				{ key: 'major-outlet', label: 'Detention + outlet', detail: 'recompute from new inflow', meta: 'new' },
				{ key: 'major-hgl', label: 'Network HGL', detail: 'recompute from new discharge', meta: 'new' },
			],
				loop: 'Each downstream result points to the calculation that produced its input.',
			stats: [{ value: '3 results recomputed', highlight: true }, { value: '3 calculation budget' }],
		},
	],
} as const;
