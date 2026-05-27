import { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, ChevronRight, FileText, Quote, Sparkles, Info, Wand2, ShieldCheck, RotateCcw, Loader2, HelpCircle, PanelRightOpen } from "lucide-react";
import { LeftRail, PhaseStepper, ChatThread, AgentMsg, UserMsg, OptionCards, OptionCard, Composer, RightArtifact } from "./chat-shell";
import { KifLine, Pred, Var, Str, Paren, SumoMark } from "./shared";
import { ModeToggle } from "./overlays";

export type WizardMode = "focused" | "expert";

export interface ShellCtx { mode: WizardMode; setMode: (m: WizardMode) => void; openShortcuts: () => void; }

function Shell({ phase, completed = [], children, right, ctx, showRightInFocused = false }: { phase: number; completed?: number[]; children: ReactNode; right?: ReactNode; ctx: ShellCtx; showRightInFocused?: boolean }) {
  const focused = ctx.mode === "focused";
  const showRight = right && (!focused || showRightInFocused);
  return (
    <div className="size-full flex bg-[#0a0a14] text-[#e6e6ee]">
      <LeftRail active="" focused={focused} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-end gap-2 px-5 py-2 border-b border-[#1f1f2c] bg-[#0a0a14] flex-shrink-0">
          <span className="text-[10px] text-[#555] mr-auto">Default mode is Focused — switch to Expert for the cockpit view.</span>
          <button onClick={ctx.openShortcuts} title="Keyboard shortcuts (?)" className="size-7 rounded-md hover:bg-white/5 text-[#a0a0b0] flex items-center justify-center"><HelpCircle className="size-3.5" /></button>
          <ModeToggle mode={ctx.mode} setMode={ctx.setMode} />
        </div>
        <PhaseStepper current={phase} completed={completed} focused={focused} />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>
          {showRight && right}
        </div>
      </div>
    </div>
  );
}

/* ───────── PHASE TRANSITION ───────── */
export function ScreenPhaseTransition({ ctx }: { ctx: ShellCtx }) {
  const focused = ctx.mode === "focused";
  return (
    <div className="size-full flex bg-[#0a0a14] text-[#e6e6ee]">
      <LeftRail active="" focused={focused} />
      <div className="flex-1 flex flex-col min-w-0">
        <PhaseStepper current={3} completed={[1, 2]} focused={focused} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="absolute inset-0 size-32 rounded-2xl bg-blue-500/20 blur-3xl animate-pulse" />
            <div className="relative size-32 flex items-center justify-center" style={{ animation: "spin 4s linear infinite" }}>
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/40 border-t-blue-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <SumoMark size={68} ring />
            </div>
          </div>
          <div className="mt-10 text-center max-w-[480px]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-2">Phase 2 → Phase 3</div>
            <h2 className="text-[22px] tracking-tight mb-2">Justification recorded. Moving to Classify…</h2>
            <p className="text-[12.5px] text-[#a0a0b0] leading-relaxed">The wizard is loading WordNet senses and SUMO parent candidates for "Nocturnal." This typically takes a few seconds.</p>
            <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-[#717182]">
              <Loader2 className="size-3.5 animate-spin text-blue-400" />
              <span>Querying loaded knowledge base · 3 files</span>
            </div>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </div>
  );
}

/* ───────── PHASE 1 — SEARCH (NOT FOUND) ───────── */
export function ScreenStep1Empty({ ctx }: { ctx: ShellCtx }) {
  const focused = ctx.mode === "focused";
  return (
    <Shell phase={1} completed={[]} ctx={ctx}>
      <ChatThread focused={focused}>
        <AgentMsg badge="Phase 1 · Search">
          Welcome back. Before authoring a new term, I'll search the loaded knowledge base for anything that already matches what you have in mind. <span className="text-[#a0a0b0]">This is the most important gate — duplicate terms are the most common error in collaborative ontology work.</span>
        </AgentMsg>
        <AgentMsg>What term would you like to add to SUMO?</AgentMsg>
        <UserMsg>I want to add <strong>Nocturnal</strong> — the property of being more active at night than during the day. Common in mammals, birds, and many invertebrates.</UserMsg>
        <AgentMsg badge="Searching">
          Searching <code className="text-blue-300 bg-black/30 px-1 rounded text-[12px]">Nocturnal</code> across <span className="text-[#a0a0b0]">Merge.kif, Mid-level.kif, Animals.kif</span>…
        </AgentMsg>

        <div className="ml-11 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center"><AlertTriangle className="size-5 text-amber-400" /></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-400">Result</div>
              <div className="text-[16px]">NOT FOUND — but 3 partial matches</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { t: "NocturnalActivity", f: "Mid-level.kif:4421", d: "(subclass NocturnalActivity Process)" },
              { t: "Night", f: "Merge.kif:8842", d: "Time interval — not a class of organisms" },
              { t: "DiurnalAnimal", f: "Animals.kif:212", d: "Sibling concept — opposite polarity" },
            ].map(m => (
              <div key={m.t} className="flex items-center gap-3 px-3 py-2 bg-black/25 rounded text-[11px] hover:bg-black/35 cursor-pointer">
                <span className="font-mono text-blue-300">{m.t}</span>
                <span className="text-[#717182]">{m.f}</span>
                <span className="text-[#a0a0b0] flex-1 truncate">{m.d}</span>
                <ExternalLink className="size-3 text-[#555]" />
              </div>
            ))}
          </div>
        </div>

        <AgentMsg>
          None of these express the dispositional property "active during night." We can proceed to Phase 2 to justify creating <code className="text-blue-300 bg-black/30 px-1 rounded text-[12px]">Nocturnal</code> as a new term.
          <OptionCards>
            <OptionCard color="blue" title="Proceed to Phase 2 — Justify" desc="Explain what Nocturnal expresses that the existing terms cannot." recommended />
            <OptionCard color="neutral" title="Refine search" desc="Try a different name or synonym before creating a new term." />
          </OptionCards>
        </AgentMsg>
      </ChatThread>
      <Composer focused={focused} placeholder="Reply, or pick an option above…" chips={["Proceed to Justify", "Search 'crepuscular' instead", "Show full hierarchy of NocturnalActivity"]} />
    </Shell>
  );
}

