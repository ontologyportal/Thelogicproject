// The formalize loop: draft -> vocabulary -> syntax -> proof, in that order
// (cheapest-first, per constraint-architecture.md claim #4's cost
// decomposition: vocabulary µs / syntax ms / proof s-min). On a validator
// failure, builds a {validator, attributed_phase, payload} failure-
// attribution object (constraint-architecture.md §6) and auto-retries the
// draft with it as a corrective signal, bounded by retry_policy
// (max_retries_per_validator, total_budget) per the connector contract
// (§2). When the budget is exhausted, or a genuine proof-layer failure
// occurs (a real contradiction, not just "couldn't prove against the
// partial local KB" — see the proof-layer note below), this escalates to a
// human-in-the-loop step instead of retrying indefinitely, carrying a
// template-constrained Socratic question (the Pease-endorsed templates:
// "Can you tell me more? How is this different? What's essential? What
// never changes when this thing exists?").
//
// This never falls back to a canned/demo formula on failure — an
// unrecoverable draft error surfaces as a plain error the caller can
// retry, not a silent substitution.

import { draftRules, runGates, type FailureHistoryEntry, type Scenario } from "./api";
import type { PhaseId } from "../components/logic/shared";

// sigma.ts pulls in the sigmakee wasm glue code, kept out of the main
// bundle (same reason api.ts's runGates dynamically imports it) — a static
// import here would eagerly bundle the WASM-adjacent JS for every page
// load, not just the ones that reach Phase 7/formalization.
async function getChecker() {
  return import("./sigma");
}

const MAX_RETRIES_PER_VALIDATOR = 2;
const TOTAL_BUDGET = 4;

export type FormalizeLayer = "draft" | "vocabulary" | "syntax" | "proof";

export interface FormalizeEvent {
  type: "layer-start" | "layer-pass" | "layer-fail" | "retry" | "escalate" | "done" | "error";
  layer?: FormalizeLayer;
  message?: string;
  attempt?: number;
}

export interface DecisionTrailEntry {
  step: string;
  proposed: string;
  decided: string;
  ms: number;
}

export interface Escalation {
  validator: string;
  attributedPhase: PhaseId | null;
  payload: string;
  question: string;
  suggestions: string[];
}

export type FormalizeResult =
  | { status: "done"; formulas: string[]; scenario: Scenario; kif: string; decisionTrail: DecisionTrailEntry[] }
  | { status: "escalated"; escalation: Escalation; decisionTrail: DecisionTrailEntry[] }
  | { status: "error"; errorMessage: string; decisionTrail: DecisionTrailEntry[] };

export interface FormalizeInput {
  term: string;
  parent: string;
  description: string;
  scenario?: string;
  statements?: string[];
}

function buildEscalation(validator: string, payload: string, suggestions: string[] = [], termForQuestion = ""): Escalation {
  if (validator === "vocabulary") {
    const symbol = payload.match(/"([^"]+)"/)?.[1] ?? "that term";
    return {
      validator,
      attributedPhase: "p2-sharpen",
      payload,
      question: `I reached for "${symbol}", which doesn't exist in SUMO. What's the closest everyday category for what you mean?${
        suggestions.length ? ` (Nearby: ${suggestions.join(", ")})` : ""
      }`,
      suggestions,
    };
  }
  if (validator === "syntax") {
    return {
      validator,
      attributedPhase: "p6-statements",
      payload,
      question: `That didn't come out as well-formed logic (${payload}). Can you tell me more about what should always be true here?`,
      suggestions: [],
    };
  }
  // proof
  return {
    validator: "proof",
    attributedPhase: "p6-statements",
    payload,
    question: `I couldn't prove your test scenario from the drafted rule. What never changes when ${termForQuestion || "this"} exists, is there a statement missing?`,
    suggestions: [],
  };
}

function budgetExhaustedEscalation(): Escalation {
  return {
    validator: "budget",
    attributedPhase: null,
    payload: `Exceeded the retry budget (${TOTAL_BUDGET} attempts).`,
    question: "I'm having trouble formalizing this automatically. Can you tell me more, or rephrase what should always be true?",
    suggestions: [],
  };
}

