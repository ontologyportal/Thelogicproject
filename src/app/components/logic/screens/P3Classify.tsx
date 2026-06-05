import { useState } from "react";
import { Frame, AppFooter } from "../shared";
import { FooterNavigation } from "../Navigation";

/**
 * Phase 3: Classify the Concept - Hi-fi dark mode
 */
type QuestionType =
  | { type: "yes-no"; question: string }
  | { type: "choice"; question: string; options: [string, string] };

export function P3ClassifyScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
}) {
  const [currentCard, setCurrentCard] = useState(0);
  const [answers, setAnswers] = useState<Array<string>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questions: QuestionType[] = [
    { type: "yes-no", question: "Is this something physical you can touch?" },
    { type: "yes-no", question: "Does it happen over a period of time?" },
    { type: "choice", question: "Which best describes this concept?", options: ["Many examples", "One specific thing"] },
  ];

  const handleAnswer = (answer: string) => {
    // Radio-style: allow changing selection before advancing
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentCard] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentCard < questions.length - 1) {
      setTimeout(() => {
        setCurrentCard(currentCard + 1);
      }, 300);
    }
  };

  const canAdvance = answers.length === questions.length;

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 3. Classify the concept"
          subtitle="let's figure out what kind of thing this is"
        >
          {/* Chatbot card sequence */}
          <div className="space-y-3 mb-6">
            {questions.map((q, idx) => {
              const isWaiting = idx > currentCard;
              const isCurrent = idx === currentCard;
              const isDone = idx < currentCard;
              const question = q.type === "yes-no" ? q.question : q.question;

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
                      {q.type === "yes-no" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnswer("yes")}
                            className={`flex-1 py-2 rounded-md text-[12px] border transition-colors ${
                              selectedAnswer === "yes"
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-[#1a1a26] border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleAnswer("no")}
                            className={`flex-1 py-2 rounded-md text-[12px] border transition-colors ${
                              selectedAnswer === "no"
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-[#1a1a26] border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnswer(q.options[0])}
                            className={`flex-1 py-2 rounded-md text-[12px] border transition-colors ${
                              selectedAnswer === q.options[0]
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-[#1a1a26] border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                            }`}
                          >
                            {q.options[0]}
                          </button>
                          <button
                            onClick={() => handleAnswer(q.options[1])}
                            className={`flex-1 py-2 rounded-md text-[12px] border transition-colors ${
                              selectedAnswer === q.options[1]
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-[#1a1a26] border-[#2a2a3a] text-[#a0a0b0] hover:border-[#3a3a4a]"
                            }`}
                          >
                            {q.options[1]}
                          </button>
                        </div>
                      )}
                      {selectedAnswer && (
                        <button
                          onClick={handleConfirmAnswer}
                          className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md text-[12px] text-white"
                        >
                          Confirm and continue
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-[12px] text-[#717182]">{question}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="p-3 bg-[#1a1a26] border border-[#2a2a3a] rounded-lg text-center">
            <div className="flex justify-center gap-2 mb-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`size-2 rounded-full ${
                    i < answers.length ? "bg-blue-500" : "bg-[#2a2a3a]"
                  } ${i === currentCard ? "animate-pulse" : ""}`}
                  style={{
                    animationDelay: i === currentCard ? `${i * 0.2}s` : undefined,
                  }}
                />
              ))}
            </div>
            <p className="text-[12px] text-[#c0c0c8]">Narrowing down the definition…</p>
            <p className="text-[10px] text-[#717182] mt-1">
              Progress: {Math.min(answers.length, questions.length)} / {questions.length}
            </p>
          </div>
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={onNext} nextDisabled={!canAdvance} />
    </div>
  );
}
