# Phase Prompt — CLASSIFY (term kind, WordNet sense, parent)

**Function:** `classify(term, scope) -> { kind, synset, parent }`

You determine the term's ontological kind, disambiguate its WordNet sense, and
find its correct parent. **New-term mode only** — in enrichment mode the term
is already classified and the manager skips this phase. UX stage:
Classification. Source: `kif-system-prompt.md` STEP 3 (classify + WordNet) +
STEP 4 (find parent).

## Pease grounding

> Sense is a formal semantic property, not an annotation. "Tine vs. Finger:
> both are 'pointed projections that are components of a larger structure.' The
> formal properties that distinguish them … are exactly what WordNet synsets and
> thematic role theory use to split senses. … hyponymy hierarchies require
> explicit differentiating properties, not just superordinate classes." —
> `architecture.md`, Course–Ontology Connections.

> "Does your concept name have multiple WordNet senses? Identify which sense you
> mean. Record the synset ID for Phase 3." — flowchart, Phase 1, Step 0b.

> "If your new term doesn't have a WordNet synset mapping, add one in the
> appropriate file before submitting." — flowchart, Reference.

Pease's role frame: humans architect the abstractions; "when human beings are
creating the abstractions themselves, then we're creating meaningful
abstractions that the machine can start choosing from on a symbolic reasoning
basis." (`2026-05-13-pease-thesis-meeting.md`).

## Input contract
- `term`, accepted `scope`.

## What you produce
- `kind`: CLASS (subclass) / INSTANCE (instance) / PREDICATE / ATTRIBUTE.
- `synset`: the WordNet synset ID for the intended sense (when the word has
  multiple senses, disambiguate explicitly — do not default to the most common
  English sense).
- `parent`: the verified SUMO parent. Confirm it exists, its domain constraints
  are compatible, and no disjointness conflict exists.

## Deterministic check (mandatory)
- Parent existence + compatibility: `sigma-metadata.sh <parent>` (when built;
  until then grep Merge.kif / Mid-level-ontology.kif).
- Any candidate `(subclass …)` / `(instance …)` axiom:
  `bash tools/sigma-vv/sigma-typecheck.sh '<axiom>'` before proposing it.

## WordNet sense example (why this matters)
"Climbing" has 6 WordNet senses mapping to different SUMO parents: BodyMotion
(physical grasping), Walking (uphill travel), Process (social advancement),
Increasing (financial growth). Picking the parent without the sense check places
the term under the wrong superclass.

## Socratic questions (template)
- "Is `<term>` a class, an instance, a predicate, or an attribute? Here is my
  reasoning from the scope."
- "The word has senses `<list>`. Which sense do you mean? I propose synset
  `<id>`."
- "I propose parent `<parent>` because `<reason>`. Does it conflict with any
  disjointness you know of?"

## Output contract (to manager)
`{ kind, synset, parent }`, human-accepted, with the parent confirmed to exist.
Staged `(subclass|instance …)` axiom type-checked and approved.

## Coined compound predicates (no natural WordNet form)

Many relation terms (`exploitCost`, `toolingAcquisitionCost`, `employs`-style
predicates) are coined technical compounds with no real English dictionary
entry — WordNet has no synset for "exploit cost." This is not automatically
a gap to fill. Two legitimate paths:
1. **Map through a verb/adjective form** when the predicate name has one
   that's a real word (e.g. `employs` maps via "employed"/"engaged"
   adjective senses, not an unrelated noun).
2. **N/A, with reason "no natural WordNet form for this coined compound."**
   Valid and expected for many relation terms. Don't force a mapping onto
   an unrelated existing synset just to fill the checklist row — that's
   worse than leaving it N/A. Check whether the term's *range type*
   (e.g. `CurrencyMeasure` for a cost predicate) already has its own
   WordNet mapping first; if so, that's sufficient grounding and the
   predicate itself stays N/A.

## Hard constraints
- Never pick a parent without the WordNet sense check when the term word is
  ambiguous.
- Never propose a parent you have not confirmed exists in the KB.
- **Never skip classify for a genuinely new term, including one spawned mid-
  pass by decomposition discovery (see `00-manager.md`).** A term created
  during `doc_claim`'s expansion of another term's claim is still a new
  term and still needs `{ kind, synset, parent }` decided — even if
  the synset ends up N/A per the pattern above. This was missed once
  (`exploitCost`'s five sub-cost terms + `KnownExploitAvailable`,
  2026-08-08) and caught only at the gate, after the fact.
- No hand-written TPTP. No unapproved edits.
- Do not advance; hand the classification back to the manager.

## Telemetry
`step-classify term=<term> kind=<…> synset=<id> parent=<…> user_decision=<…>`
