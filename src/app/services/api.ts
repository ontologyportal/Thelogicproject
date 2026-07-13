// Service layer bridging the wizard to the local validator API (server/index.js).
//
// Configure the backend with VITE_API_BASE_URL (e.g. http://localhost:8788).
// When unset, calls go same-origin — fine only if a backend is proxied there.
// The GitHub-Pages splash build has no backend; the interactive wizard needs
// this pointed at a running validator API.

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export type GateStatus = "checking" | "pass" | "fail" | "skipped";

export interface Gate {
  id: string;
  label: string;
  status: GateStatus;
  detail?: string;
}

export interface ProofResult {
  proved: boolean;
  szs: string;
  wallMs: number | null;
  detail?: string;
}

export interface GatesResponse {
  gates: Gate[];
  proof: ProofResult | null;
}

export interface Scenario {
  note?: string;
  axioms?: string[];
  facts?: string[];
  query: string;
  answer?: string;
}

export interface GatesRequest {
  formulas: string[];
  scenario?: Scenario;
}

/** Run the real validation gates (syntax + Vampire proof) against the backend. */
export async function runGates(req: GatesRequest): Promise<GatesResponse> {
  const res = await fetch(`${API_BASE}/api/gates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`gates request failed: ${res.status}`);
  return res.json();
}

/** Syntax/type-check a single SUO-KIF formula. */
export async function typecheck(formula: string): Promise<{ valid: boolean; detail: string }> {
  const res = await fetch(`${API_BASE}/api/typecheck`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formula }),
  });
  if (!res.ok) throw new Error(`typecheck request failed: ${res.status}`);
  return res.json();
}

// Default demo term: SoftwareBug -> Defective. Self-contained so the proof is
// real (real Vampire Theorem) and reliable, independent of deep KB selection.
export const DEMO_TERM = {
  name: "SoftwareBug",
  naturalLanguage: "Every software bug is, by definition, defective program behavior.",
  kif: "(=> (instance ?X SoftwareBug) (attribute ?X Defective))",
  scenarioNL: "If something is a SoftwareBug, then it is Defective.",
  formulas: ["(=> (instance ?X SoftwareBug) (attribute ?X Defective))"],
  scenario: {
    note: "If X is a SoftwareBug then X is Defective; BugA is a SoftwareBug; therefore BugA is Defective.",
    axioms: ["(=> (instance ?X SoftwareBug) (attribute ?X Defective))"],
    facts: ["(instance BugA SoftwareBug)"],
    query: "(attribute BugA Defective)",
    answer: "yes",
  } as Scenario,
};
