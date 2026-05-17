// ABOUTME: Chart datasets for the AEC-Bench Prime RL training article.
// ABOUTME: Encodes the first hosted run curve and imported base-vs-adapter eval comparison.

export const trainingTrajectoryData = {
  title: "Hosted training run",
  subtitle: "stateful workspace behavior over 20 steps",
  series: [
    {
      key: "reward",
      label: "Mean reward",
      accent: "#e8a84c",
      note:
        "Training reward rose from 0.281 at step 0 to 0.979 at step 19 on the narrowed easy slice.",
      points: [
        { cycle: 0, value: 0.2812 },
        { cycle: 1, value: 0.3594 },
        { cycle: 2, value: 0.3089 },
        { cycle: 3, value: 0.3958 },
        { cycle: 4, value: 0.4827 },
        { cycle: 5, value: 0.4533 },
        { cycle: 6, value: 0.5966 },
        { cycle: 7, value: 0.6264 },
        { cycle: 8, value: 0.7363 },
        { cycle: 9, value: 0.821 },
        { cycle: 10, value: 0.7266 },
        { cycle: 11, value: 0.8125 },
        { cycle: 12, value: 0.8058 },
        { cycle: 13, value: 0.7841 },
        { cycle: 14, value: 0.776 },
        { cycle: 15, value: 0.9374 },
        { cycle: 16, value: 0.7798 },
        { cycle: 17, value: 0.868 },
        { cycle: 18, value: 0.8246 },
        { cycle: 19, value: 0.9792 },
      ],
    },
    {
      key: "submit",
      label: "Submit calls",
      accent: "#7ab5af",
      note:
        "Mean submit_answer calls rose from 0.099 to 0.917, which is the clearest sign the policy learned to finish the workspace loop.",
      points: [
        { cycle: 0, value: 0.099 },
        { cycle: 1, value: 0.1875 },
        { cycle: 2, value: 0.1875 },
        { cycle: 3, value: 0.2552 },
        { cycle: 4, value: 0.5 },
        { cycle: 5, value: 0.25 },
        { cycle: 6, value: 0.4375 },
        { cycle: 7, value: 0.5357 },
        { cycle: 8, value: 0.5312 },
        { cycle: 9, value: 0.6875 },
        { cycle: 10, value: 0.6708 },
        { cycle: 11, value: 0.7188 },
        { cycle: 12, value: 0.6771 },
        { cycle: 13, value: 0.7292 },
        { cycle: 14, value: 0.75 },
        { cycle: 15, value: 0.8403 },
        { cycle: 16, value: 0.6607 },
        { cycle: 17, value: 0.7917 },
        { cycle: 18, value: 0.75 },
        { cycle: 19, value: 0.9167 },
      ],
    },
    {
      key: "no-tools",
      label: "No-tools stop",
      accent: "#d87b55",
      dashed: true,
      note:
        "The no-tools stop condition fell from 0.906 to 0.078, so late rollouts were much less likely to sit outside the tool loop.",
      points: [
        { cycle: 0, value: 0.9062 },
        { cycle: 1, value: 0.8438 },
        { cycle: 2, value: 0.7969 },
        { cycle: 3, value: 0.6875 },
        { cycle: 4, value: 0.5781 },
        { cycle: 5, value: 0.7188 },
        { cycle: 6, value: 0.3906 },
        { cycle: 7, value: 0.4219 },
        { cycle: 8, value: 0.4375 },
        { cycle: 9, value: 0.4062 },
        { cycle: 10, value: 0.4531 },
        { cycle: 11, value: 0.25 },
        { cycle: 12, value: 0.3125 },
        { cycle: 13, value: 0.2344 },
        { cycle: 14, value: 0.2656 },
        { cycle: 15, value: 0.1719 },
        { cycle: 16, value: 0.3281 },
        { cycle: 17, value: 0.1875 },
        { cycle: 18, value: 0.2812 },
        { cycle: 19, value: 0.0781 },
      ],
    },
  ],
  yDomain: [0, 1] as [number, number],
  yLabel: "share / mean value",
  xLabel: "training step",
  caption:
    "Prime hosted training metrics for the completed Qwen/Qwen3.5-4B run on the narrowed easy stateful slice. Reward moved with finish behaviour: the model called submit_answer more often while no-tools rollouts fell.",
};

export const adapterComparisonData = {
  title: "Base vs adapter",
  categories: [
    {
      key: "reward",
      label: "reward mean",
      description:
        "Mean AEC-Bench reward across 15 imported medium stateful eval samples.",
    },
    {
      key: "nonzero",
      label: "nonzero reward",
      description:
        "Share of rollouts that received any reward, regardless of whether the answer was perfect.",
    },
    {
      key: "final",
      label: "final env response",
      description:
        "Share of rollouts that reached a verifier-visible final environment response.",
    },
    {
      key: "empty",
      label: "empty errors",
      description:
        "Share of rollouts that ended with EmptyModelResponseError. Lower is better.",
    },
    {
      key: "submit",
      label: "submit calls",
      description:
        "Mean submit_answer calls per rollout. This is a workflow-completion metric, not a correctness metric.",
    },
  ],
  series: [
    {
      key: "base",
      label: "Base",
      accent: "#d87b55",
      description:
        "Qwen/Qwen3.5-4B without the trained adapter on the imported medium stateful eval slice.",
    },
    {
      key: "adapter",
      label: "Adapter",
      accent: "#7ab5af",
      description:
        "The same base model with the deployed Prime adapter from the completed hosted run.",
    },
  ],
  values: [
    {
      category: "reward",
      series: "base",
      value: 0.333,
      note: "Five of fifteen base rollouts received nonzero reward.",
    },
    {
      category: "reward",
      series: "adapter",
      value: 0.8,
      note: "Twelve of fifteen adapter rollouts received nonzero reward.",
    },
    {
      category: "nonzero",
      series: "base",
      value: 5 / 15,
      note: "The base run often entered the workspace but failed before useful completion.",
    },
    {
      category: "nonzero",
      series: "adapter",
      value: 12 / 15,
      note: "The adapter turned more rollouts into verifier-visible work.",
    },
    {
      category: "final",
      series: "base",
      value: 2 / 15,
      note: "Only two base rollouts reached the final environment response condition.",
    },
    {
      category: "final",
      series: "adapter",
      value: 8 / 15,
      note: "Eight adapter rollouts reached final response.",
    },
    {
      category: "empty",
      series: "base",
      value: 13 / 15,
      note: "The base run produced thirteen EmptyModelResponseError outcomes.",
    },
    {
      category: "empty",
      series: "adapter",
      value: 3 / 15,
      note: "The adapter run reduced EmptyModelResponseError outcomes to three.",
    },
    {
      category: "submit",
      series: "base",
      value: 0.133,
      note: "Mean submit_answer calls per rollout.",
    },
    {
      category: "submit",
      series: "adapter",
      value: 0.533,
      note: "The adapter submitted about four times as often on this small slice.",
    },
  ],
  domain: [0, 1] as [number, number],
  valueFormat: "decimal-2" as const,
  caption:
    "Imported Prime eval samples in the AEC-Bench ledger, n = 15 per run. The task grouping was not perfectly paired, so the safe claim is workflow completion, not broad engineering mastery.",
};
