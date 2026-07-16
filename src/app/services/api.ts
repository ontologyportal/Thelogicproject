// Service layer bridging the wizard to the local validator API (server/index.js).
//
// Configure the backend with VITE_API_BASE_URL (e.g. http://localhost:8788).
// When unset, calls go same-origin — fine only if a backend is proxied there.
// The GitHub-Pages splash build has no backend; the interactive wizard needs
// this pointed at a running validator API.

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

// "unverified" = the fast local pre-check couldn't confirm this (e.g. a
// partial-KB engine), not that it's wrong. Distinct from "fail", which means
// an authoritative check actively found a problem. sumo-contributions' CI
// re-checks every submission against the real toolchain regardless.
export type GateStatus = "checking" | "pass" | "fail" | "unverified" | "skipped";

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

// Prefer the in-browser sigmakee engine (no backend needed); set
// VITE_LOCAL_SIGMA=0 to force the remote validator API instead.
const USE_LOCAL = import.meta.env.VITE_LOCAL_SIGMA !== "0";

/** Run the validation gates (syntax + proof). In-browser by default. */
export async function runGates(req: GatesRequest): Promise<GatesResponse> {
  if (USE_LOCAL) {
    try {
      return await (await import("./sigma")).runGatesLocal(req);
    } catch (e) {
      if (!API_BASE) throw e;
    }
  }
  const res = await fetch(`${API_BASE}/api/gates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`gates request failed: ${res.status}`);
  return res.json();
}

/** Syntax/type-check a single SUO-KIF formula. In-browser by default. */
export async function typecheck(formula: string): Promise<{ valid: boolean; detail: string }> {
  if (USE_LOCAL) {
    try {
      return await (await import("./sigma")).typecheckLocal(formula);
    } catch (e) {
      if (!API_BASE) throw e;
    }
  }
  const res = await fetch(`${API_BASE}/api/typecheck`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formula }),
  });
  if (!res.ok) throw new Error(`typecheck request failed: ${res.status}`);
  return res.json();
}

// --- auth + submit ---------------------------------------------------------
// These go same-origin (relative paths) to the Vercel serverless functions
// under api/, not to the local validator backend above — separate concerns,
// separate base URLs.

export interface Me {
  login: string;
  avatar?: string;
}

/** Current signed-in GitHub identity, or null if not signed in. */
export async function getMe(): Promise<Me | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export function signOut(): Promise<void> {
  return fetch("/api/auth/logout", { method: "POST", credentials: "include" }).then(() => undefined);
}

export interface Contribution {
  term: string;
  parent: string;
  everydayName: string;
  docString: string;
  formulas: string[];
  scenario?: Scenario;
}

export interface SubmitResult {
  prUrl: string;
  prNumber: number;
}

/** Opens a real PR on the staging contribution repo. Requires a signed-in session. */
export async function submitContribution(contribution: Contribution): Promise<SubmitResult> {
  const res = await fetch("/api/submit", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contribution),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `submit failed: ${res.status}`);
  }
  return res.json();
}

// Default demo term: SoftwareBug -> Defective. Self-contained so the proof is
// real (real Vampire Theorem) and reliable, independent of deep KB selection.
export const DEMO_TERM = {
  name: "SoftwareBug",
  parent: "ComputerProgram",
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
