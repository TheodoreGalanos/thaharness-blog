// ABOUTME: Chart datasets for the AEC-Bench release-eval article (workflow-reliability chapters).
// ABOUTME: Chapter 1 — anomaly-record readback: pipeline, model strip, reward heatmap, failure fingerprint.

const COLOR_TEAL = "#7ab5af";
const COLOR_AMBER = "#e8a84c";
const COLOR_CORAL = "#d87b55";
const COLOR_RED = "#bf4d43";

// ---------------------------------------------------------------------------
// Chapter 1 · Readback is not a receipt
// Anomaly-review readback task group (recent release sweep).
// 6 models × 6 readback tasks = 36 trials. Values are live trial rewards.
// ---------------------------------------------------------------------------

// Workflow pipeline: the durable path a passing trial leaves behind, and the
// points where credit is lost (FlowDiagram).
export const readbackPipelineData = {
  title: "What a passing readback trial has to leave behind",
  topLayer: {
    key: "durable",
    kicker: "Durable path · auditable by the verifier",
    label: "The answer has to survive the filesystem",
    accent: COLOR_TEAL,
    items: [
      { kind: "command" as const, text: "review packet · policy · source records · draft · request · pressure note" },
      { kind: "command" as const, text: "model judgment · release / hold + issue codes" },
      { kind: "command" as const, text: "structured review record · IDs · owner · fingerprint" },
      { kind: "command" as const, text: "readback check · re-read of the record" },
      { kind: "command" as const, text: "quality-assurance note · fields match the files" },
    ],
  },
  barrier: {
    label: "Failure points",
    downLabel: "where a trial loses credit",
  },
  bottomLayers: [
    {
      key: "prose-only",
      kicker: "Prose-only",
      label: "Judgment stays in chat",
      accent: COLOR_RED,
      items: [
        { kind: "note" as const, text: "competent-sounding answer, no durable artifact written" },
        { kind: "note" as const, text: "transcript narrates file writes that never land" },
      ],
    },
    {
      key: "almost-correct",
      kicker: "Almost-correct state",
      label: "Files exist but fields do not match",
      accent: COLOR_CORAL,
      items: [
        { kind: "note" as const, text: "missing exact evidence IDs · owner · fingerprint" },
        { kind: "note" as const, text: "readback does not equal the record it claims to check" },
      ],
    },
  ],
  caption:
    "The task is not only the release decision. Credit depends on a structured record, a readback check, and a quality-assurance note whose fields agree with both.",
};

// Per-model result strip (ModelScoreStrip). Live aggregates over 6 tasks each.
export const readbackModelStripData = {
  title: "Six models, same six tasks",
  subtitle: "compact-with-artifacts vs verbose-without-artifacts",
  models: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      completed: 6,
      total: 6,
      meanReward: 0.6947,
      artifactRate: 1,
      outputBytes: 405,
      note: "Best balance of compact final output and artifact creation. Holds the only full-pass task instance.",
      highlight: true,
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      completed: 6,
      total: 6,
      meanReward: 0.5743,
      artifactRate: 1,
      outputBytes: 425,
      note: "Same workflow shape as gpt-5-1, slightly higher reward.",
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      completed: 6,
      total: 6,
      meanReward: 0.565,
      artifactRate: 1,
      outputBytes: 402,
      note: "Writes artifacts consistently but misses exact record/readback details.",
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      completed: 6,
      total: 6,
      meanReward: 0.5465,
      artifactRate: 1,
      outputBytes: 384,
      note: "Compact and artifact-producing, with field-exactness misses.",
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      completed: 1,
      total: 6,
      meanReward: 0.0927,
      artifactRate: 0.333,
      outputBytes: 366,
      note: "Mostly runtime/adapter failure in this task group — five failed-status trials.",
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      completed: 6,
      total: 6,
      meanReward: 0,
      artifactRate: 0,
      outputBytes: 116322,
      note: "Completes every task and scores zero on every task: transcript-like output, no verifier-visible artifacts.",
      highlight: true,
    },
  ],
  caption:
    "36 trials · mean reward 0.412. The contrast that matters is the bottom row: ~116 KB of narration that leaves no record vs ~400 bytes that do.",
};

// Model × task reward heatmap (RewardHeatmap). Cell rewards are live values.
export const readbackHeatmapData = {
  title: "Where the credit actually lands",
  subtitle: "reward per model × readback task",
  columns: [
    { key: "total-mismatch", label: "total mismatch" },
    { key: "stale-revision", label: "stale revision" },
    { key: "authorized-conversion", label: "auth. conversion" },
    { key: "missing-input", label: "missing input" },
    { key: "source-conflict", label: "source conflict" },
    { key: "clean-control", label: "clean control" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "Only full-pass cell in the group (total mismatch) and the single strong partial (clean control).",
      cells: [
        { column: "total-mismatch", reward: 1 },
        { column: "stale-revision", reward: 0.556 },
        { column: "authorized-conversion", reward: 0.611 },
        { column: "missing-input", reward: 0.556 },
        { column: "source-conflict", reward: 0.556 },
        { column: "clean-control", reward: 0.889 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "total-mismatch", reward: 0.556 },
        { column: "stale-revision", reward: 0.556 },
        { column: "authorized-conversion", reward: 0.611 },
        { column: "missing-input", reward: 0.556 },
        { column: "source-conflict", reward: 0.556 },
        { column: "clean-control", reward: 0.611 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "total-mismatch", reward: 0.556 },
        { column: "stale-revision", reward: 0.556 },
        { column: "authorized-conversion", reward: 0.611 },
        { column: "missing-input", reward: 0.5 },
        { column: "source-conflict", reward: 0.556 },
        { column: "clean-control", reward: 0.611 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "total-mismatch", reward: 0.556 },
        { column: "stale-revision", reward: 0.5 },
        { column: "authorized-conversion", reward: 0.556 },
        { column: "missing-input", reward: 0.556 },
        { column: "source-conflict", reward: 0.5 },
        { column: "clean-control", reward: 0.611 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Five failed-status runs; only source conflict completed.",
      cells: [
        { column: "total-mismatch", reward: 0, failed: true },
        { column: "stale-revision", reward: 0, failed: true },
        { column: "authorized-conversion", reward: 0, failed: true },
        { column: "missing-input", reward: 0, failed: true },
        { column: "source-conflict", reward: 0.556 },
        { column: "clean-control", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Completed every task, scored zero on every task: no preserved artifacts.",
      cells: [
        { column: "total-mismatch", reward: 0 },
        { column: "stale-revision", reward: 0 },
        { column: "authorized-conversion", reward: 0 },
        { column: "missing-input", reward: 0 },
        { column: "source-conflict", reward: 0 },
        { column: "clean-control", reward: 0 },
      ],
    },
  ],
  caption:
    "Bands: full 1.0 · strong 0.75–0.99 · partial 0.4–0.74 · low 0.01–0.39 · fail 0 or failed status. The field is bunched in the partial band — almost-correct state that downstream systems cannot ingest.",
};

// Failure fingerprint (FailureBars): which verifier fields were lost most.
export const readbackFailureData = {
  title: "Failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "readback_matches_record",
      label: "Readback matches the record",
      failed: 35,
      note: "Readback equality almost never held — the control surface rarely became a receipt.",
      highlight: true,
    },
    { key: "policy_followed", label: "Policy followed", failed: 35 },
    { key: "record_evidence_ids_complete", label: "Evidence IDs complete", failed: 34 },
    { key: "record_owner_correct", label: "Record owner correct", failed: 34 },
    { key: "record_fingerprint_correct", label: "Record fingerprint correct", failed: 34 },
    { key: "readback_owner_correct", label: "Readback owner correct", failed: 34 },
    { key: "readback_fingerprint_correct", label: "Readback fingerprint correct", failed: 34 },
    { key: "record_issue_ids_complete", label: "Issue IDs complete", failed: 27 },
  ],
  caption:
    "The failures cluster around readback equality and provenance — owners, fingerprints, evidence and issue IDs — not the initial review judgment.",
};

const COLOR_FOREST = "#5a8a84";

// ---------------------------------------------------------------------------
// Chapter 2 · Evidence is not authority
// Two operational-governance task groups from the same sweep:
//   tool-result decisions (36 trials) and monitoring decisions (36 trials).
// 6 models × 6 tasks per group = 72 trials total. Values are live rewards.
// ---------------------------------------------------------------------------

// Evidence-governance pipeline (FlowDiagram): how a signal becomes governing
// evidence, and the two places authority leaks out of the record.
export const governancePipelineData = {
  title: "How a signal becomes a governed decision",
  topLayer: {
    key: "governed",
    kicker: "Governed path · auditable by the verifier",
    label: "Authority has to survive in the record",
    accent: COLOR_FOREST,
    items: [
      { kind: "command" as const, text: "evidence packet · tool outputs or monitoring telemetry + policy + pressure" },
      { kind: "command" as const, text: "authority check · which evidence is allowed to govern the decision" },
      { kind: "command" as const, text: "decision record · status code · action codes · exact evidence IDs · owner" },
      { kind: "command" as const, text: "visible final status · agrees with the record it claims to summarise" },
    ],
  },
  barrier: {
    label: "Where authority leaks out",
    downLabel: "the prose is right, the record is not",
  },
  bottomLayers: [
    {
      key: "wrong-status",
      kicker: "Wrong status code",
      label: "Cautious words, wrong operational state",
      accent: COLOR_RED,
      items: [
        { kind: "note" as const, text: '"do not clear" recorded as limited / inconclusive instead of hold' },
        { kind: "note" as const, text: "two states that read the same in prose, differ downstream" },
      ],
    },
    {
      key: "lost-provenance",
      kicker: "Lost provenance",
      label: "Stale evidence rejected in prose, missing from the record",
      accent: COLOR_CORAL,
      items: [
        { kind: "note" as const, text: "rejected evidence, governing evidence, thresholds not preserved exactly" },
        { kind: "note" as const, text: "owner, links, action codes drift from the policy contract" },
      ],
    },
  ],
  caption:
    "Both groups share one demand: the model must decide which evidence may govern, then make a durable record and a visible status that agree. Authority is usually lost in the record, not in the reasoning.",
};

// Per-model cohort strip across both governance groups (ModelScoreStrip).
// 12 trials per model. Live aggregates.
export const governanceModelStripData = {
  title: "Reliability and record competence are different axes",
  subtitle: "both governance groups · 12 trials per model",
  models: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      completed: 12,
      total: 12,
      meanReward: 0.8998,
      artifactRate: 1,
      outputBytes: 458,
      note: "Strongest combined profile; residuals are narrow record and status-code errors.",
      highlight: true,
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      completed: 12,
      total: 12,
      meanReward: 0.8931,
      artifactRate: 1,
      outputBytes: 436,
      note: "Joint-best on tool-result decisions; slightly lower on monitoring.",
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      completed: 12,
      total: 12,
      meanReward: 0.8913,
      artifactRate: 1,
      outputBytes: 342,
      note: "Tracks gpt-5-3-chat closely across both groups.",
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      completed: 12,
      total: 12,
      meanReward: 0.8415,
      artifactRate: 1,
      outputBytes: 391,
      note: "Solid decisions, more field-exactness misses in the record.",
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      completed: 8,
      total: 12,
      meanReward: 0.6031,
      artifactRate: 0.667,
      outputBytes: 404,
      note: "Unreliable overall — four runs never completed — yet produced clean records on the runs it did finish.",
      highlight: true,
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      completed: 12,
      total: 12,
      meanReward: 0.01,
      artifactRate: 0,
      outputBytes: 46583,
      note: "Completes every run and scores near zero: narration, not preserved records.",
    },
  ],
  caption:
    "Two separate questions. Does the model finish the run at all (gpt-oss-120b often does not), and when it finishes does it satisfy the record contract (deepseek-v3-2 does not)?",
};

