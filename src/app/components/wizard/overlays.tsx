import { ReactNode, useState } from "react";
import { X, Check, Undo2, Loader2, Keyboard, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Target } from "lucide-react";
import { SumoMark } from "./shared";

/* ──────────── Onboarding · 3-step coach ──────────── */
export function OnboardingTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  if (!open) return null;
  const steps = [
    {
      title: "Contribute to truly open AI — defined by you.",
      body: "You're adding to a public, traceable map of how the world is described. Anyone can use it. No login walls, no proprietary formats — just shared knowledge with your name on the contribution.",
      icon: <SumoMark size={56} ring />,
    },
    {
      title: "Plain English, all the way through.",
      body: "Tell us what you observed in your own words. We'll guide you through seven short steps — describing, checking for duplicates, categorizing, defining, and verifying — and handle the technical translation behind the scenes.",
      icon: <div className="size-14 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-300 text-[18px]">1 → 7</div>,
    },
    {
      title: "Your words and sources — never made up.",
      body: "Every definition stays attached to where you learned it. We may polish grammar, but the meaning is yours. Anyone reading the knowledge base later can trace your contribution back to its origin.",
      icon: <div className="size-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center"><ShieldCheck className="size-7 text-emerald-300" /></div>,
    },
  ];
  const s = steps[step];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="max-w-[520px] w-full rounded-2xl border border-[#262636] bg-[#13131c] p-7 shadow-2xl">
        <div className="flex items-start gap-4 mb-5">
          {s.icon}
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.18em] text-blue-400 mb-1">Welcome · {step + 1} of {steps.length}</div>
            <div className="text-[18px] tracking-tight leading-snug">{s.title}</div>
          </div>
          <button onClick={onClose} className="size-7 rounded hover:bg-white/5 flex items-center justify-center text-[#717182]"><X className="size-3.5" /></button>
        </div>
        <div className="text-[13px] text-[#c8c8d4] leading-relaxed mb-6">{s.body}</div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i === step ? "w-6 bg-blue-400" : "w-1.5 bg-[#2a2a3a]"}`} />)}
          </div>
          <div className="flex gap-2">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="px-3 py-1.5 rounded-md text-[11px] text-[#a0a0b0] hover:bg-white/5 flex items-center gap-1"><ArrowLeft className="size-3" /> Back</button>}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-3 py-1.5 rounded-md text-[11px] bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">Next <ArrowRight className="size-3" /></button>
            ) : (
              <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[11px] bg-blue-500 hover:bg-blue-600 text-white">Let's begin</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Keyboard shortcuts · ? overlay ──────────── */
export function ShortcutsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const groups = [
    { label: "Session", items: [["⌘ N", "New term session"], ["⌘ R", "Review existing term"], ["⌘ E", "Toggle Expert mode"], ["⌘ K", "Search sessions"]] },
    { label: "In a phase", items: [["↩", "Send reply / advance"], ["⇧ ↩", "Newline in composer"], ["1–4", "Pick option card 1–4"], ["⌘ Z", "Undo last decision"], ["←", "Return to previous phase"]] },
    { label: "Voice & artifacts", items: [["⌘ M", "Toggle Voice mode"], ["⌘ /", "Toggle right artifact panel"], ["⌘ B", "Toggle session sidebar"], ["⌘ ⏎", "Submit doc-string"]] },
    { label: "Help", items: [["?", "Show this panel"], ["⌘ ⇧ H", "Replay onboarding"], ["⌘ .", "Wizard rationale tooltip"]] },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6" onClick={onClose}>
      <div className="max-w-[680px] w-full rounded-2xl border border-[#262636] bg-[#13131c] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f2c]">
          <div className="flex items-center gap-2"><Keyboard className="size-4 text-[#a0a0b0]" /><div className="text-[13px]">Keyboard shortcuts</div></div>
          <button onClick={onClose} className="size-7 rounded hover:bg-white/5 flex items-center justify-center text-[#717182]"><X className="size-3.5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 p-5">
          {groups.map(g => (
            <div key={g.label}>
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#717182] mb-2">{g.label}</div>
              <div className="space-y-1.5">
                {g.items.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[12px]">
                    <span className="text-[#c8c8d4]">{v}</span>
                    <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0a0a14] border border-[#2a2a3a] text-[#a0a0b0]">{k}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-[#1f1f2c] text-[10px] text-[#555] flex items-center justify-between">
          <span>Bindings adapt to your platform · ⌘ on macOS, Ctrl elsewhere</span>
          <span>Press <kbd className="font-mono px-1 py-0.5 rounded bg-[#0a0a14] border border-[#2a2a3a]">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Approve · double-confirm modal ──────────── */
export function ApproveDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const [typed, setTyped] = useState("");
  if (!open) return null;
  const ok = typed.trim().toLowerCase() === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="max-w-[520px] w-full rounded-2xl border border-emerald-500/30 bg-[#13131c] p-6 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="size-10 rounded-lg bg-emerald-500/15 flex items-center justify-center"><ShieldCheck className="size-5 text-emerald-300" /></div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 mb-1">Final commitment</div>
            <div className="text-[16px] tracking-tight">Approve and commit Nocturnal to draft.kif?</div>
          </div>
        </div>
        <div className="rounded-lg bg-[#0a0a14] border border-[#1f1f2c] px-4 py-3 mb-4 text-[12px] text-[#c8c8d4] leading-relaxed">
          This adds a permanent term to the SUMO contribution branch and opens a pull request for review by the maintainers. Your name and citation will be attached. Subsequent revisions require a new session.
        </div>
        <ul className="text-[11.5px] text-[#a0a0b0] space-y-1.5 mb-5 pl-4 list-disc">
          <li>5 axioms · 4/4 doc-string claims covered</li>
          <li>2 modeling risks acknowledged</li>
          <li>1 proof verification pending — will run after commit</li>
        </ul>
        <div className="mb-5">
          <label className="text-[11px] text-[#a0a0b0] mb-1.5 block">Type <span className="text-emerald-300 font-mono">approve</span> to confirm</label>
          <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="approve" className="w-full bg-[#0a0a14] border border-[#262636] focus:border-emerald-500/50 rounded-md px-3 py-2 text-[12.5px] font-mono outline-none" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md text-[12px] text-[#a0a0b0] hover:bg-white/5">Cancel</button>
          <button disabled={!ok} onClick={onConfirm} className={`px-4 py-2 rounded-md text-[12px] flex items-center gap-1.5 transition ${ok ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-emerald-500/30 text-emerald-200/50 cursor-not-allowed"}`}><Check className="size-3.5" /> Commit term</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Undo snackbar (H3) ──────────── */
export function UndoSnackbar({ open, label = "Phase 4 parent locked.", onUndo, onClose }: { open: boolean; label?: string; onUndo?: () => void; onClose?: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#13131c] border border-[#2a2a3a] shadow-2xl">
      <Check className="size-4 text-emerald-400" />
      <span className="text-[12px] text-[#e6e6ee]">{label}</span>
      <button onClick={onUndo} className="text-[11px] px-2 py-1 rounded-md bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 flex items-center gap-1"><Undo2 className="size-3" /> Undo</button>
      <button onClick={onClose} className="size-6 rounded hover:bg-white/5 flex items-center justify-center text-[#717182]"><X className="size-3" /></button>
    </div>
  );
}

/* ──────────── Saving toast (H1) ──────────── */
export function SavingToast({ open, state = "saving", text }: { open: boolean; state?: "saving" | "saved" | "error"; text?: string }) {
  if (!open) return null;
  const map = {
    saving: { icon: <Loader2 className="size-3.5 animate-spin text-blue-400" />, label: text || "Committing to draft.kif…", tone: "border-[#2a2a3a]" },
    saved: { icon: <Check className="size-3.5 text-emerald-400" />, label: text || "Saved · pushed to wizard/draft branch", tone: "border-emerald-500/30" },
    error: { icon: <Target className="size-3.5 text-red-400" />, label: text || "Save failed · retrying", tone: "border-red-500/30" },
  };
  const m = map[state];
  return (
    <div className={`fixed top-3 right-3 z-40 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#13131c] border ${m.tone} shadow-xl`}>
      {m.icon}
      <span className="text-[11.5px] text-[#e6e6ee]">{m.label}</span>
    </div>
  );
}

/* ──────────── Phase transition · full-screen processing overlay ────────────
 * Shown between phases while real work happens (search, draft axioms, prove).
 * sumo1k.gif is the canonical asset; if absent, fall back to a spinning
 * SumoMark so the screen never goes blank. Status line names what's
 * happening (H1: visibility of system status). */
export function PhaseSpinner({ open, status = "Working…" }: { open: boolean; status?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a14]/85 backdrop-blur-md">
      <div className="size-24 mb-6 flex items-center justify-center">
        <div className="animate-spin" style={{ animationDuration: "1.6s" }}>
          <SumoMark size={72} ring />
        </div>
      </div>
      <div className="text-[13px] text-[#e0e0e8] tracking-tight mb-1">{status}</div>
      <div className="text-[10.5px] text-[#717182] italic">This usually takes a few seconds.</div>
    </div>
  );
}

