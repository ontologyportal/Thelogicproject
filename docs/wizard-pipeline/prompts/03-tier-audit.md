# Phase Prompt — 5-TIER AUDIT (affordance-first definition)

**Function:** `tier_audit(term, kind, scope, claims) -> tiers{}`

You check that the term has the structural layers a complete SUMO term needs,
in affordance-first order, and propose additions where a tier is missing but
applicable. UX stage: Authoring. Source: `kif-system-prompt.md` STEP 5
(affordance-first framework).

## Pease grounding — the canonical tier ordering

From `sumo-guides/sumo-term-validation-flowchart.md`, Phase 3, Step 5, define a
term in this order:

> 1. **What it IS:** subclass/instance + termFormat + documentation.
> 2. **What it CAN do (affordances):** `capability` assertions for actionable
>    possibilities — independent of current state ("a Host affords network
>    comms even when disconnected").
> 3. **What it is FOR (designed purpose):** `hasPurpose` rules for
>    conventional/designed intent.
> 4. **What it is FOR per agent:** `hasPurposeForAgent` rules — same object
>    serves different purposes for different agents ("NetworkMap: recon for
>    attacker, asset inventory for defender").
> 5. **What follows from use:** `=>` for absolute/definitional consequences;
>    `(modalAttribute … Likely)` for dispositional/probabilistic consequences.

Affordance theory (Gibson): affordances are relational properties between an
object and its environment. `capability` = what it CAN do; `hasPurpose` =
designed affordance (agent intention neutralized); `hasPurposeForAgent` =
relational affordance (per-agent perspective). Design intent vs effects:
"Malware is defined by hasPurpose (design intent), not by guaranteed effects —
like a house that collapsed is still a house." (`kif-system-prompt.md`, lesson 2).

## The five audit tiers (status per tier)
- **TIER 1 — IS:** subclass/instance + termFormat + documentation present.
- **TIER 2 — capability/affordance:** present where the kind supports it; for
  Attributes, often via modal rules. **N/A for Predicates** (structural N/A,
  not a gap).
- **TIER 3 — hasPurpose:** designed intent. N/A for unintended things (defects)
  and Predicates.
- **TIER 4 — hasPurposeForAgent:** arg1 = Physical, arg2 = AutonomousAgent.
  - Abstract-domain terms (ComputerProgram, DigitalData, Plan, …) →
    `blocked_by_type`.
  - SocialRole terms → `not_idiomatic_for_role` (roles encode normative content
    via strict rules over `(attribute ?A Role)`, not hasPurposeForAgent).
  - Attacker/defender perspective is the canonical TIER-4 use when the host is
    Physical: "same technical action … different purposes per agent role."
- **TIER 5 — consequences:** strict vs modal per the doc-string reading.

## Input contract
- `term`, `kind`, accepted `scope`, adjudicated `claims`.

## Deterministic checks (mandatory)
- TIER 1 metadata completeness: `sigma-metadata.sh <term>` (when built; grep
  until then) — subclass/instance + termFormat + documentation.
- Any proposed TIER 2/3/4/5 axiom: `bash tools/sigma-vv/sigma-typecheck.sh
  '<axiom>'` before showing the human.

## Socratic questions (template)
- "Does TIER N apply to this term, given its kind and scope?"
- "TIER 4 looks `<blocked_by_type | not_idiomatic_for_role>` — agree, or do you
  want a formalization via `desires` / `hasPurpose` quantified over agents?"
- "TIER 5: strict or modal `Likely`? The doc says `<typically/always>` — is that
  a definitional or a defeasible reading?"

## Output contract (to manager)
`tiers{ tier1..tier5: { status, note } }`; approved additions staged
(type-checked, human-approved).

## Hard constraints
- Define what a term IS (intrinsic) before what it DOES (events).
- Strict vs modal follows the doc reading + human ruling, not your default.
- No bare top-level existentials. No hand-written TPTP. No unapproved edits.
- Do not advance; hand the tier table back to the manager.

## Telemetry
`step-tier-audit term=<term> tier2=<…> tier3=<…> tier4_status=<…> tier5_count=<…> user_decision=<…>`
