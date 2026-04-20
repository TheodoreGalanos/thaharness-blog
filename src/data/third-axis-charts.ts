// ABOUTME: Chart datasets for the-third-axis MDX article — harness evolution experiments.
// ABOUTME: Exp 1 Haiku trajectory, Exp 2 by-arm reward/bonds/advisor + frontier-is-a-dot.

// Aurecon-adjacent palette tokens used across the third-axis charts.
// Haiku = dark teal, 4.1-mini = burnt orange, accent = warm amber.
const COLOR_HAIKU = "#7ab5af";
const COLOR_HAIKU_ALT = "#b8d4d0";
const COLOR_MINI = "#d87b55";
const COLOR_MINI_ALT = "#c26143";
const COLOR_ACCENT = "#e8a84c";
const COLOR_CORAL = "#bf4d43";
const COLOR_FOREST = "#7a9e6e";
const COLOR_DIM = "#605850";
const COLOR_GRID = "#332c24";

// ---------------------------------------------------------------------------
// Figure 3a — Experiment 1 blank-start Haiku trajectory.
// Prose: 1–5 plateau at 0.85, cycle 6 peak 1.00, cycle 7 regression 0.70,
// cycles 8–10 back to 0.85.
// ---------------------------------------------------------------------------

export const experiment1TrajectoryData = {
  title: "Experiment 1 · blank-start Haiku on voltage-drop",
  subtitle: "single-seed reward trajectory across ten evolution cycles",
  yLabel: "↑ mean reward",
  xLabel: "evolution cycle →",
  yDomain: [0.6, 1.05] as [number, number],
  baseline: {
    value: 0.85,
    label: "stock Haiku baseline · 0.85",
    note: "One-line system prompt plus the calculator tool — four of five tasks solved before any evolution runs.",
  },
  series: [
    {
      key: "run-h",
      label: "Run H",
      accent: COLOR_HAIKU,
      points: [
        { cycle: 1, value: 0.85 },
        { cycle: 2, value: 0.85 },
        { cycle: 3, value: 0.85 },
        { cycle: 4, value: 0.85 },
        { cycle: 5, value: 0.85 },
        { cycle: 6, value: 1.0 },
        { cycle: 7, value: 0.7 },
        { cycle: 8, value: 0.85 },
        { cycle: 9, value: 0.85 },
        { cycle: 10, value: 0.85 },
      ],
      note: "Haiku on ten voltage-drop instances. Blank start, one-line prompt, no worked examples.",
    },
  ],
  markers: [
    {
      cycle: 6,
      value: 1.0,
      label: "peak",
      accent: COLOR_ACCENT,
      note: 'Cycle 6 mutation removed the unused 90°C XLPE table and trimmed cable sizes, then added one line: "Single-phase: Vc accounts for both conductors." Less plus clearer beat more plus exhaustive.',
    },
    {
      cycle: 7,
      value: 0.7,
      label: "regression",
      accent: COLOR_CORAL,
      note: "One mutation too far. Two previously-working tasks broke. Cycles 8–10 recovered to the 0.85 plateau — the 1.00 run is preserved by git tag only.",
    },
  ],
  caption:
    "Single seed, single task family. The peak-and-walkoff shape generalised — a second independent regression appears on arm 5 seed 42 in Experiment 2. Hill-climb finds peaks; preserving them is a separate concern, borrowed from deployment rather than from ML.",
};

// ---------------------------------------------------------------------------
// Figure 4a — Experiment 2 reward trajectory by arm.
// Six arms × ten cycles, with min-max bands where N=3.
// Data pulled verbatim from _analysis/plot_data/reward_by_cycle.csv.
// ---------------------------------------------------------------------------

