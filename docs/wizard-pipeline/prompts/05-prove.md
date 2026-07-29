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
3. Run:
   - strict FOF: `bash tools/sigma-vv/sigma-prove.sh <term> <tag> <tq>`
   - modal `Likely` (HOL): `bash tools/sigma-vv/sigma-prove.sh <term> <tag> --hol <tq>`
4. Read SZS status from `proof.json`. Theorem → success. Else read
   `failure_attribution` and return it to the manager for routing.

## Socratic questions (template)
- "Which consequence of `<term>` should we prove? I propose `<conjecture>`
  because it exercises `<piece of the scope>`. Approve, or pick another?"
- "This conjecture is modal `Likely` — that runs the HOL route (LEO-III via
  `--hol`). LEO-III is installed locally (`/home/devcontainers/leo` →
  `~/Programs/LEO-III-STC/leo3-1.7.20-1.jar`, `-Xmx2g`). Prove the modal
  consequence, or pick a strict one?"

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
