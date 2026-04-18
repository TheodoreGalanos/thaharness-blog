// ABOUTME: Chart datasets for the what-if-the-harness-could-improve-itself MDX article.
// ABOUTME: Bonds comparison (perfect vs partial), Claude session2/L0 trajectories.

export const bondsComparisonData = {
  title: "Behavioural profile · perfect vs partial Claude traces",
  categories: [
    {
      key: "execution",
      label: "execution",
      description:
        "Direct tool invocation — advancing the work without reasoning overhead. Perfect traces spent more time here.",
    },
    {
      key: "verification",
      label: "verification",
      description:
        "Backward-looking checking — comparing results against expected values. Partial traces verified more, not less.",
    },
    {
      key: "deliberation",
      label: "deliberation",
      description:
        "Forward-looking reasoning about how to proceed. Present in 56% of partial traces but only 25% of perfect ones.",
    },
  ],
  series: [
    {
      key: "perfect",
      label: "perfect · 1.0",
      description:
        "Twelve traces that scored 1.0. Execution-dominant, with verification concentrated in later blocks rather than interleaved throughout.",
      accent: "#e8a84c",
    },
    {
      key: "partial",
      label: "partial · 0.9",
      description:
        "Eighteen traces that scored 0.9 — one missed error. Roughly balanced execution and verification; higher deliberation than perfect runs.",
      accent: "#7ab5af",
    },
  ],
  values: [
    {
      category: "execution",
      series: "perfect",
      value: 0.555,
      note: "Perfect agents front-loaded decisive execution — 58% opened with three consecutive exec turns.",
    },
    {
      category: "execution",
      series: "partial",
      value: 0.453,
      note: "Only 28% of partial traces opened with three consecutive exec turns — most interrupted themselves earlier.",
    },
    {
      category: "verification",
      series: "perfect",
      value: 0.419,
      note: "Verification concentrated in the second half — 55% of later-half turns, up from 28% early.",
    },
    {
      category: "verification",
      series: "partial",
      value: 0.49,
      note: "Verification more evenly spread — 41% early, 55% late. More volume, less timing structure.",
    },
    {
      category: "deliberation",
      series: "perfect",
      value: 0.026,
      note: "Barely present. When deliberation appears, it tends to signal uncertainty rather than carefulness.",
    },
    {
      category: "deliberation",
      series: "partial",
      value: 0.058,
      note: "More than double the rate of perfect traces. Often correlates with the trace going off-track.",
    },
  ],
  domain: [0, 0.6] as [number, number],
  valueFormat: "percent-1" as const,
  caption:
    "Thirty Claude Sonnet 4.6 traces from the five-instance full-reference run, classified by the agentic-bonds framework. Exploration was effectively absent and is omitted. The counterintuitive headline: perfect traces are less verification-heavy than partial ones — the difference is timing, not volume.",
};

export const session2TrajectoryData = {
  title: "Claude · five-instance full-reference trajectory",
  subject: "mean reward across Adelaide, Brisbane, Darwin, Melbourne, Perth",
  baseline: {
    value: 0.94,
    label: "baseline · 0.94",
    note: "Original prompt — three instances at 0.9, two at 1.0. The goal for each iteration is to cross this dashed line without ballooning token cost.",
  },
  bars: [
    {
      key: "iter1",
      label: "iter 1",
      value: 0.94,
      suffix: "−1%",
      note: 'Add completeness rule — "verify every room, a missed error costs more than an extra turn." No reward change; the instruction was redundant.',
    },
    {
      key: "iter2",
      label: "iter 2",
      value: 0.94,
      suffix: "+24%",
      note: "Zero tolerance for numerical mismatches. No reward change, but the agent re-checked more and found nothing new — 64 turns, 685k tokens.",
    },
    {
      key: "iter3",
      label: "iter 3",
      value: 0.94,
      suffix: "+95%",
      note: "Two-pass restructure — sweep totals, then deep-dive flagged rooms. No reward improvement, efficiency nearly doubled at 79 turns and 1.08M tokens.",
    },
    {
      key: "iter4",
      label: "iter 4",
      value: 0.98,
      suffix: "+11%",
      highlight: true,
      note: "Systematic per-room checklist — (a) inputs, (b) components, (c) ventilation, (d) totals. Adelaide and Melbourne both jumped from 0.9 to 1.0. Only Darwin remained at 0.9.",
    },
  ],
  domain: [0.7, 1.0] as [number, number],
  valueFormat: "decimal-2" as const,
  caption:
    "Four prompt iterations against the 0.94 baseline. Three approaches tried to add more work; the fourth structured the existing work. The winner was two sentences of explicit per-room checklist — 11% extra tokens, +4 points of reward.",
};

