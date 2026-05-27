import { ArrowRight, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Info, Plus, BookOpen, Quote, Sparkles, Eye, EyeOff } from "lucide-react";
import { TopBar, StepNavigator, ValidationBar, AgentBubble, KifLine, Pred, Var, Str, Paren, PanelHeader } from "./shared";

/* ───────────────── 4. STEP 3 — CLASSIFY (WordNet senses) ───────────────── */
export function ScreenStep3() {
  const senses = [
    { id: "s1", label: "Physical grasping / ascending", parent: "BodyMotion", desc: "Climbing as an embodied act — grasping holds, moving upward against gravity. Maps to motion of the agent's own body.", example: "She climbed the rock face.", recommended: true },
    { id: "s2", label: "Uphill travel", parent: "Walking", desc: "Locomotion along an inclined surface. Subclass of Walking — does not require grasping.", example: "We climbed the trail to the summit.", recommended: false },
    { id: "s3", label: "Social or hierarchical advancement", parent: "Process", desc: "Metaphorical use — moving up in rank, status, or role. Not a physical motion.", example: "He climbed the corporate ladder.", recommended: false },
    { id: "s4", label: "Plant growth pattern", parent: "Growth", desc: "Vines or creepers climbing a structure. Botanical sense — agent is a plant.", example: "The ivy climbed the wall.", recommended: false },
  ];
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Climbing" />
      <div className="flex-1 flex overflow-hidden">
        <StepNavigator current={3} completed={[1, 2]} />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="max-w-[940px] mx-auto px-8 py-7">
              <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wider text-blue-400">Step 3 of 7 · Classify</div>
              <h2 className="text-[22px] tracking-tight mb-2">What kind of thing is "Climbing"?</h2>
              <p className="text-[12px] text-[#a0a0b0] mb-5 leading-relaxed">SUMO distinguishes four top-level kinds of term. The English word may have several senses — we'll resolve which one you mean before continuing.</p>

              <AgentBubble why>Before we classify, the word "Climbing" is ambiguous. WordNet lists 6 senses; 4 map cleanly to existing SUMO parents. Which sense do you mean? Each option shows where it would attach in the hierarchy.</AgentBubble>

              <div className="grid grid-cols-4 gap-2 mb-5 mt-4">
                {[
                  { k: "CLASS", desc: "Subclass of an existing class", active: true },
                  { k: "INSTANCE", desc: "A specific individual" },
                  { k: "PREDICATE", desc: "Relation between things" },
                  { k: "ATTRIBUTE", desc: "Property assignable to things" },
                ].map(o => (
                  <button key={o.k} className={`p-3 rounded-lg border text-left transition ${o.active ? "border-blue-500 bg-blue-500/10" : "border-[var(--border)] bg-[#1a1a26] hover:border-[#3a3a4a]"}`}>
                    <div className={`text-[11px] uppercase tracking-wider mb-1 ${o.active ? "text-blue-400" : "text-[#a0a0b0]"}`}>{o.k}</div>
                    <div className="text-[10px] text-[#717182] leading-tight">{o.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-3 mt-6">
                <div>
                  <div className="text-[13px]">WordNet sense disambiguation</div>
                  <div className="text-[11px] text-[#717182]">6 senses found · 4 with clean SUMO parent mappings shown</div>
                </div>
                <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"><Info className="size-3" /> Why senses matter</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {senses.map(s => (
                  <button key={s.id} className={`relative text-left rounded-xl border p-4 transition ${s.recommended ? "border-blue-500/60 bg-blue-500/[0.06]" : "border-[var(--border)] bg-[#1a1a26] hover:border-[#3a3a4a]"}`}>
                    {s.recommended && <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500 text-white">Best match</span>}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-6 rounded bg-[#222232] flex items-center justify-center text-[10px] text-[#a0a0b0]">{s.id.toUpperCase()}</div>
                      <div className="text-[13px]">{s.label}</div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2 text-[11px] font-mono">
                      <span className="text-[#717182]">→ Maps to</span>
                      <span className="text-blue-300">{s.parent}</span>
                    </div>
                    <div className="text-[11px] text-[#a0a0b0] leading-relaxed mb-2.5">{s.desc}</div>
                    <div className="flex items-start gap-1.5 text-[10px] text-[#717182] italic"><Quote className="size-3 mt-0.5 flex-shrink-0" /><span>{s.example}</span></div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#1a1a26] border border-[var(--border)] flex items-center gap-3">
                <Plus className="size-4 text-[#a0a0b0]" />
                <div className="flex-1 text-[11px] text-[#a0a0b0]">Need a sense not listed? Provide a paraphrase and the agent will search SUMO for an appropriate parent.</div>
                <button className="text-[11px] text-blue-400">Add custom sense</button>
              </div>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--border)]">
                <button className="text-[12px] text-[#a0a0b0] hover:text-white">← Back to Step 2</button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#717182]">Selecting locks classification</span>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white flex items-center gap-2">Lock sense → Step 4 <ArrowRight className="size-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
          <ValidationBar />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 5. STEP 5–6 MAIN WORKFLOW ───────────────────────── */
export function ScreenMainWorkflow() {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Nocturnal" />
      <div className="flex-1 flex overflow-hidden relative">
        <StepNavigator current={6} completed={[1, 2, 3, 4, 5]} />

        {/* Annotations */}
        <Annotation top={"56px"} left={"234px"} text="A · STEP NAVIGATOR — locked progression, completed steps re-openable read-only" />
        <Annotation top={"56px"} left={"50%"} text="B · AGENT PANEL — Socratic prompts; never commits an answer" pos="center" />
        <Annotation top={"56px"} right={"234px"} text="D · KIF PREVIEW — live build, syntax-highlighted, error-flagged inline" />
        <Annotation bottom={"42px"} left={"50%"} text="E · VALIDATION BAR — five automated checks, click to jump to line" pos="center" />

        {/* Center: Agent + Editor */}
        <div className="flex-1 flex flex-col border-r border-[var(--border)] min-w-0">
          <PanelHeader icon={Sparkles} title="Agent · Step 6: Parse the doc string" subtitle="Each phrase from your definition is checked for axiomatic coverage" right={
            <button className="text-[10px] text-[#a0a0b0] hover:text-white px-2 py-1 rounded bg-white/5 flex items-center gap-1"><EyeOff className="size-3" /> Hide rationale</button>
          } />
          <div className="flex-1 overflow-auto px-5 py-4">
            <AgentBubble why>I've parsed your documentation string into 4 atomic claims. Three are covered by the axioms generated in Step 5. One has no supporting axiom — review the proposed rule below.</AgentBubble>

            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-wider text-[#717182] mb-2">Doc-string editor</div>
              <div className="bg-[#1a1a26] border border-[var(--border)] rounded-lg p-3.5 text-[13px] leading-relaxed">
                <span className="bg-emerald-500/10 px-0.5 rounded">Nocturnal organisms are more active at night than during daylight hours.</span>{" "}
                <span className="bg-emerald-500/10 px-0.5 rounded">This dispositional attribute is associated with reduced predation risk in some mammal species.</span>{" "}
                <span className="bg-amber-500/10 px-0.5 rounded">It is found across multiple mammal lineages and many invertebrates.</span>{" "}
                <span className="bg-emerald-500/10 px-0.5 rounded">Common examples include bats, owls, and most rodents.</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-[#717182]">
                <div className="flex items-center gap-3"><span>Author: Dr. M. Reyes</span><span>·</span><span>Cite source: Curtis &amp; Barnes, Biology 5e</span></div>
                <div>284 / 600 chars</div>
              </div>
              <div className="mt-2 px-3 py-2 rounded bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 text-[11px] text-blue-300"><Info className="size-3.5" /> Your words, not the AI's. The agent may refine grammar but will never originate the content.</div>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-[#717182] mb-2 mt-5">Claim coverage table</div>
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <div className="grid grid-cols-[1fr_140px_220px] bg-[#181826] border-b border-[var(--border)] px-3 py-2 text-[10px] uppercase tracking-wider text-[#717182]">
                <div>Claim from doc string</div><div>Coverage</div><div>Supporting axiom</div>
              </div>
              {[
                { c: "Nocturnal organisms are more active at night", s: "covered", a: "increasesLikelihood (line 7)" },
                { c: "Associated with reduced predation risk", s: "covered", a: "=> rule (line 12)" },
                { c: "Found across multiple mammal lineages", s: "uncovered", a: "No shape predicate available" },
                { c: "Common examples include bats, owls, rodents", s: "covered", a: "instance assertions (lines 18–20)" },
              ].map((row, i) => {
                const tone = row.s === "covered" ? "text-emerald-400" : row.s === "uncovered" ? "text-red-400" : "text-amber-400";
                const Icon = row.s === "covered" ? CheckCircle2 : row.s === "uncovered" ? XCircle : AlertTriangle;
                return (
                  <div key={i} className={`grid grid-cols-[1fr_140px_220px] px-3 py-2.5 text-[12px] items-center ${i > 0 ? "border-t border-[var(--border)]" : ""} hover:bg-white/[0.02]`}>
                    <div className="text-[#d0d0d8]">{row.c}</div>
                    <div className={`flex items-center gap-1.5 ${tone} text-[11px]`}><Icon className="size-3" /> <span className="uppercase tracking-wider text-[10px]">{row.s}</span></div>
                    <div className="text-[11px] text-[#a0a0b0] font-mono truncate">{row.a}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3.5">
              <div className="flex items-start gap-2.5 mb-2"><XCircle className="size-4 text-red-400 mt-0.5" /><div className="text-[12px] text-red-300">1 NOT COVERED claim must be resolved before Step 7</div></div>
              <div className="text-[11px] text-[#c0c0c8] mb-3 leading-relaxed pl-6">"Found across multiple mammal lineages" — no shape predicate exists. Choose how to resolve:</div>
              <div className="grid grid-cols-2 gap-2 pl-6">
                <button className="text-left p-2.5 rounded bg-[#181826] border border-[var(--border)] hover:border-blue-500/40 text-[11px]">
                  <div className="text-[#d0d0d8] mb-1">Propose new rule</div>
                  <div className="text-[10px] text-[#717182]">Add: <span className="font-mono text-blue-300">(=&gt; (instance ?X Nocturnal) (exists ?C ...))</span></div>
                </button>
                <button className="text-left p-2.5 rounded bg-[#181826] border border-[var(--border)] hover:border-amber-500/40 text-[11px]">
                  <div className="text-[#d0d0d8] mb-1">Remove from doc string</div>
                  <div className="text-[10px] text-[#717182]">Statement is descriptive, not formalizable — strike from definition</div>
                </button>
              </div>
            </div>
          </div>

          <PanelHeader title="Affordance framework" subtitle="Required and recommended characterizations for any new class" />
          <div className="px-5 py-3 flex gap-2 flex-wrap text-[11px] flex-shrink-0">
            {[
              { l: "What it IS", req: "required", done: true },
              { l: "What it CAN DO", req: "recommended", done: true },
              { l: "What it is FOR", req: "recommended", done: false },
              { l: "Inference rules", req: "required", done: true },
            ].map(a => (
              <div key={a.l} className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${a.done ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-[var(--border)] bg-[#1a1a26] text-[#a0a0b0]"}`}>
                {a.done ? <CheckCircle2 className="size-3" /> : <div className="size-3 rounded-full border border-current" />}
                <span>{a.l}</span>
                <span className="text-[9px] text-[#717182]">· {a.req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: KIF preview */}
        <div className="w-[440px] flex flex-col flex-shrink-0 bg-[#0e0e16]">
          <PanelHeader title="KIF Preview · live" subtitle="Auto-generated from doc string · 320ms debounce" right={
            <div className="flex items-center gap-1 text-[10px]"><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-emerald-400">synced</span></div>
          } />
          <div className="flex-1 overflow-auto py-2">
            <KifLine n={1}><Comm>;; Nocturnal — added 2026-04-30 by Reyes</Comm></KifLine>
            <KifLine n={2}><Paren>(</Paren><Pred>subclass</Pred> Nocturnal BiologicalAttribute<Paren>)</Paren></KifLine>
            <KifLine n={3}><Paren>(</Paren><Pred>termFormat</Pred> EnglishLanguage Nocturnal <Str>"nocturnal"</Str><Paren>)</Paren></KifLine>
            <KifLine n={4}><Paren>(</Paren><Pred>documentation</Pred> Nocturnal EnglishLanguage</KifLine>
            <KifLine n={5}>{"  "}<Str>"Nocturnal organisms are more active..."</Str><Paren>)</Paren></KifLine>
            <KifLine n={6}> </KifLine>
            <KifLine n={7}><Paren>(</Paren><Pred>increasesLikelihood</Pred></KifLine>
            <KifLine n={8} indent={1}><Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?X</Var> Organism<Paren>)</Paren></KifLine>
            <KifLine n={9} indent={2}><Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren><Paren>)</Paren></KifLine>
            <KifLine n={10} indent={1}><Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>holdsDuring</Pred> <Var>?T</Var><Paren>)</Paren></KifLine>
            <KifLine n={11} indent={2}><Paren>(</Paren><Pred>active</Pred> <Var>?X</Var> Night<Paren>)</Paren><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren></KifLine>
            <KifLine n={12}><Paren>(</Paren><Pred>=&gt;</Pred></KifLine>
            <KifLine n={13} indent={1}><Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren></KifLine>
            <KifLine n={14} indent={1} error="?Y unbound"><Paren>(</Paren><Pred>lessThan</Pred> <Paren>(</Paren><Pred>predationRate</Pred> <Var>?X</Var><Paren>)</Paren> <Var>?Y</Var><Paren>)</Paren><Paren>)</Paren></KifLine>
            <KifLine n={15}> </KifLine>
            <KifLine n={16}><Comm>;; Examples</Comm></KifLine>
            <KifLine n={17}><Paren>(</Paren><Pred>attribute</Pred> Bat-1 Nocturnal<Paren>)</Paren></KifLine>
            <KifLine n={18}><Paren>(</Paren><Pred>attribute</Pred> Owl-1 Nocturnal<Paren>)</Paren></KifLine>
            <KifLine n={19}><Paren>(</Paren><Pred>attribute</Pred> Rodent-1 Nocturnal<Paren>)</Paren></KifLine>
          </div>
          <div className="border-t border-[var(--border)] px-4 py-2.5 flex items-center justify-between text-[10px] text-[#717182] bg-[#13131c]">
            <span>19 lines · 5 axioms</span>
            <div className="flex gap-2">
              <button className="hover:text-white">Format</button>
              <button className="hover:text-white">Copy</button>
              <button className="hover:text-white">Export .kif</button>
            </div>
          </div>
        </div>
      </div>
      <ValidationBar />
    </div>
  );
}

const Comm = ({ children }: any) => <span className="text-[#666] italic">{children}</span>;

function Annotation({ text, top, left, right, bottom, pos = "left" }: any) {
  return (
    <div className="absolute z-10 pointer-events-none flex items-start gap-1.5" style={{ top, left, right, bottom, transform: pos === "center" ? "translateX(-50%)" : undefined }}>
      <div className="px-2 py-0.5 rounded bg-purple-500/90 text-white text-[10px] tracking-wide shadow-lg max-w-[260px]">{text}</div>
    </div>
  );
}
