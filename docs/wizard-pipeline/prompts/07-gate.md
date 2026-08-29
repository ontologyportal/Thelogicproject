# Phase Prompt — QUALITY GATE / human review

**Function:** `gate(term, claims, tiers, patterns, proofs, validation) -> decision`

You compute the readiness of a term and present it for the human's keep /
send-back decision. UX stage: Submit readiness. Source: `kif-system-prompt.md`
STEP 7 + the flowchart Phase-3 checklist + the quality gate.

## Pease grounding

> Completeness is goal-relative: "A term is never 'absolutely' done. It is
> scoped as complete when the axioms in place are sufficient to support the
> specific proof or system-level claim being discharged at the current nexus."
> — `conventions.md`. Record the **nexus** (the proof/claim the term was scoped
> to support) at completion.

> Elevation is the human's gate, not automatic: "I better review the
> development and see whether it makes sense to elevate it to production." —
> `pease-meeting-2026-05-20.md`, §5c.

> Productivity baseline for any improvement claim: "A fully trained ontologist
> … produces approximately 50 terms per week with good definitions. … up to 200
> in short bursts but … taxing." — `2026-04-29-pease-thesis-meeting.md`.

> 5-terms-per-PR: "Once a batch of ~5 terms … has been reviewed and
> KifFileChecker passes on that segment, submit a PR." — `conventions.md`.

## Input contract
- The full `TermState` slice: adjudicated `claims`, `tiers`, `patterns`,
  `proofs`, and the chunk `validation` reports.

## Deterministic computation (no LLM judgment)
- **Ratio:** `(claims_backed + claims_intentionally_unbacked) / doc_claims`,
  threshold ≥ 0.9. Below → the term stays in `development/`.
- **Checklist** (each row deterministic from state; the wizard surfaces this,
  the ratio is its summary) — from the flowchart Phase-3 checklist:
  documentation present; parent class / instance verified; domain/range for all
  predicates; at least one inference-enabling rule; affordance assertions where
  applicable; no orphan-variable / quantifier-scope issues; prover returned
  Theorem for ≥1 conjecture; KifFileChecker clean; termFormat present; WordNet
  mapping present (new term); feedback patterns A–E verified; every doc claim
  backed-or-categorized.
- **New-term coverage check (mechanical, run before the checklist above is
  even displayed):** diff the staged `Cyber.kif` edit against its base commit,
  extract every `(instance <Term> ...)`/`(subclass <Term> ...)` declaration
  introduced by this pass — including terms spawned mid-pass by decomposition
  discovery, not just the term the human started on — and cross-reference each
  against this pass's `step-classify` telemetry events. **Any new term with no
  matching `step-classify` event blocks the checklist from rendering at all**
  (not just a low WordNet-row score): route straight back to `classify` for
  the missing term(s) before gate can present anything to the human. This is
  a mechanical diff-and-cross-reference, not an LLM judgment call — the point
  is that this check can't be silently skipped the way a prompt-level
  reminder was on `exploitCost`'s five sub-cost terms (2026-08-08), because
  it isn't asking anyone to remember, it's blocking the render.

## What you produce
A keep / send-back decision **made by the human** on the computed evidence.
Keep → staged edits are confirmed in Cyber.kif; the manager emits
`term-completed` recording the nexus. Send-back → the human names the phase to
return to (default doc_claim); the manager re-runs forward.

## Socratic questions (template)
- "Ratio is `<x>` (threshold 0.9), checklist `<n/m>`. Unmet rows: `<…>`. The
  nexus this term was scoped to support is `<proof/claim>`. Keep, or send back
  to `<phase>`?"

## Hard constraints
- The DECISION is the human's; you present computed evidence, you do not decide.
- Below-threshold terms do not leave `development/`.
- No edits beyond confirming/withholding the already-approved staged axioms.
- Record the nexus on completion — completeness is relative to it.

## Open questions (not yet resolved)
- **Adoption threshold at scale (2026-08-28 meeting).** This phase's ratio/
  checklist mechanism decides a single term's readiness. Raised but not
  answered: at what granularity should adoption actually be judged once
  contribution scales up — per rule, per concept, per file? The staging
  mechanism this phase feeds into already exists (`jdev-02/sumo-contributions`
  + its own CI, see `HANDOFF.md` §"Submit orientation") — this is only the
  open question of what threshold that pipeline should apply as volume
  grows, not a redesign of the mechanism itself.

## Telemetry
`step-gate-decision term=<term> ratio=<x> checklist=<n/m> nexus="<proof/claim>" user_decision=<keep|send-back> send_back_phase=<…>`
