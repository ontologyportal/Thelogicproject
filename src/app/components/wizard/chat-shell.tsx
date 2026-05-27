import { ReactNode } from "react";
import { Mic, Settings as SettingsIcon, Plus, Send, Paperclip, Sparkles, ChevronRight, Search, MessagesSquare, History as HistoryIcon, PanelRightClose, PanelRightOpen, Check, Lock, ArrowRight, X, FileText } from "lucide-react";
import { SumoMark } from "./shared";

export const PHASES = [
  { n: 1, k: "search", t: "Search" },
  { n: 2, k: "justify", t: "Justify" },
  { n: 3, k: "classify", t: "Classify" },
  { n: 4, k: "parent", t: "Parent" },
  { n: 5, k: "define", t: "Define" },
  { n: 6, k: "coverage", t: "Coverage" },
  { n: 7, k: "approve", t: "Approve" },
];

export function PhaseStepper({ current, completed = [], focused = false }: { current: number; completed?: number[]; focused?: boolean }) {
  if (focused) {
    const phase = PHASES.find(p => p.n === current)!;
    const pct = ((completed.length) / 7) * 100;
    return (
      <div className="px-6 py-3 border-b border-[#1f1f2c] bg-[#0a0a14] flex-shrink-0">
        <div className="max-w-[760px] mx-auto flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#717182]">Phase {current} of 7</span>
          <span className="text-[12.5px] tracking-tight">{phase.t}</span>
          <div className="flex-1 h-1 rounded-full bg-[#1a1a26] overflow-hidden mx-2">
            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-[#717182]">{completed.length}/7 done · Nocturnal</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 px-5 py-3 border-b border-[#1f1f2c] bg-[#0e0e16]/80 backdrop-blur flex-shrink-0">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#717182] mr-3">Phase</div>
      {PHASES.map((p, i) => {
        const done = completed.includes(p.n);
        const active = p.n === current;
        const locked = !done && !active && p.n > current;
        return (
          <div key={p.k} className="flex items-center gap-1">
            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-colors ${active ? "bg-blue-500 text-white" : done ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25" : "text-[#555] hover:text-[#a0a0b0]"}`}>
              <span className={`size-4 rounded-full flex items-center justify-center text-[9px] ${active ? "bg-white/25" : done ? "bg-emerald-500/40 text-white" : locked ? "bg-[#1a1a26]" : "bg-[#222232]"}`}>
                {done ? <Check className="size-2.5" /> : locked ? <Lock className="size-2" /> : p.n}
              </span>
              <span className="tracking-tight">{p.t}</span>
            </button>
            {i < PHASES.length - 1 && <div className={`w-3 h-px ${done ? "bg-emerald-500/40" : "bg-[#222232]"}`} />}
          </div>
        );
      })}
      <div className="ml-auto flex items-center gap-2 text-[10px] text-[#717182]">
        <span>Term: <span className="text-[#d0d0d8]">Nocturnal</span></span>
        <span>·</span>
        <span>{completed.length}/7 done</span>
      </div>
    </div>
  );
}

export function LeftRail({ active, focused = false }: { active: string; focused?: boolean }) {
  if (focused) {
    return (
      <aside className="w-[56px] flex-shrink-0 bg-[#0a0a14] border-r border-[#1f1f2c] flex flex-col items-center py-3 gap-2">
        <div className="mb-1"><SumoMark size={32} /></div>
        <button title="New term session" className="size-9 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"><Plus className="size-4" /></button>
        <button title="Recent sessions (⌘B)" className="size-9 rounded-lg hover:bg-white/5 text-[#a0a0b0] flex items-center justify-center"><MessagesSquare className="size-4" /></button>
        <button title="Search (⌘K)" className="size-9 rounded-lg hover:bg-white/5 text-[#a0a0b0] flex items-center justify-center"><Search className="size-4" /></button>
        <button title="History" className="size-9 rounded-lg hover:bg-white/5 text-[#a0a0b0] flex items-center justify-center"><HistoryIcon className="size-4" /></button>
        <div className="flex-1" />
        <button title="Settings" className="size-9 rounded-lg hover:bg-white/5 text-[#a0a0b0] flex items-center justify-center"><SettingsIcon className="size-4" /></button>
        <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-[10px] text-white">DR</div>
      </aside>
    );
  }
  const sessions = [
    { t: "Nocturnal", sub: "Phase 6 · Coverage", active: true },
    { t: "Communication", sub: "Approved · Apr 14" },
    { t: "PhishingAttempt", sub: "Approved · Apr 12" },
    { t: "Predation", sub: "Failed proof · revise" },
    { t: "LegalContract", sub: "Phase 2 · Justify" },
    { t: "DataBreach", sub: "Approved · Apr 03" },
    { t: "Symbiosis", sub: "Approved · Mar 29" },
  ];
  return (
    <aside className="w-[260px] flex-shrink-0 bg-[#0c0c14] border-r border-[#1f1f2c] flex flex-col">
      <div className="p-3 border-b border-[#1f1f2c] flex items-center gap-2">
        <SumoMark size={26} />
        <div className="flex-1">
          <div className="text-[12px] tracking-tight">SUMO Wizard</div>
          <div className="text-[9px] text-[#717182]">Sigma Gamma · NPS</div>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-[#1f1f2c]">
        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[12px]">
          <Plus className="size-3.5" /> New term session
        </button>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-[#555]" />
          <input placeholder="Search sessions…" className="w-full bg-[#13131c] border border-[#1f1f2c] rounded-md pl-7 pr-2 py-1.5 text-[11px] focus:outline-none focus:border-[#2a2a3a]" />
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 mb-1 text-[9px] uppercase tracking-[0.15em] text-[#555]">Recent</div>
        {sessions.map((s, i) => (
          <button key={i} className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors ${s.active ? "bg-blue-500/10 border-l-2 border-blue-500" : "border-l-2 border-transparent hover:bg-white/[0.03]"}`}>
            <MessagesSquare className={`size-3.5 mt-0.5 flex-shrink-0 ${s.active ? "text-blue-400" : "text-[#555]"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] truncate">{s.t}</div>
              <div className="text-[10px] text-[#717182] truncate">{s.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-[#1f1f2c] p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-[#717182] mb-1.5">
          <span>KB context</span>
          <span className="text-emerald-400">3 files</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#a0a0b0] px-2 py-1 rounded bg-[#13131c]"><FileText className="size-3" /> Merge.kif</div>
        <div className="flex items-center gap-2 text-[10px] text-[#a0a0b0] px-2 py-1 rounded bg-[#13131c]"><FileText className="size-3" /> Mid-level.kif</div>
        <div className="flex items-center gap-2 text-[10px] text-[#a0a0b0] px-2 py-1 rounded bg-[#13131c]"><FileText className="size-3" /> Animals.kif</div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1f1f2c]">
          <div className="size-7 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-[10px] text-white">DR</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] truncate">Dr. M. Reyes</div>
            <div className="text-[9px] text-[#717182]">Domain · Biology</div>
          </div>
          <button className="size-6 rounded hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"><SettingsIcon className="size-3" /></button>
        </div>
      </div>
    </aside>
  );
}

export function ChatThread({ children, focused = false }: { children: ReactNode; focused?: boolean }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className={`max-w-[760px] mx-auto px-6 py-10 ${focused ? "space-y-7" : "space-y-5"}`}>{children}</div>
    </div>
  );
}

export function AgentMsg({ children, badge }: { children: ReactNode; badge?: string }) {
  return (
    <div className="flex gap-3">
      <SumoMark size={32} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] text-[#a0a0b0]">Ontology Wizard</span>
          {badge && <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25">{badge}</span>}
          <button className="text-[10px] text-[#555] hover:text-blue-400 ml-auto">Why is the wizard asking?</button>
        </div>
        <div className="text-[14.5px] text-[#e6e6ee] leading-[1.65]">{children}</div>
      </div>
    </div>
  );
}

export function UserMsg({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 flex-row-reverse">
      <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-[11px] text-white flex-shrink-0">DR</div>
      <div className="max-w-[78%]">
        <div className="text-[11px] text-[#a0a0b0] mb-1.5 text-right">Dr. Reyes</div>
        <div className="bg-[#1a1a26] border border-[#262636] rounded-2xl rounded-tr-md px-4 py-2.5 text-[13.5px] text-[#e6e6ee] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function OptionCards({ children }: { children: ReactNode }) {
  return (
    <div className="ml-11 grid grid-cols-2 gap-2">{children}</div>
  );
}

export function OptionCard({ title, desc, badge, recommended, color = "blue" }: { title: string; desc: string; badge?: string; recommended?: boolean; color?: "blue" | "emerald" | "amber" | "neutral" }) {
  const tone: any = {
    blue: "border-blue-500/40 bg-blue-500/[0.06] hover:border-blue-500/70",
    emerald: "border-emerald-500/40 bg-emerald-500/[0.06] hover:border-emerald-500/70",
    amber: "border-amber-500/40 bg-amber-500/[0.06] hover:border-amber-500/70",
    neutral: "border-[#262636] bg-[#13131c] hover:border-[#3a3a4a]",
  };
  return (
    <button className={`relative text-left rounded-xl border p-3.5 transition ${tone[color]}`}>
      {recommended && <span className="absolute top-3 right-3 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500 text-white">Best match</span>}
      <div className="flex items-center gap-2 mb-1.5">
        {badge && <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[#a0a0b0]">{badge}</span>}
        <div className="text-[13px]">{title}</div>
      </div>
      <div className="text-[11px] text-[#a0a0b0] leading-relaxed">{desc}</div>
    </button>
  );
}

export function Composer({ placeholder = "Reply to the wizard…", chips, focused = false }: { placeholder?: string; chips?: string[]; focused?: boolean }) {
  return (
    <div className="border-t border-[#1f1f2c] bg-[#0a0a14] flex-shrink-0">
      <div className="max-w-[760px] mx-auto px-6 py-4">
        {chips && !focused && (
          <div className="flex gap-2 mb-2.5 flex-wrap">
            {chips.map(c => <button key={c} className="text-[11px] px-2.5 py-1 rounded-full border border-[#262636] bg-[#13131c] text-[#a0a0b0] hover:border-[#3a3a4a] hover:text-white">{c}</button>)}
          </div>
        )}
        <div className="flex items-end gap-2 bg-[#13131c] border border-[#262636] focus-within:border-blue-500/50 rounded-2xl p-2.5">
          <button className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#717182]" title="Attach"><Paperclip className="size-4" /></button>
          <textarea rows={1} placeholder={placeholder} className="flex-1 bg-transparent resize-none text-[13.5px] text-[#e6e6ee] placeholder:text-[#555] outline-none py-1.5 leading-relaxed" />
          <button className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#717182]" title="Voice"><Mic className="size-4" /></button>
          <button className="size-8 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white" title="Send"><Send className="size-3.5" /></button>
        </div>
        {!focused && <div className="flex items-center justify-between mt-2 text-[10px] text-[#555]">
          <span>Press ⏎ to send · ⇧⏎ for newline</span>
          <span>The wizard formalizes — you decide. Your words, not the AI's.</span>
        </div>}
      </div>
    </div>
  );
}

export function RightArtifact({ title, subtitle, onClose, children, badge }: { title: string; subtitle?: string; onClose?: () => void; children: ReactNode; badge?: ReactNode }) {
  return (
    <aside className="w-[460px] flex-shrink-0 bg-[#0c0c14] border-l border-[#1f1f2c] flex flex-col">
      <div className="px-4 py-3 border-b border-[#1f1f2c] flex items-center gap-2 flex-shrink-0">
        <div>
          <div className="text-[12px]">{title}</div>
          {subtitle && <div className="text-[10px] text-[#717182] mt-0.5">{subtitle}</div>}
        </div>
        <div className="ml-auto flex items-center gap-2">{badge}<button onClick={onClose} className="size-7 rounded hover:bg-white/5 flex items-center justify-center text-[#717182]"><PanelRightClose className="size-3.5" /></button></div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </aside>
  );
}
