// ABOUTME: Chart datasets for the recursive-by-design MDX article.
// ABOUTME: Open REPL vs Lambda-RLM architecture comparison.

export const rlmArchitectureShiftData = {
  title: "Architecture shift · open REPL vs Lambda-RLM",
  columns: [
    {
      key: "open-repl",
      kicker: "Open REPL",
      subtitle: "model decides decomposition",
      highlight: false,
      steps: [
        { key: "model", label: "Model" },
        { key: "generate", label: "Generate code" },
        { key: "execute", label: "Execute in REPL" },
        { key: "read", label: "Read output" },
      ],
      loop: "loops back · 48–150 turns",
      stats: [
        { value: "732K – 1.54M tokens" },
        { value: "2.1× variance" },
        { value: "cost unknown until done" },
      ],
    },
    {
      key: "lambda-rlm",
      kicker: "Lambda-RLM",
      subtitle: "structure decides decomposition",
      highlight: true,
      steps: [
        {
          key: "plan",
          label: "Plan",
          detail: "parse template → measure sources → compute k*, τ*",
          meta: "0 LLM calls",
        },
        {
          key: "extract",
          label: "Extract",
          detail: "split → leaf extract → reduce (per section)",
          meta: "bounded leaves",
        },
        {
          key: "review",
          label: "Review",
          detail: "contract alignment → re-extract if gaps",
          meta: "1 call / section",
        },
        {
          key: "generate",
          label: "Generate",
          detail: "compose from extractions + dependencies",
          meta: "1 call / section",
        },
      ],
      stats: [
        { value: "53K tokens", highlight: true },
        { value: "27 calls (= estimate)" },
        { value: "cost known before first call" },
      ],
    },
  ],
  caption:
    "The model fills the leaves · the structure is the plan. Open REPL lets the model rediscover the decomposition every run, with variable turn counts and unpredictable cost. Lambda-RLM computes the decomposition once from the template, leaving the model to do only what it is good at — bounded, local synthesis.",
};
