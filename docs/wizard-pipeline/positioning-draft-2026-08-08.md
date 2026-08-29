# Positioning draft — 2026-08-08

Context for this draft: at a conference this week I saw a competing product doing the same conceptual move as this pipeline (chat-driven rule definition, propose a formal rule, show in-scope/out-of-scope examples, human approves, system builds it) for a different domain, called "Cognitive Elements" (behavior-detection rules), and marketed openly with that framing: "Don't have the right CE's? Too lazy to write rules? We've got you covered!" We're doing the structural equivalent of that for ontology terms and axioms, except with an actual deterministic verification layer under it, and we've never named the category out loud. This draft names it. Nothing here is committed to README.md yet — review and cut what doesn't sound like me.

## Category framing

This is an agentic harness for ontological engineering. Not a chatbot that writes SUMO for you, and not a form wizard either. A harness in the mechanical sense: something that constrains a strong but undisciplined component (the LLM) to a fixed set of motions so it can't wander off and do the thing it's naturally inclined to do, which in this case is free-associate plausible-sounding axioms. The pipeline is a composition of phases, scope, doc-claim, tier-audit, patterns, prove, validate, gate, and every one of them either asks a pre-canned Socratic question or hands off to SigmaKEE for a deterministic check. The LLM never authors an axiom that lands in the file. It proposes, the human adjudicates, SigmaKEE verifies. That loop is the product.

The reason the category name matters is that "wizard" undersells it and "AI ontology tool" oversells it in the wrong direction. A wizard implies a fixed sequence of forms. An AI ontology tool implies the model is doing the modeling. What's actually happening is closer to a harness on a research instrument: the LLM supplies the natural-language fluency and the Socratic dialogue, the harness supplies the constraints (one phase at a time, lean context per phase, no silent advancement, no hand-written proofs), and SigmaKEE supplies ground truth. Nobody else in this space is naming that architecture as its own thing, they're calling it a wizard or a copilot. It's neither. It's a harness, and the harness is the part that's actually novel.

## Taglines

- Don't have the right axioms? Too lazy to formalize your domain? We've got a harness for that.
- Every term proposed by dialogue. Every term verified by a theorem prover.
- Not a chatbot's best guess at your ontology. A proof, or it doesn't land.
- The LLM proposes. You decide. SigmaKEE checks. Nothing skips the line.
- Free-associate rules and hope, or run them through something that has to prove them first.

## README-ready description paragraph

The Logic Project's wizard pipeline is an agentic harness for ontological engineering: a Socratic, template-constrained sequence of phases, scope, doc-claim, tier-audit, patterns, prove, validate, gate, that walks a human domain expert through formalizing a concept into SUMO, one small decision at a time. Each phase asks fixed, pre-written questions rather than letting the model free-associate, and every claim the human accepts gets typechecked, proved, and validated by SigmaKEE before it ever reaches the file. The result is that natural-language expertise turns into machine-checkable logic without the model ever getting to decide what's true. This isn't a wrapper around an LLM chat window. It's a harness that keeps the LLM on a short leash while it does the one thing it's actually good at: asking the right question at the right moment.

## Why this matters

The Socratic-dialogue-constrained-agentic-workflow architecture is the actual invention here, not a UI convenience layered on top of an LLM. Anyone can point a chatbot at an ontology file and ask it to write axioms; what nobody else is doing is forcing the dialogue itself through a fixed phase composition where each phase has its own narrow contract, its own pre-canned question set, and a hard boundary against advancing without human sign-off and deterministic verification. That's the patent-pending piece: not "LLM assists with ontology," but the specific mechanism of constraining an agentic loop to a template-gated, human-adjudicated, tool-verified sequence, applicable to any domain where you need expert judgment translated into formal structure without letting the model's fluency substitute for correctness.

The proof point isn't hypothetical. This exact process landed real terms in the upstream ontologyportal/sumo repository this session, ZeroSumContest and AdversarialKnapsack are merged, exploitCost is in progress, each one pushed through scope, doc-claim, tier-audit, patterns, and a proof that actually ran through the theorem prover before the term was considered done. That's the difference between a demo and a harness: a demo shows you a plausible axiom, a harness produces one that's already been proved.

## Product naming, tiers, and domain strategy (2026-08-28)

Source: `Local_Goohs_Thesis_Workspace_Dont_Push_To_Repo/meeting-notes/2026-08-28-pease-kim-rose-meeting.md`, thread A. Full detail in `docs/architecture-tiers-2026-08-28.md`.

This pipeline occupies the **middle** tier of a three-tier product, not the top, layman-facing one it was originally assumed to be. That's a positioning correction, not a scope change: the harness framing above still holds for what this repo does. It changes how the surrounding pitch should describe the audience — this tier's user is a domain expert being walked through formalization, not a general consumer. A separate top tier (proposed name "AskSumo": ask a question, get a proof-backed answer) is where the consumer-facing, adoption-for-signal product lives, sitting on top of this one, not replacing it.

Implication for the HAI paper and any external-facing copy: describe this pipeline's audience as the domain-expert tier, not "the layman."

Domain naming under discussion, undecided: `wizard.sigmakee.dev`, `tlp.sigmakee.dev`, `socrates.dev`, `socrates.io`, `logicproject.dev`. Open concern from the room: a `.dev` domain doesn't reach a layman/domain-expert audience via SEO — worth resolving before any public-facing domain gets locked in.

## Public error-count transparency vs. salesmanship (2026-08-28)

Same source, thread H. The corpus-wide SUMO diagnostics error count came up as a public-facing question: whether to advertise it prominently given it's currently in the thousands (trending down, roughly 4000 to 3000 as of this meeting). One line in the room floated keeping that off the homepage; the direct pushback, unambiguous in the transcript: "this is academia, it's about being publicly accountable." The room's resolution leaned toward putting the count on a diagnostics page rather than the homepage — visible, not front-and-center, not hidden.

Worth keeping in mind for this pipeline's own error/diagnostics reporting: the existing house style in this project's own notes (`sumo-todo.md`) already consistently sides with the accountable framing over the flattering one. Any splash-page or landing-page copy for this pipeline should match that, not the salesmanship instinct.
