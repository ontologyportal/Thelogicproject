import { useState } from "react";
import { ArrowRight, Mic, MessagesSquare, Paperclip, ImageIcon, Send, RefreshCw, Eye, ShieldCheck, Globe2 } from "lucide-react";
import { SumoMark } from "./shared";

/* ─────────────────────────── PHASE 1 · DESCRIBE ───────────────────────────
 * Two prompts (per hi-fi spec):
 *   1. "Describe the real-world problem this concept solves"
 *   2. "Write 1–2 example inferences a prover should derive"
 *
 * The user can answer with typing, voice (mic), conversational TTS
 * ("Talk with me"), file upload, or image upload — the same multimodal
 * refine bar we'll reuse in every Socratic phase.
 *
 * The example inferences are saved as the conjecture for Phase 7.
 *
 * The system auto-generates a working title from the answers; the user
 * can regenerate it. */

function RefineBar({ value, onChange, onSend, placeholder = "Refine your answer, or ask a question…" }: { value: string; onChange: (v: string) => void; onSend?: () => void; placeholder?: string }) {
  return (
    <div className="flex items-end gap-2 bg-[#13131c] border border-[#1f1f2c] focus-within:border-blue-500/60 rounded-xl p-2 transition">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={1}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none resize-none text-[13px] leading-relaxed px-2 py-2 placeholder:text-[#555]"
      />
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button title="Speak it (dictation)" className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"><Mic className="size-3.5" /></button>
        <button title="Talk with me — voice conversation" className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"><MessagesSquare className="size-3.5" /></button>
        <button title="Attach a file" className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"><Paperclip className="size-3.5" /></button>
        <button title="Upload an image" className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"><ImageIcon className="size-3.5" /></button>
        <button onClick={onSend} title="Send" className="size-8 rounded-md bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white ml-1"><Send className="size-3.5" /></button>
      </div>
    </div>
  );
}

export function ScreenDescribe({ onNext }: { onNext?: () => void }) {
  const [problem, setProblem] = useState("");
  const [conjecture, setConjecture] = useState("");
  const [source, setSource] = useState("");
  const [refine, setRefine] = useState("");

  // Auto-title — derived from the first sentence of the problem
  const autoTitle = (() => {
    const w = problem.trim().split(/\s+/).filter(Boolean);
    if (w.length < 3) return "—";
    // crude noun-phrase grab: first ~3 capitalized-ish or content words
    const stop = new Set(["a","an","the","this","that","is","are","of","to","for","and","with","by","in","on","when","where","how","why","what"]);
    const words = w.filter(x => !stop.has(x.toLowerCase())).slice(0, 3);
    return words.map(x => x[0]?.toUpperCase() + x.slice(1).toLowerCase().replace(/[^a-z0-9]/g, "")).join("");
  })();

  const ready = problem.trim().length > 25 && conjecture.trim().length > 15;

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-[#e0e0e8] overflow-hidden">
      {/* Persistent top progress rail — H1 visibility */}
      <div className="h-12 border-b border-[#1a1a26] flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <SumoMark size={22} />
          <span className="text-[12px] text-[#a0a0b0]">Step 1 of 7 · Describe your concept</span>
        </div>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5,6,7].map(n => (
            <div key={n} className={`h-1 rounded-full transition-all ${n === 1 ? "w-6 bg-blue-400" : "w-1.5 bg-[#1f1f2c]"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-[760px] mx-auto px-8 py-10">
          <div className="mb-8">
            <h1 className="text-[26px] tracking-tight leading-tight mb-2">Tell us what you want to add to the world's open knowledge.</h1>
            <p className="text-[13px] text-[#a0a0b0] leading-relaxed">Two short prompts. Type, speak, paste, or attach what you have. Use the refine bar at the bottom any time you want us to ask a sharper question.</p>
          </div>

          {/* Prompt 1 — real-world problem */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10.5px] uppercase tracking-[0.15em] text-blue-400">Prompt 1 of 2</span>
              <span className="text-[10.5px] text-[#717182]">·</span>
              <span className="text-[10.5px] text-[#717182] italic">In plain speak: what problem does this solve?</span>
            </div>
            <label className="text-[14.5px] mb-2 block">Describe the real-world problem this concept solves.</label>
            <textarea
              value={problem}
              onChange={e => setProblem(e.target.value)}
              rows={5}
              placeholder="A few sentences are plenty. Who is affected? What is happening? What gap or harm or behavior do you want named?"
              className="w-full bg-[#13131c] border border-[#1f1f2c] focus:border-blue-500/60 rounded-lg px-4 py-3 text-[13.5px] leading-relaxed outline-none resize-none transition"
            />
          </div>

          {/* Prompt 2 — example inferences (becomes Phase 7 conjecture) */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10.5px] uppercase tracking-[0.15em] text-blue-400">Prompt 2 of 2</span>
              <span className="text-[10.5px] text-[#717182]">·</span>
              <span className="text-[10.5px] text-[#717182] italic">In plain speak: what should an AI be able to figure out from this?</span>
            </div>
            <label className="text-[14.5px] mb-2 block">Write 1–2 example things a smart system should be able to derive.</label>
            <textarea
              value={conjecture}
              onChange={e => setConjecture(e.target.value)}
              rows={3}
              placeholder={`e.g. "If a community is displaced by sea-level rise, then it qualifies as climate-displaced." We'll save this and use it in Step 7 to prove the term works.`}
              className="w-full bg-[#13131c] border border-[#1f1f2c] focus:border-blue-500/60 rounded-lg px-4 py-3 text-[13.5px] leading-relaxed outline-none resize-none transition"
            />
            <div className="text-[10.5px] text-[#717182] mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="size-3 text-purple-400" /> Saved as your "conjecture" — the proof you'll watch run at the end.
            </div>
          </div>

          {/* Optional source */}
          <div className="mb-7">
            <label className="text-[11px] uppercase tracking-[0.15em] text-[#a0a0b0] mb-2 block">
              Source <span className="text-[#555] normal-case tracking-normal">(optional — URL, PDF, or image)</span>
            </label>
            <div className="relative">
              <input
                value={source}
                onChange={e => setSource(e.target.value)}
                placeholder="A field interview, a published article, a peer-reviewed paper, a government report…"
                className="w-full bg-[#13131c] border border-[#1f1f2c] focus:border-blue-500/60 rounded-lg pl-4 pr-10 py-2.5 text-[13px] outline-none transition"
              />
              <Paperclip className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#717182]" />
            </div>
          </div>

          {/* Auto-generated title card */}
          <div className="mb-7 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-blue-300">Auto-generated working title</div>
              <button title="Regenerate" className="size-6 rounded hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"><RefreshCw className="size-3" /></button>
            </div>
            <div className="text-[20px] tracking-tight font-mono">{autoTitle}</div>
            <div className="text-[10.5px] text-[#a0a0b0] mt-1 italic">In plain speak: a working name for your idea — you can change it later.</div>
          </div>

          {/* Trust strip */}
          <div className="mb-7 grid grid-cols-3 gap-3">
            <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg p-3">
              <Globe2 className="size-3.5 text-blue-400 mb-1.5" />
              <div className="text-[11.5px] mb-0.5">Open by default</div>
              <div className="text-[10.5px] text-[#717182] leading-relaxed">Joins a public knowledge base anyone can use.</div>
            </div>
            <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg p-3">
              <Eye className="size-3.5 text-emerald-400 mb-1.5" />
              <div className="text-[11.5px] mb-0.5">Always traceable</div>
              <div className="text-[10.5px] text-[#717182] leading-relaxed">Every claim links back to a source.</div>
            </div>
            <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg p-3">
              <ShieldCheck className="size-3.5 text-purple-400 mb-1.5" />
              <div className="text-[11.5px] mb-0.5">Mechanically checked</div>
              <div className="text-[10.5px] text-[#717182] leading-relaxed">A logic engine verifies before it lands.</div>
            </div>
          </div>

          {/* Refine bar — same multimodal control we use everywhere */}
          <div className="mb-6">
            <RefineBar value={refine} onChange={setRefine} placeholder="Don't like our questions? Refine here — we'll ask sharper ones." />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-5 border-t border-[#1a1a26]">
            <button className="text-[12px] text-[#a0a0b0] hover:text-white">← Save and exit</button>
            <button
              disabled={!ready}
              onClick={onNext}
              className={`px-4 py-2.5 rounded-lg text-[12.5px] flex items-center gap-2 transition ${ready ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-blue-500/20 text-blue-200/40 cursor-not-allowed"}`}
            >
              Continue · search the knowledge base <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="mt-10 text-[10.5px] text-[#555] leading-relaxed">
            The underlying knowledge base lives at{" "}
            <a href="https://github.com/ontologyportal/sumo" target="_blank" rel="noreferrer" className="text-[#a0a0b0] hover:text-white underline underline-offset-2">github.com/ontologyportal/sumo</a>. You don't need to read it to contribute.
          </div>
        </div>
      </div>
    </div>
  );
}