export const experiment2TrajectoryData = {
  title: "Experiment 2 · reward by arm across ten evolution cycles",
  subtitle: "six arms, three seeds each on arms 5–8",
  yLabel: "↑ mean reward",
  xLabel: "evolution cycle →",
  yDomain: [0, 1.05] as [number, number],
  baseline: {
    value: 0.85,
    label: "stock Haiku baseline · 0.85",
    note: "Experiment 1's blank-start floor — the score Haiku hits on this task with a one-line prompt.",
  },
  series: [
    {
      key: "arm6",
      label: "arm 6 · Haiku + hint",
      accent: COLOR_HAIKU,
      executor: "haiku",
      points: [
        { cycle: 1, value: 0.883, min: 0.8, max: 1.0 },
        { cycle: 2, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 3, value: 0.867, min: 0.8, max: 0.95 },
        { cycle: 4, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 5, value: 0.983, min: 0.95, max: 1.0 },
        { cycle: 6, value: 0.917, min: 0.85, max: 0.95 },
        { cycle: 7, value: 0.925, min: 0.85, max: 1.0 },
        { cycle: 8, value: 0.925, min: 0.85, max: 1.0 },
        { cycle: 9, value: 1.0, min: 1.0, max: 1.0 },
        { cycle: 10, value: 0.925, min: 0.85, max: 1.0 },
      ],
      note: 'Haiku with the 400-character "call when stuck" hint. Final 0.93 ± 0.06, advisor called 4 times across 3 seeds — always on seeds that ended below 1.00.',
    },
    {
      key: "arm7",
      label: "arm 7 · Haiku + Anthropic verbatim",
      accent: COLOR_HAIKU_ALT,
      executor: "haiku",
      points: [
        { cycle: 1, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 2, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 3, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 4, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 5, value: 0.933, min: 0.85, max: 1.0 },
        { cycle: 6, value: 0.917, min: 0.85, max: 1.0 },
        { cycle: 7, value: 0.95, min: 0.95, max: 0.95 },
        { cycle: 8, value: 0.95, min: 0.95, max: 0.95 },
        { cycle: 9, value: 0.95, min: 0.95, max: 0.95 },
        { cycle: 10, value: 0.95, min: 0.95, max: 0.95 },
      ],
      note: "Same Haiku, same task, same evolver — only the advisor-guidance prompt length differs from arm 6 (2,300 vs 400 characters). Final reward identical at 0.93 ± 0.06. The prompt-length knob is not a lever on this task.",
    },
    {
      key: "arm8",
      label: "arm 8 · 4.1-mini + Anthropic verbatim",
      accent: COLOR_MINI,
      executor: "mini",
      points: [
        { cycle: 1, value: 0.7, min: 0.6, max: 0.8 },
        { cycle: 2, value: 0.55, min: 0.4, max: 0.8 },
        { cycle: 3, value: 0.6, min: 0.4, max: 0.8 },
        { cycle: 4, value: 0.4, min: 0.2, max: 0.6 },
        { cycle: 5, value: 0.517, min: 0.4, max: 0.6 },
        { cycle: 6, value: 0.467, min: 0.4, max: 0.6 },
        { cycle: 7, value: 0.65, min: 0.6, max: 0.75 },
        { cycle: 8, value: 0.45, min: 0.35, max: 0.6 },
        { cycle: 9, value: 0.3, min: 0.2, max: 0.4 },
        { cycle: 10, value: 0.5, min: 0.4, max: 0.6 },
      ],
      note: "GPT-4.1-mini with Anthropic's full 2,300-character advisor-timing block pre-installed. Final 0.53 ± 0.09 — the strongest available prompt scaffold still lands below stock Haiku.",
    },
    {
      key: "arm5",
      label: "arm 5 · 4.1-mini + hint",
      accent: COLOR_MINI_ALT,
      executor: "mini",
      points: [
        { cycle: 1, value: 0.467, min: 0.4, max: 0.6 },
        { cycle: 2, value: 0.183, min: 0.0, max: 0.4 },
        { cycle: 3, value: 0.667, min: 0.4, max: 0.8 },
        { cycle: 4, value: 0.2, min: 0.0, max: 0.4 },
        { cycle: 5, value: 0.317, min: 0.2, max: 0.4 },
        { cycle: 6, value: 0.533, min: 0.4, max: 0.6 },
        { cycle: 7, value: 0.517, min: 0.4, max: 0.75 },
        { cycle: 8, value: 0.65, min: 0.6, max: 0.75 },
        { cycle: 9, value: 0.417, min: 0.25, max: 0.6 },
        { cycle: 10, value: 0.583, min: 0.55, max: 0.6 },
      ],
      note: "GPT-4.1-mini with the 400-character hint. Cycle 2 seed 42 regressed to 0.00 — a second independent instance of the Experiment 1 peak-and-walkoff shape, on a different executor and a different mutation target.",
    },
    {
      key: "arm4",
      label: "arm 4 · 4.1-mini evolved (N=1)",
      accent: "#8f5a3f",
      executor: "mini",
      dashed: true,
      points: [
        { cycle: 1, value: 1.0 },
        { cycle: 2, value: 0.6 },
        { cycle: 3, value: 0.8 },
        { cycle: 4, value: 0.6 },
        { cycle: 5, value: 0.6 },
        { cycle: 6, value: 0.2 },
        { cycle: 7, value: 0.2 },
        { cycle: 8, value: 0.6 },
        { cycle: 9, value: 0.6 },
        { cycle: 10, value: 0.4 },
      ],
      note: "Single-seed anchor in the v2 tree (five additional seeds cross-validate in the v1 tree). Evolution proposed read-before-act and cable-sizing skills at cycle 8 — score jumped 0.20 → 0.60 before regressing.",
    },
  ],
  caption:
    "Per-cycle mean reward; shaded band spans min–max across three seeds (arms 5–8). Haiku arms cluster at the top, 4.1-mini arms cluster around 0.5 — no crossover across 585 trials. The two-cluster shape is the finding.",
};

