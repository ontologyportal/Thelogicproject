Build a polished, production-style React + Tailwind v4 web app called SUMO Term Forge — a guided, multimodal tool that lets anyone (expert or beginner) propose new terms for the SUMO upper ontology and ship them as a GitHub PR. The low-fi paper prototype validated the flow; this iteration is the hi-fi version. Use shadcn/ui primitives, lucide icons, Motion (motion/react) for transitions, and a calm, modern aesthetic (think Linear × Vercel × Notion): generous whitespace, neutral palette with one warm accent, real type hierarchy, subtle shadows. Drop the hand-drawn sketch styling.

Global behavior
Spl ash → 7 phases → PR / loop, with a persistent top progress rail showing all phases and a soft animated step indicator.
Between phases, when the system is processing, show a full-screen translucent overlay with a spinning sumo wrestler GIF (src/imports/sumo1k.gif, mix-blend-multiply against the backdrop) plus a status line that names what's happening ("searching SUMO", "drafting axioms", etc). Only show during real processing, never inside a stable screen.
Auth: GitHub OAuth (claim cred it, PR opens on user's fork) or guest (PR routed to a maintainer staging queue). Both paths are equally first-class — never gate the experience.
Every Soc ratic screen uses single-select A/B/C/D chips with strong selected state, plus a ChatGPT-style refine bar at the bottom: a single text input with inline icon-buttons for mic, "Talk with me!" voice conversation (use a two-people-chatting icon), file upload, image upload, and a Send button. Refining regenerates the question set with a brief loading state.
Add inline plain-speak glosses next to any SUO-KIF jargon (subclass, termFormat, documentation, instance, =>, etc.) — small italic helper text in parentheses or as a hover popover.
Phase 0 — Splash

Hero copy: "Cont ribute to truly open AI — defined by you." Sub: "You're adding to a public, traceable map of how the world is described. Anyone can use it. No login walls, no proprietary formats — just shared knowledge with your name on the contribution." Primary CTA: Describe your world →. Secondary row: Sign in with GitHub (claim credit) and Continue as guest. (Note: ignore the "no em dashes" rule from the low-fi for this hero copy — they're stylistic here.)

Phase 1 — Describ
e your concept

Two prompts: (1) "Describe the real -world problem this concept solves" and (2) "Write 1–2 example inferences a prover should derive". Multimodal refine bar. Optional source field (URL / PDF / image). Auto-generated title appears in a card with a regenerate button. Save the user's example inferences as a "conjecture" to reuse in Phase 7.

Phase 2 — Searching SUMO (silent routing)
Show a clean "scanning" state, no raw match output, no EXISTS/NOT-FOUND verdicts. Behind the scenes deterministically route to one of: reuse existing, connect axioms (related-but-distinct), subclass (specialization), or justify new. The user only ever sees the next appropriate screen.

Phase 2b — Sharpen
against close terms

Show 2–4 closest existing SUMO terms as chips. Single-select Socratic asks the user which WordNet sense matches what they actually mean (e.g., credit#n#5 — a tradable allowance). Use the answer to write a sharper definition. Render an explicit "vs neighbor" diff card listing how the new term differs from each close term.

Phase 3 — Classify
Single Socratic mapping usage to ATTRIBUTE / RELATION / CLASS / INSTANCE, framed as "When you write axioms about this, you'll mostly say…".

Ph
ase 4 — Find its parent

Single Socratic for the parent class , with a live hierarchy preview (Entity → Abstract → FinancialInstrument → CarbonOffsetCredit) updating with the choice. Include a "none of these — refine my description" option that drops focus into the refine bar.

Phase 5 — Define formally
One card per SUO -KIF block (subclass, termFormat, documentation), each with the generated KIF, a one-line plain-speak gloss, and A/B/C buttons (accept / tweak wording / refine concept). Refine bar at the bottom.

Phase 6 — Rules from
the doc string

One card per extracted rule. Each card shows the K IF rule and a ↳ in plain speak: line. A/B/C: approve / edit / drop (cannot formalize). Track which doc-string claims got rules and which were dropped — surface this summary in Phase 7.

Phase 7 — Review the formal term
Full KIF block, with a ** Beginner mode** toggle (default on) that shows a natural-language gloss under every line.
Coverage panel: ✓ cla ims covered, ✗ claims not formalized.
Conjecture run ner: pull the example inferences from Phase 1, render them as SUO-KIF, expose a "Run proof" button that simulates a prover and reports pass/fail. Plus an "Ask AI about this term" affordance.
Approve → tr igger phase transition with the spinning sumo overlay and land on the PR screen.
Phase 8 — PR + Loop
Show the generated PR (number, branch, route — fork PR for signed-in users, staging queue for guests). Suggest the next missing SUMO term (derived from the just-approved term's neighborhood) in a dropdown with 3–5 candidates. Two CTAs: Yes — start Phase 1 with this term (loop) or No — exit cleanly (thank-you screen with PR link and a "share your contribution" card).

Reference material
The Phase 1 / 2 / 3 flowchart images already in context are the canonical decision logic — match the routing in those charts exactly (especially the exact-match / similar-term / specialization branches in Phase 1, and the "How will you use it in axioms?" + "Find its parent" branches in Phase 2). The low-fi App.tsx in this project is the structural reference; keep the screen sequence and copy intent, but the visual language is fully redesigned.