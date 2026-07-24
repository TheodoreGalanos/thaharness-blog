// ABOUTME: Content model for diagrams in the Broad Creation, Narrow Authority article.
// ABOUTME: Keeps each visual's labels, evidence, and authority boundaries aligned with the prose.

export type GatePlacement = {
	id: 'creation' | 'promotion';
	number: 'A' | 'B';
	label: string;
	gateLabel: string;
	gateDetail: string;
	outcome: 'Operate';
	note: string;
};

export type PromotionGateExperiment = {
	id: string;
	x: number;
	y: number;
	tone: 'quiet' | 'linked' | 'candidate';
};

export type CreationAuthorityExample = {
	id: string;
	method: 'human' | 'ai';
	authority: 'low' | 'high';
	label: string;
	detail: string;
};

export type AuthorityRung = {
	id: string;
	gain: string;
	obligation: string;
};

export type VerificationStage = {
	id: 'create' | 'iterate' | 'permission' | 'operate';
	label: string;
};

export const promotionGateFigure = {
	title: 'Two gate placements—what each one costs',
	placements: [
		{
			id: 'creation',
			number: 'A',
			label: 'Gate on creation',
			gateLabel: 'Approval first',
			gateDetail: 'An idea must already justify its value',
			outcome: 'Operate',
			note: 'Ideas never tested · stepping stones never built',
		},
		{
			id: 'promotion',
			number: 'B',
			label: 'Gate on promotion',
			gateLabel: 'Promotion',
			gateDetail: 'Evidence · owner · permissions · recovery',
			outcome: 'Operate',
			note: 'Explore broadly · grant authority narrowly',
		},
	] satisfies GatePlacement[],
	lostIdeas: [
		'idea-01',
		'idea-02',
		'idea-03',
		'idea-04',
		'idea-05',
		'idea-06',
		'idea-07',
		'idea-08',
		'idea-09',
	],
	approvedExperiments: ['approved-01', 'approved-02'],
	promotionCriteria: [
		'Evidence',
		'Named owner',
		'Scoped permissions',
		'Recovery path',
	],
	experiments: [
		{ id: 'experiment-01', x: 8, y: 29, tone: 'quiet' },
		{ id: 'experiment-02', x: 19, y: 66, tone: 'quiet' },
		{ id: 'experiment-03', x: 27, y: 24, tone: 'quiet' },
		{ id: 'experiment-04', x: 36, y: 68, tone: 'linked' },
		{ id: 'experiment-05', x: 48, y: 47, tone: 'linked' },
		{ id: 'experiment-06', x: 55, y: 76, tone: 'candidate' },
		{ id: 'experiment-07', x: 64, y: 25, tone: 'quiet' },
		{ id: 'experiment-08', x: 73, y: 44, tone: 'quiet' },
		{ id: 'experiment-09', x: 81, y: 70, tone: 'quiet' },
		{ id: 'experiment-10', x: 90, y: 31, tone: 'quiet' },
		{ id: 'experiment-11', x: 94, y: 64, tone: 'quiet' },
	] satisfies PromotionGateExperiment[],
	connections: [
		'M 36 68 L 48 47',
		'M 48 47 L 55 76',
		'M 64 25 L 73 44',
	],
	description:
		'Two architectures end in the same narrow operating outcome. In the first, nine ideas face an approval gate before experimentation, so only two proceed and no stepping stones are built. In the second, many bounded experiments can branch, fail, connect, and become reusable starting points before one candidate crosses an equally strict promotion gate backed by evidence, a named owner, scoped permissions, and a recovery path.',
	caption:
		'Both architectures produce the same narrow trickle into operation; the gate is equally strict. A gate on creation pays with the search space never explored. A gate on promotion leaves failed and abandoned experiments visible as stepping stones before anything acquires authority.',
} as const;

export const creationAuthorityFigure = {
	title: 'Where the risk actually lives',
	examples: [
		{
			id: 'human-consequential',
			method: 'human',
			authority: 'high',
			label: 'Cron script',
			detail: 'Production credential',
		},
		{
			id: 'ai-consequential',
			method: 'ai',
			authority: 'high',
			label: 'AI agent',
			detail: 'Can send · approve · purchase',
		},
		{
			id: 'human-bounded',
			method: 'human',
			authority: 'low',
			label: 'Spreadsheet macro',
			detail: 'Personal and reversible',
		},
		{
			id: 'ai-bounded',
			method: 'ai',
			authority: 'low',
			label: 'AI-assisted app',
			detail: 'Large, but sandboxed',
		},
	] satisfies CreationAuthorityExample[],
	description:
		'A two-by-two matrix compares human-written and AI-generated software on the horizontal axis, and isolated reversible work with software that acts on the world on the vertical axis. A neutral vertical line marks the creation-method boundary that vibe coding polices. An amber horizontal line marks the authority boundary that matters. Both human and AI examples appear on each side of the risk boundary.',
	caption:
		'Risk runs vertically, with the authority an artefact holds, rather than horizontally with how it was created. Policing the human–AI divide separates safe work from safe work and dangerous work from dangerous work.',
} as const;

export const authorityLadderFigure = {
	title: 'The authority ladder',
	rungs: [
		{
			id: 'persistence',
			gain: 'Persists beyond an isolated experiment',
			obligation: 'Monitoring and change management',
		},
		{
			id: 'protected-data',
			gain: 'Reads sensitive or protected data',
			obligation: 'Stronger handling controls',
		},
		{
			id: 'material-decision',
			gain: 'Influences a material decision',
			obligation: 'Scrutiny scaled to irreversibility',
		},
		{
			id: 'external-action',
			gain: 'Acts on systems or people',
			obligation: 'Tight permissions and observability',
		},
		{
			id: 'shared-reliance',
			gain: 'Others rely on it',
			obligation: 'Tests, support, recovery, retirement—and a named owner',
		},
	] satisfies AuthorityRung[],
	description:
		'A five-rung ladder shows increasing organisational authority. Each rung pairs a factual capability or dependency gained by an artefact with a corresponding obligation. The highest rung, where others rely on the artefact, is highlighted because informal team dependency often appears without a deliberate promotion decision.',
	caption:
		'Promotion is not one deployment event. An artefact climbs as its facts change, and each increase in authority incurs a matching obligation. The easiest rung to cross silently is shared reliance.',
} as const;

export const verificationBoundaryFigure = {
	title: 'Verification everywhere, permission at the boundary',
	stages: [
		{ id: 'create', label: 'Create' },
		{ id: 'iterate', label: 'Iterate' },
		{ id: 'permission', label: 'Permission' },
		{ id: 'operate', label: 'Operate' },
	] satisfies VerificationStage[],
	humanJudgements: ['Purpose', 'Unusual risk', 'Contested trade-offs'],
	verificationChecks: [
		'Tests',
		'Policy & security',
		'Provenance',
		'Permission bounds',
		'Telemetry',
	],
	description:
		'A workflow moves from creation through iteration and a single human permission boundary into operation. A continuous verification layer runs underneath every stage, covering tests, policy and security, provenance, permission bounds, and telemetry. Human judgement is reserved for purpose, unusual risk, and contested trade-offs at the boundary.',
	caption:
		'Executable verification runs throughout exploration and operation, supplying evidence to the gate. Human permission appears at the authority boundary, where purpose and judgement matter—not at every routine step.',
} as const;