export const session3L0TrajectoryData = {
  title: "Claude · L0 trajectory on Adelaide",
  subject: "single-instance reward at the thinnest reference level",
  baseline: {
    value: 0.73,
    label: "baseline · 0.73",
    note: "Original prompt on Adelaide L0. The agent found 2 of 3 planted issues but also produced false positives.",
  },
  bars: [
    {
      key: "iter1",
      label: "iter 1",
      value: 0.83,
      suffix: "248k",
      note: "Confidence threshold — only report an error if the specific assumption, parameter, or formula can be identified. False positives removed; 2/3 findings kept.",
    },
    {
      key: "iter2",
      label: "iter 2",
      value: 0.53,
      suffix: "407k",
      note: "Full-reference winner imported wholesale. Backfired — false positives returned and reward collapsed. Granular checks need anchors that L0 doesn't supply.",
    },
    {
      key: "iter3",
      label: "iter 3",
      value: 1.0,
      suffix: "104k",
      highlight: true,
      note: "Cross-room consistency rule — compare similar rooms and investigate large relative differences. All 3 issues found, no false positives, token usage sharply down.",
    },
    {
      key: "iter5",
      label: "iter 5",
      value: 1.0,
      suffix: "258k",
      note: "Added a design-conditions note on top of iter 3. Same 1.0 reward, significantly worse efficiency — extra guidance didn't pay off.",
    },
  ],
  domain: [0.4, 1.0] as [number, number],
  valueFormat: "decimal-2" as const,
  caption:
    "Same task family, much thinner information environment. The full-reference winner backfires: at L0 the right prompt is uncertainty management and relative comparison, not granular checking. Still single-instance — the generalisation question stays open.",
};

export const strategyContrastData = {
  title: "Strategy contrast · what wins at each reference level",
  items: [
    {
      key: "full-reference",
      symbol: "FR",
      label: "full reference",
      definition:
        "Systematic granular verification — per-room checklist: (a) inputs, (b) each heat-gain component, (c) ventilation terms, (d) totals. Works because every check can be anchored against supplied formulas, tables, and design conditions.",
    },
    {
      key: "l0",
      symbol: "L0",
      label: "thinnest reference",
      definition:
        "Uncertainty management plus relative comparison — confidence thresholds to suppress unsupported findings, cross-room consistency to flag large differences. Works because it does not require external anchors the environment no longer supplies.",
    },
  ],
  caption:
    "Prompt strategy is conditional on information availability. The same per-room checklist that lifts reward at full reference actively hurts at L0. Removing reference material changes which kind of guidance is useful.",
};

export const crossmodelL0Data = {
  title: "Cross-model L0 · same strategy, different wording, different ceiling",
  items: [
    {
      key: "claude",
      symbol: "C",
      label: "claude sonnet 4.6",
      definition:
        "Baseline 0.73 → best 1.00. Confidence threshold plus cross-room consistency; advisory wording was sufficient — the model adopted soft constraints readily. Remained relatively execution-compatible in its winning run.",
    },
    {
      key: "gpt41mini",
      symbol: "G",
      label: "gpt-4.1-mini",
      definition:
        "Baseline 0.37 → best 0.83. Same high-level strategy, but the instruction had to be rewritten as a hard verification gate. Winning run leaned much more heavily on verification than Claude's did.",
    },
  ],
  caption:
    "Strategy transfers across model families. Wording does not. Prompt portability has two layers — the underlying idea may travel, but the instruction style must match how each model follows rules.",
};

