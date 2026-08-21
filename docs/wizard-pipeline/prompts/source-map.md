# Source Map — how `kif-system-prompt.md` decomposed into phases

Traceability for the parse-out: which section of the original monolithic
`~/workspace/.claude/notes/kif-system-prompt.md` feeds each phase prompt, plus
the Pease source citation that strengthens it. The original prompt remains as
the historical single-prompt artifact; these phase prompts are its factoring.

| Phase prompt | From kif-system-prompt.md | Pease source added |
|--------------|---------------------------|--------------------|
| `01-scope.md` | STEP 1 (Search existing), STEP 2 (Justify) | flowchart Phase 1 "search before you build"; conventions Phase-0 elicitation; 2026-04-29 "LLM as philosophy teacher" |
| `08-classify.md` | STEP 3 (Classify + WordNet), STEP 4 (Find parent) | architecture.md Tine-vs-Finger sense discrimination; flowchart synset-ID rule; 2026-05-13 "humans creating abstractions" |
| `02-doc-claim.md` | STEP 6 (Parse doc string), Documentation Completeness Check, Documentation sourcing rule, rule-strength selection | conventions "every claim backed"; 2026-05-13 "convert documentation into formal rules"; conventions categorized `unbackable_reason` |
| `03-tier-audit.md` | STEP 5 (affordance-first framework: IS / CAN / FOR / FOR-agent / consequences) | flowchart Phase-3 Step-5 tier ordering; Gibson affordance machinery; lesson "design intent vs effects" (Malware) |
| `04-patterns.md` | Professor's feedback patterns A–E; relation-frequency flag; "dispositional vs absolute" lesson | conventions overcommitment default-to-modal; architecture Rosch/Frege classical-vs-prototype; 2026-05-13 "discrimination from siblings" |
| `05-prove.md` | Proof engineering lessons; antecedent-length constraint; "no bare existentials"; variable scoping | walkthrough type-guard correction; flowchart tinySUMO→full-SUMO; 2026-05-13 "run with whole previous ontology under theorem proving" |
| `06-validate.md` | Hard constraints (variable scoping, paren); automated-check list | 2026-05-20 §5b KifFileChecker≠Diagnostics; 2026-05-13 "run diagnostics, let the tool set find problems"; architecture write→check→fix cycle |
| `07-gate.md` | STEP 7 (Present for human review) | conventions goal-relative completeness + nexus; 2026-05-20 §5c human elevation gate; 2026-04-29 50-terms/week baseline; conventions 5-terms-per-PR |
| `00-manager.md` (cross-cutting) | "What the LLM is good/bad at"; hard-constraint style rules (em dash); future-work register | 2026-05-13 "LLM as linguistic interface on deterministic tools"; 2026-05-20 §6c "guardrails > prompting"; 2026-04-29 bias-via-diverse-perspectives |

## Content from kif-system-prompt.md NOT yet placed in a phase

- **"Key modeling lessons learned":** MIGRATED (2026-05-21) to
  `.claude/notes/cyber-modeling-lessons.md`. The genuinely cyber-specific ones
  (deception types, ciphertext-requires-Interpreting, LOTL, program-modification)
  live there as domain knowledge. The general ones (dispositional-vs-absolute,
  design-intent-vs-effects, attacker/defender relational affordances) were
  already captured in the phase prompts (`04-patterns.md` Pattern C,
  `03-tier-audit.md` TIER 3/4/5) and are cross-referenced from the note rather
  than duplicated.
- **"Future work items":** belongs in `sumo-todo.md` (already partly there),
  not the phase prompts.
- **"Validated proofs (8 successful)" + "Current file state":** point-in-time
  status, not specification. Lives in sumo-todo.md / walkthrough, not prompts.

## Pease canonical 6-step distillation (manager reference)

> "Create a glossary. Find the right parent class. Write format and doc. Convert
> the doc into formal rules. Run diagnostics. Run the whole previous ontology
> through theorem proving." — `2026-05-13-pease-thesis-meeting.md`.

Maps to: scope/classify (glossary, parent) → doc-claim (doc→rules) → validate
(diagnostics) → prove (full-ontology theorem proving). The manager composes
these; gate closes them.