/* ───────── PHASE 1 — SEARCH (EXISTS) ───────── */
export function ScreenStep1Found({ ctx }: { ctx: ShellCtx }) {
  const focused = ctx.mode === "focused";
  return (
    <Shell phase={1} completed={[]} ctx={ctx}>
      <ChatThread focused={focused}>
        <AgentMsg badge="Phase 1 · Search">What term would you like to add?</AgentMsg>
        <UserMsg>Predation — when one animal hunts and consumes another.</UserMsg>
        <AgentMsg badge="Result">
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="size-5 text-emerald-400" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-400">Result</div>
                <div className="text-[16px]">EXISTS in Merge.kif</div>
              </div>
              <span className="ml-auto text-[10px] text-[#717182]">line 14,221 · last modified 2024-08-12</span>
            </div>
            <div className="bg-[#0a0a12] rounded-lg overflow-hidden border border-[#1f1f2c]">
              <div className="py-2 text-[12px]">
                <KifLine n={14221}><Paren>(</Paren><Pred>subclass</Pred> Predation BiologicalProcess<Paren>)</Paren></KifLine>
                <KifLine n={14222}><Paren>(</Paren><Pred>documentation</Pred> Predation EnglishLanguage</KifLine>
                <KifLine n={14223}>{"  "}<Str>"The act of one Organism feeding upon another. Predator must be alive at start; prey must be killed."</Str><Paren>)</Paren></KifLine>
                <KifLine n={14224}><Paren>(</Paren><Pred>{"=>"}</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?P</Var> Predation<Paren>)</Paren></KifLine>
                <KifLine n={14225} indent={1}><Paren>(</Paren><Pred>exists</Pred> <Paren>(</Paren><Var>?A1</Var> <Var>?A2</Var><Paren>)</Paren> ...<Paren>)</Paren><Paren>)</Paren></KifLine>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#717182]">Entity</span><ChevronRight className="size-3" />
              <span className="text-[#717182]">Process</span><ChevronRight className="size-3" />
              <span className="text-[#a0a0b0]">BiologicalProcess</span><ChevronRight className="size-3" />
              <span className="text-emerald-300">Predation</span>
            </div>
          </div>
        </AgentMsg>
        <AgentMsg>
          This term is already formalized with a documentation string and inference rules. Creating a new term would duplicate it. I recommend you reuse the existing definition.
          <OptionCards>
            <OptionCard color="emerald" title="Use existing term" desc="Link your work to Merge.kif:14221 — recommended." recommended />
            <OptionCard color="neutral" title="Create a distinct term" desc="Justify how it differs from Predation in Phase 2." />
          </OptionCards>
        </AgentMsg>
      </ChatThread>
      <Composer focused={focused} chips={["Use existing", "Show full block", "What inferences does it support?"]} />
    </Shell>
  );
}

