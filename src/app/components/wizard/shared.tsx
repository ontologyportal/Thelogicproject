import { Check, Lock, Mic, Keyboard, Settings as SettingsIcon, ChevronRight, AlertTriangle, CheckCircle2, XCircle, FileText, History, Sparkles, GitCompare, BookOpen } from "lucide-react";
import { ReactNode } from "react";

/* Plain-speak gloss for SUO-KIF jargon (H10: help & docs).
 * Use inline next to any technical token: <Gloss term="subclass">a kind of</Gloss>.
 * Renders as a subtle italic helper in parentheses. */
export function Gloss({ children, term }: { children: ReactNode; term?: string }) {
  return (
    <span className="text-[#717182] italic text-[10.5px] ml-1" title={term ? `In plain speak: ${typeof children === "string" ? children : ""}` : undefined}>
      ({children})
    </span>
  );
}
export function SumoMark({ size = 24, ring = false }: { size?: number; ring?: boolean }) {
  const fontSize = Math.max(8, Math.round(size * 0.34));
  return (
    <div
      className={`flex items-center justify-center rounded-md bg-gradient-to-br from-white to-[#e8ecf5] text-[#0a0a14] ${ring ? "ring-1 ring-white/10 shadow-[0_0_0_2px_rgba(59,130,246,0.25)]" : ""}`}
      style={{ width: size, height: size, fontFamily: "JetBrains Mono, ui-monospace, monospace", fontWeight: 700, letterSpacing: "-0.04em", fontSize }}
      aria-label="SUMO"
    >
      SUMO
    </div>
  );
}

/* Phase labels are written for someone who has never heard of SUMO or
 * formal logic. The underlying steps are unchanged — only the wording
 * meets the user where they are. */
export const STEPS = [
  { n: 1, title: "Describe", desc: "Tell us, in your own words, what you observed" },
  { n: 2, title: "Search", desc: "Check whether the idea is already in the knowledge base" },
  { n: 3, title: "Distinguish", desc: "Say what makes your idea different from the closest match" },
  { n: 4, title: "Categorize", desc: "Place it next to similar ideas" },
  { n: 5, title: "Define", desc: "Write a clear, sourced definition" },
  { n: 6, title: "Verify", desc: "Confirm every claim is supported" },
  { n: 7, title: "Contribute", desc: "Sign off and submit to the public record" },
];

export function TopBar({ onVoice, onSettings, voiceActive, term = "Nocturnal" }: { onVoice?: () => void; onSettings?: () => void; voiceActive?: boolean; term?: string }) {
  return (
    <div className="h-12 border-b border-[var(--border)] bg-[#161622] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <SumoMark size={24} />
        <span className="text-[13px] tracking-tight">Open Knowledge</span>
        <span className="text-[12px] text-[#717182] mx-2">/</span>
        <span className="text-[12px] text-[#a0a0b0]">Your contribution</span>
        <ChevronRight className="size-3 text-[#717182]" />
        <span className="text-[12px]">{term}</span>
        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">DRAFT</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-[11px] text-[#a0a0b0] hover:text-white px-2 py-1 rounded hover:bg-white/5">Expert mode <span className="ml-1 text-[10px] text-[#717182]">⌘E</span></button>
        <button onClick={onVoice} className={`size-8 rounded-md flex items-center justify-center transition-colors ${voiceActive ? "bg-blue-500 text-white" : "bg-[#222232] text-[#a0a0b0] hover:bg-[#2a2a3a] hover:text-white"}`} title="Voice mode"><Mic className="size-4" /></button>
        <button onClick={onSettings} className="size-8 rounded-md bg-[#222232] text-[#a0a0b0] hover:bg-[#2a2a3a] hover:text-white flex items-center justify-center" title="Settings"><SettingsIcon className="size-4" /></button>
        <div className="size-7 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-[11px] text-white">DR</div>
      </div>
    </div>
  );
}

