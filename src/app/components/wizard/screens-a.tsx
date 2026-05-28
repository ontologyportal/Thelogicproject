import { Search, ArrowRight, Plus, History, Sparkles, FileText, GitCompare, BookOpen, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Filter, ExternalLink, BookCheck, ShieldCheck, Eye, Globe2, Github, UserCircle2 } from "lucide-react";
import { TopBar, StepNavigator, ValidationBar, AgentBubble, UserBubble, KifLine, Pred, Var, Str, Paren, PanelHeader, STEPS, SumoMark } from "./shared";

/* ───────────────────────────── 1. LANDING ─────────────────────────────
 * Brand-forward, jargon-light. The mission is the headline; the tooling
 * (SUMO, SUO-KIF, .kif files) lives in the footer for those who care.
 * Single primary CTA — "Start contributing" — defaults to the basic
 * guided path. Power-user shortcuts are recessive. */
export function ScreenLanding({ go }: { go: (k: string) => void }) {
  const recent = [
    { term: "Nocturnal", status: "In progress", color: "text-amber-400", domain: "Animals" },
    { term: "Communication", status: "Contributed", color: "text-emerald-400", domain: "Objects" },
    { term: "PhishingAttempt", status: "Contributed", color: "text-emerald-400", domain: "Cyber" },
  ];
  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        {/* Hero — full bleed, brand-forward */}
        <div className="relative overflow-hidden border-b border-[#1a1a26]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.08),_transparent_50%)]" />
          <div className="relative max-w-[1100px] mx-auto px-10 pt-20 pb-16">
            <div className="flex items-center gap-2 mb-7">
              <SumoMark size={36} ring />
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#a0a0b0]">Sigma Gamma · open knowledge initiative</div>
            </div>
            <h1 className="text-[44px] leading-[1.05] tracking-tight max-w-[820px] mb-5">
              Contribute to truly open AI, defined by you.
            </h1>
            <p className="text-[15px] text-[#c0c0c8] max-w-[640px] leading-relaxed mb-9">
              You're adding to a public, traceable map of how the world is described. Anyone can use it. No login walls, no proprietary formats, just shared knowledge with your name on the contribution.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => go("describe")} className="px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-[13px] text-white flex items-center gap-2 shadow-lg shadow-blue-500/20">
                Describe your world <ArrowRight className="size-4" />
              </button>
            </div>
            {/* Auth row — both paths first-class, neither gates the experience */}
            <div className="flex items-center gap-2 text-[11.5px]">
              <button className="px-3 py-2 rounded-md bg-[#13131c] border border-[#1f1f2c] hover:border-[#2a2a3a] text-[#c0c0c8] flex items-center gap-2">
                <Github className="size-3.5" /> Sign in with GitHub
                <span className="text-[10px] text-[#717182]">claim credit</span>
              </button>
              <span className="text-[#555]">or</span>
              <button onClick={() => go("describe")} className="px-3 py-2 rounded-md text-[#a0a0b0] hover:text-white hover:bg-white/5 flex items-center gap-2">
                <UserCircle2 className="size-3.5" /> Continue as guest
              </button>
            </div>
            <div className="mt-12 flex items-center gap-8 text-[11px] text-[#717182]">
              <div className="flex items-center gap-2"><Globe2 className="size-3.5 text-blue-400" /> Public &amp; open-licensed</div>
              <div className="flex items-center gap-2"><Eye className="size-3.5 text-emerald-400" /> Every claim traceable to a source</div>
              <div className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-purple-400" /> Mechanically provable consistency</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[1100px] mx-auto px-10 py-12">
          {/* What you're contributing to — plain English */}
          <div className="mb-12">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#717182] mb-4">What you're contributing to</div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "25,000+", l: "Concepts already defined", s: "spanning every domain you can think of" },
                { n: "180,000+", l: "Logical statements", s: "every one machine-checkable" },
                { n: "Open", l: "License: forever", s: "GNU General Public, no gatekeepers" },
              ].map(s => (
                <div key={s.l} className="bg-[#13131c] border border-[#1f1f2c] rounded-xl p-5">
                  <div className="text-[24px] tracking-tight mb-1">{s.n}</div>
                  <div className="text-[12px] text-[#e0e0e8] mb-1">{s.l}</div>
                  <div className="text-[11px] text-[#717182] leading-relaxed">{s.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent — only if you have any */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#717182]">Your recent work</div>
            <button onClick={() => go("history")} className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">View all <ChevronRight className="size-3" /></button>
          </div>
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-xl overflow-hidden mb-12">
            {recent.map((r, i) => (
              <div key={r.term} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer ${i > 0 ? "border-t border-[#1f1f2c]" : ""}`}>
                <div className="size-8 rounded bg-[#222232] flex items-center justify-center text-[11px] text-[#a0a0b0]">{r.term.slice(0,2).toUpperCase()}</div>
                <div className="flex-1">
                  <div className="text-[13px]">{r.term}</div>
                  <div className={`text-[11px] mt-0.5 ${r.color}`}>{r.status}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a0a0b0]">{r.domain}</span>
                <ChevronRight className="size-4 text-[#555]" />
              </div>
            ))}
          </div>

          {/* Power user / engineer fast lane — recessive */}
          <details className="group bg-[#13131c] border border-[#1f1f2c] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] list-none">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded bg-purple-500/15 flex items-center justify-center"><Sparkles className="size-4 text-purple-300" /></div>
                <div>
                  <div className="text-[12.5px]">Already know what you're doing?</div>
                  <div className="text-[10.5px] text-[#717182]">Skip the guided intro and jump straight into search, classification, or review.</div>
                </div>
              </div>
              <ChevronRight className="size-4 text-[#717182] group-open:rotate-90 transition-transform" />
            </summary>
            <div className="border-t border-[#1f1f2c] grid grid-cols-3 gap-px bg-[#1f1f2c]">
              <button onClick={() => go("step1-empty")} className="bg-[#13131c] hover:bg-white/[0.02] p-4 text-left">
                <Search className="size-4 text-[#a0a0b0] mb-2" />
                <div className="text-[12px]">Discovery</div>
                <div className="text-[10px] text-[#717182] mt-0.5">Search the knowledge base directly</div>
              </button>
              <button onClick={() => go("step6-main")} className="bg-[#13131c] hover:bg-white/[0.02] p-4 text-left">
                <BookCheck className="size-4 text-[#a0a0b0] mb-2" />
                <div className="text-[12px]">Review existing term</div>
                <div className="text-[10px] text-[#717182] mt-0.5">Audit coverage and improve axioms</div>
              </button>
              <button onClick={() => go("compare")} className="bg-[#13131c] hover:bg-white/[0.02] p-4 text-left">
                <GitCompare className="size-4 text-[#a0a0b0] mb-2" />
                <div className="text-[12px]">Compare terms</div>
                <div className="text-[10px] text-[#717182] mt-0.5">Manual baseline vs assisted</div>
              </button>
            </div>
          </details>

          {/* Footer — the technical truth, only for those who want it.
              The headline never asks the contributor to know any of this. */}
          <div className="mt-12 pt-8 border-t border-[#1a1a26] text-[10.5px] text-[#555] leading-relaxed max-w-[720px]">
            The underlying knowledge base is open and lives at{" "}
            <a href="https://github.com/ontologyportal/sumo" target="_blank" rel="noreferrer" className="text-[#a0a0b0] hover:text-white underline underline-offset-2">github.com/ontologyportal/sumo</a>.
            You don't need to read it to contribute — that's our job.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 2. STEP 1 — NOT FOUND ───────────────────────── */
export function ScreenStep1Empty() {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <StepNavigator current={1} />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="max-w-[820px] mx-auto px-8 py-8">
              <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wider text-blue-400">Step 1 of 7 · Search SUMO</div>
              <h2 className="text-[22px] tracking-tight mb-2">Does this term already exist?</h2>
              <p className="text-[13px] text-[#a0a0b0] mb-6 leading-relaxed">Before authoring a new term, the agent searches Merge.kif, Mid-level-ontology.kif, and loaded domain files. This gate prevents duplicate terms — the most common error in collaborative ontology engineering.</p>

              <AgentBubble why>I'll search the loaded knowledge base for any term matching what you have in mind. Type the term name or a close synonym below.</AgentBubble>

              <div className="mb-4 mt-2">
                <label className="text-[11px] uppercase tracking-wider text-[#717182] mb-2 block">Term name</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#717182]" />
                  <input value="Nocturnal" readOnly className="w-full bg-[#1a1a26] border border-blue-500/40 rounded-lg pl-10 pr-32 py-3.5 text-[15px] focus:outline-none focus:border-blue-500" />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white">Search SUMO</button>
                </div>
                <div className="flex gap-2 mt-2 text-[10px] text-[#717182]">
                  <span>Searching:</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5">Merge.kif</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5">Mid-level-ontology.kif</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5">Animals.kif</span>
                </div>
              </div>

              <div className="my-6 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle className="size-6 text-amber-400" /></div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Result</div>
                    <div className="text-[20px] mb-2">NOT FOUND in loaded ontology</div>
                    <div className="text-[12px] text-[#c0c0c8] leading-relaxed mb-3">No term matching <code className="bg-black/30 px-1 rounded text-amber-300">Nocturnal</code> exists in any loaded .kif file. Three partial matches were found — review them before proceeding.</div>
                    <div className="space-y-1.5">
                      {[
                        { t: "NocturnalActivity", f: "Mid-level-ontology.kif:4421", d: "(subclass NocturnalActivity Process)" },
                        { t: "Night", f: "Merge.kif:8842", d: "Time interval — not a class of organisms" },
                        { t: "DiurnalAnimal", f: "Animals.kif:212", d: "Sibling concept — opposite polarity" },
                      ].map(m => (
                        <div key={m.t} className="flex items-center gap-3 px-3 py-2 bg-black/20 rounded text-[11px] hover:bg-black/30 cursor-pointer">
                          <span className="font-mono text-blue-300">{m.t}</span>
                          <span className="text-[#717182]">{m.f}</span>
                          <span className="text-[#a0a0b0] flex-1 truncate">{m.d}</span>
                          <ExternalLink className="size-3 text-[#717182]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <AgentBubble>None of the partial matches express the dispositional property "active during night." We can proceed to Step 2 to justify creating <code className="bg-black/30 px-1 rounded text-blue-300">Nocturnal</code> as a new term.</AgentBubble>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--border)]">
                <button className="text-[12px] text-[#a0a0b0] hover:text-white">← Refine search</button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white flex items-center gap-2">Proceed to Step 2: Justify <ArrowRight className="size-3.5" /></button>
              </div>
            </div>
          </div>
          <ValidationBar items={[
            { label: "Paren balance", status: "ok" },
            { label: "Style", status: "ok" },
            { label: "Variable scoping", status: "ok" },
            { label: "Term cross-ref", status: "ok" },
            { label: "Bare existential", status: "ok" },
          ]} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 3. STEP 1 — EXISTS ───────────────────────── */
export function ScreenStep1Found() {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Predation" />
      <div className="flex-1 flex overflow-hidden">
        <StepNavigator current={1} />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="max-w-[920px] mx-auto px-8 py-8">
              <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wider text-blue-400">Step 1 of 7 · Search SUMO</div>
              <h2 className="text-[22px] tracking-tight mb-2">Does this term already exist?</h2>

              <div className="my-4 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#717182]" />
                <input value="Predation" readOnly className="w-full bg-[#1a1a26] border border-emerald-500/40 rounded-lg pl-10 pr-4 py-3 text-[14px]" />
              </div>

              <div className="my-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="size-6 text-emerald-400" /></div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">Result</div>
                    <div className="text-[20px] mb-1">EXISTS in Merge.kif</div>
                    <div className="text-[11px] text-[#a0a0b0]">Found at <code className="bg-black/30 px-1 rounded">Merge.kif:14,221</code> — last modified 2024-08-12 by team Sigma Alpha</div>
                  </div>
                  <button className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1">Open in editor <ExternalLink className="size-3" /></button>
                </div>

                <div className="bg-[#0e0e16] border border-[var(--border)] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[#13131c]">
                    <div className="flex items-center gap-2 text-[10px] text-[#717182]"><FileText className="size-3" /> Merge.kif · lines 14221–14238</div>
                    <button className="text-[10px] text-blue-400">Copy</button>
                  </div>
                  <div className="py-2">
                    <KifLine n={14221}><Paren>(</Paren><Pred>subclass</Pred> Predation <Pred>BiologicalProcess</Pred><Paren>)</Paren></KifLine>
                    <KifLine n={14222}><Paren>(</Paren><Pred>documentation</Pred> Predation EnglishLanguage</KifLine>
                    <KifLine n={14223}>{"  "}<Str>"The act of one Organism feeding upon another. The predator must be alive at the start of the process and the prey must be killed."</Str><Paren>)</Paren></KifLine>
                    <KifLine n={14224}><Paren>(</Paren><Pred>=&gt;</Pred></KifLine>
                    <KifLine n={14225} indent={1}><Paren>(</Paren><Pred>instance</Pred> <Var>?P</Var> Predation<Paren>)</Paren></KifLine>
                    <KifLine n={14226} indent={1}><Paren>(</Paren><Pred>exists</Pred> <Paren>(</Paren><Var>?A1</Var> <Var>?A2</Var><Paren>)</Paren></KifLine>
                    <KifLine n={14227} indent={2}><Paren>(</Paren><Pred>and</Pred></KifLine>
                    <KifLine n={14228} indent={3}><Paren>(</Paren><Pred>agent</Pred> <Var>?P</Var> <Var>?A1</Var><Paren>)</Paren></KifLine>
                    <KifLine n={14229} indent={3}><Paren>(</Paren><Pred>patient</Pred> <Var>?P</Var> <Var>?A2</Var><Paren>)</Paren></KifLine>
                    <KifLine n={14230} indent={3}><Paren>(</Paren><Pred>instance</Pred> <Var>?A1</Var> Animal<Paren>)</Paren></KifLine>
                    <KifLine n={14231} indent={3}><Paren>(</Paren><Pred>instance</Pred> <Var>?A2</Var> Organism<Paren>)</Paren><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren></KifLine>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-[#a0a0b0] leading-relaxed">
                  <div className="text-[#c0c0c8] mb-1.5">Hierarchy:</div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-[#717182]">Entity</span><ChevronRight className="size-3" />
                    <span className="text-[#717182]">Physical</span><ChevronRight className="size-3" />
                    <span className="text-[#717182]">Process</span><ChevronRight className="size-3" />
                    <span className="text-[#a0a0b0]">BiologicalProcess</span><ChevronRight className="size-3" />
                    <span className="text-emerald-300">Predation</span>
                  </div>
                </div>
              </div>

              <AgentBubble>This term is already formalized with two ground axioms and a documentation string. Creating a new term would duplicate it. I recommend you use the existing definition.</AgentBubble>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[13px] text-white text-left">
                  <div>Use existing term</div>
                  <div className="text-[10px] text-emerald-100/80 mt-0.5">Recommended — link to Merge.kif:14221</div>
                </button>
                <button className="px-4 py-3 bg-[#1a1a26] border border-[var(--border)] hover:border-[#3a3a4a] rounded-lg text-[13px] text-left">
                  <div>Create distinct term</div>
                  <div className="text-[10px] text-[#717182] mt-0.5">Justify how it differs in Step 2</div>
                </button>
              </div>
            </div>
          </div>
          <ValidationBar items={[
            { label: "Paren balance", status: "ok" },
            { label: "Style", status: "ok" },
            { label: "Variable scoping", status: "ok" },
            { label: "Term cross-ref", status: "ok" },
            { label: "Bare existential", status: "ok" },
          ]} />
        </div>
      </div>
    </div>
  );
}