// ---------------------------------------------------------------------------
// Figure 4b — bond distributions (horizontal stacked bars).
// Data from _analysis/plot_data/bond_distribution.csv.
// Order: Haiku arms at top, 4.1-mini arms below — matches the brainstorm.
// ---------------------------------------------------------------------------

export const bondDistributionData = {
  title: "Bond distribution · six arms, two disjoint clusters",
  subtitle: "per-arm fraction of assistant turns classified X / E / V / D",
  groups: [
    {
      key: "haiku",
      label: "Haiku 4.5",
      note: "12–13% exploration, <1.5% deliberation. First turn is almost always `--help`.",
    },
    {
      key: "mini",
      label: "GPT-4.1-mini",
      note: "0% exploration across nine seeds; 19–26% deliberation that correlates with hallucinated-table failures.",
    },
  ],
  segments: [
    {
      key: "X",
      label: "exploration",
      accent: COLOR_ACCENT,
      description:
        "Branching, considering alternatives, orientation steps like `--help`. Prevents hallucinated lookups by reading the environment first.",
    },
    {
      key: "E",
      label: "execution",
      accent: COLOR_DIM,
      description:
        "Forward motion — tool calls, code runs, formatting an answer. The dominant behaviour in any productive run.",
    },
    {
      key: "V",
      label: "verification",
      accent: COLOR_HAIKU,
      description:
        "Backward-looking checking — comparing output against expected values, re-deriving, catching errors.",
    },
    {
      key: "D",
      label: "deliberation",
      accent: COLOR_CORAL,
      description:
        "Committed multi-step reasoning along a single path. When it fires without prior data retrieval, it becomes the hallucination surface.",
    },
  ],
  rows: [
    {
      key: "arm6",
      label: "arm 6 · Haiku + hint",
      group: "haiku",
      values: { X: 0.1313, E: 0.5708, V: 0.2854, D: 0.0126 },
      note: "Haiku with the 400-character hint. X = 13.1%. The textbook `X-E-V-E-V-E` loop is its most common bond pattern.",
    },
    {
      key: "arm7",
      label: "arm 7 · Haiku + Anthropic verbatim",
      group: "haiku",
      values: { X: 0.1195, E: 0.5758, V: 0.2966, D: 0.0081 },
      note: "Same Haiku under Anthropic's 2,300-character prompt. X = 12.0%. Stronger prompt does not shift the distribution.",
    },
    {
      key: "arm2",
      label: "arm 2 · 4.1-mini stock (N=1)",
      group: "mini",
      values: { X: 0.0, E: 0.5789, V: 0.1579, D: 0.2632 },
      note: "Stock GPT-4.1-mini on a one-line prompt. X = 0%, D = 26.3%. No exploration, a quarter of turns spent deliberating.",
    },
    {
      key: "arm4",
      label: "arm 4 · 4.1-mini evolved (N=1)",
      group: "mini",
      values: { X: 0.0, E: 0.5381, V: 0.2691, D: 0.1928 },
      note: "Ten cycles of evolution on a single seed. Evolver added read-tables-first instructions; X still 0%.",
    },
    {
      key: "arm5",
      label: "arm 5 · 4.1-mini + hint",
      group: "mini",
      values: { X: 0.0, E: 0.5514, V: 0.2359, D: 0.2126 },
      note: "4.1-mini with the 400-character hint, three seeds. X = 0%, D = 21.3%. Top pattern is `E-E-D` — execute, execute, deliberate, no exploration.",
    },
    {
      key: "arm8",
      label: "arm 8 · 4.1-mini + Anthropic verbatim",
      group: "mini",
      values: { X: 0.0048, E: 0.527, V: 0.2413, D: 0.227 },
      note: "4.1-mini under Anthropic's 2,300-character prompt, three seeds. X = 0.5%, D = 22.7%. Strongest available prompt barely dents the distribution.",
    },
  ],
  caption:
    "Aggregated across every trial in Experiment 2 after up to ten cycles of evolution. Haiku's 12–13% exploration and 4.1-mini's 19–26% deliberation survive every prompt strength the evolver tried. Habits sit beneath prompt layer.",
};

// ---------------------------------------------------------------------------
// Figure 4c — advisor-calls grid (4 arms × 3 seeds).
// Counts from the findings note; final rewards from arms.json.
// ---------------------------------------------------------------------------

