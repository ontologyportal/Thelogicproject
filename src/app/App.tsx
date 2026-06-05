import { useState } from "react";
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
  P7VerifyScreen,
  SubmitScreen,
} from "./components/logic/screens";
import {
  ConflictResolutionScreen,
  DisputeSubmittedScreen,
} from "./components/logic/screens/ConflictResolution";

/**
 * The Logic Project - Build A (Production App)
 * Complete workflow with stubbed backend calls
 * No canned data, all UI states present
 */
export default function App() {
  const [currentPhase, setCurrentPhase] = useState<PhaseId>("splash");
  const [completedPhases, setCompletedPhases] = useState<PhaseId[]>([]);
  const [authStatus, setAuthStatus] = useState<"authenticated" | "guest" | "none">("none");
  const [userName] = useState("demo-user");
  const [autoTitle, setAutoTitle] = useState("");
  const [transition, setTransition] = useState<{ open: boolean; status: string }>({
    open: false,
    status: "",
  });

  // Lifted phase state — persists when user navigates back
  const [p1Description, setP1Description] = useState("");
  const [p1Scenario, setP1Scenario] = useState("");
  const [proposedParent] = useState("your category");

  // Conflict resolution sub-state
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [p3Answers, setP3Answers] = useState<string[]>([]);
  const [p4Answers, setP4Answers] = useState<string[]>([]);
  const [p4Elaboration, setP4Elaboration] = useState("");

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
            onStart={() => navigate("p1-describe")}
            onAuthChange={(status) => setAuthStatus(status)}
            preAuth={false}
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
            candidates={["RelatedConcept1", "RelatedConcept2", "RelatedConcept3"]}
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
          />
        );

      case "p6-statements":
        return (
          <P6StatementsScreen
            onNext={() => {
              navigateWithTransition("p7-verify", "Running validation gates…");
            }}
            onBack={() => navigate("p5-define")}
          />
        );

      case "p7-verify":
        return (
          <P7VerifyScreen
            onNext={() => navigate("submit")}
            onBack={() => navigate("p6-statements")}
            onSimulateConflict={() => navigate("conflict-resolution")}
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
          />
        );

      default:
        return (
          <SplashScreen
            onStart={() => navigate("p1-describe")}
            onAuthChange={(status) => setAuthStatus(status)}
          />
        );
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
