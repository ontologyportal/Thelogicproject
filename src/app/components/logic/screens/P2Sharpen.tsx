import { useState, useEffect } from "react";
import { Frame, RefineBox, AppFooter, AISuggestionBadge } from "../shared";
import { FooterNavigation } from "../Navigation";
import { draftDistinguishers, type Distinguisher } from "../../../services/api";

/**
 * Phase 2: Sharpen Against Close Terms - Hi-fi dark mode
 */
export function P2SharpenScreen({
  onNext,
  onBack,
  candidates = [],
  termName = "your concept",
  description = "",
}: {
  onNext: (choice: "match" | "new", data?: any) => void;
  onBack?: () => void;
  candidates?: string[];
  termName?: string;
  description?: string;
}) {
  const [state, setState] = useState<"match" | "new">("match");
  const [senseChoice, setSenseChoice] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedSocraticOption, setSelectedSocraticOption] = useState<string>("");
  const [customSense, setCustomSense] = useState("");
  const [refineNew, setRefineNew] = useState("");
  const [demoModal, setDemoModal] = useState<string | null>(null);
  const [distinguishers, setDistinguishers] = useState<Distinguisher[] | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    if (!description.trim() || candidates.length === 0) return;
    let cancelled = false;
    setIsDrafting(true);
    draftDistinguishers(termName, description, candidates)
      .then((result) => {
        if (!cancelled) setDistinguishers(result);
      })
      .catch(() => {
        // Falls back to the static "review how your concept differs" text below.
      })
      .finally(() => {
        if (!cancelled) setIsDrafting(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demoContent = {
    mic: "Voice input: describe your concept out loud and the system transcribes it into your refinement. Not wired yet in this preview: type it instead.",
    image: "Image input: upload a photo or diagram and the system describes what it sees. Not wired yet in this preview: describe it in words instead.",
    upload: "File input: attach a document and the system pulls out the relevant concepts. Not wired yet in this preview: paste the key details in instead.",
    link: "Link input: paste a URL and the system reads and summarizes the page. Not wired yet in this preview: summarize it yourself instead.",
  };

  // Next is enabled when:
  // - User in "new" state AND has typed refinement text
  // - senseChoice === "yes"
  // - senseChoice === "no" AND selectedSocraticOption is selected
  const canAdvance = 
    (state === "new" && refineNew.trim().length > 0) ||
    senseChoice === "yes" ||
    (senseChoice === "no" && selectedSocraticOption.length > 0);

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title={state === "match" ? "Phase 2. Sharpen against close terms" : "Phase 2. Create new concept"}
          subtitle={
            state === "match"
              ? "We found terms that are close to yours. Tell us what makes your concept different."
              : "no close match found. Let's define yours from scratch."
          }
        >
          {state === "match" ? (
            <>
              {/* "We think you mean..." card */}
              <div className="mb-4 p-4 rounded-lg border border-[#2a2a3a] bg-[#13131c]">
                <div className="mb-2"><AISuggestionBadge /></div>
                <h3 className="text-[13px] font-medium mb-2 text-[#e0e0e8]">We think you mean…</h3>
                <p className="text-[12px] text-[#c0c0c8] mb-3">
                  {termName} in the sense of a generic category.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSenseChoice("yes")}
                    className={`px-3 py-1.5 text-[11px] rounded-md ${
                      senseChoice === "yes"
                        ? "bg-[#e0e0e8] text-[#0a0a14]"
                        : "bg-[#1a1a26] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                    }`}
                  >
                    Yes, that's what I mean
                  </button>
                  <button
                    onClick={() => setSenseChoice("no")}
                    className={`px-3 py-1.5 text-[11px] rounded-md ${
                      senseChoice === "no"
                        ? "bg-[#e0e0e8] text-[#0a0a14]"
                        : "bg-[#1a1a26] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                    }`}
                  >
                    No, I mean something else
                  </button>
                </div>

                {senseChoice === "no" && (
                  <div className="mt-4 space-y-2">
                    {["The sense of a related but distinct concept", "The sense of a broader category", "None of these"].map(
                      (opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedOption(`sense-${idx}`)}
                          className={`w-full text-left p-2 rounded text-[11px] ${
                            selectedOption === `sense-${idx}`
                              ? "bg-white/10 border border-[#717182]"
                              : "bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    )}

                    {selectedOption === "sense-2" && (
                      <textarea
                        value={customSense}
                        onChange={(e) => setCustomSense(e.target.value)}
                        placeholder="Describe the sense you mean..."
                        rows={2}
                        className="w-full bg-[#1a1a26] border border-[#2a2a3a] rounded-lg px-3 py-2 text-[12px] mt-2 outline-none resize-none focus:border-[#717182] placeholder:text-[#555]"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Closest existing terms */}
              {candidates.length > 0 && (
                <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
                  <h3 className="text-[11px] font-medium mb-2 text-[#a0a0b0]">Closest existing terms:</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidates.map((term) => (
                      <span
                        key={term}
                        className="px-2 py-0.5 rounded bg-white/5 border border-[#2a2a3a] text-[11px] text-[#c0c0c8]"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Socratic question */}
              <div className="mb-4 p-4 rounded-lg border border-[#2a2a3a] bg-[#13131c]">
                <p className="text-[12px] mb-3 text-[#c0c0c8]">
                  Which sense best matches what YOU mean by [your term] here?
                </p>
                <div className="space-y-2">
                  {[
                    { letter: "A", text: "A specific instance or category" },
                    { letter: "B", text: "A broader or related concept" },
                    { letter: "C", text: "Something else" },
                  ].map((opt) => (
                    <button
                      key={opt.letter}
                      onClick={() => setSelectedSocraticOption(opt.letter)}
                      className={`w-full text-left p-2 rounded-lg transition ${
                        selectedSocraticOption === opt.letter
                          ? "bg-white/10 border-2 border-[#717182]"
                          : "bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                      }`}
                    >
                      <span
                        className={`inline-block w-6 h-6 rounded-full text-center mr-2 text-[11px] leading-6 ${
                          selectedSocraticOption === opt.letter
                            ? "bg-[#e0e0e8] text-[#0a0a14] border-2 border-[#e0e0e8]"
                            : "border border-[#3a3a4a] text-[#a0a0b0]"
                        }`}
                      >
                        {opt.letter}
                      </span>
                      <span className={`text-[12px] ${selectedSocraticOption === opt.letter ? "text-[#e0e0e8]" : "text-[#c0c0c8]"}`}>
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#717182] mt-2">
                  None of these fit? Tell us below and we'll regenerate the questions.
                </p>
              </div>

              {/* Distinguish from neighbors */}
              {candidates.length > 0 && (
                <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
                  <div className="mb-2 flex items-center gap-2">
                    <AISuggestionBadge />
                    {isDrafting && <span className="text-[10px] text-[#717182]">drafting with Gemini…</span>}
                  </div>
                  {(distinguishers ?? candidates.slice(0, 2).map((c) => ({ candidate: c, reason: "review how your concept differs before continuing" }))).map((d) => (
                    <p key={d.candidate} className="text-[11px] text-[#c0c0c8] mt-1 first:mt-0">
                      <strong className="text-[#e0e0e8]">vs {d.candidate}:</strong> {d.reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Primary Continue — only when a sense option is selected */}
              {selectedSocraticOption && (
                <div className="mb-3 p-4 bg-[#13131c] border-2 border-[#3a3a4a] rounded-lg">
                  <button
                    onClick={() => onNext(state)}
                    className="w-full py-3 bg-[#e0e0e8] hover:bg-white rounded-lg text-[13px] text-[#0a0a14] font-medium"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Escape CTA — prominent when no option selected, subordinated after */}
              <div className="mb-4">
                <button
                  onClick={() => setState("new")}
                  className={`w-full py-3 rounded-lg text-[13px] font-medium transition-colors ${
                    selectedSocraticOption
                      ? "bg-transparent border border-[#2a2a3a] text-[#717182] hover:border-[#3a3a4a] hover:text-[#a0a0b0]"
                      : "bg-[#e0e0e8] hover:bg-white text-[#0a0a14]"
                  }`}
                >
                  None of these fit. Let me describe the sense in my own words.
                </button>
              </div>
            </>
          ) : (
            <>
              {/* New concept state */}
              <div className="mb-4 p-4 bg-[#13131c] border border-[#2a2a3a] rounded-lg text-center">
                <p className="text-[15px] text-[#e0e0e8]">✓ Got it. We'll help you create a brand new term.</p>
              </div>

              <div className="mb-4">
                <label className="text-[13px] text-[#c0c0c8] mb-3 block leading-relaxed">
                  Think your concept is new enough to be its own term? Let's help you refine your definition to justify it.
                </label>
                <RefineBox
                  value={refineNew}
                  onChange={setRefineNew}
                  placeholder="Add any additional details..."
                  rows={4}
                  onMicClick={() => setDemoModal("mic")}
                  onImageClick={() => setDemoModal("image")}
                  onUploadClick={() => setDemoModal("upload")}
                  onLinkClick={() => setDemoModal("link")}
                />
              </div>

              <button
                onClick={() => setState("match")}
                className="mb-4 text-[11px] text-[#a0a0b0] hover:text-white"
              >
                ← Back to suggested matches
              </button>
            </>
          )}
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={() => onNext(state)} nextDisabled={!canAdvance} />

      {/* Demo Modal */}
      {demoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
              {demoContent[demoModal as keyof typeof demoContent]}
            </p>
            <button
              onClick={() => setDemoModal(null)}
              className="w-full py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] mb-3"
            >
              Got it
            </button>
            <p className="text-xs text-neutral-500 text-center">
              If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}