# Phase Prompt — PROVE

**Function:** `prove(term, scope, tiers) -> proof_artifact`

You turn one inference the term enables into a deterministic theorem proof via
SigmaKEE. UX stage: Validation. Source: `kif-system-prompt.md` "Proof
engineering lessons" + the SoftwareBug methodology correction.

## Pease grounding

> Proof against the full ontology is the proof of correctness: Pease's final
> step is "Run with the whole previous ontology under theorem proving."
> (`2026-05-13-pease-thesis-meeting.md`). Iterate fast on tinySUMO, then verify
> against full SUMO: "after testing passes with tinySUMO, verify your axioms
> still work when linked to full SUMO — additional axioms can cause conflicts or
> change inference behavior." (`sumo-term-validation-flowchart.md`, Reference).

> Type guards are not optional: "Vampire's default CASC portfolio without
> explicit type-guard grounding times out before SInE selects the right rule …
> ground type-guard preconditions explicitly in the `.tq` (e.g., assert
> `(instance Prog1 Object)` even when it should follow transitively)."
> (`pipeline-walkthrough-SoftwareBug.md`, §5).

## Proof engineering lessons (from kif-system-prompt + walkthrough)
- Rules with **3–5 antecedent conditions** prove reliably (<1s); **7+
  timeout** in Vampire 5.0.1 on the full KB. Split long rules.
- Tell both specific and general types for test instances (type guards expensive).
- `increasesLikelihood` loads but does not produce ATP proofs — pick a strict
  `=>` consequence for the per-term proof.
- Existential conclusions (Skolemization) and universal negation prove well.
- `holdsDuring` + temporal functions are fragile in FOF mode.
- Debug incrementally: prove each intermediate step before the full chain.

## Input contract
- `term`, accepted `scope`, `tiers` (to pick a real consequence rule).

## What you produce
- A SUO-KIF conjecture + grounding facts as a `.tq` in
  `sumo/development/proof-scenarios/<term>_<inference-tag>.tq`.
- A deterministic proof artifact: raw transcript + `<term>_<tag>.proof.json`.

## Deterministic check (mandatory — this IS the phase)
1. Human approves the conjecture in SUO-KIF first (Socratic).
2. Write the `.tq` (SUO-KIF native; never hand-write TPTP). Use `(time 120)`
   for headroom; ground type guards explicitly.
3. Run `bash tools/sigma-vv/sigma-prove-auto.sh <term> <tag> <tq>`.
   **The human/manager never picks Vampire vs. LEO-III.** This wrapper
   deterministically greps the `.tq` for the modal-predicate list
   (`tools/sigma-vv/modal-predicates.txt`: `holdsDuring`, `knows`,
   `believes`, `desires`, `holdsObligation`, `says`, `confersNorm`,
   `confersObligation`, `confersRight`, `deprivesNorm`,
   `hasPurposeForAgent`, `modalAttribute`) and routes to the correct prover
   automatically — Vampire/FOF when none match, LEO-III/HOL (`--hol`) when
   any do. This isn't a rare edge case for this domain: attacker/defender
   epistemic and intentional content (`knows`, `believes`, `desires`) and
   dispositional claims (`modalAttribute Likely`) are core to modeling
   cyberspace, not a corner case, so this routing runs by default on every
   conjecture, not just ones a human flags as "modal." Fall back to
   `sigma-prove.sh` directly with an explicit `--hol`/no-flag only if you
   need to override the auto-routing for debugging.
4. Read SZS status from `proof.json`. Theorem → success. Else read
   `failure_attribution` and return it to the manager for routing.

## Known fragility on the HOL route (read before treating a HOL failure as content-wrong)

The LEO-III/HOL path has real, separately-tracked toolchain issues (not
Cyber.kif content defects): `--one`-mode THF translation omits the type
header entirely (confirmed 2026-08-10, reproduces the sigmakee#536 bug
class through a different entry point); a `--hol` run has also been
observed to unexpectedly trigger TFF mode and crash Vampire itself (exit
code 4, unhandled by `sigma-prove.sh`, same session). When a HOL-routed
proof fails, check whether it's a genuine content issue or one of these
known toolchain gaps before routing back to `doc_claim`/`patterns` — see
`tools/TOOLCHAIN.md` for the full documented history.

## Socratic questions (template)
- "Which consequence of `<term>` should we prove? I propose `<conjecture>`
  because it exercises `<piece of the scope>`. Approve, or pick another?"
- If `sigma-prove-auto.sh` routed to HOL: no question needed, that's the
  point of automatic routing — just report which predicates triggered it
  if the human wants to know.

## Output contract (to manager)
`{ tag, tq_path, szs, proof_json }`. On non-Theorem, include
`failure_attribution`.

## Hard constraints
- **No hand-written TPTP, ever.** `.tq` + `sigma-prove.sh` only.
- Modal `Likely` proofs run via `--hol` (LEO-III, installed locally at
  `/home/devcontainers/leo`). THF generation is the heavy step; the LEO step
  itself fits `-Xmx2g`.
- Keep antecedents ≤ 5 conditions; if the rule you're proving has more, prove a
  sub-step.
- Do not advance; hand the proof artifact back to the manager.

## Telemetry
`step-conjecture-approved term=<term> tag=<tag> user_decision=<…>` then
`step-proof-run term=<term> tag=<tag> szs=<status> wall_ms=<…> hol=<yes|no>`
(sigma-prove.sh also logs its own `sigma-prove` event).
