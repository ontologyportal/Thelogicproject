# SUMO Term Pipeline — Prompt Architecture

The backend of the SUMO wizard, expressed as composable functions. The
pipeline computes:

```
f(info) = sumoterm / proof
f = gate ∘ validate ∘ prove ∘ patterns ∘ tier_audit ∘ doc_claim ∘ scope
```

Each phase is a **separately-specified function with its own system prompt** —
the prompt IS that phase's behavioral specification (the HAI 2026 framing). A
**manager system prompt** (`00-manager.md`) owns the composition: it routes a
term through the phases, holds shared `TermState`, enforces input/output
contracts between phases, routes proof failures back to the responsible
authoring phase, and orchestrates telemetry.

This factoring exists so that (a) each AI function runs with **maximum content
focus** — a phase agent sees only its own spec plus the slice of state it
needs, not the whole pipeline; and (b) **deterministic tooling is wired into
every phase**, not bolted on at the end.

## Files

| File | Phase function | UX stage |
|------|----------------|----------|
| `00-manager.md` | composition / routing / state / telemetry | (orchestrator) |
| `01-scope.md` | `scope(term, doc) -> {enables, is_not, justification}` | Scoping |
| `08-classify.md` | `classify(term, scope) -> {kind, synset, parent}` | Classification |
| `02-doc-claim.md` | `doc_claim(...) -> claims[]` | Authoring |
| `03-tier-audit.md` | `tier_audit(...) -> tiers{}` | Authoring |
| `04-patterns.md` | `patterns(...) -> patterns{}` | Authoring |
| `05-prove.md` | `prove(...) -> proof_artifact` | Validation |
| `06-validate.md` | `validate(file, chunk) -> reports{}` | Validation |
| `07-gate.md` | `gate(...) -> decision` | Submit |

`08-classify.md` carries the kif-system-prompt's STEP 3–4 (kind + WordNet sense
+ parent). It is numbered 08 to avoid renumbering the enrichment phases, but it
runs early — see the two modes below. `source-map.md` traces every phase back to
its kif-system-prompt section + Pease citation.

## Two modes

- **New-term creation** (full wizard): order is
  `scope → classify → doc_claim → tier_audit → patterns → prove → validate → gate`.
- **Enrichment** (Cyber.kif retrofit, the active work): the term already exists
  and is classified, so the manager **skips classify** and runs
  `scope → doc_claim → tier_audit → patterns → prove → (validate per chunk) → gate`.

## Phase → deterministic Sigma tool map

The principle: LLM does Socratic dialogue + corpus suggestion; the human owns
the real-world referent; **SigmaKEE owns all verification**. doc_claim is the
one phase Sigma cannot automate (claim → axiom mapping is the interpretive
core).

| Phase | Deterministic check | Wrapper |
|-------|--------------------|---------|
| scope | term-exists / metadata lookup | `sigma-metadata.sh` (TBD) |
| doc_claim | type-check every drafted axiom | `sigma-typecheck.sh` |
| tier_audit | metadata completeness; type-check additions | `sigma-metadata.sh` (TBD), `sigma-typecheck.sh` |
| patterns | type-check differentiation axioms | `sigma-typecheck.sh` |
| prove | theorem proof (FOF / HOL) | `sigma-prove.sh [--hol]` |
| validate | syntax, diagnostics, regression, consistency | `sigma-fullcheck.sh`, `sigma-diagnostics.sh`, `sigma-regress.sh` (TBD), `sigma-consistency.sh` (TBD) |
| gate | ratio + checklist (computed from state) | (no Sigma call; reads validate reports) |

Wrappers live in `tools/sigma-vv/` and are registered in `tools/TOOLCHAIN.md`.
`sigma-metadata.sh`, `sigma-regress.sh`, `sigma-consistency.sh` are stubs to
build as the pipeline matures.

## How a term flows

1. Manager loads `TermState` for the term, dispatches **scope** with only the
   doc string + kind. Human adjudicates `{enables, is_not}`.
2. Manager dispatches **doc_claim** with scope + doc string. Each claim tagged;
   `needs_axiom` items drafted, type-checked, human-approved before landing.
3. **tier_audit**, **patterns** run the same propose → type-check → adjudicate
   loop, each with its own focused prompt.
4. **prove**: human approves a conjecture, `.tq` written, `sigma-prove.sh`
   runs. Non-Theorem → `failure_attribution` routes the manager back to the
   authoring phase named in the attribution.
5. **validate** runs once per chunk (deterministic, no Socratic content).
6. **gate** computes ratio + checklist; human keeps or sends back.
7. On keep, manager confirms staged edits in Cyber.kif and emits
   `term-completed`. `f` returns the (term, proof) pair.

## Relationship to the rest of the system

- **Wizard frontend (CS3004 HCI).** Each phase prompt is the backend for one
  wizard screen. The phase → UX-stage column above is the mapping. The proof
  artifact (`proof.json`) is the wizard-ready surface (KIF-rendered steps,
  failure_attribution); the SME tier never sees raw TPTP.
- **Patent.** Per-phase prompts are behavioral specifications; the per-step
  telemetry is the decision audit trail (see `patent_working_notes.md`).
- **HAI 2026.** The factored prompts refine the paper's "system prompt as
  specification" contribution from one monolithic seven-step prompt to a
  composed set of single-function specs (see `hai_2026_evaluation_findings.md`).
- **Enrichment work now.** The Cyber.kif chunk-1 retrofit runs *through* these
  prompts. Running a term validates both the term and the prompt specs.
