// ABOUTME: Figure data for The Attacker Moves Second. So Did I. — the provenance-ledger schematic.
// ABOUTME: Maps the proposal surface, deterministic stamper rail, and ledger services onto FlowDiagram layers.

export const provenanceLedgerFlowData = {
	title: 'The ledger: proposals above the rail, authority below it',
	topLayer: {
		key: 'proposal-surface',
		kicker: 'PROPOSAL SURFACE',
		label: 'models talk; nothing here carries authority',
		items: [
			{ text: 'quarantined reader: parses untrusted content, no tools, emits typed values' },
			{ text: 'planner: proposes typed state deltas and action intents from principal input' },
			{ kind: 'note', text: 'any text may propose; none of it may authorise' },
		],
	},
	barrier: {
		label: 'STAMPER · DETERMINISTIC RUNTIME',
		downLabel: 'origin, channel, taint stamped from observed facts — never narrated',
	},
	bottomLayers: [
		{
			key: 'ledger-sign-offs',
			kicker: 'LEDGER · SIGN-OFFS',
			label: 'the only way up',
			items: [
				{ text: 'verifier or human clears taint' },
				{ text: 'under a declared rule, on the record' },
				{ kind: 'note', text: 'each sign-off is itself an entry' },
			],
		},
		{
			key: 'ledger-gate',
			kicker: 'LEDGER · GATE',
			label: 'actions bind to basis',
			items: [
				{ text: 'action names its basis entries' },
				{ text: 'provenance checked per action class' },
				{ kind: 'note', text: 'inadmissible basis fails loudly' },
			],
		},
		{
			key: 'ledger-monitors',
			kicker: 'LEDGER · MONITORS',
			label: 'assume the rest failed',
			items: [
				{ text: 'forbidden-flow invariants and alarms' },
				{ text: 'planted fakes; replay of basis chains' },
				{ kind: 'note', text: 'append-only, hash-chained store beneath' },
			],
		},
	],
} as const;

// --- Figure 2: the real leak from Fluent, But Unsafe, replayed against the ledger ---

// Source: the road-drainage row of manufacturedCeilingRows in fluent-but-unsafe-figures.ts.
// The left column is what happened; the right column is a replay on paper, not a new experiment.

export const leakReplayComparisonData = {
	title: 'The same write, with and without a ledger',
	columns: [
		{
			key: 'no-ledger',
			kicker: 'WHAT HAPPENED',
			subtitle: 'road drainage task, no provenance',
			steps: [
				{
					key: 'observe',
					label: 'Improvement loop reads the failing run',
					meta: 'score 0.76',
				},
				{
					key: 'write',
					label: 'Writes the roughness coefficient into the instructions',
					detail: 'spelled out to defeat display rounding',
				},
				{
					key: 'merge',
					label: 'Edit lands in the task text',
					detail: 'indistinguishable from authored instructions',
				},
				{
					key: 'score',
					label: 'Verifier grades the easier world',
					meta: 'score 1.0',
				},
			],
			stats: [{ value: 'discovered later, by reading the ledger of runs' }],
		},
		{
			key: 'with-ledger',
			kicker: 'REPLAYED AGAINST THE LEDGER',
			subtitle: 'same write, provenance stamped',
			highlight: true,
			steps: [
				{
					key: 'stamp',
					label: 'Stamper records the writer',
					detail: 'origin: task-improvement loop · taint: untrusted',
				},
				{
					key: 'derive',
					label: 'Instruction text inherits that taint',
					detail: 'taint is monotone through derivation',
				},
				{
					key: 'gate',
					label: 'Grading demands trusted instructions',
					detail: 'basis includes an untrusted edit — refused',
				},
				{
					key: 'alarm',
					label: 'Monitor raises the alarm',
					detail: 'graded surface changed without a sign-off',
				},
			],
			stats: [{ value: 'the score never moves; the write is loud', highlight: true }],
		},
	],
	caption:
		'A replay on paper, not a new experiment: the road-drainage write from Fluent, But Unsafe, traced through the ledger above. Without provenance, the edit passed as authored instructions and the score rose from 0.76 to a manufactured 1.0. With the stamper, the same write carries its origin, the grading gate refuses untrusted basis, and the monitor treats an unsigned change to a graded surface as an alarm, not an improvement.',
} as const;
