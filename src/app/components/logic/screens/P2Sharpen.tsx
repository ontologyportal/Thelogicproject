import { useState } from "react";
import { Frame, RefineBox, AppFooter } from "../shared";
import { FooterNavigation } from "../Navigation";

/**
 * Phase 2: Sharpen Against Close Terms - Hi-fi dark mode
 */
export function P2SharpenScreen({
  onNext,
  onBack,
  candidates = [],
}: {
  onNext: (choice: "match" | "new", data?: any) => void;
  onBack?: () => void;
  candidates?: string[];
}) {
  const [state, setState] = useState<"match" | "new">("match");
  const [senseChoice, setSenseChoice] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedSocraticOption, setSelectedSocraticOption] = useState<string>("");
  const [customSense, setCustomSense] = useState("");
  const [refineNew, setRefineNew] = useState("");
  const [demoModal, setDemoModal] = useState<string | null>(null);

  const demoContent = {
    mic: "Voice recording demo: [Demo audio captured: 19 seconds. Transcription: 'So I know it's related to nighttime behavior, but I'm not sure if it's about the organisms themselves or just activities that happen at night…']",
    image: "Image demo: [Demo image uploaded: concept-diagram.jpg. The system has identified visual features: Venn diagram, overlapping categories, handwritten labels.]",
    upload: "File demo: [Demo file uploaded: research-notes.txt, 3 pages. The system has extracted key terms: temporal behavior, classification, attributes.]",
    link: "Link demo: [Demo URL: example.org/concept-disambiguation. The system has parsed the page summary.]",
  };

  const canAdvance = state === "new" || senseChoice === "yes" || senseChoice === "no";

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
              <div className="mb-4 p-4 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <h3 className="text-[13px] font-medium mb-2 text-amber-400">We think you mean…</h3>
                <p className="text-[12px] text-[#c0c0c8] mb-3">
                  [YourConcept] in the sense of a generic category.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSenseChoice("yes")}
                    className={`px-3 py-1.5 text-[11px] rounded-md ${
                      senseChoice === "yes"
                        ? "bg-blue-500 text-white"
                        : "bg-[#1a1a26] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                    }`}
                  >
                    Yes, that's what I mean
                  </button>
                  <button
                    onClick={() => setSenseChoice("no")}
                    className={`px-3 py-1.5 text-[11px] rounded-md ${
                      senseChoice === "no"
                        ? "bg-blue-500 text-white"
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
                              ? "bg-blue-500/20 border border-blue-500/40"
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
                        className="w-full bg-[#1a1a26] border border-[#2a2a3a] rounded-lg px-3 py-2 text-[12px] mt-2 outline-none resize-none focus:border-blue-500/40 placeholder:text-[#555]"
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
              <div className="mb-4 p-4 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
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
                          ? "bg-blue-500/20 border-2 border-blue-500/60"
                          : "bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a]"
                      }`}
                    >
                      <span
                        className={`inline-block w-6 h-6 rounded-full text-center mr-2 text-[11px] leading-6 ${
                          selectedSocraticOption === opt.letter
                            ? "bg-blue-500 text-white border-2 border-blue-600"
                            : "border border-[#3a3a4a] text-[#a0a0b0]"
                        }`}
                      >
                        {opt.letter}
                      </span>
                      <span className={`text-[12px] ${selectedSocraticOption === opt.letter ? "text-white" : "text-[#c0c0c8]"}`}>
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
              <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
                <p className="text-[11px] text-[#c0c0c8]">
                  <strong className="text-[#e0e0e8]">vs RelatedConcept1:</strong> yours has property X
                </p>
                <p className="text-[11px] text-[#c0c0c8] mt-1">
                  <strong className="text-[#e0e0e8]">vs RelatedConcept2:</strong> yours differs in scope Y
                </p>
              </div>

              {/* Create New CTA */}
              <div className="mb-4 p-4 bg-gradient-to-br from-blue-500/15 to-blue-500/5 border-2 border-blue-500/40 rounded-lg">
                <button
                  onClick={() => setState("new")}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-[13px] text-white font-medium"
                >
                  None of these fit. Let me describe the sense in my own words.
                </button>
              </div>
            </>
          ) : (
            <>
              {/* New concept state */}
              <div className="mb-4 p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-lg text-center">
                <p className="text-[15px] text-emerald-400">✓ Got it. We'll help you create a brand new term.</p>
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
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white mb-3"
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
