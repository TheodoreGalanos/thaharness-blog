// ABOUTME: Tests the Chief AI Officer and governance blog draft.
// ABOUTME: Protects its metadata, factual scope, sources, and central argument.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const article = readFileSync(
	new URL('../src/content/blog/appoint-the-officer-build-the-system.mdx', import.meta.url),
	'utf8',
);

describe('Appoint the Officer. Build the System. draft', () => {
	it('uses the blog content schema and remains unpublished', () => {
		assert.match(article, /^title: "Appoint the Officer\. Build the System\."$/m);
		assert.match(article, /^author: "Theodoros Galanos"$/m);
		assert.match(article, /^category: "Engineering"$/m);
		assert.match(article, /^draft: true$/m);
		assert.match(article, /^pubDate: 2026-07-29$/m);
		assert.match(article, /^updatedDate: 2026-07-31$/m);
		assert.match(article, /^featured: false$/m);
	});

	it('states the government requirement precisely', () => {
		assert.match(article, /106 non-corporate Commonwealth entities/);
		assert.match(article, /30 June 2026/);
		assert.match(article, /104 of the 106/);
		assert.doesNotMatch(article, /August (?:deadline|2026 deadline)/i);
		assert.doesNotMatch(article, /all Australian organisations/i);
	});

	it('keeps appointment coverage separate from organisational capability', () => {
		assert.match(article, /> A Chief AI Officer is not an AI capability\./);
		assert.match(
			article,
			/A strong Chief AI Officer gives applied expertise a path to executive authority and clears barriers practitioners cannot clear alone\./,
		);
		assert.match(
			article,
			/The appointment is an administrative fact\. Capability is an operating system\./,
		);
		assert.match(article, /Goodhart/);
		assert.match(article, /a limit of the metric, not a failure of the policy diagnosis/);
	});

	it('uses primary policy evidence and current appointment examples', () => {
		assert.match(
			article,
			/https:\/\/www\.govai\.gov\.au\/aide\/chief-ai-officers-who-are-they-and-why-they-matter/,
		);
		assert.match(article, /https:\/\/www\.finance\.gov\.au\/sites\/default\/files\/2025-12\/CAIO\.pdf/);
		assert.match(article, /25 November 2025/);
		assert.doesNotMatch(article, /After the dinner, I read/);
		assert.match(
			article,
			/https:\/\/www\.commbank\.com\.au\/articles\/newsroom\/2025\/11\/ranil-boteju-chief-ai-officer\.html/,
		);
	});

	it('separates agency authority from use-case and applied delivery roles', () => {
		assert.match(article, /Accountable Use Case Owner/);
		assert.match(
			article,
			/https:\/\/www\.digital\.gov\.au\/ai\/ai-in-government-policy\/accountability/,
		);
		assert.match(
			article,
			/https:\/\/www\.digital\.gov\.au\/policy\/ai\/AI-technical-standard\/statement-3/,
		);
		assert.match(article, /same agency-wide mandate/);
		assert.match(article, /harness engineering/i);
		assert.match(
			article,
			/experts must drive this loop rather than appear only at fixed review points/,
		);
		assert.match(
			article,
			/\]\(\/blog\/where-capability-actually-lives-in-agentic-engineering\/\)/,
		);
		assert.match(article, /Advice is not influence unless it can shape the decision\./);
	});

	it('connects the argument to the existing governance thesis', () => {
		assert.match(article, /\]\(\/blog\/mediation-not-intermediation\/\)/);
		assert.match(article, /\]\(\/blog\/the-attacker-moves-second-so-did-i\/\)/);
		assert.doesNotMatch(article, /\/blog\/task-worlds-meta-harness\//);
		assert.match(article, /^## Governance at yesterday’s speed$/m);
		assert.match(article, /^## The appointment metric$/m);
		assert.match(article, /^## The policy got the diagnosis right$/m);
		assert.match(
			article,
			/The implementation question remains\. The appointment is an administrative fact\. Capability is an operating system\./,
		);
		assert.match(article, /^## The leadership defence$/m);
		assert.match(article, /^## Hire for the contradictions$/m);
		assert.doesNotMatch(article, /Badiou’s Event/);
		assert.match(
			article,
			/return the panel’s assumptions in this month’s AI vocabulary/,
		);
		assert.match(
			article,
			/These are signals about AI hiring generally, not a count of qualified Chief AI Officer candidates\./,
		);
		assert.doesNotMatch(article, /^## Measure the operating system$/m);
		assert.doesNotMatch(article, /^## Do not hire the title$/m);
		assert.match(article, /^## Build the room$/m);
		assert.match(article, /active AI communities on Discord and X, and around open-source projects/);
		assert.match(article, /Most of the people I learn from in those communities are under thirty/);
		assert.match(article, /Youth is not a qualification/);
		assert.match(article, /Domain experts and people affected by a system/);
		assert.match(article, /paid, recurring role/);
		assert.match(article, /The accountable leader still decides\./);
		assert.match(article, /A strong Chief AI Officer institutionalises that path\./);
		assert.doesNotMatch(article, /^> Ultimately,/m);
		assert.match(article, /The appointments have created a named door in almost every agency\. Now open it\.\s*$/);
	});

	it('keeps the final editorial claims precise', () => {
		assert.match(article, /Renaming them does not make one decision cycle fit every AI use case\./);
		assert.doesNotMatch(article, /It is knowing, in an instant/);
		assert.doesNotMatch(article, /^That is how leadership works\.$/m);
		assert.match(
			article,
			/leadership system that gives people with the necessary skills standing access to important decisions/,
		);
		assert.match(article, /Interviews should test whether the candidate can hold both sides of a tension at once/);
		assert.match(article, /Ask for an example of evidence that changed their mind\./);
		assert.match(article, /This can be a blind spot in large organisations\./);
		assert.match(article, /That visibility is not proof, so claims still need to be tested against real systems\./);
		assert.match(article, /How do you find people beyond your existing network\?/);
	});
});