export const advisorGridData = {
  title: "Advisor calls · four arms, three seeds",
  subtitle:
    "five calls across 585 trials — all on Haiku, all on struggling seeds",
  columns: [
    { key: "seed-7", label: "seed 7" },
    { key: "seed-42", label: "seed 42" },
    { key: "seed-999", label: "seed 999" },
  ],
  rows: [
    {
      key: "arm5",
      label: "arm 5 · 4.1-mini + hint",
      group: "mini",
      cells: [
        { column: "seed-7", calls: 0, finalReward: 0.6 },
        { column: "seed-42", calls: 0, finalReward: 0.55 },
        { column: "seed-999", calls: 0, finalReward: 0.6 },
      ],
      note: "4.1-mini under the 400-character hint. Zero advisor calls across three seeds, terminal reward 0.55–0.60.",
    },
    {
      key: "arm8",
      label: "arm 8 · 4.1-mini + Anthropic verbatim",
      group: "mini",
      cells: [
        { column: "seed-7", calls: 0, finalReward: 0.4 },
        { column: "seed-42", calls: 0, finalReward: 0.6 },
        { column: "seed-999", calls: 0, finalReward: 0.6 },
      ],
      note: "4.1-mini under Anthropic's 2,300-character recommended prompt. Still zero. Three hundred trials across nine mini seeds, zero escalations to the advisor.",
    },
    {
      key: "arm6",
      label: "arm 6 · Haiku + hint",
      group: "haiku",
      cells: [
        { column: "seed-7", calls: 0, finalReward: 1.0 },
        { column: "seed-42", calls: 2, finalReward: 0.95 },
        { column: "seed-999", calls: 2, finalReward: 0.85 },
      ],
      note: "Haiku with the hint. The seed that cruised at 1.00 never pulled the advisor; the two seeds that landed below 1.00 pulled it. Diagnostic use.",
    },
    {
      key: "arm7",
      label: "arm 7 · Haiku + Anthropic verbatim",
      group: "haiku",
      cells: [
        { column: "seed-7", calls: 0, finalReward: 1.0 },
        { column: "seed-42", calls: 0, finalReward: 0.95 },
        { column: "seed-999", calls: 1, finalReward: 0.85 },
      ],
      note: "Same Haiku, stronger prompt. Two 0.95 seeds didn't pull; the 0.85 seed did. Same diagnostic pattern as arm 6 at half the call rate.",
    },
  ],
  caption:
    "Advisor backed by Sonnet 4.6, max five calls per trial, structurally identical across all four arms. Haiku fires the tool on seeds that are visibly struggling; 4.1-mini never fires it, even under the verbatim prompt that tells it exactly when to call.",
};

// ---------------------------------------------------------------------------
// Figure 5a — frontier-is-a-dot (four bars).
// Stock vs evolved × Haiku vs 4.1-mini. Baseline = stock Haiku (0.88).
// ---------------------------------------------------------------------------

export const frontierDotData = {
  title: "The frontier is a dot",
  subject: "reward on voltage-drop · stock vs evolved across both executors",
  bars: [
    {
      key: "evolved-haiku",
      label: "evolved Haiku · 0.93 ± 0.06",
      value: 0.933,
      highlight: true,
      note: "Haiku after ten cycles of prompt + skill evolution under the advisor scaffold. Terminal mean across arms 6 and 7, three seeds each.",
    },
    {
      key: "stock-haiku",
      label: "stock Haiku · 0.88",
      value: 0.883,
      note: "Haiku on the same task before any evolution runs — arm 6 cycle 1 mean across three seeds. Already close to the evolved ceiling.",
    },
    {
      key: "stock-mini",
      label: "stock 4.1-mini · 0.60",
      value: 0.6,
      note: "GPT-4.1-mini before evolution. One-shot single-seed arm 2 anchor, cross-validated at 0.40–0.60 in the v1 five-seed tree.",
    },
    {
      key: "evolved-mini",
      label: "evolved 4.1-mini · 0.53 ± 0.09",
      value: 0.533,
      note: "4.1-mini after ten cycles under Anthropic's 2,300-character recommended prompt. Below stock 4.1-mini on the mean — the regression instances drag the terminal figure down.",
    },
  ],
  baseline: {
    value: 0.88,
    label: "stock Haiku baseline",
    note: "The line the voltage-drop task sets for a cheaper-per-token model with no evolution.",
  },
  valueFormat: "decimal-2" as const,
  caption:
    "Stock cheaper-per-token Haiku beats evolved GPT-4.1-mini by roughly 35 points on the mean. On this task, model choice swamps every gain prompt evolution can offer. A full cost/quality frontier collapses to a single dot.",
};
