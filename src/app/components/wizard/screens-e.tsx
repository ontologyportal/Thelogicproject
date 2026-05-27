import { Search, Filter, Download, Calendar, ChevronRight, GitCompare, History, BookOpen, Mic, Volume2, Bell, Database, ShieldCheck, FileCode, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { TopBar, AgentBubble, KifLine, Pred, Var, Str, Paren, PanelHeader } from "./shared";

/* ─────────────── 12. SESSION HISTORY / PORTFOLIO ─────────────── */
export function ScreenHistory() {
  const terms = [
    { t: "Communication", d: "Objects", s: "Approved", c: 12, cov: "8/8", p: "✓", date: "Apr 14", status: "ok" },
    { t: "PhishingAttempt", d: "Cyber", s: "Approved", c: 8, cov: "6/6", p: "✓", date: "Apr 12", status: "ok" },
    { t: "MilitaryConvoy", d: "Defense", s: "Approved", c: 10, cov: "5/5", p: "✓", date: "Apr 09", status: "ok" },
    { t: "Nocturnal", d: "Animals", s: "Step 6", c: 5, cov: "3/4", p: "—", date: "today", status: "draft" },
    { t: "Predation", d: "Animals", s: "Failed proof", c: 6, cov: "4/4", p: "✗", date: "Apr 22", status: "fail" },
    { t: "LegalContract", d: "Law", s: "Step 2", c: 0, cov: "—", p: "—", date: "Apr 27", status: "draft" },
    { t: "DataBreach", d: "Cyber", s: "Approved", c: 14, cov: "9/9", p: "✓", date: "Apr 03", status: "ok" },
    { t: "Symbiosis", d: "Animals", s: "Approved", c: 7, cov: "5/5", p: "✓", date: "Mar 29", status: "ok" },
  ];
  const stat = (s: string) => s === "ok" ? "text-emerald-400" : s === "fail" ? "text-red-400" : "text-amber-400";
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Portfolio" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1280px] mx-auto px-8 py-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-blue-400 mb-1">Session History</div>
              <h2 className="text-[22px] tracking-tight">23 terms · 14 approved · 6 drafts · 3 with proof failures</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded bg-[#1a1a26] border border-[var(--border)] text-[11px] flex items-center gap-1.5"><GitCompare className="size-3" /> Compare</button>
              <button className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-[11px] flex items-center gap-1.5"><Download className="size-3" /> Export .kif</button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { l: "Total approved", v: "14", sub: "of 23 worked" },
              { l: "Avg coverage", v: "94%", sub: "claims axiomatized" },
              { l: "Proof success", v: "11 / 14", sub: "verified mechanically" },
              { l: "Avg session", v: "18 min", sub: "Step 1 → Step 7" },
            ].map(s => (
              <div key={s.l} className="rounded-lg bg-[#1a1a26] border border-[var(--border)] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1">{s.l}</div>
                <div className="text-[22px] tracking-tight">{s.v}</div>
                <div className="text-[10px] text-[#717182] mt-1">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1 max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#717182]" />
              <input placeholder="Search terms…" className="w-full bg-[#1a1a26] border border-[var(--border)] rounded pl-9 pr-3 py-2 text-[12px]" />
            </div>
            <select className="bg-[#1a1a26] border border-[var(--border)] rounded px-2 py-2 text-[11px]"><option>Domain: All</option><option>Animals</option><option>Cyber</option><option>Law</option><option>Defense</option><option>Objects</option></select>
            <select className="bg-[#1a1a26] border border-[var(--border)] rounded px-2 py-2 text-[11px]"><option>Status: All</option><option>Approved</option><option>Draft</option><option>Failed proof</option></select>
            <button className="px-2 py-2 rounded bg-[#1a1a26] border border-[var(--border)] flex items-center gap-1.5 text-[11px]"><Calendar className="size-3" /> Last 30d</button>
          </div>

          <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[#181826]">
            <div className="grid grid-cols-[1.5fr_1fr_1.2fr_80px_100px_60px_80px_30px] px-4 py-2.5 border-b border-[var(--border)] text-[10px] uppercase tracking-wider text-[#717182]">
              <div>Term</div><div>Domain</div><div>Status</div><div>Axioms</div><div>Coverage</div><div>Proof</div><div>Date</div><div></div>
            </div>
            {terms.map((t, i) => (
              <div key={t.t} className={`grid grid-cols-[1.5fr_1fr_1.2fr_80px_100px_60px_80px_30px] px-4 py-3 items-center hover:bg-white/[0.02] cursor-pointer ${i > 0 ? "border-t border-[var(--border)]" : ""}`}>
                <div className="flex items-center gap-2.5"><div className="size-7 rounded bg-[#222232] flex items-center justify-center text-[10px]">{t.t.slice(0,2).toUpperCase()}</div><span className="text-[12px]">{t.t}</span></div>
                <div className="text-[11px] text-[#a0a0b0]">{t.d}</div>
                <div className={`text-[11px] ${stat(t.status)}`}>{t.s}</div>
                <div className="text-[11px] text-[#a0a0b0]">{t.c}</div>
                <div className="text-[11px] text-[#a0a0b0]">{t.cov}</div>
                <div className={`text-[12px] ${t.p === "✓" ? "text-emerald-400" : t.p === "✗" ? "text-red-400" : "text-[#555]"}`}>{t.p}</div>
                <div className="text-[10px] text-[#717182]">{t.date}</div>
                <ChevronRight className="size-3.5 text-[#555]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── 13. TERM COMPARISON ─────────────── */
export function ScreenCompare() {
  const palette: any = { emerald: { bg: "bg-emerald-500/10", label: "text-emerald-400", h: "text-emerald-300" }, blue: { bg: "bg-blue-500/10", label: "text-blue-400", h: "text-blue-300" } };
  const Side = ({ title, label, color, lines, metrics }: any) => {
    const p = palette[color];
    return (
    <div className="flex-1 flex flex-col border border-[var(--border)] rounded-xl overflow-hidden bg-[#181826]">
      <div className={`px-4 py-3 border-b border-[var(--border)] ${p.bg}`}>
        <div className={`text-[10px] uppercase tracking-wider ${p.label} mb-0.5`}>{label}</div>
        <div className="text-[14px]">{title}</div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
        {metrics.map((m: any) => (
          <div key={m.l} className="bg-[#181826] p-2.5">
            <div className="text-[9px] uppercase tracking-wider text-[#717182]">{m.l}</div>
            <div className={`text-[14px] mt-0.5 ${m.h ? p.h : ""}`}>{m.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#0e0e16] flex-1 overflow-auto py-2">
        {lines.map((l: any, i: number) => (
          <KifLine key={i} n={i + 1}>{l}</KifLine>
        ))}
      </div>
    </div>
    );
  };
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Compare" />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-8 py-5 border-b border-[var(--border)]">
          <div className="text-[11px] uppercase tracking-wider text-blue-400 mb-1">Term Comparison</div>
          <h2 className="text-[20px] tracking-tight mb-1">Manual baseline vs LLM-iterated authoring</h2>
          <p className="text-[12px] text-[#a0a0b0]">Side-by-side benchmarking. The wizard generated the right column with Socratic guidance; the left was hand-authored by a senior ontologist for Merge.kif.</p>
          <div className="flex items-center gap-3 mt-3 text-[11px]">
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400" /> Communication (Objects)</div>
            <span className="text-[#717182]">vs</span>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-400" /> Nocturnal (Animals)</div>
            <button className="ml-auto text-[11px] text-blue-400">Choose terms…</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 flex gap-4">
          <Side
            title="Communication"
            label="Manual baseline · Merge.kif"
            color="emerald"
            metrics={[
              { l: "Hierarchy depth", v: "5 from Entity" },
              { l: "Direct axioms", v: "9", h: true },
              { l: "Doc claims covered", v: "8 / 8" },
              { l: "Inference patterns", v: "4 distinct" },
              { l: "Cross-file proof", v: "Yes ✓" },
              { l: "First-pass correct", v: "Yes (expert)" },
            ]}
            lines={[
              <><Paren>(</Paren><Pred>subclass</Pred> Communication ContentBearingProcess<Paren>)</Paren></>,
              <><Paren>(</Paren><Pred>documentation</Pred> Communication EnglishLanguage</>,
              <>{"  "}<Str>"A Process by which one Agent transmits..."</Str><Paren>)</Paren></>,
              <><Paren>(</Paren><Pred>=&gt;</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?C</Var> Communication<Paren>)</Paren></>,
              <>{"  "}<Paren>(</Paren><Pred>exists</Pred> <Paren>(</Paren><Var>?A1</Var> <Var>?A2</Var> <Var>?M</Var><Paren>)</Paren></>,
              <>{"    "}<Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>agent</Pred> <Var>?C</Var> <Var>?A1</Var><Paren>)</Paren></>,
              <>{"      "}<Paren>(</Paren><Pred>destination</Pred> <Var>?C</Var> <Var>?A2</Var><Paren>)</Paren></>,
              <>{"      "}<Paren>(</Paren><Pred>patient</Pred> <Var>?C</Var> <Var>?M</Var><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren><Paren>)</Paren></>,
              <><Paren>(</Paren><Pred>partition</Pred> Communication LinguisticCommunication NonLinguisticCommunication<Paren>)</Paren></>,
            ]}
          />
          <Side
            title="Nocturnal"
            label="LLM-iterated · draft.kif"
            color="blue"
            metrics={[
              { l: "Hierarchy depth", v: "4 from Entity" },
              { l: "Direct axioms", v: "5" },
              { l: "Doc claims covered", v: "4 / 4", h: true },
              { l: "Inference patterns", v: "2 distinct" },
              { l: "Cross-file proof", v: "Yes ✓" },
              { l: "First-pass correct", v: "Corrected (Socratic)", h: true },
            ]}
            lines={[
              <><Paren>(</Paren><Pred>subclass</Pred> Nocturnal BiologicalAttribute<Paren>)</Paren></>,
              <><Paren>(</Paren><Pred>documentation</Pred> Nocturnal EnglishLanguage</>,
              <>{"  "}<Str>"Nocturnal organisms are more active at night..."</Str><Paren>)</Paren></>,
              <><Paren>(</Paren><Pred>increasesLikelihood</Pred></>,
              <>{"  "}<Paren>(</Paren><Pred>and</Pred> <Paren>(</Paren><Pred>instance</Pred> <Var>?X</Var> Organism<Paren>)</Paren></>,
              <>{"    "}<Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren><Paren>)</Paren></>,
              <>{"  "}<Paren>(</Paren><Pred>active</Pred> <Var>?X</Var> Night<Paren>)</Paren><Paren>)</Paren></>,
              <><Paren>(</Paren><Pred>=&gt;</Pred> <Paren>(</Paren><Pred>attribute</Pred> <Var>?X</Var> Nocturnal<Paren>)</Paren></>,
              <>{"  "}<Paren>(</Paren><Pred>exists</Pred> <Paren>(</Paren><Var>?Y</Var><Paren>)</Paren> ...<Paren>)</Paren><Paren>)</Paren></>,
            ]}
          />
        </div>

        <div className="px-8 py-4 border-t border-[var(--border)] bg-[#181826]">
          <div className="grid grid-cols-3 gap-4 text-[11px]">
            <div><div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1">Quality delta</div><div className="text-[#d0d0d8]">LLM-iterated reaches 100% coverage with fewer axioms but lower inference diversity.</div></div>
            <div><div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1">Pedagogical note</div><div className="text-[#d0d0d8]">Socratic correction at Step 4 reclassified from "Class of Animal" to attribute — primary teaching moment.</div></div>
            <div><div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1">Recommended next</div><div className="text-blue-400">Add a partitioning axiom (Nocturnal/Diurnal/Crepuscular) to match Communication's structural depth.</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── 14. SETTINGS ─────────────── */
export function ScreenSettings() {
  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="rounded-xl border border-[var(--border)] bg-[#181826] mb-4 overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-2"><Icon className="size-4 text-[#a0a0b0]" /><div className="text-[13px]">{title}</div></div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );
  const Row = ({ l, sub, ctrl }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
      <div><div className="text-[12px]">{l}</div>{sub && <div className="text-[10px] text-[#717182] mt-0.5">{sub}</div>}</div>
      <div>{ctrl}</div>
    </div>
  );
  const Toggle = ({ on }: { on?: boolean }) => <div className={`relative w-9 h-5 rounded-full ${on ? "bg-blue-500" : "bg-[#2a2a3a]"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} /></div>;
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <TopBar term="Settings" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[820px] mx-auto px-8 py-7">
          <div className="text-[11px] uppercase tracking-wider text-blue-400 mb-1">Settings</div>
          <h2 className="text-[22px] tracking-tight mb-5">Wizard preferences</h2>

          <Section title="Voice" icon={Mic}>
            <Row l="Preferred voice" sub="Used when entering Voice Mode" ctrl={<button className="px-3 py-1.5 rounded bg-[#222232] text-[11px] flex items-center gap-1.5"><Volume2 className="size-3" /> Aria · sample</button>} />
            <Row l="Playback speed" sub="Faster cadence reduces session time" ctrl={<select className="bg-[#222232] border border-[var(--border)] rounded px-2 py-1 text-[11px]"><option>1.0×</option></select>} />
            <Row l="Confirm before commit" sub="Wizard repeats heard speech before acting" ctrl={<Toggle on />} />
            <Row l="Transcript retention" sub="Audio is never retained" ctrl={<select className="bg-[#222232] border border-[var(--border)] rounded px-2 py-1 text-[11px]"><option>30 days</option></select>} />
          </Section>

          <Section title="Mode" icon={ShieldCheck}>
            <Row l="Expert mode" sub="Hides Socratic explanations, collapses rationale tooltips. Same workflow runs faster." ctrl={<Toggle />} />
            <Row l="Pedagogical mode" sub="Adds 'why this step exists' callouts for ontology students" ctrl={<Toggle on />} />
            <Row l="Show step-back impact warnings" sub="Alert when revising a step affects subsequent steps" ctrl={<Toggle on />} />
          </Section>

          <Section title="KB Configuration" icon={Database}>
            <Row l="Loaded knowledge base files" sub="Search context for Step 1 lookups" ctrl={<button className="px-3 py-1.5 rounded bg-blue-500 text-white text-[11px]">Manage files</button>} />
            <div className="space-y-1.5 pb-3">
              {[
                { f: "Merge.kif", s: "Top-level — always loaded", on: true, lock: true },
                { f: "Mid-level-ontology.kif", s: "Mid-level concepts", on: true },
                { f: "Animals.kif", s: "Domain — biology", on: true },
                { f: "CyberSecurity.kif", s: "Domain — disabled this session", on: false },
              ].map(f => (
                <div key={f.f} className="flex items-center gap-3 px-3 py-2 rounded bg-[#222232] text-[11px]">
                  <FileCode className="size-3.5 text-[#a0a0b0]" /><span className="font-mono">{f.f}</span>
                  <span className="text-[10px] text-[#717182] flex-1">{f.s}</span>
                  {f.lock && <span className="text-[9px] uppercase tracking-wider text-[#717182]">required</span>}
                  <Toggle on={f.on} />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Validation" icon={ShieldCheck}>
            {[
              { l: "Paren balance", sub: "Run continuously", on: true },
              { l: "Style conventions", sub: "SUMO style guide checks", on: true },
              { l: "Variable scoping", sub: "Detect unbound or shadowed vars", on: true },
              { l: "Term cross-reference", sub: "Verify each predicate exists", on: true },
              { l: "Bare existential", sub: "Detect existentials with no use", on: false },
            ].map(c => <Row key={c.l} l={c.l} sub={c.sub} ctrl={<div className="flex gap-2 items-center"><span className="text-[10px] text-[#717182]">automatic</span><Toggle on={c.on} /></div>} />)}
          </Section>

          <Section title="Notifications" icon={Bell}>
            <Row l="Rate-limit alerts" sub="Notify when same predicate used 4+ times" ctrl={<Toggle on />} />
            <Row l="Coverage 100% achieved" sub="Subtle toast at completion" ctrl={<Toggle on />} />
            <Row l="Proof completion" sub="Audible cue when prover returns" ctrl={<Toggle />} />
          </Section>

          <div className="text-[10px] text-[#717182] text-center mt-6">SUMO Wizard · v0.4 · Sigma Gamma Project 2 · NPS MSA</div>
        </div>
      </div>
    </div>
  );
}
