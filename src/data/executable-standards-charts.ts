// ABOUTME: Chart datasets for the executable-standards article — autoformalisation pipeline.
// ABOUTME: Transformation ladder stages, corpus explorer tree, certificate binding spokes.

const COLOR_TEAL = "#7ab5af";
const COLOR_AMBER = "#e8a84c";
const COLOR_CORAL = "#d87b55";
const COLOR_FOREST = "#5a8a84";
const COLOR_RED = "#bf4d43";

// ---------------------------------------------------------------------------
// Documents → Requirements pipeline (inline figure in the prose).
// ---------------------------------------------------------------------------

export const documentsToRequirementsData = {
  steps: [
    {
      key: "document",
      glyph: "document" as const,
      label: "Unstructured document",
      detail: "spec · brief · code · contract schedule",
      accent: COLOR_TEAL,
    },
    {
      key: "atomic",
      glyph: "atomic" as const,
      label: "Atomic requirement",
      detail: "named · scoped · traceable",
      accent: COLOR_AMBER,
    },
    {
      key: "register",
      glyph: "register" as const,
      label: "Structured register",
      detail: "queryable · classified · auditable",
      accent: COLOR_CORAL,
    },
  ],
};

// ---------------------------------------------------------------------------
// Autoformalisation pipeline preview — mirrors Figure 1, used as inline header
// for the "From Requirements To Predicates" section.
// ---------------------------------------------------------------------------

export const autoformPipelinePreviewData = {
  steps: [
    {
      key: "source",
      glyph: "document" as const,
      label: "Source",
      accent: COLOR_TEAL,
    },
    {
      key: "atomic",
      glyph: "atomic" as const,
      label: "Atomic requirement",
      accent: COLOR_TEAL,
    },
    {
      key: "predicate",
      glyph: "predicate" as const,
      label: "Typed predicate",
      accent: COLOR_AMBER,
    },
    {
      key: "corpus",
      glyph: "corpus" as const,
      label: "Versioned corpus",
      accent: COLOR_AMBER,
    },
    {
      key: "verifier",
      glyph: "verifier" as const,
      label: "Verifier result",
      accent: COLOR_CORAL,
    },
    {
      key: "certificate",
      glyph: "certificate" as const,
      label: "Certificate",
      accent: COLOR_CORAL,
    },
  ],
  caption:
    "Six stages from clause to certificate. Figure 1 below walks the same ladder interactively, with the artefact each stage produces.",
};

// ---------------------------------------------------------------------------
// Figure 1 — Transformation Ladder
// One fabricated voltage-drop obligation moving through six stages.
// ---------------------------------------------------------------------------

