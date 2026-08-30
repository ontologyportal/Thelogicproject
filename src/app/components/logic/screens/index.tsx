// Export all screens for easy importing
export { SplashScreen } from "./Splash";
export { P1DescribeScreen } from "./P1Describe";
export { P2SearchScreen } from "./P2Search";
export { P2SharpenScreen } from "./P2Sharpen";
export { P3ClassifyScreen } from "./P3Classify";

import { Frame, RefineBox, AppFooter, AISuggestionBadge } from "../shared";
import { FooterNavigation } from "../Navigation";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Copy, Twitter, Link, Github } from "lucide-react";
import {
  runGates,
  submitContribution,
  draftFields,
  draftStatements,
  DEMO_TERM,
  type Gate,
  type ProofResult,
  type Scenario,
  type Contribution,
  type SubmitResult,
  type FailureHistoryEntry,
} from "../../../services/api";
import {
  runFormalizeLoop,
  type FormalizeLayer,
  type Escalation,
  type DecisionTrailEntry,
} from "../../../services/formalize";

const PLACE_QUESTIONS = [
  "Can you buy or sell it?",
  "Is it created by an organization or authority?",
];

/**
 * P4: Find Its Parent - Hi-fi dark mode
 */
export function P4PlaceScreen({
  onNext,
  onBack,
  answers,
  onAnswersChange,
  elaboration,
  onElaborationChange,
  termName,
  proposedParent,
}: {
  onNext: () => void;
  onBack?: () => void;
  answers: string[];
  onAnswersChange: (answers: string[]) => void;
  elaboration: string;
  onElaborationChange: (text: string) => void;
  termName: string;
  proposedParent: string;
}) {
  const questions = PLACE_QUESTIONS;
  const [currentCard, setCurrentCard] = useState(() => Math.min(answers.length, questions.length));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [demoModal, setDemoModal] = useState<string | null>(null);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const demoContent = {
    mic: "Voice input: describe out loud how your concept differs from its parent. Not wired yet in this preview: type it instead.",
    image: "Image input: upload a photo or diagram and the system describes what it sees. Not wired yet in this preview: describe it in words instead.",
    upload: "File input: attach a document and the system pulls out the relevant concepts. Not wired yet in this preview: paste the key details in instead.",
    link: "Link input: paste a URL and the system reads and summarizes the page. Not wired yet in this preview: summarize it yourself instead.",
  };

  const handleAnswer = (answer: string) => {
    // Clear any existing timer if user changes selection
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
    }

    // Update selection
    setSelectedAnswer(answer);

    // Start 700ms auto-advance timer
    advanceTimerRef.current = setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentCard] = answer;
      onAnswersChange(newAnswers);
      setSelectedAnswer(null);

      if (currentCard < questions.length - 1) {
        setCurrentCard(currentCard + 1);
      }
    }, 700);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

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
                      ? "bg-[#13131c] border-[#3a3a4a]"
                      : "bg-[#13131c]/60 border-[#2a2a3a] opacity-60"
                  }`}
                >
                  {isDone ? (
                    <p className="text-[12px] text-[#a0a0b0]">
                      ✓ Answered: <strong className="text-[#e0e0e8]">{answers[idx]}</strong>
                    </p>
                  ) : isCurrent ? (
                    <>
                      <p className="text-[15px] mb-4 text-[#e0e0e8]">
                        {question}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnswer("yes")}
                          className={`flex-1 py-2 rounded-md text-[12px] border transition-colors ${
                            selectedAnswer === "yes"
                              ? "bg-[#e0e0e8] border-[#e0e0e8] text-[#0a0a14]"
                              : "bg-[#1a1a26] border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleAnswer("no")}
                          className={`flex-1 py-2 rounded-md text-[12px] border transition-colors ${
                            selectedAnswer === "no"
                              ? "bg-[#e0e0e8] border-[#e0e0e8] text-[#0a0a14]"
                              : "bg-[#1a1a26] border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                          }`}
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
                  Entity → PhysicalObject → <span className="text-[#a0a0b0]">{proposedParent}</span> → <span className="underline text-[#e0e0e8]">{termName}</span>
                </p>
              </div>

              {/* Elaboration prompt with multimodal input */}
              <div className="mb-4">
                <label className="text-[12px] text-[#c0c0c8] mb-3 block leading-relaxed">
                  How is {termName} more specific than {proposedParent}? Can you give an example where they would differ?
                </label>
                <RefineBox
                  value={elaboration}
                  onChange={onElaborationChange}
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
              className="w-full py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] mb-3"
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
 * P5: Define the Term - Hi-fi dark mode
 */
export function P5DefineScreen({
  onNext,
  onBack,
  onFieldsChange,
  description,
  scenario,
}: {
  onNext: () => void;
  onBack?: () => void;
  onFieldsChange?: (fields: { parent: string; everydayName: string; docString: string }) => void;
  description?: string;
  scenario?: string;
}) {
  const [accepted, setAccepted] = useState<boolean[]>([false, false, false]);
  const [edited, setEdited] = useState<boolean[]>([false, false, false]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [demoModal, setDemoModal] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftedByAI, setDraftedByAI] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const demoContent = {
    mic: "Voice input: talk through why a suggested field is wrong and the system revises it. Not wired yet in this preview: type it instead.",
    image: "Image input: upload a photo or diagram and the system describes what it sees. Not wired yet in this preview: describe it in words instead.",
    upload: "File input: attach a document and the system pulls out the relevant concepts. Not wired yet in this preview: paste the key details in instead.",
    link: "Link input: paste a URL and the system reads and summarizes the page. Not wired yet in this preview: summarize it yourself instead.",
  };

  const initialFields = [
    { label: "Most specific, more general thing it is a kind of", value: "[Parent Category]", gloss: "the broader category it belongs to" },
    { label: "Everyday English Name", value: "[Your Term]", gloss: "the friendly label people will read" },
    { label: "One-Sentence Simple Description", value: "[Generated description placeholder]", gloss: "summary anyone can understand" },
  ];

  const [fieldValues, setFieldValues] = useState(initialFields.map(f => f.value));

  // Draft real suggestions from the Phase 1 description via GenAI-MIL
  // (Gemini). Falls back silently to the static placeholders above if this
  // isn't configured or the call fails — never blocks the wizard.
  useEffect(() => {
    if (!description || !description.trim()) return;
    let cancelled = false;
    setIsDrafting(true);
    setDraftError(null);
    draftFields(description, scenario)
      .then((fields) => {
        if (cancelled) return;
        setFieldValues([fields.parent, fields.everydayName, fields.docString]);
        setDraftedByAI(true);
      })
      .catch((e) => {
        if (cancelled) return;
        setDraftError(String(e.message || e));
      })
      .finally(() => {
        if (!cancelled) setIsDrafting(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only lift fields the user has actually confirmed — the initial values
    // are bracketed placeholders ("[Parent Category]"), not valid KIF terms.
    const confirmed = (idx: number) => (accepted[idx] || edited[idx] ? fieldValues[idx] : "");
    onFieldsChange?.({
      parent: confirmed(0),
      everydayName: confirmed(1),
      docString: confirmed(2),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValues, accepted, edited]);

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditValue(fieldValues[idx]);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const newValues = [...fieldValues];
      newValues[editingIndex] = editValue;
      setFieldValues(newValues);

      const newEdited = [...edited];
      newEdited[editingIndex] = true;
      setEdited(newEdited);

      setEditingIndex(null);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 5. Define the term"
          subtitle="review our suggestions and edit if needed"
        >
          {isDrafting && (
            <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg flex items-center gap-2 text-[12px] text-[#a0a0b0]">
              <span className="inline-block animate-spin">↻</span>
              Drafting from your description with Gemini (GenAI-MIL)…
            </div>
          )}
          {draftedByAI && !isDrafting && (
            <div className="mb-4 text-[11px] text-[#717182]">
              Drafted from your Phase 1 description via Gemini 2.5 Flash (GenAI-MIL).
            </div>
          )}
          {draftError && !isDrafting && (
            <div className="mb-4 text-[11px] text-[#717182]">
              Could not reach the drafting service ({draftError}). Showing placeholders below.
            </div>
          )}
          {initialFields.map((field, idx) => {
            const isEditing = editingIndex === idx;
            const isEdited = edited[idx];
            const isAccepted = accepted[idx];

            return (
              <div key={idx} className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
                <div className="mb-1.5">
                  <AISuggestionBadge variant={idx === 2 ? "inference" : "default"} />
                </div>
                <label className="text-[10px] uppercase tracking-wider text-[#717182] mb-1 block">
                  {field.label}
                  <span className="text-[10px] text-[#555] normal-case ml-1">({field.gloss})</span>
                  {isEdited && <span className="ml-2 text-[10px] text-[#a0a0b0]">✓ edited</span>}
                </label>

                {isEditing ? (
                  <>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      className="w-full bg-[#13131c] border border-[#2a2a3a] rounded-lg px-3 py-2 text-[13px] mb-2 outline-none resize-none focus:border-[#717182] text-[#e0e0e8]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-[11px] rounded-md bg-[#e0e0e8] hover:bg-white text-[#0a0a14]"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 text-[11px] rounded-md bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex-1 text-[13px] text-[#e0e0e8]">{fieldValues[idx]}</span>
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
                          isAccepted
                            ? "bg-[#e0e0e8] text-[#0a0a14]"
                            : "bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                        }`}
                      >
                        A · accept
                      </button>
                      <button
                        onClick={() => handleEdit(idx)}
                        className="px-3 py-1.5 text-[11px] rounded-md bg-[#13131c] border border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                      >
                        B · edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <RefineBox
            onMicClick={() => setDemoModal("mic")}
            onImageClick={() => setDemoModal("image")}
            onUploadClick={() => setDemoModal("upload")}
            onLinkClick={() => setDemoModal("link")}
          />
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!(accepted.every((val, idx) => val || edited[idx]))}
      />

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
                className="flex-1 py-2 bg-transparent border-2 border-[#e0e0e8] hover:bg-white/5 rounded-md text-[13px] text-[#e0e0e8] font-medium"
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
              className="w-full py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] mb-3"
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
 * P6: Statements - Hi-fi dark mode
 */
export function P6StatementsScreen({
  onNext,
  onBack,
  termName = "your concept",
  description = "",
}: {
  onNext: (approvedStatements: string[]) => void;
  onBack?: () => void;
  termName?: string;
  description?: string;
}) {
  const [statements, setStatements] = useState([
    { text: `If something is a ${termName}, then [property 1].`, approved: false },
    { text: `${termName} has [property 2].`, approved: false },
    { text: `${termName} relates to [property 3].`, approved: false },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [demoModal, setDemoModal] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    if (!description.trim()) return;
    let cancelled = false;
    setIsDrafting(true);
    draftStatements(termName, description)
      .then((drafted) => {
        if (cancelled || drafted.length === 0) return;
        setStatements(drafted.map((text) => ({ text, approved: false })));
      })
      .catch(() => {
        // Falls back to the static placeholder statements above.
      })
      .finally(() => {
        if (!cancelled) setIsDrafting(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demoContent = {
    mic: "Voice input: talk through how a statement should be corrected and the system revises it. Not wired yet in this preview: type it instead.",
    image: "Image input: upload a photo or diagram and the system describes what it sees. Not wired yet in this preview: describe it in words instead.",
    upload: "File input: attach a document and the system pulls out the relevant concepts. Not wired yet in this preview: paste the key details in instead.",
    link: "Link input: paste a URL and the system reads and summarizes the page. Not wired yet in this preview: summarize it yourself instead.",
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
          {isDrafting && (
            <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg flex items-center gap-2 text-[12px] text-[#a0a0b0]">
              <span className="inline-block animate-spin">↻</span>
              Drafting statements with Gemini (GenAI-MIL)…
            </div>
          )}
          {isLoading && (
            <div className="mb-4 p-4 bg-[#13131c] border border-[#2a2a3a] rounded-lg flex items-center gap-3">
              <div className="animate-spin">
                <div className="size-8 rounded-full bg-gradient-to-br from-[#2a2a3a] to-[#13131c] border border-[#3a3a4a] flex items-center justify-center">
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
                  ? "bg-white/5 border-2 border-[#717182]"
                  : "bg-[#1a1a26] border border-[#2a2a3a]"
              }`}
            >
              <div className="mb-1.5"><AISuggestionBadge /></div>
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
                      ? "bg-[#e0e0e8] text-[#0a0a14]"
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
                  className="px-3 py-1.5 text-[11px] rounded-md bg-transparent border border-[#3a3a4a] text-[#a0a0b0] hover:border-[#e0e0e8] hover:text-[#e0e0e8]"
                >
                  C · drop
                </button>
              </div>
            </div>
          ))}

          {editingIndex !== null && (
            <div className="mb-4">
              <p className="text-[11px] text-[#a0a0b0] mb-2">↑ Refine the highlighted statement above:</p>
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
                className="mt-2 px-4 py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[12px] text-[#0a0a14]"
              >
                Submit refinement
              </button>
            </div>
          )}
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation
        onBack={onBack}
        onNext={() => onNext(statements.filter((s) => s.approved).map((s) => s.text))}
        nextDisabled={!allApproved}
      />

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-5">
          <p className="text-[12px] text-[#e0e0e8]">Statement dropped. The system will not include it in your definition.</p>
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
              className="w-full py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] mb-3"
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
 * Formalize: the Socratic constraint loop between the user's plain-language
 * description and the ATP proof. Drafts a real rule (via GenAI-MIL/Gemini),
 * runs it through deterministic vocabulary -> syntax -> proof checks
 * against the in-browser SUMO session (src/app/services/formalize.ts),
 * auto-retrying with a corrective signal on failure up to the connector
 * contract's retry_policy budget, then escalating to a template-constrained
 * question the user answers themselves rather than retrying forever.
 * Never falls back to a canned formula — an unrecoverable failure is a
 * plain error with Retry, not a silent substitution.
 */
export function FormalizeScreen({
  term,
  parent,
  description,
  scenario,
  statements,
  onDone,
  onEditStatements,
}: {
  term: string;
  parent: string;
  description: string;
  scenario?: string;
  statements?: string[];
  onDone: (result: { formulas: string[]; scenario: Scenario; kif: string }) => void;
  onEditStatements: () => void;
}) {
  type GateState = "pending" | "checking" | "pass" | "fail";
  const LAYERS: { id: FormalizeLayer; label: string; hint: string }[] = [
    { id: "vocabulary", label: "Vocabulary check", hint: "every term checked against SUMO" },
    { id: "syntax", label: "Syntax check", hint: "well-formed SUO-KIF" },
    { id: "proof", label: "Proof attempt", hint: "real automated theorem prover" },
  ];

  const [gateStates, setGateStates] = useState<Record<FormalizeLayer, GateState>>({
    draft: "checking",
    vocabulary: "pending",
    syntax: "pending",
    proof: "pending",
  });
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [escalation, setEscalation] = useState<Escalation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [decisionTrail, setDecisionTrail] = useState<DecisionTrailEntry[]>([]);
  const [showTrail, setShowTrail] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answering, setAnswering] = useState(false);
  const runIdRef = useRef(0);

  const start = (seedHistory: FailureHistoryEntry[] = []) => {
    const myRunId = ++runIdRef.current;
    setGateStates({ draft: "checking", vocabulary: "pending", syntax: "pending", proof: "pending" });
    setRetryMessage(null);
    setEscalation(null);
    setErrorMsg(null);
    runFormalizeLoop(
      { term, parent, description, scenario, statements },
      (e) => {
        if (runIdRef.current !== myRunId) return;
        if (e.type === "layer-start" && e.layer) setGateStates((s) => ({ ...s, [e.layer!]: "checking" }));
        if (e.type === "layer-pass" && e.layer) setGateStates((s) => ({ ...s, [e.layer!]: "pass" }));
        if (e.type === "layer-fail" && e.layer) setGateStates((s) => ({ ...s, [e.layer!]: "fail" }));
        if (e.type === "retry") {
          setRetryMessage(`Attempt ${(e.attempt ?? 1) + 1} — retrying with a corrective signal.`);
          setGateStates({ draft: "checking", vocabulary: "pending", syntax: "pending", proof: "pending" });
        }
      },
      seedHistory
    ).then((result) => {
      if (runIdRef.current !== myRunId) return;
      setDecisionTrail(result.decisionTrail);
      if (result.status === "done") {
        onDone({ formulas: result.formulas, scenario: result.scenario, kif: result.kif });
      } else if (result.status === "escalated") {
        setEscalation(result.escalation);
      } else {
        setErrorMsg(result.errorMessage);
      }
    });
  };

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = () => {
    if (!escalation || !answerText.trim() || answering) return;
    setAnswering(true);
    start([{ validator: escalation.validator, payload: escalation.payload, userAnswer: answerText.trim() }]);
    setAnswerText("");
    setAnswering(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Formalizing your term"
          subtitle="drafting real logic from what you described, then checking it"
        >
          {retryMessage && !escalation && !errorMsg && (
            <div className="mb-4 text-[11px] text-[#717182]">{retryMessage}</div>
          )}

          <div className="space-y-2 mb-6">
            {LAYERS.map((layer) => {
              const state = gateStates[layer.id];
              const tone =
                state === "pass"
                  ? "border-[#3a3a4a] bg-[#13131c]"
                  : state === "fail"
                  ? "border-2 border-[#e0e0e8] bg-[#13131c]"
                  : "border-[#2a2a3a] bg-[#1a1a26]";
              return (
                <div key={layer.id} className={`p-3 rounded-lg border flex items-start gap-3 ${tone}`}>
                  <div className="flex-shrink-0 text-[14px] leading-5 text-[#e0e0e8]">
                    {state === "pass" ? "✓" : state === "fail" ? "✕" : state === "checking" ? (
                      <span className="inline-block animate-spin">↻</span>
                    ) : (
                      "○"
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-[#c0c0c8]">{layer.label}</p>
                    <p className="text-[11px] text-[#717182] mt-0.5">{layer.hint}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg border-2 border-[#e0e0e8] bg-[#13131c] text-[12px] text-[#e0e0e8]">
              Could not draft a real rule ({errorMsg}).
              <button
                onClick={() => start()}
                className="ml-2 px-2 py-0.5 text-[11px] bg-white/10 hover:bg-white/20 rounded text-[#e0e0e8]"
              >
                Retry
              </button>
            </div>
          )}

          {escalation && (
            <div className="mb-6 p-4 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
              <div className="mb-2"><AISuggestionBadge variant="inference" /></div>
              <p className="text-[13px] text-[#e0e0e8] mb-3 leading-relaxed">{escalation.question}</p>
              <RefineBox
                value={answerText}
                onChange={setAnswerText}
                placeholder="Type your answer…"
                rows={2}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAnswer}
                  disabled={!answerText.trim() || answering}
                  className="px-4 py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[12px] text-[#0a0a14] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit answer
                </button>
                {escalation.validator === "proof" && (
                  <button
                    onClick={onEditStatements}
                    className="px-4 py-2 bg-transparent border border-[#2a2a3a] hover:border-[#3a3a4a] rounded-md text-[12px] text-[#a0a0b0]"
                  >
                    Edit statements instead
                  </button>
                )}
              </div>
            </div>
          )}

          {decisionTrail.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowTrail((v) => !v)}
                className="text-[11px] text-[#717182] hover:text-[#a0a0b0]"
              >
                {showTrail ? "Hide" : "Show"} decision trail ({decisionTrail.length} steps)
              </button>
              {showTrail && (
                <div className="mt-2 space-y-1.5">
                  {decisionTrail.map((entry, i) => (
                    <div key={i} className="text-[10.5px] text-[#717182] font-mono flex justify-between gap-3 border-b border-[#1f1f2c] pb-1.5">
                      <span className="truncate">{entry.step}: {entry.decided}</span>
                      <span className="flex-shrink-0">{entry.ms}ms</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Frame>
        <AppFooter />
      </div>
    </div>
  );
}

/**
 * P7: Verify - Hi-fi dark mode
 */
export function P7VerifyScreen({
  onNext,
  onBack,
  onSimulateConflict,
  formulas = DEMO_TERM.formulas,
  scenario = DEMO_TERM.scenario,
  naturalLanguageStatement = DEMO_TERM.naturalLanguage,
  kifStatement = DEMO_TERM.kif,
  scenarioNL = DEMO_TERM.scenarioNL,
}: {
  onNext: () => void;
  onBack?: () => void;
  onSimulateConflict?: () => void;
  formulas?: string[];
  scenario?: Scenario;
  naturalLanguageStatement?: string;
  kifStatement?: string;
  scenarioNL?: string;
}) {
  const [devView, setDevView] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Real validation against the backend (SigmaKEE + Vampire).
  const CHECKING: Gate[] = [
    { id: "syntax", label: "Syntax check", status: "checking" },
    { id: "reference", label: "Reference check", status: "checking" },
    { id: "consistency", label: "Consistency check (Vampire)", status: "checking" },
    { id: "scenario", label: "Scenario verification (Vampire)", status: "checking" },
    { id: "completeness", label: "Completeness check", status: "checking" },
  ];
  const [gates, setGates] = useState<Gate[]>(CHECKING);
  const [proof, setProof] = useState<ProofResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const attemptGates = () => {
    let cancelled = false;
    setGates(CHECKING);
    setError(null);
    runGates({ formulas, scenario })
      .then((res) => {
        if (cancelled) return;
        setGates(res.gates);
        setProof(res.proof);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e.message || e));
      });
    return () => { cancelled = true; };
  };

  useEffect(() => {
    const cancel = attemptGates();
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anyChecking = gates.some((g) => g.status === "checking");
  const anyFail = gates.some((g) => g.status === "fail");
  const consistencyFailed = gates.some((g) => g.id === "consistency" && g.status === "fail");
  const gatesComplete = !anyChecking && !anyFail && !error;

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
            <p className={`text-[12px] ${devView ? "font-mono text-[#e0e0e8]" : "text-[#c0c0c8]"}`}>
              {displayStatement}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {gates.map((gate) => {
              const tone =
                gate.status === "pass"
                  ? "border-[#3a3a4a] bg-[#13131c]"
                  : gate.status === "fail"
                  ? "border-2 border-[#e0e0e8] bg-[#13131c]"
                  : gate.status === "unverified"
                  ? "border border-dashed border-[#3a3a4a] bg-[#13131c]"
                  : gate.status === "skipped"
                  ? "border-[#2a2a3a] bg-[#1a1a26] opacity-60"
                  : "border-[#2a2a3a] bg-[#1a1a26]";
              const textTone =
                gate.status === "pass"
                  ? "text-[#e0e0e8]"
                  : gate.status === "fail"
                  ? "text-[#e0e0e8] font-medium"
                  : gate.status === "unverified"
                  ? "text-[#e0e0e8]"
                  : gate.status === "skipped"
                  ? "text-[#717182]"
                  : "text-[#c0c0c8]";
              return (
                <div key={gate.id} className={`p-3 rounded-lg border flex items-start gap-3 ${tone}`}>
                  <div className="flex-shrink-0 text-[14px] leading-5 text-[#e0e0e8]">
                    {gate.status === "pass" ? (
                      "✓"
                    ) : gate.status === "fail" ? (
                      "✕"
                    ) : gate.status === "unverified" ? (
                      "?"
                    ) : gate.status === "skipped" ? (
                      "–"
                    ) : (
                      <span className="inline-block animate-spin text-[#e0e0e8]">↻</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[12px] ${textTone}`}>{gate.label}</p>
                    {gate.detail && <p className="text-[11px] text-[#717182] mt-0.5">{gate.detail}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg border-2 border-[#e0e0e8] bg-[#13131c] text-[12px] text-[#e0e0e8]">
              Validation could not run ({error}). This normally runs in your browser with no setup needed;
              if it keeps failing, a network or ad-blocker issue may be preventing the checker from loading, or a
              local validator backend needs to be running and reachable at{" "}
              <code className="font-mono">VITE_API_BASE_URL</code>.
              <button
                onClick={attemptGates}
                className="ml-2 px-2 py-0.5 text-[11px] bg-white/10 hover:bg-white/20 rounded text-[#e0e0e8]"
              >
                Retry
              </button>
            </div>
          )}

          {consistencyFailed && onSimulateConflict && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={onSimulateConflict}
                className="px-3 py-1.5 text-[11px] bg-[#e0e0e8] hover:bg-white rounded-md text-[#0a0a14]"
              >
                Resolve consistency conflict →
              </button>
            </div>
          )}

          <div className="p-4 bg-[#13131c] border border-[#2a2a3a] rounded-lg">
            <p className="text-[11px] font-medium mb-2 text-[#e0e0e8]">Test scenario from Phase 1</p>
            <p className="text-[12px] text-[#c0c0c8] mb-3">{scenarioNL}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-3 py-1.5 text-[11px] bg-[#e0e0e8] hover:bg-white rounded-md text-[#0a0a14]"
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
            {proof?.proved ? (
              <>
                <h3 className="text-[15px] font-medium text-[#e0e0e8] mb-3">✓ Verification complete</h3>
                <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
                  The prover returned <strong className="text-[#e0e0e8]">{proof.szs}</strong>
                  {proof.wallMs ? ` in ${(proof.wallMs / 1000).toFixed(1)}s` : ""}. The example inference is
                  formally entailed by your definition, checked by an automated theorem prover.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-[15px] font-medium text-[#e0e0e8] mb-3">? Not verified locally</h3>
                <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
                  The local prover could not confirm this inference{proof?.szs ? ` (${proof.szs})` : ""}, which
                  can happen with a partial knowledge base and doesn't mean it's wrong. This gets checked for
                  real, against the full ontology, when you submit.
                </p>
              </>
            )}
            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] mb-3"
            >
              Got it
            </button>
            <p className="text-xs italic text-neutral-500 text-center">
              This is a real proof attempt over the SUMO knowledge base, not a canned response.
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
              className="w-full py-2 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] mb-3"
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
  termName = "[YourConcept]",
  proposedParent = "your category",
  contribution,
  authStatus = "guest",
  onSignIn,
}: {
  onRestart: () => void;
  termName?: string;
  proposedParent?: string;
  contribution?: Contribution;
  authStatus?: "authenticated" | "guest" | "none";
  onSignIn?: () => void;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const copyTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasSubmittedRef = useRef(false);

  // Signed-in users submit immediately (they've already made their choice).
  // Guests get a moment to choose "sign in to open a credited PR" before we
  // submit on their behalf to the staging repo anonymously either way — both
  // paths are real, neither is a dead end.
  const [status, setStatus] = useState<"choice" | "submitting" | "success" | "error">(
    !contribution ? "success" : authStatus === "authenticated" ? "submitting" : "choice"
  );
  const [prResult, setPrResult] = useState<SubmitResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fireConfetti = () => {
    const burst = {
      origin: { x: 0.5, y: 0.7 },
      spread: 70,
      colors: ["#e0e0e8", "#a0a0b0", "#717182"],
    };
    confetti({ ...burst, particleCount: 80 });
    const t = setTimeout(() => confetti({ ...burst, particleCount: 50 }), 400);
    copyTimersRef.current.push(t);
  };

  const attemptSubmit = () => {
    if (hasSubmittedRef.current) return;
    if (!contribution) {
      setStatus("success");
      fireConfetti();
      return;
    }
    hasSubmittedRef.current = true;
    setStatus("submitting");
    setErrorMsg(null);
    submitContribution(contribution)
      .then((result) => {
        setPrResult(result);
        setStatus("success");
        fireConfetti();
      })
      .catch((err) => {
        hasSubmittedRef.current = false;
        setErrorMsg(String(err.message || err));
        setStatus("error");
      });
  };

  // authStatus starts as "guest" on every real mount (the OAuth redirect
  // brings the page back before the async session check resolves), so this
  // has to react to the prop changing, not just fire once at mount — a
  // mount-only effect here means the screen never notices you actually
  // signed in a beat later and stays frozen on the sign-in prompt.
  useEffect(() => {
    if (authStatus === "authenticated") attemptSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  useEffect(() => {
    return () => {
      copyTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://logicproject.org/contribute").then(() => {
      setCopiedLink(true);
      const t = setTimeout(() => setCopiedLink(false), 1500);
      copyTimersRef.current.push(t);
    }).catch(() => {
      // Clipboard access blocked (insecure origin, permissions policy) —
      // silently skip the "Copied" confirmation rather than lie about it.
    });
  };

  const handleCopyMd = () => {
    navigator.clipboard.writeText(
      `[I contributed to The Logic Project](https://logicproject.org/contribute)`
    ).then(() => {
      setCopiedMd(true);
      const t = setTimeout(() => setCopiedMd(false), 1500);
      copyTimersRef.current.push(t);
    }).catch(() => {
      // Clipboard access blocked — skip the confirmation, don't lie.
    });
  };

  const tweetText = encodeURIComponent(
    "Just contributed to The Logic Project, an open knowledge base anyone can use to reason about the world"
  );
  const statementCount = contribution?.formulas.length ?? 3;

  if (status === "choice") {
    return (
      <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
        <div className="flex-1 overflow-auto">
          <Frame title="Ready to submit" subtitle="one thing before this goes out">
            <div className="p-5 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg mb-4">
              <p className="text-[13px] text-[#c0c0c8] leading-relaxed mb-4">
                Sign in with GitHub to open this as a real pull request under your name.
                Skip it and we'll still open a real PR, just submitted anonymously to the
                staging repo instead of credited to you.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={onSignIn}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14] font-medium"
                >
                  <Github className="size-3.5" /> Sign in to open a real PR
                </button>
                <button
                  onClick={attemptSubmit}
                  className="py-2.5 bg-transparent border border-[#2a2a3a] hover:border-[#3a3a4a] rounded-md text-[13px] text-[#a0a0b0] hover:text-white"
                >
                  Submit as guest
                </button>
              </div>
            </div>
          </Frame>
          <AppFooter />
        </div>
      </div>
    );
  }

  if (status === "submitting") {
    return (
      <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
        <div className="flex-1 overflow-auto">
          <Frame title="Submitting your contribution" subtitle="opening a pull request on GitHub">
            <div className="flex items-center gap-3 p-5 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
              <span className="inline-block animate-spin text-[#e0e0e8] text-[16px]">↻</span>
              <p className="text-[13px] text-[#c0c0c8]">
                Assembling {termName} and opening a pull request against the contribution repo…
              </p>
            </div>
          </Frame>
          <AppFooter />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
        <div className="flex-1 overflow-auto">
          <Frame title="Submission failed" subtitle="your work is not lost">
            <div className="p-5 bg-[#13131c] border-2 border-[#e0e0e8] rounded-lg mb-4">
              <p className="text-[13px] text-[#e0e0e8] mb-3">{errorMsg}</p>
              <button
                onClick={attemptSubmit}
                className="px-3 py-1.5 text-[11px] bg-[#e0e0e8] hover:bg-white rounded-md text-[#0a0a14]"
              >
                Try again
              </button>
            </div>
          </Frame>
          <AppFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Term submitted. Contribute another?"
          subtitle="your contribution is on its way"
        >
          {/* Summary card */}
          <div className="mb-6 p-5 bg-[#13131c] border border-[#2a2a3a] rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1], ease: "easeOut" }}
                className="text-[22px] inline-block"
              >
                🎉
              </motion.span>
              <h3 className="text-[16px] font-medium text-[#e0e0e8]">Your contribution is on its way</h3>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-wider text-[#717182] w-28 flex-shrink-0">Term</span>
                <span className="text-[13px] font-mono text-[#e0e0e8]">{termName}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-wider text-[#717182] w-28 flex-shrink-0">Parent class</span>
                <span className="text-[13px] text-[#c0c0c8]">{proposedParent}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-wider text-[#717182] w-28 flex-shrink-0">Statements</span>
                <span className="text-[13px] text-[#c0c0c8]">{statementCount} statement{statementCount === 1 ? "" : "s"} added</span>
              </div>
            </div>

            <p className="text-[11px] text-[#717182]">
              {prResult ? (
                <>
                  <a
                    href={prResult.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e0e0e8] hover:text-white underline underline-offset-2"
                  >
                    PR #{prResult.prNumber}
                  </a>
                  {authStatus !== "authenticated" && (
                    <>
                      {" "}· submitted anonymously.{" "}
                      <button onClick={onSignIn} className="text-[#e0e0e8] hover:text-white underline underline-offset-2">
                        Sign in to claim credit
                      </button>
                    </>
                  )}
                </>
              ) : (
                "Could not open a pull request."
              )}
            </p>
          </div>

          {/* Share row */}
          <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-[#717182] mb-3">Share your contribution</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2a2a3a] text-[11px] text-[#a0a0b0] hover:border-[#3a3a4a] hover:text-white transition-colors"
              >
                <Copy className="size-3" />
                Copy link
                {copiedLink && (
                  <span className="ml-1 text-[#e0e0e8] animate-in fade-in duration-200">Copied</span>
                )}
              </button>

              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank", "noopener,noreferrer")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2a2a3a] text-[11px] text-[#a0a0b0] hover:border-[#3a3a4a] hover:text-white transition-colors"
              >
                <Twitter className="size-3" />
                Share on X
              </button>

              <button
                onClick={handleCopyMd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2a2a3a] text-[11px] text-[#a0a0b0] hover:border-[#3a3a4a] hover:text-white transition-colors"
              >
                <Link className="size-3" />
                Copy markdown
                {copiedMd && (
                  <span className="ml-1 text-[#e0e0e8] animate-in fade-in duration-200">Copied</span>
                )}
              </button>
            </div>
          </div>

          {/* Suggested next term — unchanged */}
          <div className="mb-4 p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg">
            <div className="mb-2"><AISuggestionBadge /></div>
            <label className="text-[11px] uppercase tracking-wider text-[#717182] mb-2 block">
              Suggested next term (also missing from the knowledge base):
            </label>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[12px] bg-[#e0e0e8] hover:bg-white rounded-md text-[#0a0a14]">
                [SuggestedNextTerm]
              </button>
              <select className="px-3 py-1.5 text-[12px] bg-[#13131c] border border-[#2a2a3a] rounded-md text-[#a0a0b0]">
                <option>More suggestions...</option>
              </select>
            </div>
          </div>

          {/* Action buttons — unchanged */}
          <div className="flex gap-2">
            <button
              onClick={onRestart}
              className="flex-1 py-3 bg-[#e0e0e8] hover:bg-white rounded-md text-[13px] text-[#0a0a14]"
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
