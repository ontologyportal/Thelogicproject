import { useState } from "react";
import { Frame, AppFooter } from "../shared";

/**
 * Phase: Conflict Resolution
 * Shown when Phase 7 Verify detects a consistency conflict between the
 * user's new statements and existing knowledge base entries.
 */
export function ConflictResolutionScreen({
  onRevise,
  onDispute,
  termName = "[YourConcept]",
  userClaim = "has a defining property that implies X",
  existingTerm = "RelatedConcept",
  existingClaim = "no instance of that class can have property X",
}: {
  onRevise: () => void;
  onDispute: () => void;
  termName?: string;
  userClaim?: string;
  existingTerm?: string;
  existingClaim?: string;
}) {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="We found something that doesn't fit."
          subtitle="resolve this conflict to continue"
        >
          {/* Conflict explanation */}
          <div className="mb-6 p-4 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
            <p className="text-[13px] text-[#c0c0c8] leading-relaxed">
              You said{" "}
              <strong className="text-[#e0e0e8]">{termName}</strong>{" "}
              {userClaim}. But existing knowledge from the{" "}
              <strong className="text-[#e0e0e8]">{existingTerm}</strong>{" "}
              entry says {existingClaim}. Both can't be true at the same time.
            </p>
          </div>

          {/* Resolution action cards */}
          <div className="space-y-3 mb-5">
            <button
              onClick={onRevise}
              className="w-full text-left p-4 rounded-lg border border-[#2a2a3a] bg-[#1a1a26] hover:border-[#717182] hover:bg-white/5 transition-colors"
            >
              <p className="text-[14px] font-medium text-[#e0e0e8] mb-1">Revise my definition</p>
              <p className="text-[11px] text-[#717182]">
                Go back to Phase 6 and edit the conflicting statement.
              </p>
            </button>

            <button
              onClick={onDispute}
              className="w-full text-left p-4 rounded-lg border border-[#2a2a3a] bg-[#1a1a26] hover:border-[#717182] hover:bg-white/5 transition-colors"
            >
              <p className="text-[14px] font-medium text-[#e0e0e8] mb-1">Dispute the existing entry</p>
              <p className="text-[11px] text-[#717182]">
                Submit your definition for expert review, then re-run verification.
              </p>
            </button>
          </div>

          {/* Expandable explanation */}
          <div>
            <button
              onClick={() => setWhyOpen((o) => !o)}
              className="text-[11px] text-[#717182] hover:text-[#a0a0b0] transition-colors"
            >
              {whyOpen ? "▼" : "▶"} Why am I seeing this?
            </button>
            {whyOpen && (
              <p className="mt-2 text-[12px] text-[#c0c0c8] leading-relaxed pl-4 border-l border-[#2a2a3a]">
                Two formal statements in the knowledge base contradict each other.
                Resolving the conflict ensures the base stays consistent so other
                tools can rely on it for reasoning.
              </p>
            )}
          </div>
        </Frame>

        <AppFooter />
      </div>
    </div>
  );
}

/**
 * Dispute Submitted — shown after the user chooses "Dispute the existing entry".
 * Confirms the dispute is queued and offers a direct path back to Verify so
 * the rest of the term can be submitted while expert review is pending.
 */
export function DisputeSubmittedScreen({
  onVerify,
  onBack,
  termName = "[YourConcept]",
  userClaim = "has a defining property that implies X",
  existingTerm = "RelatedConcept",
  existingClaim = "no instance of that class can have property X",
}: {
  onVerify: () => void;
  onBack: () => void;
  termName?: string;
  userClaim?: string;
  existingTerm?: string;
  existingClaim?: string;
}) {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Dispute submitted for expert review"
          subtitle="your definition is queued; you can verify the rest of your term while it is reviewed"
        >
          {/* Status badge */}
          <div className="mb-5 p-3 bg-[#13131c] border border-[#2a2a3a] rounded-lg flex items-center gap-2">
            <span className="text-[#e0e0e8] text-[14px]">⏳</span>
            <p className="text-[12px] text-[#a0a0b0]">Under expert review, usually resolved within 48 hours.</p>
          </div>

          {/* Dispute summary card */}
          <div className="mb-6 p-4 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-[#717182] mb-3">Dispute summary</p>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1">Your statement</p>
                <p className="text-[12px] text-[#c0c0c8]">
                  <strong className="text-[#e0e0e8]">{termName}</strong> {userClaim}.
                </p>
              </div>
              <div className="border-t border-[#2a2a3a] pt-3">
                <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1">Contested entry</p>
                <p className="text-[12px] text-[#c0c0c8]">
                  <strong className="text-[#e0e0e8]">{existingTerm}</strong>: {existingClaim}.
                </p>
              </div>
            </div>
          </div>

          {/* Primary action — the Verify path Miriam flagged as missing */}
          <button
            onClick={onVerify}
            className="w-full py-3 bg-[#e0e0e8] hover:bg-white rounded-lg text-[13px] text-[#0a0a14] font-medium mb-4"
          >
            Verify my term →
          </button>

          <button
            onClick={onBack}
            className="text-[11px] text-[#717182] hover:text-[#a0a0b0] transition-colors"
          >
            ← Back to Conflict Resolution
          </button>
        </Frame>

        <AppFooter />
      </div>
    </div>
  );
}