/* ───────── PHASE 3 — CLASSIFY ───────── */
export function ScreenStep3({ ctx }: { ctx: ShellCtx }) {
  const focused = ctx.mode === "focused";
  return (
    <Shell phase={3} completed={[1, 2]} ctx={ctx}>
      <ChatThread focused={focused}>
        <AgentMsg badge="Phase 3 · Classify">
          Now we classify. SUMO has four kinds of term — <span className="text-blue-300">Class, Instance, Predicate, Attribute</span>. The English word "Nocturnal" is also ambiguous: WordNet lists six senses. Let's resolve which sense you mean before locking the classification.
        </AgentMsg>
        <UserMsg>I mean the sense that organisms <em>have</em> — like an attribute on the organism, not a class of organism.</UserMsg>
        <AgentMsg>
          Good. That points to <span className="text-blue-300">Attribute</span>. Of the four WordNet senses that map cleanly to SUMO parents, here are the candidates — which one should I lock in?
          <div className="ml-0 mt-3 grid grid-cols-2 gap-2">
            {[
              { id: "S1", t: "Active during night-time hours", p: "BiologicalAttribute", d: "Dispositional property of an organism. Maps to attribute relation. ✓ matches your description.", best: true },
              { id: "S2", t: "Of the night (poetic / temporal)", p: "TimeInterval", d: "Adjective describing time, not organisms. Sense in 'nocturnal hours'." },
              { id: "S3", t: "A nocturne (musical piece)", p: "MusicalComposition", d: "Noun sense — unrelated to biology." },
              { id: "S4", t: "Nighttime liturgical service", p: "ReligiousProcess", d: "Historical sense — not relevant here." },
            ].map(s => (
              <button key={s.id} className={`relative text-left rounded-xl border p-3.5 transition ${s.best ? "border-blue-500/60 bg-blue-500/[0.06]" : "border-[#262636] bg-[#13131c] hover:border-[#3a3a4a]"}`}>
                {s.best && <span className="absolute top-3 right-3 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500 text-white">Best match</span>}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#a0a0b0]">{s.id}</span>
                  <div className="text-[13px]">{s.t}</div>
                </div>
                <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono">
                  <span className="text-[#555]">→ Maps to</span>
                  <span className="text-blue-300">{s.p}</span>
                </div>
                <div className="text-[11px] text-[#a0a0b0] leading-relaxed">{s.d}</div>
              </button>
            ))}
          </div>
        </AgentMsg>
        <AgentMsg>Locking the sense will set <span className="text-blue-300">Attribute</span> as the kind and <span className="text-blue-300">BiologicalAttribute</span> as the working parent. You can still adjust the parent in Phase 4.</AgentMsg>
      </ChatThread>
      <Composer focused={focused} chips={["Lock S1 — biological attribute", "Show all 6 senses", "What if it should be a Class?"]} />
    </Shell>
  );
}