export const architectureData = {
  title: "Autoresearch architecture · information flow",
  topLayer: {
    key: "agent",
    kicker: "$ autoresearcher_agent",
    label: "runs locally · claude code + program.md",
    items: [
      { text: "edit workflow prompt" },
      { text: "git commit" },
      { text: "read reward, failure modes, bond summaries" },
      {
        kind: "note" as const,
        text: "never reads raw task files, verifier code, or full transcripts",
      },
    ],
  },
  barrier: {
    label: "information barrier",
    downLabel: "prompt change, trigger",
    upLabel: "sanitised summary · patterns, not answers",
  },
  bottomLayers: [
    {
      key: "scripts",
      kicker: "$ support_scripts",
      label: "enforce the barrier · produce summaries",
      items: [
        { text: "run_experiment.py — trigger Harbor job" },
        { text: "feedback.py — strip details, run bonds" },
        { text: "results.py — append to TSV audit trail" },
      ],
    },
    {
      key: "sandbox",
      kicker: "$ experiment_sandbox",
      label: "unchanged from the benchmark harness",
      items: [
        { text: "docker containers + agents" },
        { text: "verifier + output contracts" },
        {
          kind: "note" as const,
          text: "only the mounted workflow prompt changes between iterations",
        },
      ],
    },
  ],
  caption:
    "Three layers with a strict flow. The autoresearcher only ever sees sanitised patterns about how runs went; raw trial outputs stay behind the barrier with the sandbox and support scripts. That structural separation is the single thing that distinguishes this setup from Karpathy's original autoresearch.",
};

export const session4Gpt41miniTrajectoryData = {
  title: "GPT-4.1-mini · L0 trajectory on Adelaide",
  subject: "seven iterations · one winner kept, others discarded or crashed",
  baseline: {
    value: 0.37,
    label: "baseline · 0.37",
    note: "Original prompt on Adelaide L0 with GPT-4.1-mini. Found 1 of 3 planted issues and produced 18 false positives — 180k tokens, much worse than Claude's baseline.",
  },
  bars: [
    {
      key: "confidence",
      label: "iter 1",
      value: 0.28,
      suffix: "69k",
      note: "Confidence threshold (advisory wording). The soft instruction that worked for Claude did not work here — GPT-4.1-mini did not reliably adopt it.",
    },
    {
      key: "verification-gate",
      label: "iter 2",
      value: 0.83,
      suffix: "101k",
      highlight: true,
      note: "Verification gate — rewritten as a hard prohibition: do not report a discrepancy unless the tool confirms it. False positives dropped from 18 to 0; reward more than doubled. Kept.",
    },
    {
      key: "systematic",
      label: "iter 3",
      value: 0.0,
      suffix: "123k",
      note: "Systematic coverage added on top of the gate. Reward collapsed to zero — more instructions diluted the one that was working.",
    },
    {
      key: "second-pass",
      label: "iter 4",
      value: 0.0,
      suffix: "14k",
      note: "Second-pass review layer. bc syntax crash at turn 4 — the model could not execute the workflow at all. Zero reward, no recovery.",
    },
    {
      key: "tool-usage",
      label: "iter 5",
      value: 0.28,
      suffix: "30k",
      note: "Tool-usage guidance. Back above zero but still well below the winning iteration. Discarded.",
    },
    {
      key: "component",
      label: "iter 6",
      value: 0.83,
      suffix: "109k",
      note: "Component comparison. Matched the winning reward but with higher token cost and no measurable generalisation — discarded in favour of the simpler iter-2 prompt.",
    },
  ],
  domain: [0, 1.0] as [number, number],
  valueFormat: "decimal-2" as const,
  caption:
    "The GPT-4.1-mini ceiling looks different from Claude's. Baseline collapses to zero, one iteration doubles reward, and piling more structure on top either dilutes the winner or crashes the run. Strategy transferred from the Claude L0 work; wording had to become strictly prohibitive.",
};