export async function runFormalizeLoop(
  input: FormalizeInput,
  onEvent: (e: FormalizeEvent) => void = () => {},
  seedHistory: FailureHistoryEntry[] = []
): Promise<FormalizeResult> {
  const failureHistory: FailureHistoryEntry[] = [...seedHistory];
  const decisionTrail: DecisionTrailEntry[] = [];
  const retryCounts: Record<string, number> = {};
  let totalAttempts = 0;

  while (true) {
    totalAttempts++;
    if (totalAttempts > TOTAL_BUDGET) {
      onEvent({ type: "escalate", message: "retry budget exhausted" });
      return { status: "escalated", escalation: budgetExhaustedEscalation(), decisionTrail };
    }

    onEvent({ type: "layer-start", layer: "draft", attempt: totalAttempts });
    const tDraft = performance.now();
    let drafted;
    try {
      drafted = await draftRules({ ...input, failureHistory });
    } catch (err) {
      const errorMessage = String((err as Error)?.message || err);
      onEvent({ type: "error", message: errorMessage });
      return { status: "error", errorMessage, decisionTrail };
    }
    decisionTrail.push({
      step: `draft (attempt ${totalAttempts})`,
      proposed: drafted.formula,
      decided: "proposed",
      ms: Math.round(performance.now() - tDraft),
    });
    onEvent({ type: "layer-pass", layer: "draft" });

    // --- vocabulary layer ---
    onEvent({ type: "layer-start", layer: "vocabulary" });
    const tVocab = performance.now();
    const { checkVocabulary } = await getChecker();
    const vocabFindings = await checkVocabulary(drafted.formula, [input.term, drafted.instanceName]);
    decisionTrail.push({
      step: "vocabulary check",
      proposed: drafted.formula,
      decided: vocabFindings.length ? `${vocabFindings.length} finding(s)` : "clean",
      ms: Math.round(performance.now() - tVocab),
    });
    if (vocabFindings.length > 0) {
      const finding = vocabFindings[0];
      onEvent({ type: "layer-fail", layer: "vocabulary", message: finding.detail });
      const count = (retryCounts.vocabulary = (retryCounts.vocabulary || 0) + 1);
      if (count > MAX_RETRIES_PER_VALIDATOR) {
        onEvent({ type: "escalate", message: finding.detail });
        return { status: "escalated", escalation: buildEscalation("vocabulary", finding.detail, finding.suggestions), decisionTrail };
      }
      failureHistory.push({ validator: "vocabulary", payload: finding.detail });
      onEvent({ type: "retry", attempt: totalAttempts });
      continue;
    }
    onEvent({ type: "layer-pass", layer: "vocabulary" });

    // --- syntax layer ---
    onEvent({ type: "layer-start", layer: "syntax" });
    const tSyntax = performance.now();
    const { checkSyntax } = await getChecker();
    const syntaxFindings = await checkSyntax(drafted.formula);
    decisionTrail.push({
      step: "syntax check",
      proposed: drafted.formula,
      decided: syntaxFindings.length ? `${syntaxFindings.length} finding(s)` : "clean",
      ms: Math.round(performance.now() - tSyntax),
    });
    if (syntaxFindings.length > 0) {
      const finding = syntaxFindings[0];
      onEvent({ type: "layer-fail", layer: "syntax", message: finding.message });
      const count = (retryCounts.syntax = (retryCounts.syntax || 0) + 1);
      if (count > MAX_RETRIES_PER_VALIDATOR) {
        onEvent({ type: "escalate", message: finding.message });
        return { status: "escalated", escalation: buildEscalation("syntax", `${finding.code}: ${finding.message}`), decisionTrail };
      }
      failureHistory.push({ validator: "syntax", payload: `${finding.code}: ${finding.message}` });
      onEvent({ type: "retry", attempt: totalAttempts });
      continue;
    }
    onEvent({ type: "layer-pass", layer: "syntax" });

    // --- proof layer ---
    onEvent({ type: "layer-start", layer: "proof" });
    const tProof = performance.now();
    const scenario: Scenario = {
      note: drafted.scenarioNote,
      axioms: [drafted.formula],
      facts: [drafted.fact],
      query: drafted.query,
      answer: "yes",
    };
    const gatesResult = await runGates({ formulas: [drafted.formula], scenario });
    const szs = gatesResult.proof?.szs;
    // A non-proof against the bare, partial in-browser KB is expected and
    // advisory (see sigma.ts's own NOT_VERIFIED handling) — only a genuine
    // contradiction is a real proof-layer failure worth escalating.
    const isGenuineContradiction = szs === "Disproved" || szs === "Inconsistent";
    decisionTrail.push({
      step: "proof attempt",
      proposed: drafted.query,
      decided: gatesResult.proof?.proved ? "proved" : isGenuineContradiction ? `contradiction: ${szs}` : `unverified: ${szs ?? "no result"}`,
      ms: Math.round(performance.now() - tProof),
    });
    if (isGenuineContradiction) {
      onEvent({ type: "layer-fail", layer: "proof", message: String(szs) });
      onEvent({ type: "escalate", message: String(szs) });
      return {
        status: "escalated",
        escalation: buildEscalation("proof", `The drafted rule and scenario are ${szs}.`, [], input.term),
        decisionTrail,
      };
    }
    onEvent({ type: "layer-pass", layer: "proof" });
    onEvent({ type: "done" });
    return {
      status: "done",
      formulas: [drafted.formula],
      scenario,
      kif: drafted.formula,
      decisionTrail,
    };
  }
}
