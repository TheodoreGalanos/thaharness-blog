// ABOUTME: Chart datasets for the benchmarking-agents-on-real-engineering-work MDX article.
// ABOUTME: Hero reward, harness ablation, verification gradient, outcome distribution, quality vs cost, bond types, audit frontier.

export const bondTypesData = {
  title: "Agentic bonds · four categories of turn",
  bonds: [
    {
      key: "execution",
      symbol: "E",
      label: "Execution",
      definition:
        "Direct tool invocation — advancing the work without reasoning overhead. The dominant behaviour in well-scaffolded runs.",
    },
    {
      key: "verification",
      symbol: "V",
      label: "Verification",
      definition:
        "Backward-looking error detection — checking results against expected values, re-deriving, comparing row-by-row.",
    },
    {
      key: "deliberation",
      symbol: "D",
      label: "Deliberation",
      definition:
        "Forward-looking reasoning — planning, hypothesis, or explicit chain-of-thought before committing to action.",
    },
    {
      key: "exploration",
      symbol: "X",
      label: "Exploration",
      definition:
        "Considering alternatives — stepping back to weigh a different approach rather than pushing on the current one.",
    },
  ],
  caption:
    'Taxonomy adapted from Du et al., "The molecular structure of thought". Every agent turn in the benchmark is classified into one of these four bond types, giving each trace a behavioural fingerprint independent of its final reward.',
};

export const heroRewardData = {
  title: "Mean reward by task type · across four models",
  categories: [
    {
      key: "single-room-office",
      label: "single-room office",
      description:
        "Single-room heat-load calculation. Effectively saturated for the Anthropic models once the harness supplies an oracle-like calculator — useful as a baseline, not a separator.",
    },
    {
      key: "multi-room-mixed",
      label: "multi-room mixed",
      description:
        "Multi-room calculation across a mixed programme. Same saturation profile as the single-room task for the top three models.",
    },
    {
      key: "audit-office-bldg",
      label: "audit office-bldg",
      description:
        "Auditing an office-building schedule for discrepancies. This is where disciplined checking and completeness start to separate strong agents from stronger ones.",
    },
    {
      key: "audit-mixed-use",
      label: "audit mixed-use",
      description:
        "Mixed-use schedule audit. The hardest task in this set — recall, cross-row consistency, and reliable finish behaviour all matter.",
    },
  ],
  series: [
    {
      key: "sonnet-4-6",
      label: "Sonnet 4.6",
      description:
        "Strongest overall. Treats verification as part of its default workflow rather than a late-stage rescue, which appears to drive its recall lead.",
    },
    {
      key: "haiku-4-5",
      label: "Haiku 4.5",
      description:
        "Second on accuracy, first on value. 96.3% overall reward at substantially lower cost per trial — strongest quality-per-dollar in this run.",
    },
    {
      key: "sonnet-4",
      label: "Sonnet 4",
      description:
        "Solid and cheaper than 4.6, but the newer generation has moved the frontier on audit recall.",
    },
    {
      key: "gpt-4-1-mini",
      label: "GPT-4.1-mini",
      description:
        "34.1% overall reward, 64% zero-rate. A large share of failures were format failures and truncated outputs — not purely reasoning failures.",
    },
  ],
  values: [
    { category: "single-room-office", series: "sonnet-4-6", value: 1.0 },
    { category: "single-room-office", series: "haiku-4-5", value: 1.0 },
    { category: "single-room-office", series: "sonnet-4", value: 1.0 },
    {
      category: "single-room-office",
      series: "gpt-4-1-mini",
      value: 0.46,
      note: "Format failures and truncated outputs drive most of the gap here — the calculation itself is not the limiter.",
    },

    { category: "multi-room-mixed", series: "sonnet-4-6", value: 1.0 },
    { category: "multi-room-mixed", series: "haiku-4-5", value: 1.0 },
    { category: "multi-room-mixed", series: "sonnet-4", value: 1.0 },
    {
      category: "multi-room-mixed",
      series: "gpt-4-1-mini",
      value: 0.46,
      note: "Same failure shape as single-room — the oracle tool handles the math; the finish discipline does not.",
    },

    {
      category: "audit-office-bldg",
      series: "sonnet-4-6",
      value: 0.96,
      note: "Best audit recall. Verification-as-default workflow keeps discrepancies from slipping past.",
    },
    { category: "audit-office-bldg", series: "haiku-4-5", value: 0.93 },
    { category: "audit-office-bldg", series: "sonnet-4", value: 0.9 },
    {
      category: "audit-office-bldg",
      series: "gpt-4-1-mini",
      value: 0.22,
      note: "Heavy collapse — long fluent traces that drift off the assigned schedule.",
    },

    {
      category: "audit-mixed-use",
      series: "sonnet-4-6",
      value: 0.96,
      note: "Holds up on the hardest task. The gap to other frontier models widens here.",
    },
    { category: "audit-mixed-use", series: "haiku-4-5", value: 0.93 },
    { category: "audit-mixed-use", series: "sonnet-4", value: 0.89 },
    {
      category: "audit-mixed-use",
      series: "gpt-4-1-mini",
      value: 0.22,
      note: "Instance substitution and standard hallucination dominate here — the audit slips into a different problem.",
    },
  ],
  domain: [0, 1] as [number, number],
  valueFormat: "decimal-2" as const,
  caption:
    "Mean reward across four task families and four models (n ≈ 30 trials per cell). Hover a bar for task-specific notes; hover a legend pill for a one-line model summary. Calculation tasks are effectively saturated for the Anthropic models; audit tasks expose the real spread.",
};

