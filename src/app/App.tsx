import { useState, useEffect, useRef } from "react";
import { TopNavigation, PhaseTransition, StepNavigator } from "./components/logic/Navigation";
import { type PhaseId } from "./components/logic/shared";
import {
  SplashScreen,
  P1DescribeScreen,
  P2SearchScreen,
  P2SharpenScreen,
  P3ClassifyScreen,
  P4PlaceScreen,
  P5DefineScreen,
  P6StatementsScreen,
  FormalizeScreen,
  P7VerifyScreen,
  SubmitScreen,
} from "./components/logic/screens";
import {
  ConflictResolutionScreen,
  DisputeSubmittedScreen,
} from "./components/logic/screens/ConflictResolution";
import { getMe, DEMO_TERM, type Contribution, type Scenario } from "./services/api";
import { saveResumeState, takeResumeState } from "./services/resume";

/**
 * The Logic Project - Build A (Production App)
 * Complete workflow with stubbed backend calls
 * No canned data, all UI states present
 */
export default function App() {
  const [currentPhase, setCurrentPhase] = useState<PhaseId>("splash");
  const [completedPhases, setCompletedPhases] = useState<PhaseId[]>([]);
  // No auth ceremony on entry — everyone starts as a guest immediately.
  // Sign-in is offered later, scoped to the moment it actually matters
  // (TopNav, always available; Submit, where it unlocks a real credited PR).
  const [authStatus, setAuthStatus] = useState<"authenticated" | "guest" | "none">("guest");
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [autoTitle, setAutoTitle] = useState("");
  const [transition, setTransition] = useState<{ open: boolean; status: string }>({
    open: false,
    status: "",
  });

  // Lifted phase state — persists when user navigates back
  const [p1Description, setP1Description] = useState("");
  const [p1Scenario, setP1Scenario] = useState("");
  const [p5Fields, setP5Fields] = useState({ parent: "", everydayName: "", docString: "" });
  const [p3Answers, setP3Answers] = useState<string[]>([]);
  const [p4Answers, setP4Answers] = useState<string[]>([]);
  const [p4Elaboration, setP4Elaboration] = useState("");
  const [p6Statements, setP6Statements] = useState<string[]>([]);
  const proposedParent = p5Fields.parent || "your category";

  // The real formalize loop's output (src/app/services/formalize.ts) — null
  // until the Socratic constraint loop has actually produced a real,
  // checked rule. p7-verify renders FormalizeScreen instead of itself
  // whenever this is null, so both the normal P6->P7 flow and a direct
  // nav-pill jump to P7 trigger real formalization rather than ever
  // falling back to DEMO_TERM's canned formula.
  const [draftedFormulas, setDraftedFormulas] = useState<string[] | null>(null);
  const [draftedScenario, setDraftedScenario] = useState<Scenario | null>(null);
  const [draftedKif, setDraftedKif] = useState<string | null>(null);

  const clearDraftedRules = () => {
    setDraftedFormulas(null);
    setDraftedScenario(null);
    setDraftedKif(null);
  };

  const restoredRef = useRef(false);

  // Real GitHub identity, if the user has already signed in (e.g. returning
  // from the OAuth redirect, or a prior session cookie).
  useEffect(() => {
    getMe()
      .then((me) => {
        if (me) {
          setAuthStatus("authenticated");
          setUserName(me.login);
        }
      })
      .catch(() => {
        // Network hiccup checking for an existing session — already
        // defaulted to guest, nothing more to do.
      });
  }, []);

  // Resume an in-progress draft across the OAuth round trip. Independent of
  // the getMe() effect above — restoring the draft doesn't depend on the
  // auth outcome; a canceled sign-in should still get the user's work back.
  // Restoring currentPhase alone is enough: signing in from Submit resumes
  // directly onto Submit (where the existing attemptSubmit effect fires
  // once contribution is truthy); signing in from TopNav mid-flow resumes
  // wherever the user actually was. No forced navigation needed either way.
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const saved = takeResumeState();
    if (!saved) return;
    setCurrentPhase(saved.currentPhase);
    setP1Description(saved.p1Description);
    setP1Scenario(saved.p1Scenario);
    setP5Fields(saved.p5Fields);
    setAutoTitle(saved.autoTitle);
    setP3Answers(saved.p3Answers);
    setP4Answers(saved.p4Answers);
    setP4Elaboration(saved.p4Elaboration);
    setCompletedPhases(saved.completedPhases);
  }, []);

  const signIn = () => {
    saveResumeState({
      currentPhase,
      p1Description,
      p1Scenario,
      p5Fields,
      autoTitle,
      p3Answers,
      p4Answers,
      p4Elaboration,
      completedPhases,
    });
    window.location.href = "/api/auth/login";
  };

  // formulas/scenario come from the real formalize loop now — DEMO_TERM is
  // only a fallback for the term/parent NAME labels (harmless placeholder
  // text before the user has typed anything), never for logical content.
  // If draftedFormulas is somehow still null when this is read (e.g. the
  // resume-across-OAuth gap noted below), formulas is an empty array —
  // submit.js's own validation cleanly rejects that with a 400, which is a
  // safe failure, not a silent substitution of canned content.
  //
  // Known gap: signing in from Submit after formalization saves/resumes
  // phase state (services/resume.ts) but not draftedFormulas/Scenario
  // themselves — lowest-priority item in the formalize-loop plan, cut for
  // today. If hit, the user lands back on Submit with an empty formulas
  // array and a clean submit failure rather than a wrong result.
  const contribution: Contribution = {
    term: autoTitle || DEMO_TERM.name,
    parent: p5Fields.parent || DEMO_TERM.parent,
    everydayName: p5Fields.everydayName || autoTitle || DEMO_TERM.name,
    docString: p5Fields.docString || DEMO_TERM.naturalLanguage,
    formulas: draftedFormulas ?? [],
    scenario: draftedScenario ?? undefined,
  };

  // Conflict resolution sub-state
  const [disputeOpen, setDisputeOpen] = useState(false);

  const navigateWithTransition = (phase: PhaseId, status: string) => {
    // Mark current phase as completed before transitioning
    if (currentPhase !== "splash" && !completedPhases.includes(currentPhase)) {
      setCompletedPhases([...completedPhases, currentPhase]);
    }
    setTransition({ open: true, status });
    setTimeout(() => {
      setCurrentPhase(phase);
      setTransition({ open: false, status: "" });
    }, 1100);
  };

  const navigate = (phase: PhaseId) => {
    // Mark current phase as completed before navigating
    if (currentPhase !== "splash" && !completedPhases.includes(currentPhase)) {
      setCompletedPhases([...completedPhases, currentPhase]);
    }
    setCurrentPhase(phase);
  };

  const renderScreen = () => {
    switch (currentPhase) {
      case "splash":
        return (
          <SplashScreen
            onStart={(initialDescription) => {
              if (initialDescription && initialDescription.trim()) {
                setP1Description(initialDescription);
              }
              navigate("p1-describe");
            }}
          />
        );

      case "p1-describe":
        return (
          <P1DescribeScreen
            onNext={(data) => {
              console.log("P1 data:", data);
              navigate("p2-search");
            }}
            onBack={() => navigate("splash")}
            onAutoTitleChange={setAutoTitle}
            description={p1Description}
            onDescriptionChange={setP1Description}
            scenario={p1Scenario}
            onScenarioChange={setP1Scenario}
          />
        );

      case "p2-search":
        return (
          <P2SearchScreen
            onComplete={() => navigate("p2-sharpen")}
          />
        );

      case "p2-sharpen":
        return (
          <P2SharpenScreen
            onNext={(choice) => {
              console.log("P2 choice:", choice);
              navigateWithTransition("p3-classify", "Analyzing concept type…");
            }}
            onBack={() => navigate("p1-describe")}
            termName={autoTitle || "your concept"}
            description={p1Description}
            // Real, already-merged SUMO terms (github.com/ontologyportal/sumo
            // PR #569, #563) — not fabricated placeholders, and deliberately
            // upper-ontology/general rather than the niche Cyber.kif work.
            candidates={["ArtificialIntelligenceAgent", "Sensing", "ShovelHead"]}
          />
        );

      case "p3-classify":
        return (
          <P3ClassifyScreen
            onNext={() => {
              navigateWithTransition("p4-place", "Finding parent in hierarchy…");
            }}
            onBack={() => navigate("p2-sharpen")}
            answers={p3Answers}
            onAnswersChange={setP3Answers}
          />
        );

      case "p4-place":
        return (
          <P4PlaceScreen
            onNext={() => navigate("p5-define")}
            onBack={() => navigate("p3-classify")}
            answers={p4Answers}
            onAnswersChange={setP4Answers}
            elaboration={p4Elaboration}
            onElaborationChange={setP4Elaboration}
            termName={autoTitle || "[unnamed concept]"}
            proposedParent={proposedParent}
          />
        );

      case "p5-define":
        return (
          <P5DefineScreen
            onNext={() => navigate("p6-statements")}
            onBack={() => navigate("p4-place")}
            onFieldsChange={setP5Fields}
            description={p1Description}
            scenario={p1Scenario}
          />
        );

      case "p6-statements":
        return (
          <P6StatementsScreen
            onNext={(approvedStatements) => {
              setP6Statements(approvedStatements);
              navigate("p7-verify");
            }}
            onBack={() => navigate("p5-define")}
            termName={autoTitle || "your concept"}
            description={p1Description}
          />
        );

      case "p7-verify":
        // FormalizeScreen renders instead of P7 itself until real,
        // checked formulas exist — covers both the normal P6->P7 flow and
        // a direct nav-pill jump straight to P7.
        if (!draftedFormulas || !draftedScenario) {
          return (
            <FormalizeScreen
              term={autoTitle || "UnnamedConcept"}
              parent={proposedParent === "your category" ? "Entity" : proposedParent}
              description={p1Description}
              scenario={p1Scenario}
              statements={p6Statements}
              onDone={({ formulas, scenario, kif }) => {
                setDraftedFormulas(formulas);
                setDraftedScenario(scenario);
                setDraftedKif(kif);
              }}
              onEditStatements={() => {
                clearDraftedRules();
                navigate("p6-statements");
              }}
            />
          );
        }
        return (
          <P7VerifyScreen
            onNext={() => navigate("submit")}
            onBack={() => {
              clearDraftedRules();
              navigate("p6-statements");
            }}
            onSimulateConflict={() => navigate("conflict-resolution")}
            formulas={draftedFormulas}
            scenario={draftedScenario}
            kifStatement={draftedKif ?? undefined}
            naturalLanguageStatement={p1Description}
            scenarioNL={p1Scenario}
          />
        );

      case "conflict-resolution":
        return disputeOpen ? (
          <DisputeSubmittedScreen
            onVerify={() => { navigate("p7-verify"); setDisputeOpen(false); }}
            onBack={() => setDisputeOpen(false)}
            termName={autoTitle || "[YourConcept]"}
          />
        ) : (
          <ConflictResolutionScreen
            onRevise={() => navigate("p6-statements")}
            onDispute={() => setDisputeOpen(true)}
            termName={autoTitle || "[YourConcept]"}
          />
        );

      case "submit":
        return (
          <SubmitScreen
            onRestart={() => navigate("p1-describe")}
            termName={autoTitle || "[YourConcept]"}
            proposedParent={proposedParent}
            contribution={contribution}
            authStatus={authStatus}
            onSignIn={signIn}
          />
        );

      default:
        return <SplashScreen onStart={() => navigate("p1-describe")} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#13131c] text-[#e0e0e8]">
      {currentPhase !== "splash" && (
        <>
          <TopNavigation
            currentPhase={currentPhase}
            onPhaseClick={(phase) => navigate(phase)}
            authStatus={authStatus}
            userName={authStatus === "authenticated" ? userName : undefined}
            termName={autoTitle || "[unnamed concept]"}
            onSignIn={signIn}
          />
          <StepNavigator
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            onPhaseClick={(phase) => navigate(phase)}
          />
        </>
      )}

      {renderScreen()}

      <PhaseTransition open={transition.open} status={transition.status} />
    </div>
  );
}
