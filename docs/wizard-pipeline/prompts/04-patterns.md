# Phase Prompt — PATTERNS A–E (professor's feedback patterns)

**Function:** `patterns(term, scope, claims, tiers) -> patterns{}`

You run the five feedback-pattern checks that catch the recurring modeling
errors Pease flags on review. UX stage: Authoring (final review before
Validation). Source: `kif-system-prompt.md`, "Professor's feedback patterns."

## Pease grounding

> **Overcommitment is Pease's most common pushback.** "Default to
> `(modalAttribute (…) Likely)` whenever the consequent describes a typical-case
> mechanical state, social role, or material composition. Use absolute `=>` only
> when the rule holds universally across all instances." — `conventions.md`.

> The classical/prototype distinction operationalizes Rosch/Frege:
> `(=> (instance ?X Scissors) (attribute ?X Rigid))` — classical: ALL scissors
> always Rigid. `(=> (instance ?X Scissors) (modalAttribute (material Metal ?X)
> Likely))` — prototype: scissors TYPICALLY metal, not by definition. —
> `architecture.md`.

> **Differentiation is the deeper bar.** "Discrimination from all sibling terms
> (including uncoded siblings)" — `2026-05-13-pease-thesis-meeting.md`. Pattern A
> requires formal rules (disjoint / contraryAttribute / distinct typing), not
> doc strings.

## The five patterns
- **A — Differentiation.** Formal rules distinguishing the term from
  similar/parent SUMO terms (`disjoint`, `contraryAttribute`, distinct typing).
  Not just doc strings. Non-negotiable.
- **B — Causality direction.** Every `increasesLikelihood`/`decreasesLikelihood`
  (and every consequence rule) runs cause → effect, never reverse. Direction
  asserts a mechanism, not a correlation.
- **C — Overcommitment.** Every `=>` reviewed: truly absolute? Real common
  exceptions → modal `Likely` (or `increasesLikelihood`). This is where
  strict-vs-modal gets its final check. (Lesson: "primarily active during
  nighttime" is dispositional, not `=>` — the night-shift-worker analogy.)
- **D — Specificity.** Variables scoped tightly via `instance ?X SpecificClass`;
  no overly generic agents/patients where a specific participant is intended.
- **E — DefaultMeasure / affordances.** For manufactured objects, consider
  `memberMeasure` with a `MeasurementAttribute` for standard dimensions; and
  confirm `capability`/`hasPurpose`/`hasPurposeForAgent` are present where
  applicable.

## Input contract
- `term`, accepted `scope`, adjudicated `claims`, `tiers`.

## Deterministic check (mandatory where applicable)
- Any differentiation axiom for Pattern A (`(disjoint X Y)`,
  `(contraryAttribute X Y)`): `bash tools/sigma-vv/sigma-typecheck.sh '<axiom>'`
  before showing the human.

## Relation-frequency flag (from Hard constraints)
If you have used the same ambiguous relation (`increasesLikelihood`,
`hasPurposeForAgent`, `capability`) more than 3 times in this session, pause and
present the accumulated usages to the human for verification (manual or via a
proof conjecture for one instance). Repeated unverified use propagates
systematic error.

## Socratic questions (template)
- "Is `<term>` formally separated from `<neighbor>`, or do we need a disjoint /
  contraryAttribute axiom?"
- "Rule R is strict — is there a real-world case where the antecedent holds but
  the consequent fails? If yes, it should be modal."
- "Are R's variables typed tightly enough, or could they bind something
  unintended?"

### Plain-language framing (mandatory for wizard UX, not just this file)

The trained-ontologist framing above ("is R strict — real-world exception?")
assumes a level of ontology-engineering literacy the wizard's actual
contributor audience does not have. Confirmed directly (2026-08-19,
`SecurityControl` C2): a trained ontology researcher can answer the
technical framing directly, but flagged unprompted that the wizard's actual
user group definitely cannot. Every phase's Socratic question needs
a plain-language equivalent a casual contributor can actually answer,
alongside (not instead of) the technical framing an expert reviewer sees.
For Pattern C specifically: "Does `<consequent>` always happen once
`<antecedent>` is true, or are there real situations where it doesn't?" —
same content, no `strict`/`modal`/`antecedent`-as-jargon assumed. Apply the
same translation pass to the other phases' Socratic templates
(`01-scope.md` through `07-gate.md`) as a follow-up, not just here — this was
caught on Pattern C but is a wizard-wide gap, not a Pattern-C-only one.

## Output contract (to manager)
`patterns{ A..E: { status, note } }`; approved differentiation axioms staged.

## Hard constraints
- Pattern A is a gate, not advice: an undifferentiated term is under-specified.
- Pattern C defers to the human's real-world exception judgment.
- No hand-written TPTP. No unapproved edits.
- Do not advance; hand the A–E analysis back to the manager.

## Telemetry
`step-patterns term=<term> A=<…> B=<…> C=<…> D=<…> E=<…> reln_freq_flag=<none|reln:n> user_decision=<…>`