export const ablationData = {
  title: "Harness ablation",
  subject: "Sonnet 4.6, office-building audit",
  bars: [
    {
      key: "L0",
      label: "L0",
      value: 0.0,
      note: "Bare problem statement, no embedded formulas or lookup table. All zero-score trials — once the method is not carried by the environment, the task collapses.",
    },
    {
      key: "L1",
      label: "L1",
      value: 0.0,
      note: "Effectively the same as L0 in the current task set — informative in its own right. Still zero across the board.",
    },
    {
      key: "L2",
      label: "L2",
      value: 0.0,
      note: "Adds psychrometric constants and explicit outside-air rules. Does not rescue the task.",
    },
    {
      key: "L3",
      label: "L3",
      value: 0.0,
      note: "Replaces L2 support with a compact AS 1668.2 reference table and general calculation guidance. Still collapses to zero.",
    },
    {
      key: "No-tool",
      label: "No-tool",
      value: 0.153,
      note: "Removes the calculator tool entirely — the model must audit directly from prompt context. One perfect trial, one partial, eight zeroes.",
    },
  ],
  baseline: {
    value: 0.966,
    label: "tool baseline · 0.966",
    note: "Sonnet 4.6 with the full tool-enabled harness on the same office-building audit set. Strong performance, many perfect trials.",
  },
  domain: [0, 1] as [number, number],
  valueFormat: "decimal-3" as const,
  caption:
    "Mean reward for Sonnet 4.6 on the office-building audit as harness support is removed in stages. Reducing the turn budget is a degradation; removing guidance is a collapse. The gap between harness-enabled and low-guidance performance is larger than most model-to-model differences in this run.",
};