export const transformationLadderData = {
  title: "Figure 1 · the transformation ladder",
  subtitle:
    "one obligation, six stages — click a stage to inspect the artefact it produces",
  stages: [
    {
      key: "raw",
      number: "01",
      label: "Raw standard text",
      kicker: "prose",
      accent: COLOR_TEAL,
      preview: {
        language: "text",
        code: `The voltage drop for a final subcircuit shall not exceed
5 percent of the nominal voltage under the stated design load.`,
      },
      whatChanged: "prose",
      whatBecameCheckable: "boundary",
      whatCanFail: "ambiguous clause",
      identity: null,
    },
    {
      key: "atomic",
      number: "02",
      label: "Atomic requirement",
      kicker: "record",
      accent: COLOR_TEAL,
      preview: {
        language: "json",
        code: `{
  "requirement_id": "AS3000-3.4.3-voltage-drop",
  "text": "Voltage drop for the circuit shall not exceed 5% of nominal voltage.",
  "scope_tags": ["cable_sizing", "voltage_drop"],
  "standard_version": "AS/NZS 3000:2018 Amdt 3",
  "source_hash": "sha256:b1c8…"
}`,
      },
      whatChanged: "record",
      whatBecameCheckable: "provenance",
      whatCanFail: "bad split",
      identity: { kind: "source_hash", value: "sha256:b1c8…" },
    },
    {
      key: "predicate",
      number: "03",
      label: "Typed predicate",
      kicker: "code",
      accent: COLOR_AMBER,
      preview: {
        language: "python",
        code: `@requirement("AS3000-3.4.3")
def voltage_drop_within_limit(
    design: CableDesign,
) -> PredicateResult:
    percent = 100 * design.voltage_drop_v / design.nominal_voltage_v
    return PredicateResult.bounded(
        percent <= 5.0,
        witness={"actual_percent": percent, "limit_percent": 5.0},
    )`,
      },
      whatChanged: "code",
      whatBecameCheckable: "semantics",
      whatCanFail: "wrong lift",
      identity: { kind: "predicate_hash", value: "sha256:8f3a…" },
    },
    {
      key: "corpus",
      number: "04",
      label: "Corpus entry",
      kicker: "index",
      accent: COLOR_AMBER,
      preview: {
        language: "json",
        code: `{
  "predicate_name": "voltage_drop_within_limit",
  "predicate_hash": "sha256:8f3a…",
  "standard_version": "AS/NZS 3000:2018 Amdt 3",
  "scope_tags": ["cable_sizing", "voltage_drop"],
  "status": "released",
  "supersedes": null
}`,
      },
      whatChanged: "index",
      whatBecameCheckable: "applicability",
      whatCanFail: "stale index",
      identity: { kind: "predicate_hash", value: "sha256:8f3a…" },
    },
    {
      key: "result",
      number: "05",
      label: "Verifier result",
      kicker: "result",
      accent: COLOR_CORAL,
      preview: {
        language: "json",
        code: `{
  "predicate_hash": "sha256:8f3a…",
  "status": "pass",
  "witness": {
    "actual_percent": 3.78,
    "limit_percent": 5.0
  }
}`,
      },
      whatChanged: "result",
      whatBecameCheckable: "witness",
      whatCanFail: "failed predicate",
      identity: { kind: "predicate_hash", value: "sha256:8f3a…" },
    },
    {
      key: "certificate",
      number: "06",
      label: "Certificate",
      kicker: "certificate",
      accent: COLOR_CORAL,
      preview: {
        language: "json",
        code: `{
  "certificate_id": "cert_sha256:c41a…",
  "overall": "valid",
  "design_hash": "sha256:e7d2…",
  "predicate_hashes": ["sha256:8f3a…"],
  "standard_versions": ["AS/NZS 3000:2018 Amdt 3"]
}`,
      },
      whatChanged: "certificate",
      whatBecameCheckable: "validity",
      whatCanFail: "invalid certificate",
      identity: { kind: "certificate_id", value: "cert_sha256:c41a…" },
    },
  ],
  caption:
    "The same source_hash, predicate_hash, and certificate_id carry forward as the obligation hardens. Identity is not just metadata — it is what lets a later certificate be invalidated when an upstream artefact changes.",
};

// ---------------------------------------------------------------------------
// Figure 2 — Predicate Corpus Explorer
// Tree of fabricated AS/NZS 3000 cable-sizing predicates with tabs.
// ---------------------------------------------------------------------------