export function StepNavigator({ current, completed = [] }: { current: number; completed?: number[] }) {
  return (
    <div className="w-[220px] border-r border-[var(--border)] bg-[#181826] flex flex-col flex-shrink-0">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1">Protocol</div>
        <div className="text-[13px]">7-Step Term Authoring</div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {STEPS.map((s) => {
          const done = completed.includes(s.n);
          const active = s.n === current;
          const locked = !done && !active && s.n > current;
          return (
            <div key={s.n} className={`relative px-4 py-2.5 cursor-pointer transition-colors ${active ? "bg-blue-500/10 border-l-2 border-blue-500" : "border-l-2 border-transparent hover:bg-white/[0.02]"}`}>
              <div className="flex items-start gap-2.5">
                <div className={`size-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 ${done ? "bg-emerald-500 text-white" : active ? "bg-blue-500 text-white" : locked ? "bg-[#2a2a3a] text-[#555]" : "bg-[#2a2a3a] text-[#a0a0b0]"}`}>
                  {done ? <Check className="size-3" /> : locked ? <Lock className="size-2.5" /> : s.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12px] ${locked ? "text-[#555]" : active ? "text-white" : "text-[#d0d0d8]"}`}>{s.title}</div>
                  <div className={`text-[10px] mt-0.5 ${locked ? "text-[#444]" : "text-[#717182]"} leading-tight`}>{s.desc}</div>
                </div>
              </div>
              {s.n < 7 && <div className="absolute left-[26px] top-9 w-px h-3 bg-[#2a2a3a]" />}
            </div>
          );
        })}
      </div>
      <div className="border-t border-[var(--border)] p-3 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1.5">Session</div>
        <div className="flex items-center justify-between text-[11px] text-[#a0a0b0]"><span>Term</span><span className="text-white">Nocturnal</span></div>
        <div className="flex items-center justify-between text-[11px] text-[#a0a0b0]"><span>Started</span><span>14:32</span></div>
        <div className="flex items-center justify-between text-[11px] text-[#a0a0b0]"><span>Decisions</span><span>7</span></div>
      </div>
    </div>
  );
}

export function ValidationBar({ items }: { items?: { label: string; status: "ok" | "warn" | "err"; count?: number }[] }) {
  const checks = items ?? [
    { label: "Paren balance", status: "ok" as const },
    { label: "Style", status: "ok" as const },
    { label: "Variable scoping", status: "warn" as const, count: 1 },
    { label: "Term cross-ref", status: "ok" as const },
    { label: "Bare existential", status: "ok" as const },
  ];
  const colors = {
    ok: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    warn: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    err: "text-red-400 bg-red-500/10 border-red-500/20",
  };
  const Icon = ({ s }: { s: "ok" | "warn" | "err" }) => s === "ok" ? <CheckCircle2 className="size-3" /> : s === "warn" ? <AlertTriangle className="size-3" /> : <XCircle className="size-3" />;
  return (
    <div className="h-9 border-t border-[var(--border)] bg-[#161622] flex items-center px-4 gap-2 flex-shrink-0 text-[11px]">
      <span className="text-[10px] uppercase tracking-wider text-[#717182] mr-2">Validation</span>
      {checks.map((c) => (
        <button key={c.label} className={`flex items-center gap-1.5 px-2 py-1 rounded border ${colors[c.status]} hover:brightness-125 transition`}>
          <Icon s={c.status} />
          <span>{c.label}</span>
          {c.status !== "ok" && <span className="ml-0.5">[{c.count ?? "issue"}]</span>}
          {c.status === "ok" && <span className="ml-0.5 opacity-60">[OK]</span>}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-3 text-[10px] text-[#717182]">
        <span>increasesLikelihood used 4× — verify before Step 7</span>
      </div>
    </div>
  );
}

export function AgentBubble({ children, why }: { children: ReactNode; why?: string }) {
  return (
    <div className="flex gap-3 mb-3">
      <div className="flex-shrink-0"><SumoMark size={28} /></div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] text-[#a0a0b0]">Ontology Wizard</span>
          {why && <button className="text-[10px] text-blue-400 hover:underline">Why is the wizard asking this?</button>}
        </div>
        <div className="bg-[#1f1f2e] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-[14px] text-[#e0e0e8] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 mb-3 flex-row-reverse">
      <div className="size-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-[11px] text-emerald-400">DR</div>
      <div className="flex-1 flex flex-col items-end">
        <div className="text-[11px] text-[#a0a0b0] mb-1">Dr. Reyes (you)</div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3.5 py-2.5 text-[13px] text-[#e0e0e8] leading-relaxed max-w-[85%]">{children}</div>
      </div>
    </div>
  );
}

export function KifLine({ n, children, error, indent = 0 }: { n: number; children: ReactNode; error?: string; indent?: number }) {
  return (
    <div className={`flex font-mono text-[12.5px] leading-[1.65] ${error ? "bg-red-500/10" : ""}`}>
      <span className="select-none text-right pr-3 pl-3 text-[#555] w-10 flex-shrink-0">{n}</span>
      <span className="flex-1 whitespace-pre" style={{ paddingLeft: indent * 16 }}>{children}</span>
      {error && <span className="text-[10px] text-red-400 px-2 self-center">{error}</span>}
    </div>
  );
}

export const Pred = ({ children }: { children: ReactNode }) => <span className="text-blue-400">{children}</span>;
export const Var = ({ children }: { children: ReactNode }) => <span className="text-orange-400">{children}</span>;
export const Str = ({ children }: { children: ReactNode }) => <span className="text-emerald-400">{children}</span>;
export const Paren = ({ children }: { children: ReactNode }) => <span className="text-[#666]">{children}</span>;
export const Comm = ({ children }: { children: ReactNode }) => <span className="text-[#666] italic">{children}</span>;

export function PanelHeader({ icon: Icon, title, subtitle, right }: { icon?: any; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[#181826] flex-shrink-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-3.5 text-[#a0a0b0]" />}
        <div>
          <div className="text-[12px]">{title}</div>
          {subtitle && <div className="text-[10px] text-[#717182] mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

export { History, FileText, GitCompare, BookOpen };
