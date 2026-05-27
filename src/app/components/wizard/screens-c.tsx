import { ArrowRight, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Info, Mic, MicOff, Keyboard, X, Volume2, Play, Pause, Settings as SettingsIcon, ShieldAlert, FileCheck2, RotateCcw } from "lucide-react";
import { TopBar, StepNavigator, ValidationBar, AgentBubble, KifLine, Pred, Var, Str, Paren, PanelHeader } from "./shared";

/* ─────────────────── 6. STEP 7 — REVIEW & APPROVE ─────────────────── */
export function ScreenStep7() {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Nocturnal" />
      <div className="flex-1 flex overflow-hidden">
        <StepNavigator current={7} completed={[1, 2, 3, 4, 5, 6]} />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <PanelHeader icon={FileCheck2} title="Step 7 · Human Review and Approval" subtitle="Read-only KIF block · sign-off finalizes the contribution" right={
              <div className="text-[10px] text-[#a0a0b0]">Session 23 min · 12 decisions · 0 unresolved errors</div>
            } />
            <div className="flex-1 overflow-auto bg-[#0e0e16]">
              <div className="py-3">
                <KifLine n={1}><span className="text-[#666] italic">;; Nocturnal — approved draft · awaiting human sign-off</span></KifLine>
                <KifLine n={2}><Paren>(</Paren><Pred>subclass</Pred> Nocturnal BiologicalAttribute<Paren>)</Paren></KifLine>
                <KifLine n={3}><Paren>(</Paren><Pred>termFormat</Pred> EnglishLanguage Nocturnal <Str>"nocturnal"</Str><Paren>)</Paren></KifLine>
                <KifLine n={4}><Paren>(</Paren><Pred>documentation</Pred> Nocturnal EnglishLanguage</KifLine>
                <KifLine n={5}>{"  "}<Str>"Nocturnal organisms are more active at night than during daylight hours. This dispositional attribute is associated with reduced predation risk in some mammal species. Common examples include bats, owls, and most rodents."</Str><Paren>)</Paren></KifLine>
                <KifLine n={6}> </KifLine>
                <KifLine n={7}><Paren>(</Paren><Pred>increasesLikelihood</Pred></KifLine>
                <KifLine n={8} indent={1}><Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?X</Var> Organism<Paren>)</Paren></KifLine>
                <KifLine n={9} indent={2}><Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren><Paren>)</Paren></KifLine>
                <KifLine n={10} indent={1}><Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>holdsDuring</Pred> <Var>?T</Var> Night<Paren>)</Paren></KifLine>
                <KifLine n={11} indent={2}><Paren>(</Paren><Pred>active</Pred> <Var>?X</Var> <Var>?T</Var><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren></KifLine>
                <KifLine n={12}><Paren>(</Paren><Pred>=&gt;</Pred></KifLine>
                <KifLine n={13} indent={1}><Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren></KifLine>
                <KifLine n={14} indent={1}><Paren>(</Paren><Pred>exists</Pred> <Paren>(</Paren><Var>?Y</Var><Paren>)</Paren> <Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>predationRate</Pred> <Var>?X</Var> <Var>?Y</Var><Paren>)</Paren> <Paren>(</Paren><Pred>lessThan</Pred> <Var>?Y</Var> AverageRate<Paren>)</Paren><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren></KifLine>
                <KifLine n={15}> </KifLine>
                <KifLine n={16}><Paren>(</Paren><Pred>attribute</Pred> Bat-1 Nocturnal<Paren>)</Paren></KifLine>
                <KifLine n={17}><Paren>(</Paren><Pred>attribute</Pred> Owl-1 Nocturnal<Paren>)</Paren></KifLine>
                <KifLine n={18}><Paren>(</Paren><Pred>attribute</Pred> Rodent-1 Nocturnal<Paren>)</Paren></KifLine>
              </div>
            </div>
          </div>

          <div className="w-[400px] border-l border-[var(--border)] bg-[#181826] flex flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-2">Coverage summary</div>
              <div className="flex items-end gap-2">
                <div className="text-[28px] tracking-tight text-emerald-400">4 / 4</div>
                <div className="text-[11px] text-[#a0a0b0] mb-1.5">doc-string claims covered</div>
              </div>
              <div className="h-1.5 bg-[#222232] rounded-full overflow-hidden mt-2"><div className="h-full bg-emerald-500" style={{ width: "100%" }} /></div>
            </div>

            <div className="px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2"><ShieldAlert className="size-3.5 text-amber-400" /><div className="text-[11px] uppercase tracking-wider text-amber-400">Modeling risks · 2</div></div>
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/20">
                  <div className="text-[11px] text-[#d0d0d8] mb-1">Absolute {"=>"} for dispositional property</div>
                  <div className="text-[10px] text-[#a0a0b0] leading-relaxed">Line 12 uses material implication for a probabilistic claim. Verify this is the intended strength.</div>
                </div>
                <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/20">
                  <div className="text-[11px] text-[#d0d0d8] mb-1">Bound variable ?T re-used across rules</div>
                  <div className="text-[10px] text-[#a0a0b0] leading-relaxed">Line 8 and line 10 both bind ?T. Scoping is correct but may confuse readers.</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-[var(--border)] flex-1 overflow-auto">
              <div className="text-[11px] uppercase tracking-wider text-[#717182] mb-2.5">Decision points · 1 of 2 resolved</div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#1a1a26] border border-emerald-500/30">
                  <div className="flex items-center gap-1.5 mb-2"><CheckCircle2 className="size-3.5 text-emerald-400" /><div className="text-[12px]">Parent placement confirmed</div></div>
                  <div className="text-[10px] text-[#a0a0b0]">BiologicalAttribute · approved at Step 4</div>
                </div>
                <div className="p-3 rounded-lg bg-[#1a1a26] border border-blue-500/40">
                  <div className="text-[12px] mb-1.5">increasesLikelihood usage verification</div>
                  <div className="text-[10px] text-[#a0a0b0] mb-3 leading-relaxed">The relation increasesLikelihood was used 4 times this session. Before committing, verify at least one usage manually.</div>
                  <label className="flex items-start gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                    <input type="radio" name="ver" className="mt-0.5 accent-blue-500" />
                    <div>
                      <div className="text-[11px]">I have verified — proceed</div>
                      <div className="text-[10px] text-[#717182]">Confirms manual review of one usage</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                    <input type="radio" name="ver" className="mt-0.5 accent-blue-500" defaultChecked />
                    <div>
                      <div className="text-[11px]">Show me a proof conjecture to test one usage</div>
                      <div className="text-[10px] text-[#717182]">Routes to the prover after approval</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-3 space-y-2 border-t border-[var(--border)]">
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 rounded-lg text-[13px] text-white flex items-center justify-center gap-2"><CheckCircle2 className="size-4" /> Approve and commit to draft</button>
              <button className="w-full py-2 bg-[#222232] hover:bg-[#2a2a3a] rounded-lg text-[12px] flex items-center justify-center gap-2"><RotateCcw className="size-3.5" /> Revise — return to Step 5</button>
              <div className="text-[10px] text-[#717182] text-center mt-1">Approval is a formal commitment to the knowledge base.</div>
            </div>
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
  );
}

