import { UserCircle2, Github, ChevronRight } from "lucide-react";
import { PHASES, type PhaseId, SumoMark } from "./shared";
import { Button } from "../ui/button";

/**
 * Global Top Navigation - Hi-fi dark mode design
 */
export function TopNavigation({
  currentPhase,
  onPhaseClick,
  authStatus = "guest",
  userName,
  termName = "Nocturnal",
}: {
  currentPhase: PhaseId;
  onPhaseClick?: (phase: PhaseId) => void;
  authStatus?: "authenticated" | "guest" | "none";
  userName?: string;
  termName?: string;
}) {
  return (
    <div className="h-12 border-b border-[#1a1a26] bg-[#161622] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-[#a0a0b0]">Your contribution</span>
        <ChevronRight className="size-3 text-[#717182]" />
        <span className="text-[12px] text-[#e0e0e8]">{termName}</span>
        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">DRAFT</span>
      </div>
      <div className="flex items-center gap-2">
        {authStatus === "authenticated" && userName ? (
          <div className="flex items-center gap-2 text-[11px] text-[#a0a0b0]">
            <span>Signed in as @{userName}</span>
          </div>
        ) : authStatus === "guest" ? (
          <div className="text-[11px] text-[#a0a0b0]">Guest mode</div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Footer Navigation - Hi-fi dark mode
 */
export function FooterNavigation({
  onBack,
  onNext,
  nextDisabled = false,
  backLabel = "Back",
  nextLabel = "Next",
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  backLabel?: string;
  nextLabel?: string;
}) {
  return (
    <div className="w-full max-w-[820px] mx-auto px-8 py-4 flex items-center justify-between border-t border-[#1a1a26]">
      {onBack ? (
        <button className="text-[12px] text-[#a0a0b0] hover:text-white" onClick={onBack}>
          ← {backLabel}
        </button>
      ) : (
        <div />
      )}

      {onNext ? (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={`px-4 py-2 rounded-md text-[12px] flex items-center gap-2 ${
            nextDisabled
              ? "bg-blue-500/20 text-blue-400/50 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {nextLabel} →
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}

/**
 * Phase Transition Overlay - Hi-fi dark mode
 */
export function PhaseTransition({ open, status = "processing…" }: { open: boolean; status?: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a14]/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 max-w-md mx-4">
        <div className="animate-spin">
          <div
            className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
            style={{ width: 96, height: 96 }}
          >
            <span className="text-4xl" role="img" aria-label="sumo wrestler">
              🤼
            </span>
          </div>
        </div>
        <p className="text-lg italic text-[#a0a0b0]" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          {status}
        </p>
        <p className="text-xs italic text-neutral-500 text-center mt-2">
          If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
        </p>
      </div>
    </div>
  );
}

/**
 * Step Navigator Sidebar - Hi-fi dark mode
 */
export function StepNavigator({ current, completed = [] }: { current: number; completed?: number[] }) {
  const STEPS = [
    { n: 1, title: "Describe", desc: "Tell us what you observed" },
    { n: 2, title: "Search", desc: "Check for existing terms" },
    { n: 3, title: "Sharpen", desc: "Distinguish from similar" },
    { n: 4, title: "Classify", desc: "Determine term type" },
    { n: 5, title: "Place", desc: "Find parent in hierarchy" },
    { n: 6, title: "Define", desc: "Author definition" },
    { n: 7, title: "Statements", desc: "Extract axioms" },
    { n: 8, title: "Verify", desc: "Run validation gates" },
    { n: 9, title: "Submit", desc: "Contribute to knowledge base" },
  ];

  return (
    <div className="w-[220px] border-r border-[#1a1a26] bg-[#181826] flex flex-col flex-shrink-0">
      <div className="px-4 py-3 border-b border-[#1a1a26]">
        <div className="text-[10px] uppercase tracking-wider text-[#717182] mb-1">Protocol</div>
        <div className="text-[13px] text-[#e0e0e8]">9-Phase Term Authoring</div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {STEPS.map((s) => {
          const done = completed.includes(s.n);
          const active = s.n === current;
          const locked = !done && !active && s.n > current;
          return (
            <div
              key={s.n}
              className={`relative px-4 py-2.5 cursor-pointer transition-colors ${
                active ? "bg-blue-500/10 border-l-2 border-blue-500" : "border-l-2 border-transparent hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`size-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 ${
                    done ? "bg-emerald-500 text-white" : active ? "bg-blue-500 text-white" : locked ? "bg-[#2a2a3a] text-[#555]" : "bg-[#2a2a3a] text-[#a0a0b0]"
                  }`}
                >
                  {done ? "✓" : s.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12px] ${locked ? "text-[#555]" : active ? "text-white" : "text-[#d0d0d8]"}`}>{s.title}</div>
                  <div className={`text-[10px] mt-0.5 ${locked ? "text-[#444]" : "text-[#717182]"} leading-tight`}>{s.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
