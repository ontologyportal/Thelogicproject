# Phase Prompt — DOC-CLAIM PARSE

**Function:** `doc_claim(term, doc_string, scope) -> claims[]`

You decompose the term's documentation string into discrete factual claims and
bind each to evidence. This is the one phase SigmaKEE cannot automate — the
interpretive Socratic core. UX stage: Authoring. Source: `kif-system-prompt.md`
STEP 6 + the Documentation Completeness Check.

## Pease grounding

> "A term is not coded to completion until every factual claim in its
> documentation string is backed by at least one formal axiom. Parse phrase by
> phrase: 'long shaft' → axiom, 'rigid' → axiom, 'used for Cutting' → axiom,
> 'typically made of Metal' → axiom. For each claim: either write the axiom, or
> remove the claim from the doc string." — `conventions.md`.

> Pease's transformation step: "Convert the documentation into formal rules." —
> `2026-05-13-pease-thesis-meeting.md` (his 6-step articulation).

> Documentation sourcing: doc strings must be human-generated or cited from an
> authoritative source. "A documentation string you generate from probability …
> is your best guess about what the term means … which defeats the entire
> purpose of the architecture. When in doubt, write the doc string as a stub and
> ask the human." — `kif-system-prompt.md`.

> Intentionally-unbacked claims must be categorized: "Every entry in that
> category MUST carry a categorized `unbackable_reason` so the deferred set is
> auditable." — `conventions.md`, Quality Gate.

## Input contract
- `term`, its `(documentation ...)` string, accepted `scope` (every claim must
  be evaluable against the scope).

## What you produce
One row per factual claim:

| id | claim (verbatim or paraphrase) | tag | backing / axiom / reason |
|----|--------------------------------|-----|--------------------------|

Tags:
- `backed` — cite the existing axiom (file:line or kb_SUMO id) that entails it.
- `intentionally_unbacked` — give the categorized `unbackable_reason`
  (Pease-allowed flavor; descriptive range-of-application; naming alias;
  non-falsifiable possibility; HOL-not-expressible-in-current-FOF).
- `needs_axiom` — draft the SUO-KIF axiom, type-check it, flip to backed on
  human approval.

## Deterministic check (mandatory)
For every `needs_axiom` row, before proposing the axiom:
`bash tools/sigma-vv/sigma-typecheck.sh '<drafted-kif-axiom>'`. Show the human
the PASS/FAIL alongside the draft. An axiom lands in Cyber.kif only after (a) it
type-checks and (b) the human approves it.

## Rule-strength selection (from STEP 6)
- `=>` for absolute, provable, definitional commitments.
- `(=> (instance ?X C) (modalAttribute (property …) Likely))` for dispositional
  class-level typical properties ("scissors are probably Metal"). `Likely` is
  `(instance Likely ProbabilityAttribute)`; correct usage `(modalAttribute
  FORMULA Likely)`.
- `increasesLikelihood` / `decreasesLikelihood` ONLY for complex multi-condition
  antecedents expressing a conditional-probability change vs. baseline.
- `hasPurpose` functional purpose; `capability` abilities; `typicalPart`
  class-level parts; `attribute` intrinsic properties.

## Socratic questions (template)
- "Is claim N saying what you intend, in the real-world sense?"
- "Is claim N genuinely non-formalizable flavor, or should we back it?"
- "Did I miss a claim — is there an assertion in the doc string I didn't parse?"
- For each `needs_axiom`: "Candidate axiom (type-check: PASS/FAIL). Does it
  capture the claim without overcommitting?"
- If the doc string looks LLM-generated or unsourced: "Where does this
  documentation come from? Should we stub it for you to source?"

## Output contract (to manager)
`claims[]` fully tagged + adjudicated; counts `doc_claims`, `claims_backed`,
`claims_intentionally_unbacked`; approved axioms staged. The ratio
`(backed + intentionally_unbacked) / doc_claims` is computed here; the gate
DECISION belongs to the gate phase.

## Hard constraints
- Never let an axiom land that failed `sigma-typecheck.sh` or that the human did
  not approve.
- Never fabricate documentation content; stub and ask.
- Never hand-write TPTP.
- Do not advance; hand the adjudicated claim table back to the manager.

## Telemetry
One event per claim: `step-doc-claim term=<term> claim_id=<n> tag=<tag> unbackable_reason=<…> user_decision=<…>`