/* ───────── PHASE 5–6 — DEFINE + COVERAGE (with right artifact panel) ───────── */
export function ScreenMainWorkflow({ ctx }: { ctx: ShellCtx }) {
  const focused = ctx.mode === "focused";
  const right = (
    <RightArtifact
      title="KIF artifact · live"
      subtitle="Generated from your doc string · 320ms debounce"
      badge={<span className="flex items-center gap-1 text-[10px] text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> synced</span>}
    >
      <div className="px-3 pt-2 pb-1 border-b border-[#1f1f2c] flex items-center gap-1 flex-wrap text-[10px]">
        {["Paren OK", "Style OK", "Var scope · 1", "Cross-ref OK", "Bare exists OK"].map((c, i) => (
          <span key={i} className={`px-1.5 py-0.5 rounded border ${i === 2 ? "bg-amber-500/10 text-amber-300 border-amber-500/25" : "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"}`}>{c}</span>
        ))}
      </div>
      <div className="bg-[#08080f] py-2">
        <KifLine n={1}><span className="text-[#555] italic">;; Nocturnal — added 2026-04-30 by Reyes</span></KifLine>
        <KifLine n={2}><Paren>(</Paren><Pred>subclass</Pred> Nocturnal BiologicalAttribute<Paren>)</Paren></KifLine>
        <KifLine n={3}><Paren>(</Paren><Pred>termFormat</Pred> EnglishLanguage Nocturnal <Str>"nocturnal"</Str><Paren>)</Paren></KifLine>
        <KifLine n={4}><Paren>(</Paren><Pred>documentation</Pred> Nocturnal EnglishLanguage</KifLine>
        <KifLine n={5}>{"  "}<Str>"Nocturnal organisms are more active at night..."</Str><Paren>)</Paren></KifLine>
        <KifLine n={6}> </KifLine>
        <KifLine n={7}><Paren>(</Paren><Pred>increasesLikelihood</Pred></KifLine>
        <KifLine n={8} indent={1}><Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?X</Var> Organism<Paren>)</Paren></KifLine>
        <KifLine n={9} indent={2}><Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren><Paren>)</Paren></KifLine>
        <KifLine n={10} indent={1}><Paren>(</Paren><Pred>active</Pred> <Var>?X</Var> Night<Paren>)</Paren><Paren>)</Paren></KifLine>
        <KifLine n={11}><Paren>(</Paren><Pred>{"=>"}</Pred> <Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren></KifLine>
        <KifLine n={12} indent={1} error="?Y unbound"><Paren>(</Paren><Pred>lessThan</Pred> <Paren>(</Paren><Pred>predationRate</Pred> <Var>?X</Var><Paren>)</Paren> <Var>?Y</Var><Paren>)</Paren><Paren>)</Paren></KifLine>
        <KifLine n={13}> </KifLine>
        <KifLine n={14}><Paren>(</Paren><Pred>attribute</Pred> Bat-1 Nocturnal<Paren>)</Paren></KifLine>
        <KifLine n={15}><Paren>(</Paren><Pred>attribute</Pred> Owl-1 Nocturnal<Paren>)</Paren></KifLine>
      </div>
      <div className="border-t border-[#1f1f2c] px-3 py-2 flex items-center justify-between text-[10px] text-[#717182]">
        <span>15 lines · 5 axioms</span>
        <div className="flex gap-3"><button className="hover:text-white">Format</button><button className="hover:text-white">Copy</button><button className="hover:text-white">Export</button></div>
      </div>
    </RightArtifact>
  );
  return (
    <Shell phase={6} completed={[1, 2, 3, 4, 5]} right={right} ctx={ctx} showRightInFocused>
      <ChatThread focused={focused}>
        <AgentMsg badge="Phase 5 · Define">
          You wrote the doc string. I generated a minimum KIF block on the right. <span className="text-[#a0a0b0]">Your words, not mine — I only formalized them.</span>
        </AgentMsg>
        <UserMsg>
          "Nocturnal organisms are more active at night than during daylight hours. This dispositional attribute is associated with reduced predation risk in some mammal species. It is found across multiple mammal lineages and many invertebrates. Common examples include bats, owls, and most rodents."
          <div className="text-[10px] text-[#a0a0b0] mt-2 italic">cite: Curtis &amp; Barnes, Biology 5e</div>
        </UserMsg>
        <AgentMsg badge="Phase 6 · Coverage">
          I parsed your doc string into 4 atomic claims and checked each against the axioms in the artifact. Three are covered. One is not — let's resolve it before Phase 7.
          <div className="ml-0 mt-3 rounded-lg border border-[#1f1f2c] overflow-hidden bg-[#13131c]">
            <div className="grid grid-cols-[1fr_110px_180px] px-3 py-2 border-b border-[#1f1f2c] text-[10px] uppercase tracking-wider text-[#717182] bg-[#0e0e16]">
              <div>Claim</div><div>Coverage</div><div>Supporting axiom</div>
            </div>
            {[
              { c: "More active at night than day", s: "covered", a: "increasesLikelihood (line 7)" },
              { c: "Reduced predation risk", s: "covered", a: "=> rule (line 11)" },
              { c: "Found across mammal lineages", s: "uncovered", a: "No shape predicate available" },
              { c: "Examples: bats, owls, rodents", s: "covered", a: "instance assertions (14–15)" },
            ].map((r, i) => {
              const tone = r.s === "covered" ? "text-emerald-400" : "text-red-400";
              const Icon = r.s === "covered" ? CheckCircle2 : XCircle;
              return (
                <div key={i} className={`grid grid-cols-[1fr_110px_180px] px-3 py-2.5 text-[12px] items-center ${i > 0 ? "border-t border-[#1f1f2c]" : ""}`}>
                  <div className="text-[#d6d6dd]">{r.c}</div>
                  <div className={`flex items-center gap-1.5 ${tone} text-[11px]`}><Icon className="size-3" /><span className="uppercase tracking-wider text-[10px]">{r.s}</span></div>
                  <div className="text-[10.5px] text-[#a0a0b0] font-mono truncate">{r.a}</div>
                </div>
              );
            })}
          </div>
        </AgentMsg>
        <AgentMsg>
          Claim "Found across mammal lineages" has no formal support. How should I resolve it?
          <OptionCards>
            <OptionCard color="blue" title="Propose a covering rule" desc="Add: (=> (attribute ?X Nocturnal) (exists ?L (mammalLineage ?X ?L)))" recommended />
            <OptionCard color="amber" title="Strike from doc string" desc="Treat as descriptive prose, not formalizable. The KIF block stays minimal." />
          </OptionCards>
        </AgentMsg>
      </ChatThread>
      <Composer focused={focused} chips={["Propose covering rule", "Strike from doc", "Show me the rule first"]} />
    </Shell>
  );
}

