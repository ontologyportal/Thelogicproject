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

## Hard constraint: non-triviality witnesses are proof scenarios, never Cyber.kif axioms

Confirmed real risk (2026-08-27, `sigma-rs` Audit mode on Cyber.kif): 17
bare, unconditional `(exists ...)` ground facts had accumulated in Cyber.kif
over time, committed purely to demonstrate a relation isn't vacuous ("there
exists a case where two agents diverge"). Several reused the same existential
variable names (`?A1`/`?A2`/`?B1`/`?B2`) across unrelated axioms. A saturation
audit flagged two of them as jointly contradictory with no real derivation
shown — plausibly a Skolem-naming collision in the prover (unconfirmed
without its source), but the underlying practice is wrong regardless of the
exact mechanism: permanent, unscoped existential ground facts compound every
future consistency/audit check's search space and interaction surface
forever, for content that only ever needed to be checked once.

If a phase (scope Q4, patterns E, or anywhere else) is tempted to demonstrate
a term's machinery isn't vacuous by asserting a bare `(exists ...)` fact into
Cyber.kif itself, stop — that content is a proof scenario, not a KB axiom.
Write it as a `.tq` under `sumo/development/proof-scenarios/`, run it once,
keep the transcript. Never let a bare top-level `(exists ...)` land in
Cyber.kif as committed content.

**Before treating a bare existential as witness-only, check whether the doc
claim it's standing in for is actually a possibility claim or a definite
one.** Confirmed real miss (2026-09-03, the 17-item cleanup this constraint
was written for): all 17 got moved to `.tq` witnesses uniformly, but one of
them — `aggregateCyberCost`'s "equals the sum of per-action costs" claim —
was a definite equality with no rule anywhere backing it, not a possibility
claim. It needed a real `=>` rule (mirroring `exploitCost`'s own five-
subcost summation rule, itself strengthened from witness to rule on
2026-08-08 for the identical reason), not a witness. Caught after PR, not
before. The distinguishing test: does the doc string say "may," "can," or
"is not necessarily" (a possibility/non-constraint claim — witness-only is
correct, `=>` cannot express an absence of constraint) or "not every ... has
..." (an existential negation — witness-only is the *only* correct
formalization, `=>` would assert something false)? Or does it say "equals,"
"is the sum of," "is defined as" (a definite computation/equality claim —
this needs a real rule; a bare existential or a comment describing it is
never sufficient, see `02-doc-claim.md`'s `backed`-citation-verification
requirement). Also check whether the claim is already backed by a *different*,
more specific rule elsewhere in the term's neighborhood before writing a new
one or defaulting to witness-only — two of the 17 (`exploitCost`'s and
`patchCost`'s own agent-relative claims) turned out to already be covered by
existing monotonicity/maturity-ordering rules a few lines away that just
hadn't been cross-referenced.

## Deterministic check (mandatory — this IS the phase)
1. Human approves the conjecture in SUO-KIF first (Socratic).
2. Write the `.tq` (SUO-KIF native; never hand-write TPTP). Use `(time 120)`
   for headroom; ground type guards explicitly.
3. Run `bash tools/sigma-vv/sigma-prove-auto.sh <term> <tag> <tq>`.
   **The human/manager never picks a prover by hand.** This wrapper
   deterministically greps the `.tq` for the modal-predicate list
   (`tools/sigma-vv/modal-predicates.txt`: `holdsDuring`, `knows`,
   `believes`, `desires`, `holdsObligation`, `says`, `confersNorm`,
   `confersObligation`, `confersRight`, `deprivesNorm`,
   `hasPurposeForAgent`, `modalAttribute`) and routes to the correct prover
   automatically — Vampire/FOF when none match, **Vampire's native HOL/THF
   route (`--hol-vampire`)** when any do. This isn't a rare edge case for
   this domain: attacker/defender epistemic and intentional content
   (`knows`, `believes`, `desires`) and dispositional claims
   (`modalAttribute Likely`) are core to modeling cyberspace, not a corner
   case, so this routing runs by default on every conjecture, not just ones
   a human flags as "modal." LEO-III (`--hol`) is a manual fallback for
   debugging only — it has documented, separately-tracked toolchain
   breakage (`tools/TOOLCHAIN.md`), while Vampire's HOL route needed only
   two small sigmakee fixes to work (landed during the `SecurityControl`
   pass). Fall back to `sigma-prove.sh` directly with an explicit
   `--hol`/`--hol-vampire`/no-flag only if you need to override the
   auto-routing for debugging.
4. Read SZS status from `proof.json`. Theorem → success. Else read
   `failure_attribution` and return it to the manager for routing.

## Known fragility on the HOL route (read before treating a HOL failure as content-wrong)

Both HOL routes have real, separately-tracked toolchain issues (not
Cyber.kif content defects) — check `tools/TOOLCHAIN.md` for the full history
before routing a HOL failure back to `doc_claim`/`patterns` as if it were a
modeling error:

- **`--hol-vampire` (default route):** the combined-KB THF file has a known
  tail of undeclared-relation crashes (SIGSEGV) — two instances root-caused
  and fixed during the `SecurityControl` pass (a stray numeric-constant
  handling bug in `THFnew.writeTypes()`, and a genuinely undeclared
  `loadBearingRegion` in `Objects.kif`), a third located but not yet
  bisected. A crash here is worth a quick check against this known pattern
  before assuming the term's content is wrong.
- **`--hol` / LEO-III (manual fallback only):** `--one`-mode THF translation
  omits the type header entirely (confirmed 2026-08-10, reproduces the
  sigmakee#536 bug class through a different entry point); has also been
  observed to unexpectedly trigger TFF mode and crash Vampire itself (exit
  code 4, unhandled by `sigma-prove.sh`).

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