export const verificationGradientData = {
  title: "Verification behaviour · perfect traces vs worst outcome",
  categories: [
    {
      key: "sonnet-4-6",
      label: "Sonnet 4.6",
      description:
        "Highest baseline verification at 23% of perfect traces — treats checking as part of default workflow, not a late-stage rescue. Moderate gradient to 40% in the worst bucket.",
    },
    {
      key: "haiku-4-5",
      label: "Haiku 4.5",
      description:
        "Steepest gradient of any model (+24pp). Verification shoots up when traces start struggling — strong runtime distress signal, useful for monitoring.",
    },
    {
      key: "sonnet-4",
      label: "Sonnet 4",
      description:
        "Rigid workhorse pattern. Low verification baseline (11%) in successful traces, clear jump to 32% in failing ones.",
    },
    {
      key: "gpt-4-1-mini",
      label: "GPT-4.1-mini",
      description:
        "Shallowest gradient (+5pp). Success and failure are behaviourally near-indistinguishable — hard to rescue a model that does not reveal when it is failing.",
    },
  ],
  series: [
    {
      key: "perfect",
      label: "Perfect",
      description:
        "Verification share across turns in perfect-reward trajectories. Higher values suggest verification is a default habit, not a distress response.",
      accent: "#7ab5af",
    },
    {
      key: "worst",
      label: "Worst bucket",
      description:
        "Verification share across turns in the worst-outcome bucket (zero / partial). The gap to the perfect-trace share is the runtime distress gradient.",
      accent: "#d87b55",
    },
  ],
  values: [
    {
      category: "sonnet-4-6",
      series: "perfect",
      value: 0.23,
      note: "Highest success-case verification of any model — checking is part of the default workflow.",
    },
    { category: "sonnet-4-6", series: "worst", value: 0.4 },
    { category: "haiku-4-5", series: "perfect", value: 0.14 },
    {
      category: "haiku-4-5",
      series: "worst",
      value: 0.38,
      note: "Biggest jump from success (+24pp). Strong behavioural tell when things go wrong.",
    },
    { category: "sonnet-4", series: "perfect", value: 0.11 },
    { category: "sonnet-4", series: "worst", value: 0.32 },
    { category: "gpt-4-1-mini", series: "perfect", value: 0.13 },
    {
      category: "gpt-4-1-mini",
      series: "worst",
      value: 0.18,
      note: "Only 5pp above its success rate — weak distress signal makes runtime intervention hard.",
    },
  ],
  domain: [0, 0.5] as [number, number],
  valueFormat: "percent-0" as const,
  caption:
    "Verification turn share across four models, split by outcome bucket. All models verify more when struggling, but the gradient varies sharply: Haiku swings the most, GPT-4.1-mini barely reacts, and Sonnet 4.6 sits with the highest baseline. Source: 477 classified turns from the aurecon-bench heat-load benchmark.",
};

export const outcomeDistributionData = {
  title: "Outcome distribution · per-trace reward, 20 buckets",
  models: [
    {
      key: "sonnet-4-6",
      label: "Sonnet 4.6",
      bins: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 11, 104],
      total: 120,
      mean: 0.983,
      zeros: 0,
      perfect: 104,
      accent: "#e8a84c",
      note: "Tightly concentrated at the top — 104 of 120 are exact-perfect, sixteen more land in the high-partial tail (0.7–0.95), and there are zero zero-score trials.",
    },
    {
      key: "haiku-4-5",
      label: "Haiku 4.5",
      bins: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 23, 83],
      total: 118,
      mean: 0.963,
      zeros: 0,
      perfect: 82,
      accent: "#7ab5af",
      note: "Also bunched at the top, but with a longer partial tail — 23 traces in the 0.9–0.95 band and 12 in 0.8–0.85 trade small accuracy hits for a very different cost profile.",
    },
    {
      key: "sonnet-4",
      label: "Sonnet 4",
      bins: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 23, 0, 10, 82],
      total: 118,
      mean: 0.947,
      zeros: 0,
      perfect: 81,
      accent: "#5a8a84",
      note: "Broader spread into the partial range, visible around 0.65–0.75. Zero zero-score trials, but noticeably more audit recall misses than the newer generation models.",
    },
    {
      key: "gpt-4-1-mini",
      label: "GPT-4.1-mini",
      bins: [77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 2, 34],
      total: 120,
      mean: 0.341,
      zeros: 77,
      perfect: 33,
      accent: "#d87b55",
      note: "Strongly bimodal. 77 of 120 traces are outright zeros — mostly format failures and truncated outputs — with a separate cluster of 34 exact-perfect runs. The shape matters as much as the mean.",
    },
  ],
  caption:
    "Per-trace reward across ~120 trials per model, in 0.05-wide buckets. Average reward compresses this story — the real difference is failure shape. GPT-4.1-mini's 77-trace zero spike is the article's central point about why cheap wrong answers are not a bargain.",
};