export const crossModelBondsL0Data = {
  title: "Cross-model behavioural profile · at L0",
  categories: [
    {
      key: "execution",
      label: "execution",
      description:
        "Direct tool invocation. Claude's perfect L0 runs dominate here — the model commits to actions and sustains them.",
    },
    {
      key: "verification",
      label: "verification",
      description:
        "Backward-looking checking. GPT-4.1-mini's non-zero runs lean on verification more than Claude's do, even in the winning prompt.",
    },
    {
      key: "deliberation",
      label: "deliberation",
      description:
        "Forward-looking reasoning about how to proceed. The zero-reward GPT-4.1-mini traces spend a quarter of turns here — uncertainty expressed as wheel-spinning rather than decisive action.",
    },
  ],
  series: [
    {
      key: "claude-perfect",
      label: "claude · L0 perfect",
      description:
        "Two Claude Sonnet 4.6 traces that scored 1.0 on Adelaide L0. Execution-dominant, low verification, deliberation compressed.",
      accent: "#e8a84c",
    },
    {
      key: "claude-partial",
      label: "claude · L0 partial",
      description:
        "Three Claude traces that did not reach 1.0. More verification, slightly more deliberation — the familiar hedging pattern from the full-reference partial traces.",
      accent: "#c49a4e",
    },
    {
      key: "gpt-nonzero",
      label: "gpt-4.1-mini · non-zero",
      description:
        "Five GPT-4.1-mini traces that scored above zero. Execution-present but verification-heavier than Claude's wins — the hard gate leaves behavioural residue.",
      accent: "#7ab5af",
    },
    {
      key: "gpt-zero",
      label: "gpt-4.1-mini · zero",
      description:
        "Two GPT-4.1-mini traces that scored zero. Deliberation spikes to 25% — the model is reasoning about what to do rather than doing it. Spinning wheels.",
      accent: "#d87b55",
    },
  ],
  values: [
    {
      category: "execution",
      series: "claude-perfect",
      value: 0.58,
      note: "Claude's perfect L0 runs open and close decisively — highest execution share in the grid.",
    },
    {
      category: "execution",
      series: "claude-partial",
      value: 0.41,
      note: "Still execution-leading, but lower than the perfect runs — mirrors the full-reference partial pattern.",
    },
    {
      category: "execution",
      series: "gpt-nonzero",
      value: 0.49,
      note: "GPT-4.1-mini's working runs execute plenty — but not as heavily as Claude's wins.",
    },
    {
      category: "execution",
      series: "gpt-zero",
      value: 0.38,
      note: "Even in failure, GPT-4.1-mini tries actions — but fewer of them translate into progress.",
    },
    {
      category: "verification",
      series: "claude-perfect",
      value: 0.24,
      note: "Claude's L0 wins verified less than its partial traces — timing, not volume, carries the work.",
    },
    {
      category: "verification",
      series: "claude-partial",
      value: 0.36,
      note: "Partial Claude runs hedged with extra verification — didn't lift the reward.",
    },
    {
      category: "verification",
      series: "gpt-nonzero",
      value: 0.36,
      note: "The hard verification gate worked but left GPT-4.1-mini verification-heavier than Claude's L0 winners.",
    },
    {
      category: "verification",
      series: "gpt-zero",
      value: 0.38,
      note: "Zero-reward GPT-4.1-mini runs verified at roughly the same rate as its successful runs — the verification was just looking at broken work.",
    },
    {
      category: "deliberation",
      series: "claude-perfect",
      value: 0.18,
      note: "Present but compressed. Where it appears, it tends to precede a decisive block of execution.",
    },
    {
      category: "deliberation",
      series: "claude-partial",
      value: 0.21,
      note: "Slightly higher — consistent with the full-reference pattern where more deliberation correlated with worse outcomes.",
    },
    {
      category: "deliberation",
      series: "gpt-nonzero",
      value: 0.12,
      note: "Low — once the hard gate is in place, GPT-4.1-mini stops reasoning about what to do and follows the rule.",
    },
    {
      category: "deliberation",
      series: "gpt-zero",
      value: 0.25,
      note: "Highest in the grid. Zero-reward traces spin wheels in deliberation rather than committing to action. The failure mode has a behavioural signature.",
    },
  ],
  domain: [0, 0.65] as [number, number],
  valueFormat: "percent-0" as const,
  caption:
    "Four behavioural profiles across two models at L0. Exploration is omitted (≤3% everywhere). The story in three bars: Claude's wins are execution-dominant, GPT-4.1-mini's wins lean more on verification, and GPT-4.1-mini's failures are deliberation-heavy — the model reasons its way into a zero.",
};
