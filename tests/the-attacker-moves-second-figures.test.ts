// ABOUTME: Tests the provenance-ledger figure data used by The Attacker Moves Second. So Did I.
// ABOUTME: Keeps the proposal surface, stamper rail, and ledger services consistent with the article.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	leakReplayComparisonData,
	provenanceLedgerFlowData,
} from '../src/data/the-attacker-moves-second-figures.ts';
import { manufacturedCeilingRows } from '../src/data/fluent-but-unsafe-figures.ts';

const article = readFileSync(
	new URL('../src/content/blog/the-attacker-moves-second-so-did-i.mdx', import.meta.url),
	'utf8',
);

describe('the-attacker-moves-second figures', () => {
	it('is ready to publish from this branch', () => {
		assert.match(article, /^draft: false$/m);
		assert.match(article, /^pubDate: 2026-07-21$/m);
		assert.match(article, /^updatedDate: 2026-07-21$/m);
		assert.doesNotMatch(article, /decide whether this ships/);
		assert.doesNotMatch(article, /scrutiny\.\./);
	});

	it('keeps the proposal surface above the stamper rail', () => {
		assert.equal(provenanceLedgerFlowData.topLayer.key, 'proposal-surface');
		const topTexts = provenanceLedgerFlowData.topLayer.items.map((item) => item.text).join(' ');
		assert.match(topTexts, /quarantined reader/i);
		assert.match(topTexts, /planner/i);
		assert.match(provenanceLedgerFlowData.barrier.label, /stamper/i);
		assert.match(provenanceLedgerFlowData.barrier.downLabel ?? '', /origin, channel, taint/);
	});

	it('exposes the three ledger services in order: sign-offs, gate, monitors', () => {
		assert.deepEqual(
			provenanceLedgerFlowData.bottomLayers.map((layer) => layer.key),
			['ledger-sign-offs', 'ledger-gate', 'ledger-monitors'],
		);
		for (const layer of provenanceLedgerFlowData.bottomLayers) {
			assert.match(layer.kicker, /^LEDGER/);
		}
	});

	it('renders the figure in the article instead of the ASCII schematic', () => {
		assert.match(article, /import FlowDiagram/);
		assert.match(article, /provenanceLedgerFlowData/);
		assert.match(article, /<FlowDiagram/);
		assert.doesNotMatch(article, /\+-{2,}\+/);
	});

	it('never grants authority above the rail', () => {
		const note = provenanceLedgerFlowData.topLayer.items.find((item) => item.kind === 'note');
		assert.equal(note?.text, 'any text may propose; none of it may authorise');
		assert.match(provenanceLedgerFlowData.topLayer.label, /nothing here carries authority/);
	});

	it('replays the real road-drainage leak from Fluent, But Unsafe', () => {
		const drainage = manufacturedCeilingRows.find((row) => row.task === 'Road drainage task');
		assert.ok(drainage, 'the source incident row must exist in the Part 1 data');
		const [happened, replayed] = leakReplayComparisonData.columns;
		assert.equal(happened.key, 'no-ledger');
		assert.equal(replayed.key, 'with-ledger');
		const happenedText = JSON.stringify(happened);
		assert.match(happenedText, /0\.76/);
		assert.match(happenedText, /1\.0/);
		assert.match(happenedText, /roughness coefficient/);
		const replayedText = JSON.stringify(replayed);
		assert.match(replayedText, /task-improvement loop/);
		assert.match(replayedText, /refused|alarm/i);
	});

	it('labels the replay as reasoning on the record, not a new experiment', () => {
		assert.match(leakReplayComparisonData.caption ?? '', /replay on paper|paper replay/i);
		assert.match(article, /leakReplayComparisonData/);
		assert.match(article, /<ProcessComparison/);
	});
});