export const auditMixedUseFrontierData = {
  title: "Audit mixed-use · trial outcomes by model",
  categories: [
    {
      key: "gpt-4-1-mini",
      label: "GPT-4.1-mini",
      total: 30,
      description:
        "Hardest audit in the set. Only 1 exact-perfect trial — 6 partials and 23 outright zeros. Format failures and instance drift dominate.",
    },
    {
      key: "sonnet-4",
      label: "Sonnet 4",
      total: 30,
      description:
        "6 exact-perfect, 24 partial, zero zero-score trials. Much cleaner finish discipline than GPT-4.1-mini, but clearly behind the newer Anthropic generation.",
    },
    {
      key: "haiku-4-5",
      label: "Haiku 4.5",
      total: 29,
      description:
        "7 exact-perfect, 22 partial, zero zeros (n = 29 — one trial missing from this cohort). Similar perfect-count to Sonnet 4 at a very different cost profile.",
    },
    {
      key: "sonnet-4-6",
      label: "Sonnet 4.6",
      total: 30,
      description:
        "18 exact-perfect — more than double the next best. Zero zero-score trials. This task is where the capability frontier sits.",
    },
  ],
  series: [
    {
      key: "perfect",
      label: "Perfect (1.0)",
      description:
        "Trials with exact 1.0 reward — the audit is fully correct and the output is well-formatted.",
      accent: "#e8a84c",
    },
    {
      key: "partial",
      label: "Partial (0 < r < 1)",
      description:
        "Trials with some correctness but verifier-flagged issues — missed discrepancies, shallow checks, or output-contract drift.",
      accent: "#7ab5af",
    },
    {
      key: "zero",
      label: "Zero (0.0)",
      description:
        "Trials the audit never landed — format failures, truncated outputs, or drift off the assigned schedule entirely.",
      accent: "#d87b55",
    },
  ],
  values: [
    { category: "gpt-4-1-mini", series: "perfect", value: 1 },
    {
      category: "gpt-4-1-mini",
      series: "partial",
      value: 6,
      note: "Partial credit on this task was rare — when reward was non-zero but non-perfect, the trace usually reached some discrepancies before drifting or truncating.",
    },
    {
      category: "gpt-4-1-mini",
      series: "zero",
      value: 23,
      note: "77% of trials hit zero on this task — the article's heavy zero-score tail, driven by instance substitution and format failures.",
    },

    { category: "sonnet-4", series: "perfect", value: 6 },
    { category: "sonnet-4", series: "partial", value: 24 },

    { category: "haiku-4-5", series: "perfect", value: 7 },
    { category: "haiku-4-5", series: "partial", value: 22 },

    {
      category: "sonnet-4-6",
      series: "perfect",
      value: 18,
      note: "The frontier finding — 18 of 30 on the hardest audit is more than double the next-best Anthropic model, and 18× GPT-4.1-mini.",
    },
    { category: "sonnet-4-6", series: "partial", value: 12 },
  ],
  domainMax: 30,
  yTicks: [0, 10, 20, 30],
  yLabel: "trials (of 30)",
  caption:
    "Audit mixed-use is where the benchmark separates strong agents from stronger ones. Exact-perfect counts diverge sharply (1 / 6 / 7 / 18), and the failure shape differs too: GPT-4.1-mini's 23 zeros against zero zeros for all three Anthropic models. Haiku 4.5 shows 29 trials — one was missing from the cohort.",
};

export const qualityVsCostData = {
  title: "Quality vs estimated cost · per trial",
  data: [
    {
      key: "sonnet-4-6",
      label: "Sonnet 4.6",
      cost: 0.35,
      reward: 0.98,
      accent: "#e8a84c",
      note: "Highest quality ceiling. Output verbosity pushes the cost up — long traces limit how much prompt caching can rescue.",
    },
    {
      key: "haiku-4-5",
      label: "Haiku 4.5",
      cost: 0.08,
      reward: 0.96,
      accent: "#7ab5af",
      note: "The quality-per-dollar sweet spot. Fast, much cheaper than Sonnet 4.6, and accurate enough to dominate on reward²-per-$.",
    },
    {
      key: "sonnet-4",
      label: "Sonnet 4",
      cost: 0.25,
      reward: 0.95,
      accent: "#5a8a84",
      note: "Middle of the pack. Cheaper than 4.6, clearly ahead of GPT-4.1-mini, but the newer generation has moved the frontier.",
    },
    {
      key: "gpt-4-1-mini",
      label: "GPT-4.1-mini",
      cost: 0.02,
      reward: 0.34,
      accent: "#d87b55",
      note: "Cheapest in raw dollars, but too much of the spend was wasted on unusable or incomplete outputs. A cheap wrong answer is not a bargain.",
    },
  ],
  xDomain: [0, 0.4] as [number, number],
  yDomain: [0, 1] as [number, number],
  caption:
    "Approximate per-trial cost estimated from public per-token pricing × typical trial token usage (20-turn budget, oracle-tool-enabled). Reward is the overall mean across task families. Exact per-model billing was not captured during the run — treat costs as order-of-magnitude.",
};