/* ─────────────────────── 7. VOICE MODE ACTIVE ─────────────────────── */
export function ScreenVoiceActive() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-[#e0e0e8] relative overflow-hidden">
      {/* Dimmed background workspace */}
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
        <TopBar voiceActive />
        <div className="flex-1 flex">
          <StepNavigator current={3} completed={[1, 2]} />
          <div className="flex-1 bg-[#13131c] p-8">
            <div className="h-full bg-[#1a1a26] rounded-lg border border-[var(--border)]" />
          </div>
        </div>
      </div>

      {/* Voice overlay */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="h-12 border-b border-blue-500/30 bg-[#0a0a14]/90 backdrop-blur flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] text-emerald-400 uppercase tracking-wider">Voice Mode · Listening</span>
            <span className="mx-2 text-[#444]">|</span>
            <span className="text-[12px] text-blue-400">Step 3: Classify</span>
            <span className="text-[11px] text-[#717182]">· Term: Nocturnal</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded bg-[#1a1a26] border border-[var(--border)] text-[11px] flex items-center gap-1.5"><Volume2 className="size-3" /> Aria · 1.0×</button>
            <button className="size-8 rounded bg-[#1a1a26] border border-[var(--border)] flex items-center justify-center"><MicOff className="size-3.5" /></button>
            <button className="size-8 rounded bg-[#1a1a26] border border-[var(--border)] flex items-center justify-center"><SettingsIcon className="size-3.5" /></button>
            <button className="px-3 py-1.5 rounded bg-[#1a1a26] border border-[var(--border)] hover:bg-[#222232] text-[11px] flex items-center gap-1.5"><Keyboard className="size-3" /> Switch to text</button>
            <button className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-1.5"><X className="size-3" /> End voice session</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative">
          {/* Annotation strip - state machine */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-center gap-2 text-[10px]">
            {[
              { l: "LISTENING", active: true, on: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" },
              { l: "PROCESSING", active: false, on: "bg-amber-500/20 text-amber-400 border border-amber-500/40" },
              { l: "SPEAKING", active: false, on: "bg-blue-500/20 text-blue-400 border border-blue-500/40" },
              { l: "LISTENING", active: false, on: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`px-2 py-0.5 rounded uppercase tracking-wider ${s.active ? s.on : "bg-[#1a1a26] text-[#555] border border-[var(--border)]"}`}>{s.l}</div>
                {i < 3 && <ArrowRight className="size-3 text-[#444]" />}
              </div>
            ))}
            <span className="ml-3 text-[10px] text-[#666]">↻ state machine cycles per turn</span>
          </div>

          {/* Orb */}
          <div className="relative mb-10">
            <div className="absolute inset-0 size-56 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
            <div className="relative size-56 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-700 flex items-center justify-center" style={{ animation: "breathe 3s ease-in-out infinite" }}>
              <div className="size-44 rounded-full bg-gradient-to-br from-blue-400/40 to-purple-400/40 flex items-center justify-center backdrop-blur">
                <div className="flex items-end gap-1 h-12">
                  {[18, 36, 24, 44, 30, 48, 26, 38, 20, 34, 28].map((h, i) => (
                    <div key={i} className="w-1 bg-white rounded-full" style={{ height: h, animation: `wave 1.2s ease-in-out infinite ${i * 0.08}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[680px] space-y-4">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-blue-400 mb-2">Ontology Wizard says</div>
              <div className="text-[18px] leading-relaxed text-white">"For the term <span className="text-blue-300">Nocturnal</span>, do you mean a property assignable to organisms — like an attribute — or do you mean a class of organisms that are nocturnal?"</div>
            </div>

            <div className="text-center pt-4 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 mb-2 flex items-center justify-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> You · transcribing
              </div>
              <div className="text-[16px] text-[#e0e0e8] leading-relaxed">"It's an attribute — organisms <span className="bg-emerald-500/10 px-1 rounded">have</span> the property of being nocturnal, they aren't <span className="opacity-50">a separate</span><span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 animate-pulse align-middle" /></div>
              <div className="text-[10px] text-[#717182] mt-2">Pause for 1.2s to commit · or say "scratch that" to redo</div>
            </div>
          </div>

          {/* Limitations panel */}
          <div className="absolute bottom-6 left-6 right-6 max-w-[520px] mx-auto px-4 py-3 rounded-lg bg-[#1a1a26]/90 border border-[var(--border)] backdrop-blur flex items-start gap-3">
            <Info className="size-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-[11px]">
              <div className="text-[#d0d0d8] mb-1">Unavailable in Voice Mode</div>
              <div className="text-[10px] text-[#a0a0b0] flex flex-wrap gap-x-3 gap-y-0.5">
                <span>· File upload</span><span>· Proof execution</span><span>· Diagram generation</span><span>· KIF export</span>
              </div>
              <div className="text-[10px] text-blue-400 mt-1.5">Switch to text mode to access these features →</div>
            </div>
            <button className="text-[#717182] hover:text-white"><X className="size-3.5" /></button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes wave { 0%,100%{transform:scaleY(.4)} 50%{transform:scaleY(1)} }
      `}</style>
    </div>
  );
}

/* ─────────────────────── 8. VOICE MODE ENTRY ─────────────────────── */
export function ScreenVoiceEntry() {
  const voices = [
    { n: "Aria", desc: "Warm, deliberate. Recommended for long sessions.", tag: "Default", a: true },
    { n: "Sage", desc: "Crisp, professorial. Faster cadence.", tag: "Pedagogical" },
    { n: "Nova", desc: "Neutral, low-affect. Minimal inflection.", tag: "Expert mode" },
    { n: "Ember", desc: "Conversational, slightly informal.", tag: "Friendly" },
  ];
  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-[#e0e0e8]">
      <TopBar voiceActive />
      <div className="flex-1 flex items-center justify-center px-8 py-10 overflow-auto">
        <div className="max-w-[760px] w-full">
          <div className="text-center mb-10">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4"><Mic className="size-7 text-white" /></div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-2">Voice Mode · First-time setup</div>
            <h2 className="text-[26px] tracking-tight mb-2">Choose a wizard voice</h2>
            <p className="text-[13px] text-[#a0a0b0] max-w-[480px] mx-auto leading-relaxed">The same 7-step Socratic protocol runs in voice. The wizard asks questions aloud; you answer by speaking. You can switch back to text at any time without losing session state.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {voices.map(v => (
              <div key={v.n} role="button" tabIndex={0} className={`text-left rounded-xl border p-4 transition relative cursor-pointer ${v.a ? "border-blue-500/60 bg-blue-500/[0.06]" : "border-[var(--border)] bg-[#1a1a26] hover:border-[#3a3a4a]"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[13px] text-white">{v.n[0]}</div>
                    <div>
                      <div className="text-[14px]">{v.n}</div>
                      <div className="text-[10px] text-[#717182]">{v.tag}</div>
                    </div>
                  </div>
                  <button className={`size-8 rounded-full flex items-center justify-center ${v.a ? "bg-blue-500 text-white" : "bg-[#222232] text-[#a0a0b0]"}`}><Play className="size-3.5" /></button>
                </div>
                <div className="text-[12px] text-[#a0a0b0] leading-relaxed mb-3">{v.desc}</div>
                <div className="flex items-end gap-0.5 h-5">
                  {[6, 10, 14, 8, 16, 12, 18, 10, 14, 8, 12, 16, 10, 6].map((h, i) => <div key={i} className={`w-0.5 rounded-full ${v.a ? "bg-blue-400" : "bg-[#444]"}`} style={{ height: h }} />)}
                </div>
                {v.a && <div className="absolute top-3 right-14 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Selected</div>}
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[#1a1a26] border border-[var(--border)] p-4 mb-5">
            <div className="text-[11px] uppercase tracking-wider text-[#717182] mb-2.5">Voice options</div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div className="flex items-center justify-between"><span className="text-[#a0a0b0]">Playback speed</span><span>1.0×</span></div>
              <div className="flex items-center justify-between"><span className="text-[#a0a0b0]">Confirm-before-commit</span><span className="text-emerald-400">on</span></div>
              <div className="flex items-center justify-between"><span className="text-[#a0a0b0]">Transcript retention</span><span>30 days</span></div>
              <div className="flex items-center justify-between"><span className="text-[#a0a0b0]">Audio retained</span><span className="text-red-400">never</span></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-[12px] text-[#a0a0b0] hover:text-white">← Cancel</button>
            <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white flex items-center gap-2"><Mic className="size-3.5" /> Start voice session</button>
          </div>
        </div>
      </div>
    </div>
  );
}
