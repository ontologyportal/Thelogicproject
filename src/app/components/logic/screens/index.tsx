// Export all screens for easy importing
export { SplashScreen } from "./Splash";
export { P1DescribeScreen } from "./P1Describe";
export { P2SearchScreen } from "./P2Search";
export { P2SharpenScreen } from "./P2Sharpen";
export { P3ClassifyScreen } from "./P3Classify";

import { Frame, RefineBox, AppFooter } from "../shared";
import { FooterNavigation } from "../Navigation";
import { useState } from "react";

/**
 * P4: Find Its Parent - Hi-fi dark mode
 */
export function P4PlaceScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [currentCard, setCurrentCard] = useState(0);
  const [answers, setAnswers] = useState<Array<"yes" | "no">>([]);
  const [elaboration, setElaboration] = useState("");
  const [demoModal, setDemoModal] = useState<string | null>(null);

  const demoContent = {
    mic: "Voice recording demo: [Demo audio captured: 14 seconds. Transcription: 'It's like a financial instrument but specifically for environmental credits…']",
    image: "Image demo: [Demo image uploaded: hierarchy-sketch.jpg. The system has identified visual features: tree diagram, parent-child relationships, annotation arrows.]",
    upload: "File demo: [Demo file uploaded: taxonomy-draft.docx, 1 page. The system has extracted key terms: classification, inheritance, specialization.]",
    link: "Link demo: [Demo URL: ontology-patterns.org/hierarchy-design. The system has parsed the page summary.]",
  };

  const questions = [
    "Can you buy or sell it?",
    "Is it created by an organization or authority?",
  ];

  const handleAnswer = (answer: "yes" | "no") => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentCard < questions.length - 1) {
      setTimeout(() => {
        setCurrentCard(currentCard + 1);
      }, 300);
    }
  };

  const canAdvance = answers.length === questions.length && elaboration.trim().length > 0;

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 4. Find its parent"
          subtitle="placing it in the hierarchy"
        >
          {/* Chatbot cards */}
          <div className="space-y-3 mb-4">
            {questions.map((question, idx) => {
              const isWaiting = idx > currentCard;
              const isCurrent = idx === currentCard;
              const isDone = idx < currentCard;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border transition-all ${
                    isWaiting
                      ? "bg-[#1a1a26]/40 opacity-40 border-[#2a2a3a]"
                      : isCurrent
                      ? "bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30"
                      : "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 opacity-60"
                  }`}
                >
                  {isDone ? (
                    <p className="text-[12px] text-emerald-400">
                      ✓ Answered: <strong>{answers[idx]}</strong>
                    </p>
                  ) : isCurrent ? (
                    <>
                      <p className="text-[15px] mb-4 text-[#e0e0e8]">
                        {question}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnswer("yes")}
                          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleAnswer("no")}
                          className="flex-1 py-2 bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a] rounded-md text-[12px] text-[#a0a0b0]"
                        >
                          No
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[12px] text-[#717182]">{question}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview hierarchy */}
          {answers.length === questions.length && (
            <>
              <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
                <p className="text-[11px] mb-2 text-[#a0a0b0]">Preview hierarchy:</p>
                <p className="text-[12px] text-[#c0c0c8] font-mono">
                  Entity → PhysicalObject → <span className="text-[#a0a0b0]">[GenericParent]</span> → <span className="underline text-blue-400">[YourConcept]</span>
                </p>
              </div>

              {/* Elaboration prompt with multimodal input */}
              <div className="mb-4">
                <label className="text-[12px] text-[#c0c0c8] mb-3 block leading-relaxed">
                  How is [your term] more specific than [proposed parent]? Can you give an example where they would differ?
                </label>
                <RefineBox
                  value={elaboration}
                  onChange={setElaboration}
                  placeholder="Describe what makes your term more specific..."
                  rows={3}
                  onMicClick={() => setDemoModal("mic")}
                  onImageClick={() => setDemoModal("image")}
                  onUploadClick={() => setDemoModal("upload")}
                  onLinkClick={() => setDemoModal("link")}
                />
              </div>
            </>
          )}
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={onNext} nextDisabled={!canAdvance} />

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

/**
 * P5: Define the Term - Hi-fi dark mode
 */
export function P5DefineScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [accepted, setAccepted] = useState<boolean[]>([false, false, false]);
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [demoModal, setDemoModal] = useState<string | null>(null);

  const demoContent = {
    mic: "Voice recording demo: [Demo audio captured: 21 seconds. Transcription: 'I think the parent category is too broad, maybe I need to be more specific about the domain…']",
    image: "Image demo: [Demo image uploaded: definition-example.png. The system has identified visual features: dictionary entry, formal definition structure, example usage.]",
    upload: "File demo: [Demo file uploaded: glossary-terms.csv, 15 rows. The system has extracted key terms: definition, parent class, attributes.]",
    link: "Link demo: [Demo URL: terminology-standards.org/best-practices. The system has parsed the page summary.]",
  };

  const fields = [
    { label: "Most specific, more general thing it is a kind of", value: "[Parent Category]", gloss: "the broader category it belongs to" },
    { label: "Everyday English Name", value: "[Your Term]", gloss: "the friendly label people will read" },
    { label: "One-Sentence Simple Description", value: "[Generated description placeholder]", gloss: "summary anyone can understand" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 5. Define the term"
          subtitle="review our suggestions and edit if needed"
        >
          {fields.map((field, idx) => (
            <div key={idx} className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
              <label className="text-[10px] uppercase tracking-wider text-[#717182] mb-1 block">
                {field.label}
                <span className="text-[10px] italic text-[#555] normal-case ml-1">({field.gloss})</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex-1 text-[13px] text-[#e0e0e8]">{field.value}</span>
                <button
                  onClick={() => setShowRecycleModal(true)}
                  className="size-6 rounded hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"
                  title="Recycle term"
                >
                  🔄
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newAccepted = [...accepted];
                    newAccepted[idx] = true;
                    setAccepted(newAccepted);
                  }}
                  className={`px-3 py-1.5 text-[11px] rounded-md ${
                    accepted[idx]
                      ? "bg-blue-500 text-white"
                      : "bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                  }`}
                >
                  A · accept
                </button>
                <button className="px-3 py-1.5 text-[11px] rounded-md bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]">
                  B · edit
                </button>
              </div>
            </div>
          ))}

          <RefineBox
            onMicClick={() => setDemoModal("mic")}
            onImageClick={() => setDemoModal("image")}
            onUploadClick={() => setDemoModal("upload")}
            onLinkClick={() => setDemoModal("link")}
          />
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={onNext} nextDisabled={!accepted.every(Boolean)} />

      {/* Recycle Modal */}
      {showRecycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-[15px] font-medium text-[#e0e0e8] mb-3">Recycle term</h3>
            <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
              This will discard your current draft and return you to Phase 1 so you can start over with a new concept. Your current progress will not be saved.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRecycleModal(false)}
                className="flex-1 py-2 bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a] rounded-md text-[13px] text-[#a0a0b0]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRecycleModal(false);
                  // In real app, would navigate to P1
                }}
                className="flex-1 py-2 bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 rounded-md text-[13px] text-red-400"
              >
                Discard and restart
              </button>
            </div>
            <p className="text-xs italic text-neutral-500 text-center mt-4">
              If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
            </p>
          </div>
        </div>
      )}

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

