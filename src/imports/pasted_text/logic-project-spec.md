Build The Logic Project, a guided web application that helps anyone — expert or beginner — contribute new terms to an upper ontology
  knowledge base (SUMO) through a multimodal, validated authoring pipeline. Produce three distinct deliverables from this single prompt:

  - Build A — Production App (/app): the full design, no canned data, all UI states present, copy reflects future real-pipeline behavior. Backend calls are
  stubbed with realistic placeholders; nothing is hard-coded to a specific term.
  - Build B — Demo Scenario 1 (/demo/term-1): a forked clone of Build A with all responses canned for Term 1. Used in the usability study as the user's
  first attempt (learning task).
  - Build C — Demo Scenario 2 (/demo/term-2): a forked clone of Build A with all responses canned for Term 2, and routed through a conflict-resolution state
   in Phase 6. Used in the usability study as the user's repeat task (memorability/learnability measurement, per CS3004 P3 instructor feedback).

  The three builds share the same component library, design tokens, navigation shell, and screen sequence. They diverge only in (a) the data wired into
  inputs/outputs and (b) whether Build C surfaces the conflict path.

  ---
  1. Design System & Visual Aesthetic

  Same as the prior spec — preserved verbatim:

  - Framework: React + TypeScript with Tailwind CSS v4
  - UI Library: shadcn/ui (Button, Input, Textarea, Checkbox, Badge, Label, Separator, Dialog, Tooltip)
  - Animations: Motion (motion package)
  - Icons: lucide-react
  - Typography: Clean sans-serif system stack, 16px base
  - Color: Neutral grays; yellow/amber accents; green for success; blue for prominent CTAs (e.g., "create new"); soft pastels (yellow-50, green-50, blue-50,
   neutral-50)
  - Border radius: 6–8px (md)
  - Spacing: Generous whitespace
  - Elevation: Subtle shadows only
  - Mascot: Animated sumo wrestler GIF (../imports/sumo1k.gif) used as a brand/loading element

  Copy rules (apply globally across all three builds):
  - No em dashes or en dashes anywhere in user-facing copy. Use commas, colons, or periods.
  - No jargon barriers. Apply the jargon replacement table (Section 4) globally.
  - No "in plain English" / "in plain speak" framing. The copy is plain English; saying so is patronizing.
  - No leading language in user prompts. Questions must be neutral.

  ---
  2. Application Structure & Navigation

  Global Top Navigation

  - Fixed horizontal strip with 9 clickable phase labels, harmonized with the underlying 3-phase pipeline:
    - Splash · P1 Describe · P2 Search · P2 Sharpen · P3 Classify · P4 Place · P5 Define · P6 Statements · P7 Verify · Submit
  - Current phase: darker border, yellow background. Other phases: dashed borders. Horizontally scrollable on mobile.
  - Top-right of nav bar reserved for auth status pill ("Signed in as @user" with avatar / "Guest mode" / disabled when unauthenticated).

  Phase Transition Overlay

  - Full-screen semi-transparent white backdrop with blur, z-index 50
  - Centered animated sumo wrestler GIF (96px)
  - Text below in handwritten/casual font: "processing…"
  - Duration ~1100ms (Builds B/C use the same timing for realism)

  Footer Navigation (all screens except Splash and Submit)

  - Back (left, outline, ArrowLeft icon) and Next (right, solid dark, ArrowRight icon)
  - Next is disabled on terminal screens and on any screen where the phase's gating condition has not been met (see Section 6)
  - Max-width 3xl, centered

  Auth Gating (NEW — fix from session transcript)

  - On Splash, "Describe your world" CTA is disabled by default with helper text: "Sign in or continue as guest to begin."
  - "Sign in with GitHub" opens a modal: "Authenticating with GitHub…" with a 1-second spinner, auto-closes, updates top-right to "Signed in as @demo-user"
  with avatar; enables the CTA.
  - "Continue as guest" immediately updates top-right to "Guest mode"; enables the CTA.
  - Clicking the disabled CTA triggers a soft pulse on the auth options.
  - (Build B/C only): Pre-authenticate as guest by default so the demo starts directly on Splash with the CTA already enabled, but the auth options are
  still clickable for realism.

  Common Components (preserved from prior spec)

  - Frame — max-w-3xl, p-6, white, 2px solid neutral-700, rounded-md, header with title (2xl), subtitle (sm, neutral-500), and (Build A only) a small
  "hi-fi" badge top-right. Builds B/C show "demo · term 1" / "demo · term 2" badges instead.
  - RefineBox — 2px dashed border, neutral-50 bg, horizontal flex with text input + Mic/MessagesSquare/Upload/ImageIcon ghost buttons + small Send button.
  Placeholder: "type to refine, or use a mic / file / image…"
  - Wrestler — spinning sumo GIF, size prop (default 56px), blend-mode multiply
  - Plain — inline gloss span in handwritten font, italic, xs, neutral-500, parenthesized. Used to soften any unavoidable term.

  ---
  3. Pipeline & Validation Gates (Bake into the App's Behavior)

  The wizard is a UI over a real validation pipeline. Build A's screens must reflect what the real pipeline does (even where stubbed); Builds B/C replay it
  with canned values. Three logical phases sit under the 9 nav steps:

  ┌────────────────┬────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Logical Phase  │   Nav Steps    │                                              What the Pipeline Does                                               │
  ├────────────────┼────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Discovery      │ P1, P2, P2     │ Capture the concept; search SUMO (Merge.kif + Mid-level + domain files); evaluate near-matches; route to reuse /  │
  │                │ Sharpen        │ specialize / create-new                                                                                           │
  ├────────────────┼────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Classification │ P3, P4         │ Determine term type (Class/Instance/Property/Relationship) via Yes/No questions; walk the hierarchy; identify     │
  │                │                │ parent; flag any secondary terms mentioned                                                                        │
  ├────────────────┼────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Implementation │ P5, P6, P7,    │ Author definition (parent + name + description); extract statements; run validation gates; verify proof scenario; │
  │                │ Submit         │  route to PR or staging queue                                                                                     │
  └────────────────┴────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Validation Gates (visible to the user as Phase 7 "Verify" panels)

  Each gate is a check panel with the sumo mascot spinner that resolves to a status. In Build A, gate results come from a stubbed API. In Builds B/C, they
  are canned to pass (Build B) or to surface a conflict (Build C).

  ┌──────────────────────────┬─────────────────────────────────────────┬──────────────────────────────┬────────┬──────────────────────────────────────┐
  │           Gate           │             What it checks              │ Plain-language label shown   │ Pass   │            Fail behavior             │
  │                          │                                         │           to user            │  icon  │                                      │
  ├──────────────────────────┼─────────────────────────────────────────┼──────────────────────────────┼────────┼──────────────────────────────────────┤
  │ 1. Structural check      │ Parenthesis balance, variable scoping,  │ "Your definition is          │ green  │ Route back to P6 with the offending  │
  │ (KifFileChecker)         │ quantifier discipline                   │ well-formed."                │ ✓      │ statement highlighted                │
  ├──────────────────────────┼─────────────────────────────────────────┼──────────────────────────────┼────────┼──────────────────────────────────────┤
  │ 2. Common-meaning link   │ Term mapped to a WordNet sense          │ "Linked to common English    │ green  │ Show sense-picker modal (see Phase 2 │
  │ (WordNet)                │                                         │ meaning."                    │ ✓      │  Sharpen card)                       │
  ├──────────────────────────┼─────────────────────────────────────────┼──────────────────────────────┼────────┼──────────────────────────────────────┤
  │ 3. Consistency (Vampire  │ New rules don't contradict existing     │ "No conflicts found with     │ green  │ Trigger Conflict screen (Build C     │
  │ FOF)                     │ SUMO                                    │ existing knowledge."         │ ✓      │ path)                                │
  ├──────────────────────────┼─────────────────────────────────────────┼──────────────────────────────┼────────┼──────────────────────────────────────┤
  │ 4. Proof of correctness  │ At least one of the user's Phase 1      │ "Your test scenario proves   │ green  │ Route to P6 with "add a statement    │
  │ (Vampire)                │ scenarios proves true under the new     │ true."                       │ ✓      │ that captures: [scenario]" prompt    │
  │                          │ rules                                   │                              │        │                                      │
  ├──────────────────────────┼─────────────────────────────────────────┼──────────────────────────────┼────────┼──────────────────────────────────────┤
  │ 5. Documentation         │ Every factual claim in the description  │ "Every claim in your         │ green  │ List unbacked claims; offer "add     │
  │ coverage                 │ is backed by at least one statement     │ description is backed up."   │ ✓      │ statement" or "soften wording"       │
  └──────────────────────────┴─────────────────────────────────────────┴──────────────────────────────┴────────┴──────────────────────────────────────┘

  A small "?" tooltip on each gate label opens a one-paragraph plain-English explanation of what the check does and why it matters. Do not show TPTP, FOF,
  THF, or solver names in the gate UI. A "Developer view" toggle on Phase 7 reveals them.

  Backend contract: the five gates above are the user-facing surface of the
  LLM-agnostic constraint architecture specified at
  `~/workspace/sumo_business_development_work/wizard-pipeline/constraint-architecture.md`.
  The React app calls validators through a constraint-layer API that is
  independent of which LLM provider is bound (Ollama-served open model by
  default, hosted frontier as optional upgrade). Build A wires the stubbed API
  to real validators per the connector contract in §2 of that spec; Builds B/C
  remain canned for usability evaluation. Failure routing on each gate
  (described in the "Fail behavior" column above) is the user-visible
  expression of the failure-attribution logic in §6 of the spec.

  ---
  4. Jargon Replacement Table (Apply Globally)

  ┌───────────────────────────────────────────┬─────────────────────────────────────────────────────────┐
  │                 Don't say                 │                       Say instead                       │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ prover / theorem prover                   │ (omit; use "verify" or "check")                         │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ example inferences a prover should derive │ "What should be true whenever this concept applies?"    │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ axiom / rule                              │ "statement" (or "thing that's always true about it")    │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ parent term / parent class                │ "the most specific, more general thing it is a kind of" │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ KIF / SUO-KIF / formal logic              │ "formal definition" (or hidden behind Developer view)   │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ Class / Instance / Attribute / Relation   │ (hidden from user; system determines silently — see P3) │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ subclass declaration                      │ "what kind of thing it is"                              │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ documentation string                      │ "description"                                           │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ termFormat                                │ "everyday English name"                                 │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ in plain English / in plain speak         │ (delete entirely)                                       │
  ├───────────────────────────────────────────┼─────────────────────────────────────────────────────────┤
  │ run proof                                 │ "verify"                                                │
  └───────────────────────────────────────────┴─────────────────────────────────────────────────────────┘

  This table is canonical. Any screen content that contradicts it must be rewritten.

  ---
  5. Screen-by-Screen Specification

  0. Splash Screen

  Centered card, min-height 80vh, max-width xl, 2px dashed neutral-700, p-10, text-center.
  - Mascot: 🤼 (text-6xl)
  - Heading: "The Logic Project. Contribute to truly open AI, defined by you." (4xl, tight leading)
  - Body: "You're adding to a public, traceable map of how the world is described. Anyone can use it. No login walls, no proprietary formats, just shared
  knowledge with your name on the contribution." (neutral-700, snug)
  - Primary CTA: "Describe your world →" (large, dark, disabled until auth choice made)
  - Separator (my-6)
  - Auth options (side-by-side):
    - "Sign in with GitHub (claim credit)" — outline, GitHub icon
    - "Continue as guest" — ghost, UserCircle2 icon
  - Helper text (xs, neutral-500, centered, stacked):
    - "Log in to establish authorship and track your contributions to the global model."
    - "Guest contributions go to a maintainer's staging queue. Still public, still traceable."

  1. P1 Describe Your Concept

  - Title: "Phase 1. Describe your concept"
  - Subtitle: "tell us what you're thinking about"
  - Main multimodal input (2px dashed border, p-4, white): 7-row textarea, placeholder: "Describe the concept in your own words. You can upload an image,
  drop a link, or just type a stream of consciousness." Bottom toolbar: Mic / ImageIcon / Upload / MessagesSquare ghost buttons + Send.
  - Word-count gating callout (NEW per Pease findings): when text > 0 and < 20 words, render a yellow callout below the input with three Socratic prompts
  (non-blocking, Next still enabled but the callout discourages skipping):
    - "How is this different from similar things?"
    - "What is essential about it. What never changes?"
    - "Can you give an example of one?"
  - Secondary input (mt-4): Label "What should the system be able to verify about this concept?" 3-row textarea, example placeholder: "If something is a
  [your concept], then [what should be true]."
  - Auto-title (yellow-50, 2px dashed, p-2, mt-4): "✨ auto-generated title: [CanonicalName]" + refresh ghost icon.

  2. P2 Searching Existing Terms

  - Title: "Phase 2. Searching existing terms"
  - Subtitle: "we'll route you automatically"
  - Centered container with Wrestler (48px), text "Scanning knowledge base for related concepts…" + subtext "You don't need to interpret raw matches. We'll
  take you down the right path."
  - Below container: small neutral-500 text: "(Behind the scenes: exact match → reuse · related-but-distinct → connect · specialization → refine · none →
  create new.)"
  - Auto-advances after ~1500ms in Builds B/C; in Build A, advances on stubbed search result.

  3. P2 Sharpen Against Close Terms (or Create New)

  Two states: match (default) and new.

  State match

  - Title: "Phase 2. Sharpen against close terms"
  - Subtitle: "found similar terms. Help us understand what makes yours different."
  - "We think you mean…" card (NEW per Pease findings on word-sense disambiguation) at top: yellow-50, 2px dashed, p-3. Heading: "We think you mean…". Body:
   a single sentence stating the predicted WordNet sense in plain language. Two buttons: "Yes, that's what I mean" and "No, I mean something else." If "No":
   expand to 3 alternate sense radio options + "None of these" → opens free-text clarification box.
  - Closest existing terms (2px dashed, p-3): badge list of 3 candidate terms.
  - Socratic question (yellow-50, 2px dashed, p-3): "Which sense best matches what YOU mean by '[stem]' here?" 3 lettered options A/B/C (circular dashed
  letter badge, handwritten font, hover neutral-50, selected yellow-100 solid border). Helper text below options: "None of these fit? Tell us below and
  we'll regenerate the questions."
  - RefineBox at bottom of question box.
  - Prominent "Create New" CTA (blue-50, border-4 blue-400, p-4, mt-4): full-width blue-600 button: "None of these fit. Let me describe the sense in my own
  words." Most eye-catching element on the page.
  - Distinguish from neighbors (2px dashed, p-3, mt-3): "vs [Term A]: yours requires …" / "vs [Term B]: yours is …"

  State new

  - Title: "Phase 2. Create new concept"
  - Subtitle: "no close match found. Let's define yours from scratch."
  - Success message (green-50, 2px dashed, p-4, centered): "✓ Got it. We'll help you create a brand new term."
  - Optional refinement (2px dashed, p-3, mt-3): label "Refine your description (optional)", 4-row textarea.
  - Back link (mt-3): small outline button "← Back to suggested matches" — toggles to match.

  4. P3 Classify the Concept

  - Title: "Phase 3. Classify the concept"
  - Subtitle: "let's figure out what kind of thing this is"
  - Chatbot card sequence — 3 cards vertical (space-y-3). Card states: waiting (neutral-100, opacity-40, 2px dashed), current (yellow-50, 2px solid
  neutral-900, p-4, question text-lg handwritten, two flex-1 buttons "Yes" / "No"), done (green-50, opacity-60, "✓ Answered: Yes/No" sm).
  - Clicking either Yes/No advances to next card after 300ms.
  - Questions (system silently maps answers to Class/Instance/Property/Relationship — never shown to user):
    a. "Is this something physical you can touch?"
    b. "Does it happen over a period of time?"
    c. "Are there many examples of it, or is it one specific thing?"
  - Progress indicator (2px dashed neutral-50, p-3, mt-4, centered): 3 pulsing dots (staggered 0s/0.2s/0.4s), text "Narrowing down the definition…", counter
   "Progress: 2 / 3".

  5. P4 Find Its Parent

  - Same chatbot pattern as P3, 2 cards.
  - Questions:
    a. "Can you buy or sell it?"
    b. "Is it created by an organization or authority?"
  - Preview hierarchy (2px dashed, p-3, mt-3): "Preview hierarchy: Entity → Abstract → FinancialInstrument → [YourTerm]" (term underlined).
  - Elaboration prompt (NEW per Pease findings) at the bottom of the screen, appears after both questions answered: "How is [your term] more specific than
  [proposed parent]? Can you give an example where they would differ?" — small text input.

  6. P5 Define the Term

  - Title: "Phase 5. Define the term"
  - Subtitle: "review our suggestions and edit if needed"
  - Three review fields (pre-filled, A/B button pattern):
    a. "Most specific, more general thing it is a kind of" (Plain gloss: "the broader category it belongs to") — value display, refresh ghost icon, "A ·
  accept" / "B · edit" buttons
    b. "Everyday English Name" (Plain gloss: "the friendly label people will read") — same pattern
    c. "One-Sentence Simple Description" (Plain gloss: "summary anyone can understand") — same pattern
  - RefineBox at bottom.

  7. P6 Statements from Your Description

  States: default, loading, detour.

  Default

  - Title: "Phase 6. Statements from your description"
  - Subtitle: "approve each statement we extracted"
  - Three statement cards (2px dashed, p-3, mb-3 each):
    - Formal form (pre, xs, neutral-50 bg, p-2, rounded, mb-1) — hidden by default, shown only when Developer view is toggled
    - Plain-language form (text-sm, neutral-700): "If something is a carbon offset credit, then it can be traded." (always visible)
    - Buttons: "A · approve" (primary), "B · edit" (outline) → triggers loading, "C · drop" (destructive) → triggers loading
  - RefineBox at bottom.

  Loading

  - Wrestler 64px, yellow-50 container, "Updating based on your feedback…", ~1200ms, returns to default.

  Detour

  - Title: "Phase 6. Detour needed"
  - Subtitle: "define a missing dependency first"
  - Detour card (blue-50, border-2 blue-400, p-4): "To finish defining [CurrentTerm], we need to quickly define [PrerequisiteTerm] first." + subtext "Let's
  take a quick detour. You'll return to [CurrentTerm] right after."
  - Breadcrumb trail (neutral-50, 2px dashed, p-2, mt-3): badges with arrows: [CurrentTerm] → [PrerequisiteTerm] (detour) (yellow-200) → back to
  [CurrentTerm] (outline, opacity-50).
  - CTA: "Start detour →" primary button → routes back to P1 with the prerequisite term name pre-filled.

  8. P7 Verify Your Term

  - Title: "Phase 7. Verify your term"
  - Subtitle: "natural language view. Toggle for technical details."
  - Developer view toggle (checkbox): "Developer view. Show formal logic." Default off.
  - Term definition cards (3 cards): natural language always visible; formal logic only when toggle on.
  - Validation panel (NEW — bake the gates in): 5 sequential check rows with sumo mascot spinner that resolves to ✓ green (or ✗ red on Build C's consistency
   check). Labels per Section 3's table. Each row has a "?" tooltip.
  - Test scenario panel (yellow-50, 2px dashed, p-3, mt-4): "Test scenario from Phase 1" + the user's Phase 1 scenario. Buttons: "Verify" (primary,
  PlayCircle) and "Ask AI about this term" (outline, MessageSquare).
  - Next is disabled until all 5 gates resolve green (Build C: disabled until conflict is resolved).

  9. Conflict Screen (NEW — Build C path; reachable from P7 in all builds via demo trigger)

  Reached when Gate 3 (consistency) fails.
  - Heading: "We found something that doesn't fit."
  - Body (plain language): "You said [statement A]. But existing knowledge says [statement B]. Both can't be true at the same time."
  - Two action buttons:
    - "Revise my definition" → routes back to P6 with the offending statement highlighted
    - "Dispute the existing entry" → opens modal: "Your dispute will be reviewed by a domain expert. Continue?" Submit / Cancel.
  - "Why am I seeing this?" expandable link → one-paragraph explanation.

  10. Readiness Checklist (NEW — insert before Submit)

  - Title: "Almost done. Final check."
  - Subtitle: "everything below needs a green check before we submit"
  - 7 checklist items (all green ✓ for Builds B/C; Build A reflects real status):
    a. Concept has a clear description
    b. Concept is placed under the right general category
    c. At least one thing that is always true about it has been recorded
    d. Formal definition is well-formed
    e. No conflicts with existing knowledge
    f. Linked to common English meaning
    g. Verification ran successfully
  - Primary button: "Submit for review."

  11. Submit Screen (PR + Loop)

  - Title: "Term submitted. Contribute another?"
  - Subtitle: "your contribution is on its way"
  - Submission confirmation (green-50, 2px dashed, p-3): GitPullRequest icon + "PR #482 opened · [TermName]". Subtext (xs, neutral-600): "Guest? routed to
  staging queue. Signed in? PR opened on your fork."
  - Follow-up prompt (NEW per low-fi flag): if a secondary term was flagged during P3, render: "We noticed you mentioned [SecondaryTerm]. Want to add that
  too?" with "Yes, continue" / "Not now."
  - Suggested next term (2px dashed, p-3): label "Suggested next term (also missing from the knowledge base):" + badge + dropdown.
  - Loop / exit buttons: "Yes. Back to Phase 1 with this term." (primary) / "No. Exit cleanly." (outline → returns to Splash).

  ---
  6. Gating Logic (Pipeline-Backed)

  The Next button enforces the validation contract:

  ┌────────────┬──────────────────────────────────────────────────────────────┐
  │   Screen   │                       Gate to advance                        │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ Splash     │ Auth choice made                                             │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P1         │ At least one character in description AND scenario textareas │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P2         │ Auto-advances                                                │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P2 Sharpen │ Either a sense option selected, OR "Create new" clicked      │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P3         │ All 3 questions answered                                     │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P4         │ Both questions answered AND elaboration text entered         │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P5         │ All 3 fields accepted or edited                              │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P6         │ All statements approved/edited/dropped (no pending)          │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ P7         │ All 5 gates green                                            │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ Conflict   │ Resolution chosen                                            │
  ├────────────┼──────────────────────────────────────────────────────────────┤
  │ Readiness  │ All 7 items checked                                          │
  └────────────┴──────────────────────────────────────────────────────────────┘

  ---
  7. Build-Specific Data

  Build A (Production) — No canned data

  - Term name, search results, sense candidates, statements, gate results all come from API stubs that return realistic-but-empty shapes. UI handles loading
   and empty states.
  - Conflict path not auto-triggered. Reachable only if the (stubbed) consistency gate returns failure.

  Build B — Demo Scenario 1 (Term 1)

  - Term: a canonical, conflict-free domain concept appropriate for first-time users. Use CarbonOffsetCredit as the canonical example unless a
  study-specific term is supplied at build time.
  - All search results, sense candidates, parent suggestions, generated statements, and gate results are canned to a clean success path.
  - All 5 validation gates resolve green. No conflict screen.
  - Detour state is not triggered.
  - Submit screen shows "PR #482 opened · CarbonOffsetCredit" and offers OffsetVintage as the suggested next term.

  Build C — Demo Scenario 2 (Term 2)

  - Term: a related but distinct concept that triggers the conflict path. Use a second canonical example (study-specific term supplied at build time).
  - All flows mirror Build B's structure (this is the repeat task — instructor-required learnability/memorability measurement).
  - Critical divergence: at P7, Gate 3 (Consistency) fails. The flow routes to the Conflict screen.
  - "Revise my definition" returns to P6 with one statement highlighted; user re-approves; flow proceeds.
  - All other gates green. Submit succeeds at the end.

  ---
  8. Instrumentation (Build B and C)

  Both demo builds log timestamped events to window.__termForgeTelemetry (array) on every interaction. Each event:
  { t: <ms-epoch>, phase: <screen-id>, action: <kebab-case>, payload: <small-object> }
  Logged actions: phase-enter, phase-exit, next-click, back-click, option-select, refine-send, regenerate-click, edit-statement, drop-statement,
  gate-resolve, conflict-shown, conflict-resolve. Expose window.__termForgeTelemetry.dump() to copy a JSON dump to clipboard for paste into the study
  spreadsheet. Error metric for the wizard = count of regenerate-click events + count of back-click events that cross a phase boundary.

  ---
  9. Cut-Corner Documentation (per CS3004 fidelity rules)

  Render a /about page (linked from Splash footer as "How this prototype differs from the real product"):
  - "Sign in with GitHub" is a fake auth modal; no GitHub OAuth wired
  - All search results, sense suggestions, parent suggestions, and generated statements are stubbed (Build A) or canned (Builds B/C)
  - Validation gates display canned results; the real pipeline runs SigmaKEE + Vampire + LEO-III off-app
  - Multimodal inputs (Mic, Image, Upload, Link) are UI only; no actual handling
  - Detour recursion is single-level only
  - No persistence across sessions

  ---
  10. Content Tone & Voice

  - Welcoming: "tell us what you're thinking about", "just type a stream of consciousness"
  - Reassuring: "we'll route you automatically", "you don't need to interpret raw matches"
  - Encouraging: "Tip: adding more detail helps the system find better matches."
  - Transparent: "(Behind the scenes: …)"
  - Human: handwritten font touches, sumo emoji, conversational labels
  - No jargon barriers, no em dashes, no leading language

  ---
  11. Implementation Order (apply in this sequence)

  1. Component library + design tokens + navigation shell + transition overlay
  2. Splash with auth gating + fake GitHub modal
  3. P1 with multimodal input + word-count callout + auto-title
  4. P2 transition + P2 Sharpen with "We think you mean…" card + Create-new CTA
  5. P3 + P4 chatbot card sequence + P4 elaboration prompt
  6. P5 review fields with A/B buttons
  7. P6 statements with default/loading/detour states
  8. P7 verify with 5 validation gates + Developer view toggle
  9. Conflict screen
  10. Readiness checklist
  11. Submit + secondary-term follow-up + loop
  12. Telemetry hook
  13. Fork Build A → Build B (Term 1 canned data, clean path)
  14. Fork Build A → Build C (Term 2 canned data, conflict path)
  15. /about page

  ---
  12. Final Note

  The wizard is the UI over a real validation pipeline (KifFileChecker, Vampire FOF, LEO-III THF, WordNet, consistency check). The job of the UI is to hide
  that complexity behind plain-language questions and conversational pacing, while still surfacing opt-in technical detail for experts via the Developer
  view toggle. Every phase should feel like progress; every interaction should feel conversational; every contribution should feel meaningful.

  Build A is the future. Builds B and C are the demo. All three share the same skeleton.
