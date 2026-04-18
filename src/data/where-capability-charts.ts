// ABOUTME: Concept-grid datasets for the where-capability-actually-lives article.
// ABOUTME: Harness layers, open research questions, task-vs-process comparison.

export const harnessLayersData = {
  title: "Where capability lives · the harness stack",
  items: [
    {
      key: "tools",
      symbol: "T",
      label: "Tools",
      definition:
        "Accumulated domain method, externalised so the model doesn't have to reconstruct it from prose. Calculators, lookups, verification routines — the procedures a field has already made executable.",
    },
    {
      key: "verifiers",
      symbol: "V",
      label: "Verifiers",
      definition:
        "Habits of checking made structural rather than hoped-for. Routines the system can invoke on demand, not dispositions the model is trusted to adopt.",
    },
    {
      key: "contracts",
      symbol: "O",
      label: "Output contracts",
      definition:
        "Required shape of the final answer: inspectable, comparable, operationally usable. Decides whether the work can be trusted by the next system or reviewer.",
    },
    {
      key: "control",
      symbol: "C",
      label: "Control flow",
      definition:
        "Turn budgets, routing, branching policy. Determines whether the agent has room for a careful review, or collapses into partial work and malformed output.",
    },
  ],
  caption:
    "The model is only one layer. Each of these carries capability that would otherwise have to live inside prompt context — where it is less stable, harder to enforce, and easier to lose between turns.",
};

export const openQuestionsData = {
  title: "Open research questions · what is still underspecified",
  items: [
    {
      key: "knowledge",
      symbol: "K",
      label: "Knowledge location",
      definition:
        "Prompt, retrieval, tool, or verifier — where should engineering method live, and in what form? The choices are not equivalent: a method in prose is available very differently from a method in an executable routine.",
    },
    {
      key: "unit",
      symbol: "U",
      label: "Unit of work",
      definition:
        "Task or process? Too narrow loses leverage; too broad loses attachment to the governing artifact. The span inside which the agent can remain controllable is the real design variable.",
    },
    {
      key: "reliability",
      symbol: "R",
      label: "Reliability signals",
      definition:
        "Which trace-level behaviours predict a dependable run, not just a correct final answer? Uncertainty exposure, revisiting weak steps, and graceful failure may matter more than end scores.",
    },
    {
      key: "failure",
      symbol: "F",
      label: "Failure modes",
      definition:
        'Loss of attachment, instance substitution, unsupported use of standards, malformed completion — different breakdowns, different remedies. Coarse "reasoning failure" hides the mechanism.',
    },
    {
      key: "environment",
      symbol: "E",
      label: "Environmental capability",
      definition:
        "How much of observed performance is native competence versus supplied by the harness? Where is the line between scaffolding that unlocks real skill and scaffolding that performs the task on the model's behalf?",
    },
  ],
  caption:
    "These are structural questions, not implementation details. Each one changes what we should build, what we should measure, and how we should interpret success in agentic engineering.",
};

export const taskProcessData = {
  title: "Two shapes of work · task vs process",
  items: [
    {
      key: "task",
      symbol: "T",
      label: "Task",
      definition:
        "Bounded, often single-step, verifiable by one output. The design question is narrow: can the system complete this unit of work correctly? Orchestration is a thin wrapper.",
    },
    {
      key: "process",
      symbol: "P",
      label: "Process",
      definition:
        "Longer-horizon, multi-artifact, gated by review and redirection. The design questions multiply: how should work be decomposed, where should evidence accumulate, when should an expert intervene, what intermediate state must stay visible?",
    },
  ],
  caption:
    "The moment work stops being a task, orchestration stops being implementation and becomes part of the substance of the work itself.",
};
