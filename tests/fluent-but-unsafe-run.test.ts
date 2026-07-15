// ABOUTME: Tests the published strong-model road-review run and its article integration.
// ABOUTME: Keeps the public trajectory reproducible, sanitised, and connected to its source code.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
	fluentButUnsafeRun,
	fluentButUnsafeSourceLinks,
} from '../src/data/fluent-but-unsafe-run.ts';

const article = readFileSync(
	new URL('../src/content/blog/fluent-but-unsafe.mdx', import.meta.url),
	'utf8',
);
const component = readFileSync(
	new URL('../src/components/RunTrajectory.astro', import.meta.url),
	'utf8',
);
const runPage = readFileSync(
	new URL('../src/pages/runs/road-low-point-review.astro', import.meta.url),
	'utf8',
);
const publicTrajectory = readFileSync(
	new URL('../public/runs/road-low-point-review/trajectory.jsonl', import.meta.url),
	'utf8',
);
const publicRunFiles = [
	publicTrajectory,
	readFileSync(new URL('../public/runs/road-low-point-review/review.md', import.meta.url), 'utf8'),
	readFileSync(new URL('../public/runs/road-low-point-review/verifier.json', import.meta.url), 'utf8'),
	readFileSync(new URL('../public/runs/road-low-point-review/receipt.json', import.meta.url), 'utf8'),
];

describe('published Fluent, But Unsafe run', () => {
	it('preserves the complete seven-moment audit spine and four article moments', () => {
		assert.deepEqual(
			fluentButUnsafeRun.moments.map((moment) => moment.id),
			[
				'inventory',
				'claimed-adequate',
				'recompute',
				'defect',
				'root-cause',
				'localise',
				'decision',
			],
		);
		assert.deepEqual(
			fluentButUnsafeRun.moments.filter((moment) => moment.preview).map((moment) => moment.id),
			['inventory', 'recompute', 'defect', 'decision'],
		);
	});

	it('records the frozen score and verifier-only rescore without rewriting history', () => {
		assert.equal(fluentButUnsafeRun.receipt.recordedScore, 0.95);
		assert.equal(fluentButUnsafeRun.receipt.rescoredScore, 1);
		assert.match(fluentButUnsafeRun.receipt.rescoreNote, /response did not change/i);
		assert.equal(fluentButUnsafeRun.receipt.model, 'au.anthropic.claude-sonnet-4-6');
		assert.equal(fluentButUnsafeRun.receipt.seed, 20260706);
	});

	it('links to immutable GitHub source for the instructions, generator, verifier, and tests', () => {
		assert.deepEqual(
			fluentButUnsafeSourceLinks.map((link) => link.label),
			['Review instructions', 'Document generator', 'Verifier', 'Regression tests'],
		);
		assert.ok(
			fluentButUnsafeSourceLinks.every((link) =>
				link.href.includes('/blob/1e78c3c7ad856a1a9124e737f1f365d5a8616957/'),
			),
		);
	});

	it('publishes sanitised, parseable run records', () => {
		assert.equal(publicTrajectory.trim().split('\n').length, 40);
		for (const line of publicTrajectory.trim().split('\n')) JSON.parse(line);
		JSON.parse(publicRunFiles[2]);
		JSON.parse(publicRunFiles[3]);
		for (const forbidden of [
			'/Users/',
			'/private/',
			'/var/folders/',
			'theodoros.galanos',
			'AWS_SECRET',
			'Authorization',
			'Bearer ',
		]) {
			for (const publicRunFile of publicRunFiles) {
				assert.doesNotMatch(publicRunFile, new RegExp(forbidden.replace('/', '\\/'), 'i'));
			}
		}
		assert.match(publicTrajectory, /\/workspace\/sources\/document-register\.md/);
	});

	it('wires the runnable example and preview into the article before the structured-world section', () => {
		assert.match(article, /^draft: false$/m);
		assert.match(article, /^pubDate: 2026-07-15$/m);
		assert.match(article, /^updatedDate: 2026-07-15$/m);
		assert.match(article, /import RunTrajectory/);
		assert.match(article, /road-low-point-issue-review-package/);
		assert.match(article, /TASK=demo-tasks\/civil\/road-review\/road-low-point-issue-review-package/);
		assert.match(article, /"\$TASK\/urban-arterial-sag-urban-arterial-02"/);
		assert.match(article, /--seed 20260706/);
		assert.match(article, /\[\^run-credentials\]/);
		assert.match(article, /<RunTrajectory run=\{fluentButUnsafeRun\} mode="preview" \/>/);
		assert.ok(article.indexOf('<RunTrajectory') < article.indexOf('## The Messy Surface'));
	});

	it('uses native disclosure controls and gives the complete run a stable page', () => {
		assert.match(component, /\.run-header,[\s\S]*text-align: left/);
		assert.match(component, /<details/);
		assert.match(component, /<summary/);
		assert.doesNotMatch(component, /<dialog|role="dialog"/);
		assert.match(runPage, /<RunTrajectory run=\{fluentButUnsafeRun\} mode="full" \/>/);
		assert.match(runPage, /resolve\(process\.cwd\(\), 'public'/);
		assert.doesNotMatch(runPage, /new URL\('\.\.\/\.\.\/\.\.\/public/);
		assert.match(runPage, /data-pagefind-ignore/);
		assert.match(runPage, /\/blog\/fluent-but-unsafe\//);
	});
});
