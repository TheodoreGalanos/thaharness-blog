// ABOUTME: Figure data for the task-world examples in the meta-harness article.
// ABOUTME: Keeps engineering example values separate from Astro figure rendering.

export interface TaskWorldInput {
	key: string;
	value: string;
}

export interface BearingCapacityFactor {
	name: string;
	remembered: string;
	expected: string;
}

export interface MethodLedgerRow {
	run: string;
	method: string;
	answer: string;
	result: 'pass' | 'fail';
}

export interface BearingCapacityFigureData {
	model: string;
	taskPath: string;
	status: string;
	inputs: TaskWorldInput[];
	factors: BearingCapacityFactor[];
	remembered: {
		label: string;
		eyebrow: string;
		answer: string;
	};
	expected: {
		label: string;
		eyebrow: string;
		answer: string;
	};
	ledger: MethodLedgerRow[];
	takeaway: string;
}

export interface ClearanceRun {
	run: string;
	speed: string;
	answer: number;
}

export interface MissingInputFigureData {
	model: string;
	taskPath: string;
	status: string;
	distance: string;
	missingInput: string;
	expectedSpeed: string;
	expectedAnswer: number;
	axisTicks: number[];
	runs: ClearanceRun[];
	takeaway: string;
}

export const bearingCapacityFigure: BearingCapacityFigureData = {
	model: 'Grok 4.3',
	taskPath: 'ground / shallow-foundations / terzaghi-bearing-capacity',
	status: '8 / 8 inputs given',
	inputs: [
		{ key: 'Footing', value: 'strip' },
		{ key: 'Width B', value: '5.85 m' },
		{ key: 'Depth Df', value: '3.15 m' },
		{ key: "Cohesion c'", value: '0 kPa' },
		{ key: "Friction phi'", value: '33.55 deg' },
		{ key: 'Unit wt gamma', value: '17.59' },
		{ key: 'Water table', value: '100 m' },
		{ key: 'Safety factor', value: '3.21' },
	],
	factors: [
		{ name: 'Nc', remembered: '40.53', expected: '50.51' },
		{ name: 'Nq', remembered: '27.88', expected: '34.50' },
		{ name: 'Ngamma', remembered: '26.73', expected: '34.16' },
	],
	remembered: {
		label: 'Textbook formula',
		eyebrow: 'what the model recalled',
		answer: '910 kPa',
	},
	expected: {
		label: "Project's tool",
		eyebrow: 'what the task expected',
		answer: '1144 kPa',
	},
	ledger: [
		{ run: '01', method: 'ran the project tool', answer: '1143 kPa', result: 'pass' },
		{ run: '02', method: 'ran the project tool', answer: '1143 kPa', result: 'pass' },
		{ run: '03', method: 'used formula memory', answer: '910 kPa', result: 'fail' },
	],
	takeaway: '~20% lower allowable capacity: same inputs, different engineering convention.',
};

export const missingWalkingSpeedFigure: MissingInputFigureData = {
	model: 'Grok 4.3',
	taskPath: 'electrical / signal-timing / pedestrian-clearance',
	status: '1 required input missing',
	distance: '32.77 m',
	missingInput: 'walking speed',
	expectedSpeed: '0.80 m/s',
	expectedAnswer: 41,
	axisTicks: [24, 29, 34, 39, 44],
	runs: [
		{ run: '01', speed: '1.20 m/s', answer: 28 },
		{ run: '02', speed: '1.07 m/s', answer: 31 },
		{ run: '03', speed: '1.0668 m/s', answer: 31 },
	],
	takeaway: 'The arithmetic was fine. The missing value was invented, and it changed every run.',
};