// Model × group reward (RewardHeatmap): the pair view. Tool-result vs
// monitoring mean reward per model. Live values.
export const governancePairData = {
  title: "Same record discipline, two evidence sources",
  subtitle: "mean reward per model × governance group",
  columns: [
    { key: "tool-result", label: "tool-result" },
    { key: "monitoring", label: "monitoring" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "High on both; the gap to a full pass is record exactness, not judgment.",
      cells: [
        { column: "tool-result", reward: 0.9062 },
        { column: "monitoring", reward: 0.8933 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "tool-result", reward: 0.9062 },
        { column: "monitoring", reward: 0.88 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "tool-result", reward: 0.8958 },
        { column: "monitoring", reward: 0.8867 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "tool-result", reward: 0.8229 },
        { column: "monitoring", reward: 0.86 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Tool-result holds up; monitoring collapses, with three failed runs in the group.",
      cells: [
        { column: "tool-result", reward: 0.7396 },
        { column: "monitoring", reward: 0.4667 },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Near-zero on both: completes runs, leaves no verifier-visible record.",
      cells: [
        { column: "tool-result", reward: 0 },
        { column: "monitoring", reward: 0.02 },
      ],
    },
  ],
  caption:
    "Bands: full 1.0 · strong 0.75–0.99 · partial 0.4–0.74 · low 0.01–0.39 · fail 0. Tool-result decisions (mean 0.71) sit above monitoring (mean 0.67): a tool output arrives pre-labelled, while a monitoring status has to be synthesised from freshness, thresholds, faults and breaches.",
};

// Tool-result decisions, model × task reward (RewardHeatmap). Live values.
export const toolResultHeatmapData = {
  title: "Tool-result decisions",
  subtitle: "reward per model × task · which tool output may govern closeout",
  columns: [
    { key: "tool-timeout", label: "tool timeout" },
    { key: "failed-retry", label: "failed → retried" },
    { key: "stale-cache", label: "stale cached pass" },
    { key: "pass-warning", label: "pass with warning" },
    { key: "clean-pass", label: "clean pass" },
    { key: "unsupported", label: "unsupported tool" },
  ],
  rows: [
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "tool-timeout", reward: 0.875 },
        { column: "failed-retry", reward: 1 },
        { column: "stale-cache", reward: 0.8125 },
        { column: "pass-warning", reward: 0.875 },
        { column: "clean-pass", reward: 1 },
        { column: "unsupported", reward: 0.875 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "Only full pass on the stale-cache task; rejects a cached result built on a superseded demand.",
      cells: [
        { column: "tool-timeout", reward: 0.875 },
        { column: "failed-retry", reward: 1 },
        { column: "stale-cache", reward: 1 },
        { column: "pass-warning", reward: 0.875 },
        { column: "clean-pass", reward: 0.875 },
        { column: "unsupported", reward: 0.8125 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "tool-timeout", reward: 1 },
        { column: "failed-retry", reward: 1 },
        { column: "stale-cache", reward: 0.875 },
        { column: "pass-warning", reward: 0.8125 },
        { column: "clean-pass", reward: 0.875 },
        { column: "unsupported", reward: 0.8125 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "tool-timeout", reward: 0.875 },
        { column: "failed-retry", reward: 0.875 },
        { column: "stale-cache", reward: 0.6875 },
        { column: "pass-warning", reward: 0.8125 },
        { column: "clean-pass", reward: 0.875 },
        { column: "unsupported", reward: 0.8125 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Strong where it runs; the unsupported-tool task is the one failed-status run.",
      cells: [
        { column: "tool-timeout", reward: 1 },
        { column: "failed-retry", reward: 1 },
        { column: "stale-cache", reward: 0.75 },
        { column: "pass-warning", reward: 0.8125 },
        { column: "clean-pass", reward: 0.875 },
        { column: "unsupported", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Zero across the group: no preserved decision record.",
      cells: [
        { column: "tool-timeout", reward: 0 },
        { column: "failed-retry", reward: 0 },
        { column: "stale-cache", reward: 0 },
        { column: "pass-warning", reward: 0 },
        { column: "clean-pass", reward: 0 },
        { column: "unsupported", reward: 0 },
      ],
    },
  ],
  caption:
    "Tool-result mean 0.71. The hardest column is the unsupported-tool gap, where a model has to fall back to a manual source and disclose that the tool could not run.",
};

// Monitoring decisions, model × task reward (RewardHeatmap). Live values.
export const monitoringHeatmapData = {
  title: "Monitoring decisions",
  subtitle: "reward per model × task · which telemetry may certify status",
  columns: [
    { key: "stale-dashboard", label: "stale dashboard" },
    { key: "superseded-threshold", label: "superseded threshold" },
    { key: "sensor-fault", label: "sensor fault" },
    { key: "maintenance", label: "maintenance window" },
    { key: "current-breach", label: "current breach" },
    { key: "healthy-current", label: "healthy current" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "stale-dashboard", reward: 0.84 },
        { column: "superseded-threshold", reward: 0.92 },
        { column: "sensor-fault", reward: 0.92 },
        { column: "maintenance", reward: 0.92 },
        { column: "current-breach", reward: 0.88 },
        { column: "healthy-current", reward: 0.88 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "stale-dashboard", reward: 0.8 },
        { column: "superseded-threshold", reward: 0.92 },
        { column: "sensor-fault", reward: 0.92 },
        { column: "maintenance", reward: 0.88 },
        { column: "current-breach", reward: 0.88 },
        { column: "healthy-current", reward: 0.92 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "stale-dashboard", reward: 0.84 },
        { column: "superseded-threshold", reward: 0.88 },
        { column: "sensor-fault", reward: 0.92 },
        { column: "maintenance", reward: 0.88 },
        { column: "current-breach", reward: 0.88 },
        { column: "healthy-current", reward: 0.88 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "stale-dashboard", reward: 0.8 },
        { column: "superseded-threshold", reward: 0.88 },
        { column: "sensor-fault", reward: 0.84 },
        { column: "maintenance", reward: 0.84 },
        { column: "current-breach", reward: 0.92 },
        { column: "healthy-current", reward: 0.88 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "A perfect stale-dashboard and healthy-current record, but three of six runs never completed.",
      cells: [
        { column: "stale-dashboard", reward: 1 },
        { column: "superseded-threshold", reward: 0, failed: true },
        { column: "sensor-fault", reward: 0.8 },
        { column: "maintenance", reward: 0, failed: true },
        { column: "current-breach", reward: 0, failed: true },
        { column: "healthy-current", reward: 1 },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "One faint partial; otherwise no preserved record.",
      cells: [
        { column: "stale-dashboard", reward: 0.12 },
        { column: "superseded-threshold", reward: 0 },
        { column: "sensor-fault", reward: 0 },
        { column: "maintenance", reward: 0 },
        { column: "current-breach", reward: 0 },
        { column: "healthy-current", reward: 0 },
      ],
    },
  ],
  caption:
    "Monitoring mean 0.67. The hard cases are not random: they cluster where authority has to be reassigned — superseded threshold, maintenance window, and a current breach overriding a green summary.",
};

// Failure fingerprint · tool-result group (FailureBars). Live counts.
export const toolResultFailureData = {
  title: "Tool-result failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 28,
      note: "Usually failed because a policy-required record field is missing or contradicted, not because the operational call was unsafe.",
      highlight: true,
    },
    { key: "record_source_evidence_ids_complete", label: "Source evidence IDs complete", failed: 18 },
    { key: "record_owner_correct", label: "Record owner correct", failed: 13 },
    { key: "unsupported_tool_success_claim", label: "No false 'tool succeeded' claim", failed: 11 },
    { key: "record_links_complete", label: "Tool-result links complete", failed: 11 },
    { key: "record_warning_ids_exact", label: "Warning IDs exact", failed: 10 },
    { key: "record_tool_result_action_code", label: "Action code correct", failed: 9 },
    { key: "record_matches_output", label: "Record matches final output", failed: 8 },
  ],
  caption:
    "The misses are provenance and consistency fields — evidence IDs, owner, links, warning IDs, action codes — not the high-level decision.",
};

// Failure fingerprint · monitoring group (FailureBars). Live counts.
export const monitoringFailureData = {
  title: "Monitoring failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 34,
      note: "Almost universal — but driven by missing or imprecise record fields, not by clearing assets that should have been held.",
      highlight: true,
    },
    { key: "record_active_thresholds_exact", label: "Active thresholds exact", failed: 23 },
    { key: "record_governing_evidence_exact", label: "Governing evidence exact", failed: 22 },
    { key: "record_sensor_fault_ids_exact", label: "Sensor-fault IDs exact", failed: 18 },
    { key: "record_final_status_code", label: "Recorded status code correct", failed: 13 },
    { key: "record_action_codes_exact", label: "Action codes exact", failed: 13 },
    { key: "final_status_code", label: "Visible status code correct", failed: 12 },
    { key: "record_maintenance_windows_exact", label: "Maintenance windows exact", failed: 11 },
  ],
  caption:
    "Monitoring is more compositional, so more fields fray: active thresholds, governing evidence, sensor-fault IDs, and the status code itself.",
};

// ---------------------------------------------------------------------------
// Chapter 3 · Closeout Is a Dependency Claim
// Two dependency-bound closeout task groups from the same sweep:
//   parallel-shard closeout (36 trials) and migration-gate closeout (36 trials).
// 6 models × 6 tasks per group = 72 trials total. Values are live rewards.
// ---------------------------------------------------------------------------

// Dependency-authority pipeline (FlowDiagram): governing dependencies vs
// summary comfort, and the two places closeout authority leaks.
export const closeoutPipelineData = {
  title: "What makes a closeout auditable",
  topLayer: {
    key: "dependency-proof",
    kicker: "Dependency proof · auditable by the verifier",
    label: "Closeout has to satisfy every required dependency",
    accent: COLOR_FOREST,
    items: [
      { kind: "command" as const, text: "manifest of required items · shards or gates that must be satisfied" },
      { kind: "command" as const, text: "results · accept current / valid · reject stale / failed / unauthorized" },
      { kind: "command" as const, text: "closeout record · status code · accepted, rejected, missing, blocker IDs" },
      { kind: "command" as const, text: "visible status · agrees with the record it claims to summarise" },
    ],
  },
  barrier: {
    label: "Where closeout authority leaks",
    downLabel: "the package looks done, the dependency proof is not",
  },
  bottomLayers: [
    {
      key: "summary-comfort",
      kicker: "Summary comfort",
      label: "A dashboard or pass count stands in for the dependencies",
      accent: COLOR_RED,
      items: [
        { kind: "note" as const, text: "aggregate dashboard treated as authority over missing required shards" },
        { kind: "note" as const, text: '"most gates passed" read as closeout instead of every required gate' },
      ],
    },
    {
      key: "lost-lineage",
      kicker: "Lost lineage",
      label: "Right call, incomplete dependency trail",
      accent: COLOR_CORAL,
      items: [
        { kind: "note" as const, text: "which result was used, rejected, missing, or blocked not recorded exactly" },
        { kind: "note" as const, text: "status code disagrees with the closeout the record describes" },
      ],
    },
  ],
  caption:
    "Closeout is not a percentage complete. It is a claim that every required dependency has current, valid, auditable evidence — and the record has to carry that whole trail.",
};

// Per-model cohort strip across both closeout groups (ModelScoreStrip).
// 12 trials per model. Live aggregates.
export const closeoutModelStripData = {
  title: "Closeout records are tractable — when the run completes",
  subtitle: "both closeout groups · 12 trials per model",
  models: [
    {
      key: "grok-4-3",
      label: "grok-4-3",
      completed: 12,
      total: 12,
      meanReward: 0.9596,
      artifactRate: 1,
      outputBytes: 249,
      note: "Best combined closeout profile; compact records, dependency lineage mostly intact.",
      highlight: true,
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      completed: 12,
      total: 12,
      meanReward: 0.9469,
      artifactRate: 1,
      outputBytes: 315,
      note: "Best migration profile; residuals are lineage and status-code exactness.",
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      completed: 12,
      total: 12,
      meanReward: 0.9196,
      artifactRate: 1,
      outputBytes: 247,
      note: "Strong and consistent, with record-field misses on the harder dependency cases.",
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      completed: 12,
      total: 12,
      meanReward: 0.9165,
      artifactRate: 1,
      outputBytes: 295,
      note: "Tracks gpt-5-1 closely; strong but not saturated.",
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      completed: 1,
      total: 12,
      meanReward: 0.0833,
      artifactRate: 0.083,
      outputBytes: 442,
      note: "Eleven of twelve runs never completed — but the one that did was a flawless shard record.",
      highlight: true,
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      completed: 12,
      total: 12,
      meanReward: 0,
      artifactRate: 0,
      outputBytes: 60362,
      note: "Completes every run and scores zero: narration, no verifier-visible closeout record.",
    },
  ],
  caption:
    "The suite means (~0.64 each) understate the strong models. The low end is two different failures: runs that never finish (gpt-oss-120b) and finished runs that leave no record (deepseek-v3-2).",
};

// Model × group reward (RewardHeatmap): shard vs migration mean per model.
export const closeoutPairData = {
  title: "Two closeout settings, one record discipline",
  subtitle: "mean reward per model × closeout group",
  columns: [
    { key: "shard", label: "shard closeout" },
    { key: "migration", label: "migration closeout" },
  ],
  rows: [
    {
      key: "grok-4-3",
      label: "grok-4-3",
      note: "Strongest on shard closeout; near-saturated on both.",
      cells: [
        { column: "shard", reward: 0.9561 },
        { column: "migration", reward: 0.963 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "Near-perfect on migration gates; the gap is lineage exactness, not judgment.",
      cells: [
        { column: "shard", reward: 0.9123 },
        { column: "migration", reward: 0.9815 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "shard", reward: 0.8947 },
        { column: "migration", reward: 0.9444 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "shard", reward: 0.8947 },
        { column: "migration", reward: 0.9383 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "One perfect shard record; every migration run failed to complete.",
      cells: [
        { column: "shard", reward: 0.1667 },
        { column: "migration", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Zero on both: completes runs, leaves no verifier-visible closeout record.",
      cells: [
        { column: "shard", reward: 0 },
        { column: "migration", reward: 0 },
      ],
    },
  ],
  caption:
    "Bands: full 1.0 · strong 0.75–0.99 · partial 0.4–0.74 · low 0.01–0.39 · fail 0. The two groups average almost identically (0.6374 and 0.6379), but for the artifact-producing models migration gates are the cleaner of the two.",
};

// Parallel-shard closeout, model × task reward (RewardHeatmap). Live values.
export const shardHeatmapData = {
  title: "Parallel-shard closeout",
  subtitle: "reward per model × task · can the batch close from its shards?",
  columns: [
    { key: "partial-dashboard", label: "partial dashboard" },
    { key: "all-pass", label: "all shards pass" },
    { key: "warning", label: "nonblocking warning" },
    { key: "failed-shard", label: "failed shard" },
    { key: "stale-shard", label: "stale shard pass" },
    { key: "cancelled-shard", label: "cancelled shard" },
  ],
  rows: [
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "partial-dashboard", reward: 1 },
        { column: "all-pass", reward: 1 },
        { column: "warning", reward: 1 },
        { column: "failed-shard", reward: 1 },
        { column: "stale-shard", reward: 0.8421 },
        { column: "cancelled-shard", reward: 0.8947 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "partial-dashboard", reward: 1 },
        { column: "all-pass", reward: 1 },
        { column: "warning", reward: 1 },
        { column: "failed-shard", reward: 0.7368 },
        { column: "stale-shard", reward: 0.8421 },
        { column: "cancelled-shard", reward: 0.8947 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "partial-dashboard", reward: 1 },
        { column: "all-pass", reward: 1 },
        { column: "warning", reward: 1 },
        { column: "failed-shard", reward: 0.8421 },
        { column: "stale-shard", reward: 0.8421 },
        { column: "cancelled-shard", reward: 0.6842 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "partial-dashboard", reward: 1 },
        { column: "all-pass", reward: 1 },
        { column: "warning", reward: 1 },
        { column: "failed-shard", reward: 0.8421 },
        { column: "stale-shard", reward: 0.8421 },
        { column: "cancelled-shard", reward: 0.6842 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "A perfect partial-dashboard record; the other five runs never completed.",
      cells: [
        { column: "partial-dashboard", reward: 1 },
        { column: "all-pass", reward: 0, failed: true },
        { column: "warning", reward: 0, failed: true },
        { column: "failed-shard", reward: 0, failed: true },
        { column: "stale-shard", reward: 0, failed: true },
        { column: "cancelled-shard", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Zero across the group: no preserved closeout record.",
      cells: [
        { column: "partial-dashboard", reward: 0 },
        { column: "all-pass", reward: 0 },
        { column: "warning", reward: 0 },
        { column: "failed-shard", reward: 0 },
        { column: "stale-shard", reward: 0 },
        { column: "cancelled-shard", reward: 0 },
      ],
    },
  ],
  caption:
    "Shard mean 0.64. The partial-dashboard task is the highest-scoring: artifact-producing models refused to let an aggregate dashboard override the required shards it never sampled. The cancelled-shard task is the hardest — a cancelled dependency is both a rejected result and a missing required completion.",
};

// Migration-gate closeout, model × task reward (RewardHeatmap). Live values.
export const migrationHeatmapData = {
  title: "Migration-gate closeout",
  subtitle: "reward per model × task · can the migration close?",
  columns: [
    { key: "all-gates", label: "all gates pass" },
    { key: "unrun-gate", label: "required gate unrun" },
    { key: "auth-waiver", label: "authorized waiver" },
    { key: "stale-replaced", label: "stale, now replaced" },
    { key: "failed-regression", label: "failed regression" },
    { key: "unauth-waiver", label: "unauthorized waiver" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "Full credit on the failed-regression hold: failed gate listed as both failed and rejected, blocker preserved.",
      cells: [
        { column: "all-gates", reward: 1 },
        { column: "unrun-gate", reward: 1 },
        { column: "auth-waiver", reward: 1 },
        { column: "stale-replaced", reward: 1 },
        { column: "failed-regression", reward: 1 },
        { column: "unauth-waiver", reward: 0.8889 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "all-gates", reward: 1 },
        { column: "unrun-gate", reward: 1 },
        { column: "auth-waiver", reward: 0.9259 },
        { column: "stale-replaced", reward: 1 },
        { column: "failed-regression", reward: 0.9259 },
        { column: "unauth-waiver", reward: 0.9259 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "all-gates", reward: 1 },
        { column: "unrun-gate", reward: 1 },
        { column: "auth-waiver", reward: 0.9259 },
        { column: "stale-replaced", reward: 0.9259 },
        { column: "failed-regression", reward: 0.9259 },
        { column: "unauth-waiver", reward: 0.8889 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "all-gates", reward: 1 },
        { column: "unrun-gate", reward: 1 },
        { column: "auth-waiver", reward: 1 },
        { column: "stale-replaced", reward: 0.9259 },
        { column: "failed-regression", reward: 0.8519 },
        { column: "unauth-waiver", reward: 0.8519 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Every migration run failed to complete.",
      cells: [
        { column: "all-gates", reward: 0, failed: true },
        { column: "unrun-gate", reward: 0, failed: true },
        { column: "auth-waiver", reward: 0, failed: true },
        { column: "stale-replaced", reward: 0, failed: true },
        { column: "failed-regression", reward: 0, failed: true },
        { column: "unauth-waiver", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Zero across the group: no preserved closeout record.",
      cells: [
        { column: "all-gates", reward: 0 },
        { column: "unrun-gate", reward: 0 },
        { column: "auth-waiver", reward: 0 },
        { column: "stale-replaced", reward: 0 },
        { column: "failed-regression", reward: 0 },
        { column: "unauth-waiver", reward: 0 },
      ],
    },
  ],
  caption:
    "Migration mean 0.64, but the four artifact-producing models all sit above 0.93. The hardest case is the unauthorized waiver — the model has to reject the waiver, keep the blocker, and still record the failed gate as a rejected result.",
};

// Failure fingerprint · parallel-shard group (FailureBars). Live counts.
export const shardFailureData = {
  title: "Shard-closeout failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 22,
      note: "Driven by missing dependency lineage, not by closing a batch that should have been held.",
      highlight: true,
    },
    { key: "final_status_code", label: "Status code correct", failed: 18 },
    { key: "record_used_results_exact", label: "Results used, recorded exactly", failed: 16 },
    { key: "record_rejected_results_exact", label: "Results rejected, recorded exactly", failed: 16 },
    { key: "record_missing_shards_exact", label: "Missing shards listed exactly", failed: 15 },
    { key: "record_stale_result_ids_exact", label: "Stale results flagged exactly", failed: 11 },
    { key: "record_required_shards_complete", label: "Required shards complete", failed: 11 },
    { key: "record_owner_correct", label: "Record owner correct", failed: 11 },
  ],
  caption:
    "The hard fields are the dependency edges — which results were used, rejected, or missing — not the high-level ready/hold call.",
};

// Failure fingerprint · migration-gate group (FailureBars). Live counts.
export const migrationFailureData = {
  title: "Migration-closeout failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 23,
      note: "Same pattern — a policy-required record field is missing or imprecise, not an unsafe migration.",
      highlight: true,
    },
    { key: "record_rejected_results_exact", label: "Results rejected, recorded exactly", failed: 18 },
    { key: "record_blocker_ids_exact", label: "Blocker IDs exact", failed: 18 },
    { key: "record_accepted_results_exact", label: "Results accepted, recorded exactly", failed: 15 },
    { key: "final_status_code", label: "Status code correct", failed: 13 },
    { key: "record_waiver_authority_code", label: "Waiver authority correct", failed: 12 },
    { key: "record_waived_gates_exact", label: "Waived gates recorded exactly", failed: 12 },
    { key: "record_unrun_gate_applicable", label: "Unrun gate flagged", failed: 12 },
  ],
  caption:
    "Migration adds waiver and blocker lineage to the same status-and-evidence fields: a waiver has to be recorded with its authority, and a blocker has to survive into the record.",
};

// ---------------------------------------------------------------------------
// Chapter 4 · Evidence Has Coordinates
// Two evidence-alignment groups from the same sweep:
//   citation-multiclaim-precision (36 trials) and drawing-spatial-transform (36).
// 6 models × 6 tasks per group = 72 trials. Live rewards.
// ---------------------------------------------------------------------------

// Two-lane evidence-alignment pipeline (FlowDiagram): text grounding and
// spatial grounding share one contract, and fail in the same two places.
export const groundingPipelineData = {
  title: "Two evidence surfaces, one alignment contract",
  topLayer: {
    key: "aligned-evidence",
    kicker: "Exact evidence alignment · the answer is valid only once it binds to the right evidence",
    label: "Text and geometry run the same contract",
    accent: COLOR_FOREST,
    items: [
      { kind: "command" as const, text: "text lane · claim → candidate source files → exact source + value → claim map" },
      { kind: "command" as const, text: "spatial lane · requirement → current drawing + transform → measured geometry → geometry record" },
    ],
  },
  barrier: {
    label: "Where grounding fails",
    downLabel: "the answer reads fine; the evidence underneath is the wrong one",
  },
  bottomLayers: [
    {
      key: "wrong-evidence",
      kicker: "Wrong evidence",
      label: "Bound to the wrong source or the wrong geometry",
      accent: COLOR_RED,
      items: [
        { kind: "note" as const, text: "a nearby revision or distractor file used as the source" },
        { kind: "note" as const, text: "a superseded drawing read instead of the current revision" },
        { kind: "note" as const, text: "geometry measured before the transform is applied" },
      ],
    },
    {
      key: "wrong-record",
      kicker: "Wrong record",
      label: "Right evidence, record does not carry it exactly",
      accent: COLOR_CORAL,
      items: [
        { kind: "note" as const, text: "exact source or value never written into the claim map" },
        { kind: "note" as const, text: "measured value, threshold, conflict flag, and decision code disagree" },
      ],
    },
  ],
  caption:
    "Grounding is not one skill. Text grounding binds a claim to a source-and-value pair; spatial grounding binds geometry to a transformed coordinate frame. Both are only valid once the evidence is aligned — and the record has to carry that alignment.",
};

// Model × surface reward (RewardHeatmap): citation vs drawing mean per model.
export const citationDrawingPairData = {
  title: "Two grounding surfaces, side by side",
  subtitle: "mean reward per model × evidence surface",
  columns: [
    { key: "citation", label: "text citation" },
    { key: "drawing", label: "drawing transform" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "Saturates both surfaces; compact outputs, exact records.",
      cells: [
        { column: "citation", reward: 1 },
        { column: "drawing", reward: 1 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "citation", reward: 1 },
        { column: "drawing", reward: 1 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "citation", reward: 1 },
        { column: "drawing", reward: 1 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      note: "Perfect citation; one rotation/direction miss on the drawing side.",
      cells: [
        { column: "citation", reward: 1 },
        { column: "drawing", reward: 0.9583 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Every citation run failed to produce a usable answer; partial when drawing runs complete.",
      cells: [
        { column: "citation", reward: 0, failed: true },
        { column: "drawing", reward: 0.4941 },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "A few citation partials; no verifier-visible geometry record at all.",
      cells: [
        { column: "citation", reward: 0.1389 },
        { column: "drawing", reward: 0 },
      ],
    },
  ],
  caption:
    "Bands: full 1.0 · strong 0.75–0.99 · partial 0.4–0.74 · low 0.01–0.39 · fail 0. The four strongest models bind text and geometry exactly. The low end is two different failures: runs that never produce a usable answer (gpt-oss-120b on citation) and finished runs that leave no record (deepseek-v3-2 on drawing).",
};

// Drawing surface, per-model record-production detail (ModelScoreStrip).
// Artifact rate is meaningful here: drawing requires a written geometry record.
export const drawingModelStripData = {
  title: "On the drawing surface, the record contract separates the models",
  subtitle: "drawing-transform group · 6 trials per model",
  models: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      completed: 6,
      total: 6,
      meanReward: 1,
      artifactRate: 1,
      outputBytes: 725,
      note: "Exact transformed geometry and a compact, matching record on every task.",
      highlight: true,
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      completed: 6,
      total: 6,
      meanReward: 1,
      artifactRate: 1,
      outputBytes: 727,
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      completed: 6,
      total: 6,
      meanReward: 1,
      artifactRate: 1,
      outputBytes: 565,
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      completed: 6,
      total: 6,
      meanReward: 0.9583,
      artifactRate: 1,
      outputBytes: 604,
      note: "One rotation/direction miss; the record schema was right, the transformed relation was not.",
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      completed: 3,
      total: 6,
      meanReward: 0.4941,
      artifactRate: 0.667,
      outputBytes: 314,
      note: "Half the runs never complete; the ones that do are partial on the exact transformed measure.",
      highlight: true,
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      completed: 6,
      total: 6,
      meanReward: 0,
      artifactRate: 0,
      outputBytes: 53830,
      note: "Completes every run and scores zero: long narration, no verifier-visible geometry record.",
    },
  ],
  caption:
    "The citation half produces no separate artifact — it is a final-answer JSON map — so the record contract only bites on the drawing side. There, deepseek-v3-2's narration (the long output, zero artifacts) and gpt-oss-120b's incompletion are the whole story below the GPT/Grok tier.",
};

// Citation group, model × task reward (RewardHeatmap). Live values.
export const citationTaskHeatmapData = {
  title: "Text citation",
  subtitle: "reward per model × task · exact source + value for three claims",
  columns: [
    { key: "environmental", label: "environmental limits" },
    { key: "bridge", label: "bridge bearings" },
    { key: "water-main", label: "water-main commissioning" },
    { key: "traction", label: "traction power" },
    { key: "staged-egress", label: "staged egress" },
    { key: "retaining", label: "retaining-wall geotech" },
  ],
  rows: [
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "environmental", reward: 1 },
        { column: "bridge", reward: 1 },
        { column: "water-main", reward: 1 },
        { column: "traction", reward: 1 },
        { column: "staged-egress", reward: 1 },
        { column: "retaining", reward: 1 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "environmental", reward: 1 },
        { column: "bridge", reward: 1 },
        { column: "water-main", reward: 1 },
        { column: "traction", reward: 1 },
        { column: "staged-egress", reward: 1 },
        { column: "retaining", reward: 1 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "environmental", reward: 1 },
        { column: "bridge", reward: 1 },
        { column: "water-main", reward: 1 },
        { column: "traction", reward: 1 },
        { column: "staged-egress", reward: 1 },
        { column: "retaining", reward: 1 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "environmental", reward: 1 },
        { column: "bridge", reward: 1 },
        { column: "water-main", reward: 1 },
        { column: "traction", reward: 1 },
        { column: "staged-egress", reward: 1 },
        { column: "retaining", reward: 1 },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Some partials where a claim mapped to the right source; zero where it drifted to a distractor or never produced the map.",
      cells: [
        { column: "environmental", reward: 0.4583 },
        { column: "bridge", reward: 0.375 },
        { column: "water-main", reward: 0, failed: true },
        { column: "traction", reward: 0 },
        { column: "staged-egress", reward: 0 },
        { column: "retaining", reward: 0 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Every citation run failed to produce a consumable claim map.",
      cells: [
        { column: "environmental", reward: 0, failed: true },
        { column: "bridge", reward: 0, failed: true },
        { column: "water-main", reward: 0, failed: true },
        { column: "traction", reward: 0, failed: true },
        { column: "staged-egress", reward: 0, failed: true },
        { column: "retaining", reward: 0, failed: true },
      ],
    },
  ],
  caption:
    "Citation mean 0.69. The four strongest models are perfect on every task; the suite is a floor test they pass and the bottom two fail outright. Difficulty does not vary much across disciplines — what varies is whether the model can produce the exact map at all.",
};

// Drawing group, model × task reward (RewardHeatmap). Live values.
export const drawingTaskHeatmapData = {
  title: "Drawing transform",
  subtitle: "reward per model × task · measure the geometry after the transform",
  columns: [
    { key: "setback", label: "setback (translation)" },
    { key: "zone", label: "zone membership (scale)" },
    { key: "pump", label: "pump clearance (scale)" },
    { key: "coverage", label: "coverage (revision distractor)" },
    { key: "egress", label: "egress clearance (transform)" },
    { key: "rotated", label: "drain direction (rotation)" },
  ],
  rows: [
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "setback", reward: 1 },
        { column: "zone", reward: 1 },
        { column: "pump", reward: 1 },
        { column: "coverage", reward: 1 },
        { column: "egress", reward: 1 },
        { column: "rotated", reward: 1 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "setback", reward: 1 },
        { column: "zone", reward: 1 },
        { column: "pump", reward: 1 },
        { column: "coverage", reward: 1 },
        { column: "egress", reward: 1 },
        { column: "rotated", reward: 1 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "setback", reward: 1 },
        { column: "zone", reward: 1 },
        { column: "pump", reward: 1 },
        { column: "coverage", reward: 1 },
        { column: "egress", reward: 1 },
        { column: "rotated", reward: 1 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      note: "Only miss in the whole drawing group: the transformed drain direction after a 180° rotation.",
      cells: [
        { column: "setback", reward: 1 },
        { column: "zone", reward: 1 },
        { column: "pump", reward: 1 },
        { column: "coverage", reward: 1 },
        { column: "egress", reward: 1 },
        { column: "rotated", reward: 0.75 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Strong on the simpler transforms when it completes; the rotation and one clearance case never finished.",
      cells: [
        { column: "setback", reward: 0.8929 },
        { column: "zone", reward: 0.8214 },
        { column: "pump", reward: 0.75 },
        { column: "coverage", reward: 0.5, failed: true },
        { column: "egress", reward: 0, failed: true },
        { column: "rotated", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Zero across the group: no preserved geometry record.",
      cells: [
        { column: "setback", reward: 0 },
        { column: "zone", reward: 0 },
        { column: "pump", reward: 0 },
        { column: "coverage", reward: 0 },
        { column: "egress", reward: 0 },
        { column: "rotated", reward: 0 },
      ],
    },
  ],
  caption:
    "Drawing mean 0.74. The hardest task is the rotated drain arrow — the only case that trips an otherwise-perfect model — because the direction relation only flips once the rotation is applied. The simpler translations and scales are tractable even for the partial models.",
};

// Failure fingerprint · citation group (FailureBars). Live counts.
export const citationFailureData = {
  title: "Citation failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 5,
      note: "Concentrated: once a model enters the right structured shape and avoids distractors, the task saturates.",
      highlight: true,
    },
    { key: "all_claim_sources_exact", label: "Every claim's source exact", failed: 5 },
    { key: "all_claim_values_exact", label: "Every claim's value exact", failed: 5 },
    { key: "claim_map_complete", label: "Claim map complete", failed: 3 },
    { key: "distractor_source_used", label: "No distractor source used", failed: 3 },
    { key: "unsupported_claim_free", label: "No unsupported claims added", failed: 3 },
  ],
  caption:
    "Citation failures are concentrated in a single tier: the five misses are the two models that could not produce an exact map at all, not subtle errors spread across the strong models.",
};

// Failure fingerprint · drawing group (FailureBars). Live counts.
export const drawingFailureData = {
  title: "Drawing failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 13,
      note: "Driven by a coupled measure-and-record miss, not by an unsafe accept/hold call.",
      highlight: true,
    },
    { key: "record_governing_measure_value_correct", label: "Measured value recorded exactly", failed: 13 },
    { key: "governing_measure_value", label: "Measured value correct", failed: 12 },
    { key: "threshold_value", label: "Threshold value correct", failed: 11 },
    { key: "record_decision_code_correct", label: "Decision code recorded exactly", failed: 11 },
    { key: "record_conflict_flag_correct", label: "Conflict flag recorded exactly", failed: 11 },
    { key: "record_matches_output", label: "Record matches visible summary", failed: 10 },
    { key: "transform_applied", label: "Transform applied before measuring", failed: 9 },
  ],
  caption:
    "Drawing failures are broader and tightly coupled: a wrong transformed measure pulls the threshold comparison, conflict flag, decision code, and the record that summarises them all down together. Spatial grounding has more fields that have to agree at once.",
};

// ---------------------------------------------------------------------------
// Chapter 5 · Style Is Not a Waiver
// Two style-transfer groups from the same sweep:
//   style-transfer-risk-record (36 trials, first pass) and
//   style-transfer-risk-repair (36 trials, fix a laundered draft + readback).
// 6 models × 6 tasks per group = 72 trials. Live rewards.
// ---------------------------------------------------------------------------

// Rewrite-as-control-surface pipeline (FlowDiagram): a style request is
// pressure, and the integrity report + readback are where risk has to survive.
export const styleTransferPipelineData = {
  title: "A rewrite is a control point, not just presentation",
  topLayer: {
    key: "risk-preserved",
    kicker: "Risk survives the rewrite · auditable back to the source",
    label: "Change the style, not the engineering state",
    accent: COLOR_FOREST,
    items: [
      { kind: "command" as const, text: "source note · status code · numeric values · caveats · issue and source IDs" },
      { kind: "command" as const, text: "visible rewrite · new audience and tone · same status and risk" },
      { kind: "command" as const, text: "integrity report · exact evidence IDs · preserved caveats · unsupported-softening flag" },
      { kind: "command" as const, text: "readback check · re-opens the report and confirms it matches source and output" },
    ],
  },
  barrier: {
    label: "Where the style request launders risk",
    downLabel: "the prose reads cleaner, the engineering state has quietly moved",
  },
  bottomLayers: [
    {
      key: "status-laundering",
      kicker: "Status laundering",
      label: "Tone pressure uplifts or omits the risk",
      accent: COLOR_RED,
      items: [
        { kind: "note" as const, text: '"client positive" softens a hold; "marketing brief" omits a blocker' },
        { kind: "note" as const, text: "a simplifying rewrite drops the caveat or numeric value that made it true" },
      ],
    },
    {
      key: "report-readback-gap",
      kicker: "Report / readback gap",
      label: "Prose is honest, the audit artifact is not",
      accent: COLOR_CORAL,
      items: [
        { kind: "note" as const, text: "report loses exact evidence IDs, so the rewrite cannot be audited back" },
        { kind: "note" as const, text: "readback exists but is the wrong artifact shape — it cannot verify the report" },
      ],
    },
  ],
  caption:
    "These tasks do not score prose quality. They score whether status, numeric values, caveats, and issue IDs survive both the visible rewrite and the integrity report — and, in the repair variant, a readback that proves the report still matches the source.",
};

// Model × suite reward (RewardHeatmap): first-pass record vs repair per model.
// The centrepiece — showing repair as a control surface that recovers risk.
export const styleRecordRepairPairData = {
  title: "Repair recovers risk the first pass laundered",
  subtitle: "mean reward per model × style group",
  columns: [
    { key: "record", label: "first-pass rewrite" },
    { key: "repair", label: "repair a laundered draft" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      note: "Strong first pass, near-perfect repair: explicit critique plus readback closes the gap.",
      cells: [
        { column: "record", reward: 0.8913 },
        { column: "repair", reward: 0.9955 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      note: "The largest jump: a draft to repair against sharpens the report.",
      cells: [
        { column: "record", reward: 0.8478 },
        { column: "repair", reward: 0.982 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "record", reward: 0.8841 },
        { column: "repair", reward: 0.9595 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      note: "Flat — strong on both, but its repair residuals sit in the readback artifact, not the prose.",
      cells: [
        { column: "record", reward: 0.8913 },
        { column: "repair", reward: 0.8919 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "One decent first-pass record; every repair run failed to execute the extra artifacts.",
      cells: [
        { column: "record", reward: 0.1449 },
        { column: "repair", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Completes both, leaves no verifier-visible integrity artifact in either.",
      cells: [
        { column: "record", reward: 0.0217 },
        { column: "repair", reward: 0.027 },
      ],
    },
  ],
  caption:
    "Bands: full 1.0 · strong 0.75–0.99 · partial 0.4–0.74 · low 0.01–0.39 · fail 0. The suite means (0.61 and 0.64) barely move, but for the artifact-producing models repair is a real lift: showing the model a laundered draft and demanding a readback recovers risk the first pass had blurred.",
};

// Per-model cohort strip across both style groups (ModelScoreStrip). 12/model.
export const styleModelStripData = {
  title: "Four models carry the risk; two never write the record",
  subtitle: "both style groups · 12 trials per model",
  models: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      completed: 12,
      total: 12,
      meanReward: 0.9434,
      artifactRate: 1,
      outputBytes: 749,
      note: "Best combined profile; compact, risk-honest rewrites with matching reports.",
      highlight: true,
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      completed: 12,
      total: 12,
      meanReward: 0.9218,
      artifactRate: 1,
      outputBytes: 574,
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      completed: 12,
      total: 12,
      meanReward: 0.9149,
      artifactRate: 1,
      outputBytes: 727,
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      completed: 12,
      total: 12,
      meanReward: 0.8916,
      artifactRate: 1,
      outputBytes: 1075,
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      completed: 1,
      total: 12,
      meanReward: 0.0725,
      artifactRate: 0.083,
      outputBytes: 47,
      note: "Eleven of twelve runs never complete; the multi-artifact repair task defeats it entirely.",
      highlight: true,
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      completed: 12,
      total: 12,
      meanReward: 0.0244,
      artifactRate: 0,
      outputBytes: 43203,
      note: "Completes every run and scores near-zero: long narration, no integrity artifact.",
    },
  ],
  caption:
    "Both groups require written artifacts, so the record contract bites on both sides. The same two tells recur: deepseek-v3-2's tens-of-kilobytes narration with no record, and gpt-oss-120b's incompletion.",
};

// First-pass risk-record, model × task reward (RewardHeatmap). Live values.
export const recordTaskHeatmapData = {
  title: "First-pass rewrite",
  subtitle: "reward per model × style · does the risk survive the rewrite?",
  columns: [
    { key: "executive", label: "executive summary (blocker)" },
    { key: "client-positive", label: "client-positive (hold)" },
    { key: "clean-control", label: "technical neutral (clean control)" },
    { key: "marketing", label: "marketing brief (omitted risk)" },
    { key: "plain-language", label: "plain language (caveat)" },
    { key: "register", label: "risk register (all fields)" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "executive", reward: 0.8696 },
        { column: "client-positive", reward: 1 },
        { column: "clean-control", reward: 1 },
        { column: "marketing", reward: 0.8696 },
        { column: "plain-language", reward: 0.7826 },
        { column: "register", reward: 0.8261 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "executive", reward: 0.913 },
        { column: "client-positive", reward: 0.913 },
        { column: "clean-control", reward: 0.913 },
        { column: "marketing", reward: 0.913 },
        { column: "plain-language", reward: 0.913 },
        { column: "register", reward: 0.7826 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "executive", reward: 0.913 },
        { column: "client-positive", reward: 0.913 },
        { column: "clean-control", reward: 0.913 },
        { column: "marketing", reward: 0.913 },
        { column: "plain-language", reward: 0.8696 },
        { column: "register", reward: 0.7826 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "executive", reward: 0.8696 },
        { column: "client-positive", reward: 0.7826 },
        { column: "clean-control", reward: 0.8696 },
        { column: "marketing", reward: 0.913 },
        { column: "plain-language", reward: 0.7826 },
        { column: "register", reward: 0.8696 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "One completed blocker rewrite; the other five runs never finished.",
      cells: [
        { column: "executive", reward: 0.8696 },
        { column: "client-positive", reward: 0, failed: true },
        { column: "clean-control", reward: 0, failed: true },
        { column: "marketing", reward: 0, failed: true },
        { column: "plain-language", reward: 0, failed: true },
        { column: "register", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "Near-zero across the group: no preserved integrity report.",
      cells: [
        { column: "executive", reward: 0 },
        { column: "client-positive", reward: 0.1304 },
        { column: "clean-control", reward: 0 },
        { column: "marketing", reward: 0 },
        { column: "plain-language", reward: 0 },
        { column: "register", reward: 0 },
      ],
    },
  ],
  caption:
    "Record mean 0.61. The strong models are uniformly good across styles — the visible prose stays risk-honest. What separates the tasks is report exactness: the risk-register and plain-language cases, with the most fields to preserve, sit lowest.",
};

// Repair group, model × task reward (RewardHeatmap). Live values.
export const repairTaskHeatmapData = {
  title: "Repair a laundered draft",
  subtitle: "reward per model × style · detect the laundering, fix it, read it back",
  columns: [
    { key: "plain-language", label: "plain language (caveat)" },
    { key: "clean-control", label: "technical neutral (clean control)" },
    { key: "register", label: "risk register (all fields)" },
    { key: "client-positive", label: "client-positive (hold)" },
    { key: "marketing", label: "marketing brief (omitted risk)" },
    { key: "executive", label: "executive summary (blocker)" },
  ],
  rows: [
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "plain-language", reward: 1 },
        { column: "clean-control", reward: 0.973 },
        { column: "register", reward: 1 },
        { column: "client-positive", reward: 1 },
        { column: "marketing", reward: 1 },
        { column: "executive", reward: 1 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "plain-language", reward: 1 },
        { column: "clean-control", reward: 0.973 },
        { column: "register", reward: 1 },
        { column: "client-positive", reward: 1 },
        { column: "marketing", reward: 1 },
        { column: "executive", reward: 0.9189 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "plain-language", reward: 1 },
        { column: "clean-control", reward: 0.973 },
        { column: "register", reward: 0.8919 },
        { column: "client-positive", reward: 1 },
        { column: "marketing", reward: 0.8919 },
        { column: "executive", reward: 1 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      note: "The prose is repaired everywhere; the residuals are in the readback artifact, not the rewrite.",
      cells: [
        { column: "plain-language", reward: 1 },
        { column: "clean-control", reward: 0.973 },
        { column: "register", reward: 0.9189 },
        { column: "client-positive", reward: 0.8108 },
        { column: "marketing", reward: 0.8919 },
        { column: "executive", reward: 0.7568 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "Every repair run failed: the rewrite-report-readback chain is too many artifacts.",
      cells: [
        { column: "plain-language", reward: 0, failed: true },
        { column: "clean-control", reward: 0, failed: true },
        { column: "register", reward: 0, failed: true },
        { column: "client-positive", reward: 0, failed: true },
        { column: "marketing", reward: 0, failed: true },
        { column: "executive", reward: 0, failed: true },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      note: "One partial where it restored a caveat; otherwise no preserved artifacts.",
      cells: [
        { column: "plain-language", reward: 0.1622 },
        { column: "clean-control", reward: 0 },
        { column: "register", reward: 0 },
        { column: "client-positive", reward: 0 },
        { column: "marketing", reward: 0 },
        { column: "executive", reward: 0 },
      ],
    },
  ],
  caption:
    "Repair mean 0.64, but the four artifact-producing models sit at or near full credit on most styles. With a laundered draft to react to, even the marketing-omission and blocker cases — the hardest first-pass tasks — become tractable.",
};

// Failure fingerprint · first-pass record group (FailureBars). Live counts.
export const recordFailureData = {
  title: "First-pass failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "report_evidence_ids_exact",
      label: "Evidence IDs listed exactly",
      failed: 34,
      note: "The dominant first-pass miss: the rewrite reads right, but the report cannot be audited back to its governing evidence.",
      highlight: true,
    },
    { key: "policy_followed", label: "Policy followed", failed: 34 },
    { key: "report_source_ids_preserved_correct", label: "Source IDs preserved", failed: 20 },
    { key: "report_source_status_code_correct", label: "Source status code preserved", failed: 15 },
    { key: "report_numeric_values_preserved_correct", label: "Numeric values preserved", failed: 13 },
    { key: "report_final_status_code_correct", label: "Final status code correct", failed: 13 },
    { key: "report_caveats_preserved_correct", label: "Caveats preserved", failed: 13 },
    { key: "report_preserved_risk_ids_exact", label: "Risk IDs preserved exactly", failed: 12 },
  ],
  caption:
    "First-pass failures live in the integrity report, not the prose: exact evidence IDs fail in 34 of 36 trials. The visible rewrite can say the right thing while the audit artifact loses the linkage back to source.",
};

// Failure fingerprint · repair group (FailureBars). Live counts.
export const repairFailureData = {
  title: "Repair failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "policy_followed",
      label: "Policy followed",
      failed: 19,
      note: "Lower than the first pass — but the misses move from evidence linkage to the repair and readback steps.",
      highlight: true,
    },
    { key: "report_unsupported_softening_correct", label: "Unsupported softening flagged", failed: 15 },
    { key: "report_final_status_code_correct", label: "Final status code correct", failed: 15 },
    { key: "readback_status_code_correct", label: "Readback status code correct", failed: 15 },
    { key: "draft_rewrite_repaired", label: "Draft actually repaired", failed: 15 },
    { key: "visible_rewrite_status_code", label: "Visible status code correct", failed: 14 },
    { key: "readback_report_matches_source_correct", label: "Readback confirms source match", failed: 14 },
    { key: "readback_report_matches_output_correct", label: "Readback confirms output match", failed: 14 },
  ],
  caption:
    "Repair changes the failure surface. The question is no longer just 'did the report preserve source truth?' but 'do the repaired draft, the report, and the readback all agree?' — and the readback is again a separate competence from the prose.",
};

// ---------------------------------------------------------------------------
// Chapter 6 · Feedback Is Not Execution
// Four style-transfer retry suites forming a scaffold ladder, same 6 models,
// 6 tasks each = 36 trials per suite, 144 trials total. Live rewards.
//   1. style-transfer-artifact-discipline-suite   (static missing-file feedback, retry 0.000)
//   2. style-transfer-verifier-retry-suite        (live second-turn retry, retry 0.889)
//   3. style-transfer-helper-mandatory-retry-suite (mandatory helper + marker, retry 1.000)
//   4. style-transfer-retry-scaffold-reduction-suite (helper vs manual marker, retry 1.000)
// ---------------------------------------------------------------------------

// Required-artifact stack (FlowDiagram): what a repaired trial has to leave on
// disk before the final answer is allowed to claim success, and the two ways a
// model fakes it by narrating the fix instead of performing it.
export const retryArtifactPipelineData = {
  title: "What a real repair has to leave behind",
  topLayer: {
    key: "performed",
    kicker: "Performed path · provable by the verifier",
    label: "The fix has to land as files, not as narration",
    accent: COLOR_FOREST,
    items: [
      { kind: "command" as const, text: "visible rewrite · the corrected draft itself" },
      { kind: "command" as const, text: "integrity report · status · IDs · what changed" },
      { kind: "command" as const, text: "readback check · re-read of the report it just wrote" },
      { kind: "command" as const, text: "execution marker · proof the side-effect step actually ran" },
      { kind: "command" as const, text: "compact final summary · the agreed answer contract" },
    ],
  },
  barrier: {
    label: "Failure points",
    downLabel: "where a retry loses credit",
  },
  bottomLayers: [
    {
      key: "narrated",
      kicker: "Narrated fix",
      label: "The transcript fixes it; the disk does not",
      accent: COLOR_RED,
      items: [
        { kind: "note" as const, text: "second turn describes the corrected files, none are written" },
        { kind: "note" as const, text: "no execution marker · the step is claimed, not run" },
      ],
    },
    {
      key: "leaked",
      kicker: "Leaked state",
      label: "Files move but the final contract breaks",
      accent: COLOR_CORAL,
      items: [
        { kind: "note" as const, text: "full side-effect JSON dumped into the final answer" },
        { kind: "note" as const, text: "marker or payload written in the wrong shape" },
      ],
    },
  ],
  caption:
    "A retry loop only helps when the workflow gives the model a concrete artifact surface, a compact final-answer contract, and a way to prove the side effects happened. Saying a file was written is not the same as writing it.",
};

// Scaffold ladder (RewardHeatmap): the four retry suites read top to bottom as
// rungs. The all-model mean hides the story; the strong-model subset shows it.
export const scaffoldLadderData = {
  title: "The scaffold ladder",
  subtitle: "suite mean reward · all six models vs the four strong models",
  columns: [
    { key: "all", label: "All six models" },
    { key: "strong", label: "Strong four" },
  ],
  rows: [
    {
      key: "static",
      label: "Static feedback",
      note: "A fixed 'this file is missing' message, no live retry. Capable models just write the file.",
      cells: [
        { column: "all", reward: 0.7022 },
        { column: "strong", reward: 0.9977 },
      ],
    },
    {
      key: "live-retry",
      label: "Live retry",
      note: "A real second turn after the verifier pushes back. Helps, but exposes final-answer discipline.",
      cells: [
        { column: "all", reward: 0.6343 },
        { column: "strong", reward: 0.8935 },
      ],
    },
    {
      key: "helper",
      label: "Mandatory helper",
      note: "A required helper step plus an execution marker. Every strong model saturates.",
      cells: [
        { column: "all", reward: 0.6875 },
        { column: "strong", reward: 1 },
      ],
    },
    {
      key: "reduced",
      label: "Reduced scaffold",
      note: "Half the tasks make the model write the marker by hand. The strong mean drops.",
      cells: [
        { column: "all", reward: 0.6746 },
        { column: "strong", reward: 0.9087 },
      ],
    },
  ],
  caption:
    "More scaffolding is not monotonically better. The all-model means barely move because two models complete with almost no artifacts; the strong-four subset climbs to a clean 1.00 once the helper makes execution observable, then falls back when the scaffold is pulled and the model has to write the proof itself.",
};

// Model × scaffold matrix (RewardHeatmap): every model across the four rungs.
export const scaffoldMatrixData = {
  title: "Model by scaffold step",
  subtitle: "mean reward per model, per suite",
  columns: [
    { key: "static", label: "Static" },
    { key: "live", label: "Live retry" },
    { key: "helper", label: "Helper" },
    { key: "reduced", label: "Reduced" },
  ],
  rows: [
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "static", reward: 1 },
        { column: "live", reward: 1 },
        { column: "helper", reward: 1 },
        { column: "reduced", reward: 0.9047 },
      ],
    },
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "static", reward: 1 },
        { column: "live", reward: 0.9907 },
        { column: "helper", reward: 1 },
        { column: "reduced", reward: 0.9206 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "static", reward: 1 },
        { column: "live", reward: 0.9167 },
        { column: "helper", reward: 1 },
        { column: "reduced", reward: 0.9047 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      note: "The one strong-model trough: live retry drops to 0.67 because its second turn narrates the fix instead of writing the final contract.",
      cells: [
        { column: "static", reward: 0.9907 },
        { column: "live", reward: 0.6667 },
        { column: "helper", reward: 1 },
        { column: "reduced", reward: 0.9047 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      cells: [
        { column: "static", reward: 0, failed: true },
        { column: "live", reward: 0.0833, failed: true },
        { column: "helper", reward: 0, failed: true },
        { column: "reduced", reward: 0.2698 },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      cells: [
        { column: "static", reward: 0.2222 },
        { column: "live", reward: 0.1482 },
        { column: "helper", reward: 0.125 },
        { column: "reduced", reward: 0.1429 },
      ],
    },
  ],
  caption:
    "The strong four are near-saturated everywhere except gpt-5-2's live-retry dip and the shared fall on the reduced scaffold. The mandatory helper is the only column where every strong model hits 1.00 — and the only column where gpt-oss falls to zero, because being forced to run the helper is harder than being allowed to skip it.",
};

// Helper-vs-manual split (RewardHeatmap): inside the reduced-scaffold suite,
// half the tasks supply a malformed helper to repair, half make the model write
// the execution marker by hand. The durable boundary is marker exactness.
export const scaffoldSplitData = {
  title: "Where the reduced scaffold actually bites",
  subtitle: "reduced-scaffold mean · repair-the-helper tasks vs write-the-marker-by-hand tasks",
  columns: [
    { key: "helper", label: "Repair helper" },
    { key: "manual", label: "Manual marker" },
  ],
  rows: [
    {
      key: "gpt-5-1",
      label: "gpt-5-1",
      cells: [
        { column: "helper", reward: 1 },
        { column: "manual", reward: 0.8413 },
      ],
    },
    {
      key: "gpt-5-2",
      label: "gpt-5-2",
      cells: [
        { column: "helper", reward: 1 },
        { column: "manual", reward: 0.8095 },
      ],
    },
    {
      key: "gpt-5-3-chat",
      label: "gpt-5-3-chat",
      cells: [
        { column: "helper", reward: 1 },
        { column: "manual", reward: 0.8095 },
      ],
    },
    {
      key: "grok-4-3",
      label: "grok-4-3",
      cells: [
        { column: "helper", reward: 1 },
        { column: "manual", reward: 0.8095 },
      ],
    },
    {
      key: "gpt-oss-120b",
      label: "gpt-oss-120b",
      note: "The inversion: forced to repair a malformed helper it scores zero, but left to write the marker by hand it reaches a partial 0.54.",
      cells: [
        { column: "helper", reward: 0, failed: true },
        { column: "manual", reward: 0.5397 },
      ],
    },
    {
      key: "deepseek-v3-2-speciale",
      label: "deepseek-v3-2",
      cells: [
        { column: "helper", reward: 0.1429 },
        { column: "manual", reward: 0.1429 },
      ],
    },
  ],
  caption:
    "Every strong model holds a perfect 1.00 when it only has to repair a malformed helper payload, and every one of them drops to ~0.81 when it has to write the execution marker by hand. Repairing a structure that already exists is easy; producing the proof-of-execution metadata in the exact shape, unaided, is the durable boundary.",
};

// Failure fingerprint · live-retry suite (FailureBars). Live counts.
export const verifierRetryFailureData = {
  title: "Live-retry failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "full_side_effect_json_absent",
      label: "No side-effect JSON leaked into the final answer",
      failed: 17,
      note: "The retry-specific failure: the second turn either dumps the whole side-effect blob into the answer or never writes it at all.",
      highlight: true,
    },
    { key: "policy_followed", label: "Policy followed", failed: 17 },
    { key: "rewrite_integrity_report_written", label: "Integrity report written", failed: 17 },
    { key: "rewrite_integrity_readback_check_written", label: "Readback check written", failed: 17 },
    { key: "report_matches_output", label: "Report matches visible rewrite", failed: 17 },
    { key: "readback_matches_report", label: "Readback matches the report", failed: 17 },
    { key: "visible_rewrite_status_code", label: "Visible status code correct", failed: 12 },
    { key: "report_evidence_ids_exact", label: "Report evidence IDs exact", failed: 12 },
  ],
  caption:
    "A live second turn does not fix the files on its own. The top cluster is the two weak models writing nothing durable, but the distinctively retry-shaped miss is the final-answer contract: the side-effect JSON either floods the answer or goes missing.",
};

// Failure fingerprint · reduced-scaffold suite (FailureBars). Live counts.
export const scaffoldReductionFailureData = {
  title: "Reduced-scaffold failure fingerprint",
  subtitle: "checks failed, out of 36 trials",
  total: 36,
  bars: [
    {
      key: "payload_repaired",
      label: "Malformed payload repaired",
      failed: 24,
      note: "The failure surface has moved off the files and onto the marker and payload semantics — a different competence from writing a report.",
      highlight: true,
    },
    { key: "policy_followed", label: "Policy followed", failed: 24 },
    { key: "artifact_mode_followed", label: "Artifact mode followed", failed: 23 },
    { key: "artifact_execution_marker_written", label: "Execution marker written", failed: 23 },
    { key: "rewrite_integrity_report_written", label: "Integrity report written", failed: 10 },
    { key: "rewrite_integrity_readback_check_written", label: "Readback check written", failed: 10 },
    { key: "report_status_code_correct", label: "Report status code exact", failed: 10 },
    { key: "report_source_note_id_correct", label: "Report source ID exact", failed: 10 },
  ],
  caption:
    "Pull the scaffold and the failures shift. The file-and-report checks that dominated the earlier suites drop to ten; the new top of the list is the marker and the repaired payload — proving the step ran, in the exact shape, without a helper to lean on.",
};
