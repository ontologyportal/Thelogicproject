import { UserCircle2, Github, ChevronRight } from "lucide-react";
import { PHASES, type PhaseId } from "./shared";
import { Button } from "../ui/button";

/**
 * Global Top Navigation - Hi-fi dark mode design
 */
export function TopNavigation({
  currentPhase,
  onPhaseClick,
  authStatus = "guest",
  userName,
  termName = "[unnamed concept]",
}: {
  currentPhase: PhaseId;
  onPhaseClick?: (phase: PhaseId) => void;
  authStatus?: "authenticated" | "guest" | "none";
  userName?: string;
  termName?: string;
}) {
  const isUnnamed = termName === "[unnamed concept]";

  return (
    <div className="h-12 border-b border-[#1a1a26] bg-[#161622] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-[#a0a0b0]">Your contribution</span>
        <ChevronRight className="size-3 text-[#717182]" />
        <span className={`text-[12px] ${isUnnamed ? "text-[#717182]" : "text-[#e0e0e8]"}`}>{termName}</span>
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
        <p className="text-lg text-[#a0a0b0]">
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
 * Step Navigator - Horizontal strip below top nav
 */
export function StepNavigator({
  currentPhase,
  completedPhases = [],
  onPhaseClick,
}: {
  currentPhase: PhaseId;
  completedPhases?: PhaseId[];
  onPhaseClick?: (phase: PhaseId) => void;
}) {
  return (
    <div className="w-full border-b border-[#1a1a26] bg-[#181826] overflow-x-auto">
      <div className="flex items-center gap-2 px-4 py-2 min-w-max">
        {PHASES.map((phase) => {
          const isCurrent = phase.id === currentPhase;
          const isCompleted = completedPhases.includes(phase.id);
          const isUpcoming = !isCurrent && !isCompleted;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseClick?.(phase.id)}
              className={`px-3 py-1.5 text-[11px] rounded transition-colors whitespace-nowrap ${
                isCurrent
                  ? "bg-amber-400/20 border-2 border-amber-400/60 text-amber-400"
                  : isCompleted
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "border-2 border-dashed border-[#2a2a3a] text-[#717182] hover:border-[#3a3a4a]"
              }`}
            >
              {isCompleted && <span className="mr-1">✓</span>}
              {phase.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
