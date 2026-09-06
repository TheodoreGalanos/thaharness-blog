// ABOUTME: Tests the public SSC-03 comparison figures used by A World Worth Learning From.
// ABOUTME: Keeps incomplete evidence and descriptive means distinct.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	campaignRewardHeatmapData,
	checkpointTurnProfileData,
	environmentLearnerAxesData,
	packetFigureProvenance,
	reviewReleaseSequenceData,
	reuseVsRecomputeData,
} from '../src/data/the-packet-starts-moving-figures.ts';

const article = readFileSync(
	new URL('../src/content/blog/a-world-worth-learning-from.mdx', import.meta.url),
	'utf8',
);
const environmentLearnerAxes = readFileSync(
	new URL('../src/components/charts/EnvironmentLearnerAxes.astro', import.meta.url),
	'utf8',
);
const rewardHeatmap = readFileSync(
	new URL('../src/components/charts/RewardHeatmap.astro', import.meta.url),
	'utf8',
);
const figureDataSource = readFileSync(
	new URL('../src/data/the-packet-starts-moving-figures.ts', import.meta.url),
	'utf8',
);

describe('the-packet-starts-moving figures', () => {
	it('keeps environment response separate from learner updates', () => {
		assert.equal(environmentLearnerAxesData.actualMilestones.length, 5);
		assert.equal(environmentLearnerAxesData.worldStages.length, 6);
		assert.deepEqual(
			environmentLearnerAxesData.actualMilestones.map((milestone) => milestone.learnerLevel),
			['fixed', 'fixed', 'fixed', 'fixed', 'fixed'],
		);
		assert.deepEqual(
			environmentLearnerAxesData.actualMilestones.map((milestone) => milestone.worldStage),
			[0, 1, 2, 3, 4],
		);
		assert.deepEqual(
			environmentLearnerAxesData.futureMilestones.map((milestone) => milestone.learnerLevel),
			['fixed', 'between-runs', 'continual'],
		);
		assert.equal(
			environmentLearnerAxesData.futureMilestones.at(0)?.label,
			'Asset stewardship',
		);
		assert.equal(
			environmentLearnerAxesData.futureMilestones.at(0)?.detail,
			'time and consequences continue',
		);
		assert.deepEqual(environmentLearnerAxesData.historyCarriers, [
			'Same model session',
			'Written handover',
			'All documents, no prior decisions',
			'Newest documents only',
		]);
	});

	it('replaces the orthogonality table with an accessible axis diagram', () => {
		assert.match(article, /import EnvironmentLearnerAxes/);
		assert.match(article, /<EnvironmentLearnerAxes/);
		assert.doesNotMatch(article, /\| Axis \| Progression \|/);
		assert.match(environmentLearnerAxes, /<table>/);
		assert.match(environmentLearnerAxes, /Completed in this article/);
		assert.match(environmentLearnerAxes, /Current asset-stewardship work/);
		assert.match(environmentLearnerAxes, /Future work/);
		assert.match(environmentLearnerAxes, /ela-next-world-path/);
		assert.match(environmentLearnerAxes, /text-wrap: balance/);
		assert.match(environmentLearnerAxes, /overflow-wrap: anywhere/);
		assert.match(environmentLearnerAxes, /data-label-row=/);
		assert.match(
			environmentLearnerAxes,
			/grid-template-rows: 1\.6rem 27rem 5\.4rem 1\.6rem/,
		);
		assert.match(
			environmentLearnerAxes,
			/\.ela-milestone-future\[data-track='world'\] \.ela-milestone-copy \{[\s\S]*?top: 1\.15rem;[\s\S]*?bottom: auto;/,
		);
		assert.match(
			environmentLearnerAxes,
			/\.ela-milestone-actual\[data-label-row='high'\]::before \{[\s\S]*?repeating-linear-gradient/,
		);
		assert.match(
			environmentLearnerAxes,
			/\.ela-milestone-actual\[data-label-row='high'\]::before \{[\s\S]*?display: none;/,
		);
		assert.match(environmentLearnerAxes, /const STAGE_START = 8;/);
		assert.match(environmentLearnerAxes, /const STAGE_SPAN = 84;/);
		assert.doesNotMatch(environmentLearnerAxes, /data-edge=/);
	});

	it('explains the continuing asset world without claiming learner change', () => {
		assert.match(article, /An asset has a life, not one task\./);
		assert.match(article, /The model can remain fixed through all of this\./);
		assert.match(
			article,
			/Time passes, equipment deteriorates, duties remain open, and earlier actions affect what happens later\./,
		);
		assert.doesNotMatch(article, /deterministic proof/);
		assert.doesNotMatch(article, /model weights remain fixed/);
		assert.doesNotMatch(article, /\[\^hydraulic-engine\]/);
	});

	it('distinguishes the acting agent from engineering and language models', () => {
		assert.match(article, /title: "A World Worth Learning From"/);
		assert.match(article, /draft: false/);
		assert.match(article, /pubDate: 2026-07-28/);
		assert.match(article, /updatedDate: 2026-07-28/);
		assert.match(article, /The agent must distinguish between evidence that exists/);
		assert.doesNotMatch(article, /The model must distinguish between evidence that exists/);
		assert.equal(environmentLearnerAxesData.historyLabel, 'What carries the past');
		assert.equal(
			environmentLearnerAxesData.worldStages[
				environmentLearnerAxesData.actualMilestones.at(-1)?.worldStage ?? -1
			],
			'Action changes the asset',
		);
	});

	it('reports the model-selected intervention without overclaiming reliability', () => {
		assert.match(article, /I then ran Claude Sonnet through this world\./);
		assert.match(
			article,
			/before seeing the calculated result, it chose to enlarge the controlled outlet\./,
		);
		assert.match(
			article,
			/freeboard rose from `0\.289 m` to `0\.303 m`, above the `0\.300 m` minimum/,
		);
		assert.match(
			article,
			/This was one run, so it does not tell us how reliable models would be on other problems\./,
		);
		assert.doesNotMatch(article, /No language model had attempted the successor task/);
		assert.doesNotMatch(article, /A credential-free proof ran both fixed choices/);
	});

	it('ends in plain language with the boundary between a responsive world and learning', () => {
		assert.match(article, /## Where This Leaves Us/);
		assert.match(
			article,
			/We now have an environment that can remember what happened, change when the agent acts, and show what happened next\./,
		);
		assert.match(article, /The same model was used from beginning to end\./);
		assert.match(
			article,
			/A future training system could update the model between runs and then test whether it improves/,
		);
		assert.match(
			article,
			/Continual learning would go further: the model would carry changes from one real encounter to the next\./,
		);
		assert.match(
			article,
			/The next step is to make these worlds behave more like real environments\./,
		);
		assert.match(
			article,
			/The first will follow a wastewater pumping station through part of its operating life\./,
		);
		assert.match(article, /The engineering is specific, but the attitude is general\./);
		assert.match(
			article,
			/we should be as demanding about the experience as we are about the learner\./,
		);
		assert.match(
			article,
			/\[Part 1\]\(\/blog\/fluent-but-unsafe\/\) asked whether an agent could leave behind a trustworthy review\./,
		);
		assert.match(
			article,
			/Part 2, this article, asked whether that review could survive new evidence/,
		);
		for (const crypticTerm of [
			'## What This Work Proves',
			'reward-bearing',
			'run a policy',
			'bounded lifecycle',
			'score the trajectory',
			'task streams',
			'sequence of obligations',
			'This article stopped before the last step',
			'The unseen task produced no performance result',
		]) {
			assert.equal(article.includes(crypticTerm), false);
		}
	});

	it('replaces the monospace lifecycle with one ordered three-release record', () => {
		assert.equal(reviewReleaseSequenceData.releases.length, 3);
		assert.deepEqual(
			reviewReleaseSequenceData.releases.map((release) => release.key),
			['initial-review', 'response-review', 'closeout-review'],
		);
		assert.deepEqual(reviewReleaseSequenceData.continuityItems, [
			'Same finding identity',
			'Same evidence request',
			'Accepted decisions persist unless their basis changes',
		]);
		assert.match(article, /import ReviewReleaseSequence/);
		assert.match(article, /<ReviewReleaseSequence/);
		assert.doesNotMatch(article, /```text\ninitial review/);
	});

	it('preserves all sixteen public campaign cells and the incomplete trial', () => {
		assert.equal(campaignRewardHeatmapData.columns.length, 4);
		assert.equal(campaignRewardHeatmapData.rows.length, 4);
		assert.equal(campaignRewardHeatmapData.title, 'How each method scored');
		assert.equal(campaignRewardHeatmapData.valueFormat, 'percent');
		assert.deepEqual(
			campaignRewardHeatmapData.columns.map((column) => column.label),
			[
				'Administrative update',
				'Larger-storm rainfall',
				'Outlet size',
				'Downstream water level',
			],
		);
		assert.deepEqual(
			campaignRewardHeatmapData.rows.map((row) => row.label),
			[
				'Same model session',
				'Written handover',
				'All documents, no prior decisions',
				'Newest documents only',
			],
		);
		assert.equal(
			campaignRewardHeatmapData.rows.reduce((total, row) => total + row.cells.length, 0),
			16,
		);

		const persistent = campaignRewardHeatmapData.rows.find(
			(row) => row.key === 'persistent',
		);
		const current = campaignRewardHeatmapData.rows.find((row) => row.key === 'current');
		assert.equal(persistent?.selected, true);
		assert.equal(persistent?.meanReward, 0.77275);
		assert.equal(current?.eligible, false);
		assert.equal(current?.meanReward, null);
		assert.equal(current?.allRecordMeanReward, 0);
		assert.deepEqual(
			current?.cells.map((cell) => ({
				column: cell.column,
				reward: cell.reward,
				failed: 'failed' in cell ? cell.failed : undefined,
			})),
			[
				{ column: 'administrative', reward: 0, failed: undefined },
				{ column: 'major_idf', reward: 0, failed: true },
				{ column: 'outlet', reward: 0, failed: undefined },
				{ column: 'tailwater', reward: 0, failed: undefined },
			],
		);
		assert.match(rewardHeatmap, /Math\.round\(cell\.reward \* 100\)/);
		assert.match(rewardHeatmap, /if \(cell\.failed\) return 'incomplete'/);
		assert.match(rewardHeatmap, /\.rh-cell-incomplete/);
		assert.match(rewardHeatmap, /Review score/);
		assert.match(article, /The same model session averaged 77%/);
		assert.match(
			article,
			/In this comparison, carrying earlier decisions mattered more than receiving the files again\./,
		);
		assert.doesNotMatch(
			article,
			/These results describe this comparison; they do not prove why the methods differed\./,
		);
		assert.doesNotMatch(article, /mean reward of 0\.77275/);
	});

	it('shows the reconstruction gap emerging after baseline', () => {
		const persistent = checkpointTurnProfileData.conditions.find(
			(condition) => condition.key === 'persistent',
		);
		const current = checkpointTurnProfileData.conditions.find(
			(condition) => condition.key === 'current',
		);

		assert.deepEqual(persistent?.means, {
			baseline: 12.75,
			revision: 11,
			closeout: 4.5,
		});
		assert.equal(current?.means.closeout, 17.5);
		assert.equal(
			current?.values.closeout.filter((point) => point.status === 'incomplete').length,
			1,
		);
	});

	it('keeps recomputation selective and host-controlled', () => {
		assert.equal(reuseVsRecomputeData.columns.length, 2);
		assert.deepEqual(
			reuseVsRecomputeData.columns.map((column) => column.stats.map((stat) => stat.value)),
			[
				['3 results reused', '0 calculation budget'],
				['3 results recomputed', '3 calculation budget'],
			],
		);
	});

	it('does not turn the routine holdout check into a section or figure', () => {
		assert.doesNotMatch(article, /## The Final Test Stayed Final/);
		assert.doesNotMatch(article, /FlowDiagram|publicPrivateEvidenceFlowData|\[\^unseen-task\]/);
		assert.doesNotMatch(
			figureDataSource,
			/publicHoldoutReceipt|publicPrivateEvidenceFlowData/,
		);
	});

	it('binds the figures to the frozen public evidence', () => {
		assert.deepEqual(packetFigureProvenance, {
			manifestSha256: '470e6a7f9c05883a6f35a44f2a638f3967beaca771047d986753b356527e4c33',
			planSha256: '0fca1f1685d26756f72d4722eff262bc29e001fc084c253b3c85afffde770287',
			freezeSha256: '0569a4afed131a02b014a2b51778eed8416dda72d3aa64960f30c98c79a65f62',
			receiptSha256: '155a379304209e28c1e125831971f589b86b95d7ab0f5ec3c88add9acb36269b',
		});
	});
});
