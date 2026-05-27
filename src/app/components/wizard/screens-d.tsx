import { ArrowRight, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Info, FileText, GitCompare, History, Search, Filter, Calendar, Download, FlaskConical, Wand2, Target, Sparkles } from "lucide-react";
import { TopBar, AgentBubble, KifLine, Pred, Var, Str, Paren, PanelHeader } from "./shared";

/* ─────────────── 9. PROOF SUBMISSION & RESULT (SUCCESS) ─────────────── */
export function ScreenProofSuccess() {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Nocturnal" />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[440px] border-r border-[var(--border)] bg-[#181826] flex flex-col flex-shrink-0">
          <PanelHeader icon={FlaskConical} title="Proof submission · Tell / Ask" subtitle="Verify one usage of increasesLikelihood" />
          <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2"><div className="text-[10px] uppercase tracking-wider text-[#717182]">Background facts (Tell)</div><button className="text-[10px] text-blue-400">Auto-fill from session</button></div>
              <div className="bg-[#0e0e16] border border-[var(--border)] rounded-lg py-2">
                <KifLine n={1}><Paren>(</Paren><Pred>instance</Pred> Bat-1 Mammal<Paren>)</Paren></KifLine>
                <KifLine n={2}><Paren>(</Paren><Pred>subclass</Pred> Mammal Organism<Paren>)</Paren></KifLine>
                <KifLine n={3}><Paren>(</Paren><Pred>attribute</Pred> Bat-1 Nocturnal<Paren>)</Paren></KifLine>
                <KifLine n={4}><Paren>(</Paren><Pred>holdsDuring</Pred> T1 Night<Paren>)</Paren></KifLine>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-2">Conjecture (Ask)</div>
              <div className="bg-[#0e0e16] border border-blue-500/30 rounded-lg py-2">
                <KifLine n={1}><Paren>(</Paren><Pred>active</Pred> Bat-1 T1<Paren>)</Paren></KifLine>
              </div>
              <div className="text-[10px] text-[#717182] mt-1.5">Agent-generated · approved by you</div>
            </div>
            <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white flex items-center justify-center gap-2"><Target className="size-3.5" /> Submit to Vampire prover</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <PanelHeader title="Result · PROOF FOUND" right={<span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">7 steps · 318ms</span>} />
          <div className="flex-1 overflow-auto p-5">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="size-6 text-emerald-400" /></div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">Verification result</div>
                  <div className="text-[18px] mb-1">Conjecture is provable from background facts</div>
                  <div className="text-[12px] text-[#a0a0b0] leading-relaxed">The increasesLikelihood axiom on Nocturnal entails that Bat-1, attributed Nocturnal and observed during Night, is active. One manual usage verified.</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-[#717182] mb-2">Proof steps · color-coded by inference type</div>
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              {[
                { n: 1, type: "Premise", c: "bg-blue-500/10 text-blue-300", t: "(instance Bat-1 Mammal)" },
                { n: 2, type: "Premise", c: "bg-blue-500/10 text-blue-300", t: "(subclass Mammal Organism)" },
                { n: 3, type: "Subclass", c: "bg-purple-500/10 text-purple-300", t: "(instance Bat-1 Organism)  [from 1, 2]" },
                { n: 4, type: "Premise", c: "bg-blue-500/10 text-blue-300", t: "(attribute Bat-1 Nocturnal)" },
                { n: 5, type: "Definition", c: "bg-amber-500/10 text-amber-300", t: "(increasesLikelihood (and ?X Org…) (active ?X ?T))" },
                { n: 6, type: "Modus Ponens", c: "bg-emerald-500/10 text-emerald-300", t: "Likelihood-increase applied with ?X=Bat-1, ?T=T1" },
                { n: 7, type: "Conclusion", c: "bg-emerald-500/10 text-emerald-300", t: "(active Bat-1 T1) ✓" },
              ].map((p, i) => (
                <div key={p.n} className={`flex items-center gap-3 px-3 py-2 text-[12px] ${i > 0 ? "border-t border-[var(--border)]" : ""}`}>
                  <span className="text-[11px] text-[#555] w-5 text-right">{p.n}</span>
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${p.c}`}>{p.type}</span>
                  <span className="font-mono text-[11px] text-[#d0d0d8] flex-1">{p.t}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[13px] text-white text-left">
                <div>Accept proof · finalize approval</div>
                <div className="text-[10px] text-emerald-100/80 mt-0.5">Returns to Step 7 with verification recorded</div>
              </button>
              <button className="px-4 py-3 bg-[#1a1a26] border border-[var(--border)] hover:border-[#3a3a4a] rounded-lg text-[13px] text-left">
                <div>Test another conjecture</div>
                <div className="text-[10px] text-[#717182] mt-0.5">Stay on prover screen</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── 10. PROOF FAIL + DEBUG ─────────────── */
export function ScreenProofFail() {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Nocturnal" />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[440px] border-r border-[var(--border)] bg-[#181826] flex flex-col flex-shrink-0">
          <PanelHeader icon={FlaskConical} title="Proof submission · Tell / Ask" />
          <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-2">Background facts (Tell)</div>
              <div className="bg-[#0e0e16] border border-[var(--border)] rounded-lg py-2">
                <KifLine n={1}><Paren>(</Paren><Pred>instance</Pred> Owl-1 Bird<Paren>)</Paren></KifLine>
                <KifLine n={2}><Paren>(</Paren><Pred>attribute</Pred> Owl-1 Nocturnal<Paren>)</Paren></KifLine>
                <KifLine n={3}><Paren>(</Paren><Pred>holdsDuring</Pred> T2 Night<Paren>)</Paren></KifLine>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-2">Conjecture</div>
              <div className="bg-[#0e0e16] border border-red-500/30 rounded-lg py-2">
                <KifLine n={1}><Paren>(</Paren><Pred>active</Pred> Owl-1 T2<Paren>)</Paren></KifLine>
              </div>
            </div>
            <button className="w-full py-2.5 bg-[#222232] rounded-md text-[12px] flex items-center justify-center gap-2"><Target className="size-3.5" /> Re-submit with fix</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <PanelHeader title="Result · PROOF NOT FOUND" right={<span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">Saturated · 4.2s</span>} />
          <div className="flex-1 overflow-auto p-5">
            <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0"><XCircle className="size-6 text-red-400" /></div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-red-400 mb-1">Verification result</div>
                  <div className="text-[18px] mb-1">The conjecture cannot be derived from current facts</div>
                  <div className="text-[12px] text-[#a0a0b0] leading-relaxed">Specifically, the prover could not satisfy the antecedent <code className="bg-black/30 px-1 rounded">(instance ?X Organism)</code>. The fact <code className="bg-black/30 px-1 rounded">(instance Owl-1 Bird)</code> is asserted, but no axiom links Bird to Organism in the loaded knowledge base.</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-[#717182] mb-2">Missing step identified</div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.04] p-4 mb-5">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="size-4 text-amber-400" /><div className="text-[12px]">The proof needs: <code className="bg-black/30 px-1 rounded font-mono text-amber-300">(subclass Bird Organism)</code> or equivalent</div></div>
              <div className="text-[11px] text-[#a0a0b0] leading-relaxed pl-6">This subclass relation should already exist in Merge.kif but is not in the currently-loaded knowledge subset. The prover treats Bird and Organism as unrelated.</div>
            </div>

            <AgentBubble>
              <div className="flex items-center gap-2 mb-2 text-[12px] text-blue-300"><Wand2 className="size-3.5" /> Debugging suggestion · 1 of 1</div>
              <div className="text-[12.5px] mb-2">Try adding this ground fact to your background:</div>
              <div className="bg-black/40 px-3 py-2 rounded font-mono text-[12px] text-blue-300 mb-3">(subclass Bird Organism)</div>
              <div className="text-[11px] text-[#a0a0b0] leading-relaxed">Once added, the chain Owl-1 → Bird → Organism completes, and the increasesLikelihood antecedent will satisfy. I can fix one issue at a time and re-run automatically.</div>
            </AgentBubble>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <button className="px-3 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white">Apply fix &amp; re-run</button>
              <button className="px-3 py-2.5 bg-[#1a1a26] border border-[var(--border)] rounded-md text-[12px]">Edit conjecture</button>
              <button className="px-3 py-2.5 bg-[#1a1a26] border border-[var(--border)] rounded-md text-[12px]">Return to Step 7</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── 11. ERROR / VALIDATION FEEDBACK ─────────────── */
export function ScreenError() {
  const errs = [
    { sev: "error", file: "Merge.kif", line: 14238, type: "Bare existential", msg: "Quantifier (exists ?Z) introduced with no binding occurrence — variable is not used in body.", fix: "Remove unused (exists ?Z) wrapper or add a constraint that uses ?Z." , wizard: true},
    { sev: "error", file: "draft.kif", line: 14, type: "Variable scoping", msg: "?Y appears in consequent but is not bound in antecedent. Will fail under universal closure.", fix: "Wrap ?Y in (exists (?Y) ...) inside the consequent.", wizard: true },
    { sev: "warn", file: "draft.kif", line: 7, type: "Style", msg: "Predicate 'increasesLikelihood' used 4 times in this term — typically indicates over-reliance on probabilistic claims.", fix: "Convert at least one usage to a deterministic => rule, or verify with a proof.", wizard: false },
    { sev: "warn", file: "Animals.kif", line: 212, type: "Term cross-ref", msg: "Cross-file reference to DiurnalAnimal — disjointness with Nocturnal is not formally asserted.", fix: "Add (disjoint Nocturnal Diurnal) to draft.kif.", wizard: true },
    { sev: "info", file: "draft.kif", line: 5, type: "Doc-string", msg: "Doc-string lacks an authoritative citation. Recommended for empirical claims.", fix: "Add (citation Nocturnal …) clause.", wizard: false },
  ];
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Nocturnal" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1100px] mx-auto px-8 py-7">
          <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wider text-red-400"><AlertTriangle className="size-3" /> Validation feedback · 2 errors · 2 warnings · 1 info</div>
          <h2 className="text-[22px] tracking-tight mb-2">5 issues found while loading draft.kif</h2>
          <p className="text-[13px] text-[#a0a0b0] mb-5 leading-relaxed">All errors must be resolved before the term can advance to Step 7. Issues marked <span className="text-blue-400">"Fix with wizard"</span> can be corrected step-by-step with agent guidance.</p>

          <div className="flex items-center gap-2 mb-3">
            <button className="px-3 py-1.5 rounded bg-blue-500 text-white text-[11px]">All (5)</button>
            <button className="px-3 py-1.5 rounded bg-[#1a1a26] border border-[var(--border)] text-[11px]">Errors (2)</button>
            <button className="px-3 py-1.5 rounded bg-[#1a1a26] border border-[var(--border)] text-[11px]">Warnings (2)</button>
            <button className="px-3 py-1.5 rounded bg-[#1a1a26] border border-[var(--border)] text-[11px]">Info (1)</button>
            <div className="ml-auto flex items-center gap-2"><Filter className="size-3.5 text-[#717182]" /><select className="bg-[#1a1a26] border border-[var(--border)] rounded px-2 py-1 text-[11px]"><option>By severity</option></select></div>
          </div>

          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            {errs.map((e, i) => {
              const cls = e.sev === "error" ? { ic: "text-red-400", pill: "bg-red-500/10 text-red-300 border-red-500/20" } : e.sev === "warn" ? { ic: "text-amber-400", pill: "bg-amber-500/10 text-amber-300 border-amber-500/20" } : { ic: "text-blue-400", pill: "bg-blue-500/10 text-blue-300 border-blue-500/20" };
              const Icon = e.sev === "error" ? XCircle : e.sev === "warn" ? AlertTriangle : Info;
              return (
                <div key={i} className={`px-4 py-3.5 ${i > 0 ? "border-t border-[var(--border)]" : ""} hover:bg-white/[0.02]`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`size-4 ${cls.ic} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${cls.pill}`}>{e.sev}</span>
                        <span className="text-[12px]">{e.type}</span>
                        <span className="text-[10px] text-[#717182]">{e.file}:{e.line}</span>
                      </div>
                      <div className="text-[12px] text-[#d0d0d8] mb-1.5 leading-relaxed">{e.msg}</div>
                      <div className="text-[11px] text-[#a0a0b0] leading-relaxed flex items-start gap-1.5"><span className="text-[#717182]">Suggested fix:</span> <span>{e.fix}</span></div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {e.wizard && <button className="text-[10px] px-2.5 py-1 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 flex items-center gap-1"><Wand2 className="size-3" /> Fix with wizard</button>}
                      <button className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#a0a0b0]">View source</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-5 p-4 rounded-lg bg-[#1a1a26] border border-[var(--border)]">
            <div className="text-[12px] text-[#a0a0b0]">2 errors block advancement to Step 7. Fix them or revert to last validated draft.</div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded bg-[#222232] text-[12px]">Revert to validated</button>
              <button className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-[12px] text-white flex items-center gap-1.5"><Wand2 className="size-3.5" /> Walk through fixes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