export const predicateCorpusData = {
  title: "Figure 2 · predicate corpus explorer",
  subtitle:
    "browse a fabricated AS/NZS 3000 corpus — pick a predicate, switch tabs, toggle the amendment",
  versions: [
    { key: "amdt3", label: "AS3000-2018-Amdt3", default: true },
    { key: "amdt4", label: "AS3000-2018-Amdt4" },
  ],
  tree: [
    {
      key: "electrical",
      label: "electrical",
      children: [
        {
          key: "as_nzs_3000",
          label: "as_nzs_3000",
          children: [
            {
              key: "cable_sizing",
              label: "cable_sizing",
              children: [
                {
                  key: "current_rating",
                  label: "current_rating",
                  children: [
                    {
                      key: "minimum_current_capacity",
                      label: "minimum_current_capacity",
                      isLeaf: true,
                    },
                  ],
                },
                {
                  key: "voltage_drop",
                  label: "voltage_drop",
                  children: [
                    {
                      key: "max_percentage_drop",
                      label: "max_percentage_drop",
                      isLeaf: true,
                      featured: true,
                    },
                  ],
                },
                {
                  key: "fault_loop_impedance",
                  label: "fault_loop_impedance",
                  children: [
                    {
                      key: "disconnection_time_limit",
                      label: "disconnection_time_limit",
                      isLeaf: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  predicates: {
    minimum_current_capacity: {
      label: "minimum_current_capacity",
      status: "released",
      versions: {
        amdt3: {
          status: "released",
          tabs: {
            "predicate.py": `@requirement("AS3000-3.4.1")
def minimum_current_capacity(design: CableDesign) -> PredicateResult:
    rating = lookup_current_rating(
        size_mm2=design.size_mm2,
        installation_method=design.method,
    )
    return PredicateResult.bounded(
        design.load_current_a <= rating,
        witness={"load_a": design.load_current_a, "rating_a": rating},
    )`,
            "tests.py": `def test_passes_when_load_under_rating():
    design = CableDesign(size_mm2=4, method="B1", load_current_a=25)
    assert minimum_current_capacity(design).status == "pass"

def test_fails_when_load_exceeds_rating():
    design = CableDesign(size_mm2=2.5, method="B1", load_current_a=32)
    assert minimum_current_capacity(design).status == "fail"`,
            "manifest.json": `{
  "predicate_hash": "sha256:2a91…",
  "status": "released",
  "scope_tags": ["cable_sizing", "current_rating"],
  "standard_version": "AS/NZS 3000:2018 Amdt 3",
  "jurisdictions": ["AU"]
}`,
            "provenance.json": `{
  "source_document": "AS/NZS 3000:2018 Amdt 3",
  "source_spans": [{"clause": "3.4.1", "page": 142}],
  "lifted_by": "agent:autoform-v0.3",
  "audited_by": "engineer:tg",
  "audited_at": "2026-04-12T14:08:00Z"
}`,
          },
        },
      },
    },
    max_percentage_drop: {
      label: "max_percentage_drop",
      status: "released",
      versions: {
        amdt3: {
          status: "released",
          supersedes: null,
          tabs: {
            "predicate.py": `from aec_autoform.domains.electrical.cable_sizing import (
    CableDesign,
    voltage_drop_within_limit,
)
from aec_autoform.runtime import PredicateResult, requirement


@requirement("AS3000-3.4.3")
def predicate(design: CableDesign) -> PredicateResult:
    passed = voltage_drop_within_limit(design)

    return PredicateResult.bounded(
        passed,
        witness={
            "voltage_drop_percent": design.voltage_drop_percent,
            "max_voltage_drop_percent": design.max_voltage_drop_percent,
        },
    )`,
            "tests.py": `from aec_autoform.domains.electrical.cable_sizing import CableDesign
from predicate import predicate


def test_passes_when_voltage_drop_is_within_limit():
    design = CableDesign(
        load_current_a=63.0,
        rated_current_a=80.0,
        voltage_drop_percent=4.2,
        max_voltage_drop_percent=5.0,
        fault_loop_impedance_ohm=0.4,
        disconnection_limit_ohm=0.8,
    )

    result = predicate(design)

    assert result.passed is True
    assert result.witness == {
        "voltage_drop_percent": 4.2,
        "max_voltage_drop_percent": 5.0,
    }


def test_fails_when_voltage_drop_exceeds_limit():
    design = CableDesign(
        load_current_a=63.0,
        rated_current_a=80.0,
        voltage_drop_percent=5.4,
        max_voltage_drop_percent=5.0,
        fault_loop_impedance_ohm=0.4,
        disconnection_limit_ohm=0.8,
    )

    result = predicate(design)

    assert result.passed is False`,
            "manifest.json": `{
  "schema_version": "corpus-manifest@v0.1",
  "predicate_name": "max_percentage_drop",
  "predicate_slug": "max_percentage_drop",
  "predicate_version": "0.1.0",
  "predicate_hash": "sha256:2359c7bc575f05395afa156b38e35b6092a44a4309a4bd1d476a7a68d2843231",
  "tests_hash": "sha256:41303aa32f3684f1c984a17f84c1f10fad81757a411c01357793023c6ad52827",
  "provenance_hash": "sha256:4ac03b3d0b3ff1888eeac756edc8e591c9f4070a038f0d8928b9cb6c8d8041cd",
  "standard": "as_nzs_3000",
  "standard_version": "AS/NZS 3000:2018 Amdt 3",
  "discipline": "electrical",
  "scope_tags": ["cable_sizing", "voltage_drop"],
  "jurisdictions": ["AS/NZS", "AU", "NZ"],
  "status": "released",
  "source_requirement_ids": ["AS3000-3.4.3"],
  "source_requirement_hashes": ["sha256:fixture-voltage-drop"],
  "supersedes": [],
  "replaces": [],
  "lean_eligible": false,
  "lean_status": "not_eligible"
}`,
            "provenance.json": `{
  "schema_version": "corpus-provenance@v0.1",
  "source_document_title": "AS/NZS 3000:2018 Wiring Rules",
  "source_document_version": "Amdt 3",
  "source_document_hash": "sha256:fixture-document",
  "source_spans": [
    {
      "requirement_id": "AS3000-3.4.3",
      "clause_path": ["3.4", "3.4.3"],
      "span_text": "Fixture clause limiting voltage drop to a maximum percentage for the circuit design.",
      "source_record_hash": "sha256:fixture-voltage-drop"
    }
  ],
  "triage_rubric_version": "rubric@v0.1.0",
  "lift_pipeline_version": "manual-fixture@v0.1.0",
  "lift_model_version": "human-authored-fixture",
  "lifted_at": "2026-05-02T00:00:00Z",
  "audit_required": false,
  "auditors": [],
  "audit_records": []
}`,
          },
        },
        amdt4: {
          status: "released",
          supersedes: "sha256:2359c7bc…",
          tabs: {
            "predicate.py": `from aec_autoform.domains.electrical.cable_sizing import (
    CableDesign,
    voltage_drop_within_limit,
)
from aec_autoform.runtime import PredicateResult, requirement


@requirement("AS3000-3.4.3")
def predicate(design: CableDesign) -> PredicateResult:
    # Amdt 4 splits final subcircuits from consumer mains.
    limit = 3.0 if design.is_consumer_mains else 5.0
    passed = voltage_drop_within_limit(design, limit_percent=limit)

    return PredicateResult.bounded(
        passed,
        witness={
            "voltage_drop_percent": design.voltage_drop_percent,
            "max_voltage_drop_percent": limit,
            "is_consumer_mains": design.is_consumer_mains,
        },
    )`,
            "tests.py": `from aec_autoform.domains.electrical.cable_sizing import CableDesign
from predicate import predicate


def test_consumer_mains_tighter_limit():
    design = CableDesign(
        load_current_a=63.0,
        rated_current_a=80.0,
        voltage_drop_percent=3.4,
        max_voltage_drop_percent=5.0,
        is_consumer_mains=True,
    )

    result = predicate(design)

    assert result.passed is False


def test_final_subcircuit_uses_legacy_limit():
    design = CableDesign(
        load_current_a=63.0,
        rated_current_a=80.0,
        voltage_drop_percent=4.2,
        max_voltage_drop_percent=5.0,
        is_consumer_mains=False,
    )

    result = predicate(design)

    assert result.passed is True`,
            "manifest.json": `{
  "schema_version": "corpus-manifest@v0.1",
  "predicate_name": "max_percentage_drop",
  "predicate_slug": "max_percentage_drop",
  "predicate_version": "0.2.0",
  "predicate_hash": "sha256:c14b1aafb0e2a9f3d8b5e04aa6f2c1b3d7e9112a4f6c8902bdff8e1d44a92a18",
  "tests_hash": "sha256:7b1aa59c3f0a44f1c7c5d9ee2a83b1b7e0f3d2b8c4d12fa6b9e3c7a2f8d4e1c0",
  "provenance_hash": "sha256:11d2c3e4a5b6f70819283a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f",
  "standard": "as_nzs_3000",
  "standard_version": "AS/NZS 3000:2018 Amdt 4",
  "discipline": "electrical",
  "scope_tags": ["cable_sizing", "voltage_drop"],
  "jurisdictions": ["AS/NZS", "AU", "NZ"],
  "status": "released",
  "source_requirement_ids": ["AS3000-3.4.3"],
  "source_requirement_hashes": ["sha256:fixture-voltage-drop-amdt4"],
  "supersedes": ["sha256:2359c7bc575f05395afa156b38e35b6092a44a4309a4bd1d476a7a68d2843231"],
  "replaces": ["max_percentage_drop@0.1.0"],
  "lean_eligible": false,
  "lean_status": "not_eligible"
}`,
            "provenance.json": `{
  "schema_version": "corpus-provenance@v0.1",
  "source_document_title": "AS/NZS 3000:2018 Wiring Rules",
  "source_document_version": "Amdt 4",
  "source_document_hash": "sha256:fixture-document-amdt4",
  "source_spans": [
    {
      "requirement_id": "AS3000-3.4.3",
      "clause_path": ["3.4", "3.4.3"],
      "span_text": "Amdt 4 splits the maximum voltage drop limit between consumer mains and final subcircuits.",
      "source_record_hash": "sha256:fixture-voltage-drop-amdt4"
    }
  ],
  "triage_rubric_version": "rubric@v0.1.0",
  "lift_pipeline_version": "manual-fixture@v0.1.0",
  "lift_model_version": "human-authored-fixture",
  "lifted_at": "2026-05-02T00:00:00Z",
  "audit_required": true,
  "auditors": ["engineer:tg"],
  "audit_records": [
    {
      "auditor": "engineer:tg",
      "audited_at": "2026-05-02T11:04:00Z",
      "patch_note": "Split limit by circuit category."
    }
  ]
}`,
          },
        },
      },
    },
    disconnection_time_limit: {
      label: "disconnection_time_limit",
      status: "draft",
      versions: {
        amdt3: {
          status: "draft",
          tabs: {
            "predicate.py": `@requirement("AS3000-1.5.5")
def disconnection_time_limit(design: CableDesign) -> PredicateResult:
    actual = design.fault_clearing_time_s
    return PredicateResult.bounded(
        actual <= 0.4,
        witness={"actual_s": actual, "limit_s": 0.4},
    )`,
            "tests.py": `# TODO: discharge tests pending audit of clause exceptions.`,
            "manifest.json": `{
  "predicate_hash": "sha256:f205…",
  "status": "draft",
  "scope_tags": ["cable_sizing", "fault_loop_impedance"],
  "standard_version": "AS/NZS 3000:2018 Amdt 3",
  "jurisdictions": ["AU"]
}`,
            "provenance.json": `{
  "source_document": "AS/NZS 3000:2018 Amdt 3",
  "source_spans": [{"clause": "1.5.5", "page": 39}],
  "lifted_by": "agent:autoform-v0.3",
  "audited_by": null,
  "notes": "Awaiting clarification on TN-C-S vs TT exception path."
}`,
          },
        },
      },
    },
  },
  defaultPredicate: "max_percentage_drop",
  caption:
    "Released predicates are queryable by default. Draft entries remain visible for review but stay out of certification. The amendment toggle reveals an explicit supersedes edge — no implicit latest-wins.",
};

// ---------------------------------------------------------------------------
// Figure 3 — Certificate Binding Diagram
// Central certificate node with eight bindings; failure-mode toggle.
// ---------------------------------------------------------------------------

export const certificateBindingData = {
  title: "Figure 3 · certificate binding diagram",
  subtitle:
    "what a certificate is bound to — and what each binding prevents",
  certificate: {
    valid: {
      certificate_id: "cert_sha256:c41a…",
      overall: "valid",
      design_hash: "sha256:e7d2…",
      predicate_hashes: ["sha256:8f3a…"],
      standard_versions: ["AS/NZS 3000:2018 Amdt 3"],
      assumption_ledger_hash: "sha256:441b…",
      world_model_ref: "wm:electrical-v0.2",
      witness_bundle_hash: "sha256:9c0e…",
      verifier_policy: "policy:strict-released",
      layer_results: { algebraic: "pass", clause: "pass", ood: "bounded" },
      signatures: ["engineer:tg", "auditor:rs"],
    },
    rejected: {
      certificate_id: "cert_sha256:c41a…",
      overall: "rejected",
      design_hash: "sha256:e7d2…",
      predicate_hashes: ["sha256:8f3a…"],
      standard_versions: ["AS/NZS 3000:2018 Amdt 3"],
      assumption_ledger_hash: null,
      world_model_ref: "wm:electrical-v0.2",
      witness_bundle_hash: "sha256:9c0e…",
      verifier_policy: "policy:strict-released",
      layer_results: { algebraic: "pass", clause: "pass", ood: "bounded" },
      signatures: ["engineer:tg", "auditor:rs"],
    },
  },
  bindings: [
    {
      key: "design_hash",
      label: "Design hash",
      jsonField: "design_hash",
      accent: COLOR_TEAL,
      prevents: "certifying one design and presenting another",
    },
    {
      key: "predicate_hashes",
      label: "Predicate hashes",
      jsonField: "predicate_hashes",
      accent: COLOR_TEAL,
      prevents: "silent drift when a predicate is renamed or patched",
    },
    {
      key: "standard_versions",
      label: "Standard versions",
      jsonField: "standard_versions",
      accent: COLOR_FOREST,
      prevents: "vague \u201Clatest standard\u201D compliance",
    },
    {
      key: "assumption_ledger",
      label: "Assumption ledger",
      jsonField: "assumption_ledger_hash",
      accent: COLOR_AMBER,
      prevents: "hidden inputs, exclusions, and conservative choices",
      failureCandidate: true,
    },
    {
      key: "world_model",
      label: "World model · envelope",
      jsonField: "world_model_ref",
      accent: COLOR_AMBER,
      prevents: "claims made outside the validated regime",
    },
    {
      key: "witness_bundle",
      label: "Witness bundle",
      jsonField: "witness_bundle_hash",
      accent: COLOR_CORAL,
      prevents: "prose-only compliance claims",
    },
    {
      key: "verifier_policy",
      label: "Verifier policy",
      jsonField: "verifier_policy",
      accent: COLOR_CORAL,
      prevents: "unclear pass/fail thresholds",
    },
    {
      key: "layer_results",
      label: "Layer results",
      jsonField: "layer_results",
      accent: COLOR_RED,
      prevents:
        "flattening bounded, deferred, open, fail, and error into one word",
    },
    {
      key: "signatures",
      label: "Signatures",
      jsonField: "signatures",
      accent: COLOR_RED,
      prevents: "unverifiable authorship or approval state",
    },
  ],
  failureMode: {
    toggleLabel: "Drop the assumption ledger",
    bindingKey: "assumption_ledger",
    note: "Without a frozen assumption ledger, the verifier cannot tell which exclusions and conservative choices the design was made under. The certificate flips from valid to rejected — not because a predicate failed, but because a binding is missing.",
  },
  caption:
    "Certificates are not paperwork. Each spoke is a binding the harness can check independently. Toggle a missing binding and the overall status flips — that is the visual argument for why each edge is load-bearing.",
};
