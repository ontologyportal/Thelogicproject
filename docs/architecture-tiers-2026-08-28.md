# Three-tier product architecture — 2026-08-28

Source: a call between Adam Pease, Shaun Rose, and Teddy Kim, 2026-08-28.
Full transcript and routing:
`Local_Goohs_Thesis_Workspace_Dont_Push_To_Repo/meeting-notes/2026-08-28-pease-kim-rose-meeting.md`,
thread A. Attribution caveat: the Teams transcript only reliably separates
Teddy's remote-mic lines; everything else is the room mic (Pease, Jon, or
Shaun, in-room). Individual claims below are not attributed by name except
where the transcript is unambiguous.

## The correction this session produced

TheLogicProject (the Socratic wizard) is the **middle** tier of a
three-tier stack, not the layman-facing top tier it was assumed to be:
"what I thought was for the layman still isn't ready for it, because it's
still like talking about contributing to logic."

## The three tiers

**Bottom — sigmakee.dev as IDE.** Proposed subdomain `ide.sigmakee.dev`,
centered on Monaco, for people actually working in KIF. A possible
intermediary between this and the wizard tier: a controlled-English,
one-sentence-one-axiom editing view — "looks kind of like simple English
Wikipedia... each sentence corresponds to a single axiom."

**Middle — TheLogicProject / Socratic dialogue.** This repo. Language-
mediated formal logic development: a domain expert answers pointed
questions, an LLM helps translate, an ontologist turns the result into
real formalization. Unchanged from the existing pipeline design — the
change is only in how this tier is positioned relative to the other two.

**Top — consumer QA application, proposed name "AskSumo".** Ask a
question, get a proof-backed answer from Vampire over formalized
knowledge, not an LLM search match — "I saw this clip on YouTube, is it
factually relevant or logically consistent with what I understand the
world to be." Explicit rationale for building it: wide consumer adoption
generates the contribution signal that funds the whole stack, drawn
directly to the ChatGPT comparison — frontier labs needed every question
asked to retrain the next model; this needs the analogous hook, logic-
backed instead of statistical, extracting signal "with the unwitting[ness]
of the user."

## Services, not a monolith

Each tier gets its own service; all call back to `sigma-rs` as the main
service. "Division of responsibility," not just load balancing — a
monolithic backend across all three tiers was named directly as a bad
code smell risk. Two concrete cleanups that fall out of this: `LogLearn`
and `Delphi` should come out of old SigmaKEE and become separate clients
rather than living in the same codebase they were built into originally.

Confirmed in the same call: Pease already merged Teddy's earlier PR using
the WebAssembly/JS `sigma-rs` implementation into TheLogicProject.

## Naming and domain options (undecided)

`wizard.sigmakee.dev`, `tlp.sigmakee.dev`, `socrates.dev`, `socrates.io`,
`logicproject.dev`. Open concern: a `.dev` domain doesn't reach a
layman/domain-expert audience via SEO the way a `.com`/`.io` might — the
top tier specifically needs to be findable by people who aren't already
in this ecosystem.

## What this doesn't resolve

Attribution for the "AskSumo" top-tier concept is unresolved as of this
writing — see the meeting-notes file. This changes how the concept should
be discussed relative to the wizard's own patent-pending claim until
that's settled.

The batch-vs-real-time validation contract in
`docs/wizard-pipeline/prompts/06-validate.md` is unaffected by this
document — that prompt still governs how a single term gets validated
inside the middle tier. A separate 2026-08-28 idea (real-time Vampire-on-
save linting, tracked in `sumo-todo.md`) would eventually change that
contract, but is not scoped here.
