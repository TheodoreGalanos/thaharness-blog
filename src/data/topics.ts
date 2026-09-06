// ABOUTME: Three curated entry points into the published engineering essays.
// ABOUTME: Shared by the homepage and existing tag routes to keep their reading order consistent.
export const topics = [
	{
		tag: 'harness-engineering',
		title: 'Harness engineering',
		task: 'Understand the harness',
		description:
			'How tools, verifiers and control flow turn model capability into useful engineering work.',
		posts: [
			'where-capability-actually-lives-in-agentic-engineering',
			'the-harness-is-all-you-need',
			'recursive-by-design',
		],
	},
	{
		tag: 'agent-evaluation',
		title: 'Agent evaluation',
		task: 'Evaluate an agent',
		description:
			'Start with measured results, then examine what scores miss and what a trustworthy task needs.',
		posts: [
			'benchmarking-agents-on-real-engineering-work',
			'fluent-but-unsafe',
			'a-world-worth-learning-from',
		],
	},
	{
		tag: 'ai-in-aec',
		title: 'AI in AEC',
		task: 'Govern organisational use',
		description:
			'Bring agents into architecture, engineering and construction with room to experiment and clear limits on authority.',
		posts: [
			'broad-creation-narrow-authority',
			'mediation-not-intermediation',
			'the-distance-to-the-edge',
		],
	},
];
