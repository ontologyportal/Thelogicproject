import { Github, ChevronRight, ChevronLeft } from "lucide-react";
import { PHASES, type PhaseId, Mark } from "./shared";
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
  onSignIn,
}: {
  currentPhase: PhaseId;
  onPhaseClick?: (phase: PhaseId) => void;
  authStatus?: "authenticated" | "guest" | "none";
  userName?: string;
  termName?: string;
  onSignIn?: () => void;
}) {
  const isUnnamed = termName === "[unnamed concept]";

  return (
    <div className="h-14 border-b border-[#1a1a26] bg-[#161622] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Mark className="size-4 text-[#717182] flex-shrink-0" />
        <span className="text-[11px] uppercase tracking-[0.1em] text-[#717182]">Your contribution</span>
        <ChevronRight className="size-3 text-[#3a3a4a]" />
        <span className={`text-[12.5px] ${isUnnamed ? "text-[#717182] italic" : "text-[#e0e0e8]"}`}>{termName}</span>
        <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-[#13131c] text-[#a0a0b0] border border-[#2a2a3a] uppercase tracking-wider">Draft</span>
      </div>
      <div className="flex items-center gap-2">
        {authStatus === "authenticated" && userName ? (
          <div className="flex items-center gap-2 text-[11px] text-[#a0a0b0]">
            <Github className="size-3.5" />
            <span>Signed in as @{userName}</span>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="flex items-center gap-1.5 text-[11px] text-[#717182] hover:text-[#c0c0c8] transition-colors"
          >
            <Github className="size-3.5" />
            Sign in with GitHub
          </button>
        )}
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
    <div className="w-full max-w-[820px] mx-auto px-8 py-5 flex items-center justify-between border-t border-[#1a1a26]">
      {onBack ? (
        <button
          className="flex items-center gap-1 text-[12px] text-[#a0a0b0] hover:text-white transition-colors"
          onClick={onBack}
        >
          <ChevronLeft className="size-3.5" /> {backLabel}
        </button>
      ) : (
        <div />
      )}

      {onNext ? (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={`px-5 py-2.5 rounded-full text-[12px] font-medium flex items-center gap-2 transition-colors ${
            nextDisabled
              ? "bg-[#2a2a3a] text-[#717182] cursor-not-allowed"
              : "bg-[#e0e0e8] hover:bg-white text-[#0a0a14]"
          }`}
        >
          {nextLabel} <ChevronRight className="size-3.5" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a14]/90 backdrop-blur-sm overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(224,224,232,0.05)_1px,transparent_1px)] bg-[length:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-5 max-w-md mx-4">
        <div className="animate-spin">
          <div
            className="flex items-center justify-center rounded-full bg-gradient-to-br from-[#2a2a3a] to-[#13131c] border border-[#3a3a4a]"
            style={{ width: 96, height: 96 }}
          >
            <span className="text-4xl" role="img" aria-label="sumo wrestler">
              🤼
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#717182] mb-2">Working</p>
          <p className="text-[19px] text-[#e0e0e8] tracking-tight">
            {status}
          </p>
        </div>
        <p className="text-xs italic text-neutral-500 text-center mt-1 max-w-sm">
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
    <div className="relative w-full border-b border-[#1a1a26] bg-[#181826] overflow-x-auto">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(224,224,232,0.04)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-2 px-5 py-2.5 min-w-max">
        {PHASES.map((phase) => {
          const isCurrent = phase.id === currentPhase;
          const isCompleted = completedPhases.includes(phase.id);
          const isUpcoming = !isCurrent && !isCompleted;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseClick?.(phase.id)}
              className={`px-3.5 py-1.5 text-[10.5px] uppercase tracking-wider rounded-full transition-colors whitespace-nowrap ${
                isCurrent
                  ? "bg-[#e0e0e8] border-2 border-[#e0e0e8] text-[#0a0a14] font-medium"
                  : isCompleted
                  ? "bg-[#13131c] border border-[#3a3a4a] text-[#e0e0e8]"
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