/**
 * P6: Statements - Hi-fi dark mode
 */
export function P6StatementsScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [statements, setStatements] = useState([
    { text: "If something is a [YourConcept], then [property 1].", approved: false },
    { text: "[YourConcept] has [property 2].", approved: false },
    { text: "[YourConcept] relates to [property 3].", approved: false },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [demoModal, setDemoModal] = useState<string | null>(null);

  const demoContent = {
    mic: "Voice recording demo: [Demo audio captured: 18 seconds. Transcription: 'Actually that second statement isn't quite right, it should say that it implies a time-based pattern…']",
    image: "Image demo: [Demo image uploaded: logic-correction.jpg. The system has identified visual features: crossed-out text, handwritten edits, revision marks.]",
    upload: "File demo: [Demo file uploaded: statement-revisions.txt, 2 pages. The system has extracted key terms: implication, logical consequence, refinement.]",
    link: "Link demo: [Demo URL: logic-patterns.org/statement-quality. The system has parsed the page summary.]",
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditText("");
    setShowEditModal(true);
  };

  const handleSubmitEdit = () => {
    setShowEditModal(false);
    setIsLoading(true);

    setTimeout(() => {
      // Replace edited statement with 1-2 new ones
      const newStatements = [...statements];
      newStatements.splice(editingIndex!, 1,
        { text: "[YourConcept] exhibits [refined property].", approved: false }
      );
      setStatements(newStatements);
      setIsLoading(false);
      setEditingIndex(null);
    }, 1200);
  };

  const handleDrop = (idx: number) => {
    const newStatements = statements.filter((_, i) => i !== idx);
    setStatements(newStatements);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const allApproved = statements.every(s => s.approved);

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 6. Statements from your description"
          subtitle="approve each statement we extracted"
        >
          {isLoading && (
            <div className="mb-4 p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-lg flex items-center gap-3">
              <div className="animate-spin">
                <div className="size-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  🤼
                </div>
              </div>
              <p className="text-[13px] text-[#c0c0c8]">Updating based on your feedback…</p>
            </div>
          )}

          {statements.map((statement, idx) => (
            <div
              key={idx}
              className={`mb-3 p-3 rounded-lg ${
                editingIndex === idx
                  ? "bg-blue-500/10 border-2 border-blue-500/40"
                  : "bg-[#1a1a26] border border-[#2a2a3a]"
              }`}
            >
              <p className="text-[12px] text-[#c0c0c8] mb-2">{statement.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newStatements = [...statements];
                    newStatements[idx].approved = true;
                    setStatements(newStatements);
                  }}
                  className={`px-3 py-1.5 text-[11px] rounded-md ${
                    statement.approved
                      ? "bg-blue-500 text-white"
                      : "bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                  }`}
                >
                  A · approve
                </button>
                <button
                  onClick={() => handleEdit(idx)}
                  className="px-3 py-1.5 text-[11px] rounded-md bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                >
                  B · edit
                </button>
                <button
                  onClick={() => handleDrop(idx)}
                  className="px-3 py-1.5 text-[11px] rounded-md bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                >
                  C · drop
                </button>
              </div>
            </div>
          ))}

          {editingIndex !== null && (
            <div className="mb-4">
              <p className="text-[11px] text-blue-400 mb-2">↑ Refine the highlighted statement above:</p>
              <RefineBox
                value={editText}
                onChange={setEditText}
                placeholder="Describe how this statement should be refined..."
                rows={2}
                onMicClick={() => setDemoModal("mic")}
                onImageClick={() => setDemoModal("image")}
                onUploadClick={() => setDemoModal("upload")}
                onLinkClick={() => setDemoModal("link")}
              />
              <button
                onClick={handleSubmitEdit}
                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[12px] text-white"
              >
                Submit refinement
              </button>
            </div>
          )}
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={onNext} nextDisabled={!allApproved} />

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-5">
          <p className="text-[12px] text-emerald-400">Statement dropped. The system will not include it in your definition.</p>
        </div>
      )}

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