/* ───────── PHASE 7 — APPROVE ───────── */
export function ScreenStep7({ ctx, onApprove }: { ctx: ShellCtx; onApprove?: () => void }) {
  const focused = ctx.mode === "focused";
  const right = (
    <RightArtifact title="Final KIF · read-only" subtitle="19 lines · 5 axioms · 4/4 claims covered" badge={<span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Ready</span>}>
      <div className="bg-[#08080f] py-2">
        <KifLine n={1}><span className="text-[#555] italic">;; Nocturnal — approved draft</span></KifLine>
        <KifLine n={2}><Paren>(</Paren><Pred>subclass</Pred> Nocturnal BiologicalAttribute<Paren>)</Paren></KifLine>
        <KifLine n={3}><Paren>(</Paren><Pred>termFormat</Pred> EnglishLanguage Nocturnal <Str>"nocturnal"</Str><Paren>)</Paren></KifLine>
        <KifLine n={4}><Paren>(</Paren><Pred>documentation</Pred> Nocturnal EnglishLanguage</KifLine>
        <KifLine n={5}>{"  "}<Str>"Nocturnal organisms are more active..."</Str><Paren>)</Paren></KifLine>
        <KifLine n={6}><Paren>(</Paren><Pred>increasesLikelihood</Pred></KifLine>
        <KifLine n={7} indent={1}><Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?X</Var> Organism<Paren>)</Paren></KifLine>
        <KifLine n={8} indent={2}><Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren><Paren>)</Paren></KifLine>
        <KifLine n={9} indent={1}><Paren>(</Paren><Pred>active</Pred> <Var>?X</Var> Night<Paren>)</Paren><Paren>)</Paren></KifLine>
        <KifLine n={10}><Paren>(</Paren><Pred>{"=>"}</Pred> <Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren></KifLine>
        <KifLine n={11} indent={1}><Paren>(</Paren><Pred>exists</Pred> <Paren>(</Paren><Var>?Y</Var><Paren>)</Paren> <Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>predationRate</Pred> <Var>?X</Var> <Var>?Y</Var><Paren>)</Paren></KifLine>
        <KifLine n={12} indent={2}><Paren>(</Paren><Pred>lessThan</Pred> <Var>?Y</Var> AverageRate<Paren>)</Paren><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren></KifLine>
        <KifLine n={13}><Paren>(</Paren><Pred>attribute</Pred> Bat-1 Nocturnal<Paren>)</Paren></KifLine>
        <KifLine n={14}><Paren>(</Paren><Pred>attribute</Pred> Owl-1 Nocturnal<Paren>)</Paren></KifLine>
        <KifLine n={15}><Paren>(</Paren><Pred>attribute</Pred> Rodent-1 Nocturnal<Paren>)</Paren></KifLine>
      </div>
    </RightArtifact>
  );
  return (
    <Shell phase={7} completed={[1, 2, 3, 4, 5, 6]} right={right} ctx={ctx} showRightInFocused>
      <ChatThread focused={focused}>
        <AgentMsg badge="Phase 7 · Review &amp; Approve">
          Here is the contract. <span className="text-[#a0a0b0]">All 4 doc-string claims are covered. There are 2 modeling risks I want you to acknowledge before signing off.</span>
        </AgentMsg>

        <div className="ml-11 space-y-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.05] p-3.5">
            <div className="flex items-center gap-2 mb-2 text-[12px] text-amber-300"><AlertTriangle className="size-3.5" /> Risk 1 — Absolute {"=>"} for a dispositional property</div>
            <div className="text-[11.5px] text-[#c8c8d4] leading-relaxed">Line 10 uses material implication for what reads as a probabilistic claim. Verify this is the intended strength.</div>
            <div className="mt-2 flex gap-2">
              <button className="text-[10px] px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Acknowledge</button>
              <button className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#a0a0b0]">Switch to increasesLikelihood</button>
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/[0.05] p-3.5">
            <div className="text-[12px] mb-2">Risk 2 — increasesLikelihood used 4× this session</div>
            <div className="text-[11.5px] text-[#c8c8d4] leading-relaxed mb-3">Before committing, verify at least one usage manually with a proof.</div>
            <div className="space-y-1.5">
              <label className="flex items-start gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                <input type="radio" name="ver" className="mt-0.5 accent-blue-500" />
                <div><div className="text-[12px]">I have verified — proceed</div><div className="text-[10px] text-[#717182]">Records manual review of one usage</div></div>
              </label>
              <label className="flex items-start gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                <input type="radio" name="ver" className="mt-0.5 accent-blue-500" defaultChecked />
                <div><div className="text-[12px]">Show me a proof conjecture to test one usage</div><div className="text-[10px] text-[#717182]">Routes to the prover after approval</div></div>
              </label>
            </div>
          </div>
        </div>

        <AgentMsg>
          When you're ready, sign off below. Approval is a formal commitment to the knowledge base.
          <div className="ml-0 mt-3 grid grid-cols-2 gap-2">
            <button onClick={onApprove} className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 p-3.5 text-left">
              <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="size-4 text-emerald-400" /><div className="text-[13px] text-emerald-200">Approve and commit</div></div>
              <div className="text-[10.5px] text-emerald-200/70">Adds the term to draft.kif and opens a PR</div>
            </button>
            <button className="rounded-xl border border-[#262636] bg-[#13131c] hover:border-[#3a3a4a] p-3.5 text-left">
              <div className="flex items-center gap-2 mb-1"><RotateCcw className="size-4 text-[#a0a0b0]" /><div className="text-[13px]">Revise — return to a phase</div></div>
              <div className="text-[10.5px] text-[#a0a0b0]">Pick which step to edit. Subsequent steps re-validate.</div>
            </button>
          </div>
        </AgentMsg>
      </ChatThread>
      <Composer focused={focused} placeholder="Add a note for the reviewer (optional)…" chips={["Approve", "Revise Phase 5", "Run a proof first"]} />
    </Shell>
  );
}