/* ──────────── Post-term · expedited next-session prompt ──────────── */
export function PostTermDialog({ open, term = "Nocturnal", onClose, onFastLane, onGuided }: { open: boolean; term?: string; onClose: () => void; onFastLane?: () => void; onGuided?: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="max-w-[560px] w-full rounded-2xl border border-[#262636] bg-[#13131c] p-7 shadow-2xl">
        <div className="flex items-start gap-4 mb-5">
          <div className="size-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0"><Check className="size-6 text-emerald-300" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 mb-1">Contribution accepted</div>
            <div className="text-[18px] tracking-tight leading-snug truncate">{term} is now part of the open ontology.</div>
            <div className="text-[12px] text-[#a0a0b0] mt-1">Routed to the reviewer queue · the public KB will pick it up after merge.</div>
          </div>
          <button onClick={onClose} className="size-7 rounded hover:bg-white/5 flex items-center justify-center text-[#717182]"><X className="size-3.5" /></button>
        </div>

        <div className="text-[12px] text-[#c0c0c8] mb-3">Want to contribute another? You've done this once — we can skip the parts you don't need.</div>

        <div className="space-y-2 mb-5">
          <button onClick={onFastLane} className="w-full text-left flex items-start gap-3 p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/60 transition">
            <Sparkles className="size-4 text-blue-300 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] flex items-center gap-2">Fast lane <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 uppercase tracking-wider">recommended</span></div>
              <div className="text-[11px] text-[#a0a0b0] mt-0.5 leading-relaxed">Skip setup and scoping. Jump straight to searching the knowledge base for your next concept.</div>
            </div>
            <ArrowRight className="size-3.5 text-blue-300 mt-1 flex-shrink-0" />
          </button>

          <button onClick={onGuided} className="w-full text-left flex items-start gap-3 p-3.5 rounded-lg bg-[#0a0a14] border border-[#262636] hover:border-[#3a3a4a] transition">
            <Target className="size-4 text-[#a0a0b0] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px]">Full guided flow</div>
              <div className="text-[11px] text-[#717182] mt-0.5 leading-relaxed">Walk the complete pipeline again — useful if the next concept is in a new domain.</div>
            </div>
            <ArrowRight className="size-3.5 text-[#717182] mt-1 flex-shrink-0" />
          </button>
        </div>

        <div className="flex items-center justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[11.5px] text-[#a0a0b0] hover:bg-white/5">I'm done for now</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Mode toggle pill (Focused / Expert) ──────────── */
export function ModeToggle({ mode, setMode }: { mode: "focused" | "expert"; setMode: (m: "focused" | "expert") => void }) {
  return (
    <div className="inline-flex p-0.5 rounded-full bg-[#0a0a14] border border-[#262636]">
      {(["focused", "expert"] as const).map(m => (
        <button key={m} onClick={() => setMode(m)} className={`px-2.5 py-1 text-[10.5px] tracking-tight rounded-full capitalize transition ${mode === m ? (m === "focused" ? "bg-blue-500 text-white" : "bg-[#222232] text-white") : "text-[#717182] hover:text-[#c0c0c8]"}`}>
          {m === "focused" && <Sparkles className="size-2.5 inline -mt-0.5 mr-1" />}
          {m}
        </button>
      ))}
    </div>
  );
}