/**
 * P7: Verify - Hi-fi dark mode
 */
export function P7VerifyScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [gatesComplete, setGatesComplete] = useState(false);
  const [devView, setDevView] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  useState(() => {
    setTimeout(() => setGatesComplete(true), 2000);
  });

  const gates = [
    { label: "Gate 1: Syntax check passed", status: gatesComplete ? "pass" : "checking" },
    { label: "Gate 2: Reference check passed", status: gatesComplete ? "pass" : "checking" },
    { label: "Gate 3: Consistency check passed", status: gatesComplete ? "pass" : "checking" },
    { label: "Gate 4: Scenario verification passed", status: gatesComplete ? "pass" : "checking" },
    { label: "Gate 5: Completeness check passed", status: gatesComplete ? "pass" : "checking" },
  ];

  const naturalLanguageStatement = "Every [YourConcept] has [defining property].";
  const kifStatement = "(=> (instance ?X YourConcept) (attribute ?X DefiningProperty))";

  const displayStatement = devView ? kifStatement : naturalLanguageStatement;

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 7. Verify your term"
          subtitle="natural language view. Toggle for technical details."
        >
          <div className="mb-4">
            <label className="flex items-center gap-2 text-[11px] cursor-pointer text-[#a0a0b0] hover:text-white">
              <input
                type="checkbox"
                checked={devView}
                onChange={(e) => setDevView(e.target.checked)}
                className="rounded"
              />
              Developer view. Show formal logic.
            </label>
          </div>

          {/* Term definition display */}
          <div className="mb-6 p-4 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
            <h3 className="text-[11px] uppercase tracking-wider text-[#717182] mb-2">
              {devView ? "Formal Definition (KIF)" : "Natural Language"}
            </h3>
            <p className={`text-[12px] ${devView ? "font-mono text-blue-300" : "text-[#c0c0c8]"}`}>
              {displayStatement}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {gates.map((gate, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center gap-3 ${
                  gate.status === "pass"
                    ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5"
                    : "border-[#2a2a3a] bg-[#1a1a26]"
                }`}
              >
                <div className="flex-shrink-0 text-[14px]">
                  {gate.status === "pass" ? "✓" : "⏳"}
                </div>
                <p className={`flex-1 text-[12px] ${gate.status === "pass" ? "text-emerald-400" : "text-[#c0c0c8]"}`}>
                  {gate.label}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-lg">
            <p className="text-[11px] font-medium mb-2 text-amber-400">Test scenario from Phase 1</p>
            <p className="text-[12px] text-[#c0c0c8] mb-3">
              If something is a [YourConcept], then [expected property].
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-3 py-1.5 text-[11px] bg-blue-500 hover:bg-blue-600 rounded-md text-white"
              >
                ▶ Verify
              </button>
              <button
                onClick={() => setShowAIModal(true)}
                className="px-3 py-1.5 text-[11px] bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a] rounded-md text-[#a0a0b0]"
              >
                💬 Ask AI about this term
              </button>
            </div>
          </div>
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={onNext} nextDisabled={!gatesComplete} />

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-[15px] font-medium text-emerald-400 mb-3">✓ Verification complete</h3>
            <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
              All consistency checks passed. Your definition is ready to submit.
            </p>
            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white mb-3"
            >
              Got it
            </button>
            <p className="text-xs italic text-neutral-500 text-center">
              If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
            </p>
          </div>
        </div>
      )}

      {/* Ask AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-[15px] font-medium text-[#e0e0e8] mb-3">AI Analysis: [YourConcept]</h3>
            <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
              This term defines <strong>[YourConcept]</strong> as a subclass of <strong>[ParentCategory]</strong>. It is consistent with related terms in the knowledge base. The closest neighbors are:
            </p>
            <ul className="text-[12px] text-[#c0c0c8] mb-4 space-y-1 list-disc list-inside">
              <li>RelatedTerm1 (relationship type)</li>
              <li>RelatedTerm2 (relationship type)</li>
              <li>RelatedTerm3 (relationship type)</li>
            </ul>
            <button
              onClick={() => setShowAIModal(false)}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white mb-3"
            >
              Got it
            </button>
            <p className="text-xs italic text-neutral-500 text-center">
              If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Submit Screen - Hi-fi dark mode
 */
export function SubmitScreen({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Term submitted. Contribute another?"
          subtitle="your contribution is on its way"
        >
          <div className="mb-6 p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-lg text-center">
            <p className="text-[16px] mb-1 text-emerald-400">🎉 PR #[NNN] opened · [YourConcept]</p>
            <p className="text-[11px] text-[#717182]">
              Guest? routed to staging queue. Signed in? PR opened on your fork.
            </p>
          </div>

          <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
            <label className="text-[11px] uppercase tracking-wider text-[#717182] mb-2 block">
              Suggested next term (also missing from the knowledge base):
            </label>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[12px] bg-blue-500 hover:bg-blue-600 rounded-md text-white">
                [SuggestedNextTerm]
              </button>
              <select className="px-3 py-1.5 text-[12px] bg-[#13131c] border border-[#2a2a3a] rounded-md text-[#a0a0b0]">
                <option>More suggestions...</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onRestart}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white"
            >
              Yes. Back to Phase 1 with this term.
            </button>
            <button className="flex-1 py-3 bg-[#1a1a26] border border-[#2a2a3a] hover:border-[#3a3a4a] rounded-md text-[13px] text-[#a0a0b0]">
              No. Exit cleanly.
            </button>
          </div>
        </Frame>

        <AppFooter />
      </div>
    </div>
  );
}
