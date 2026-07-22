import type { PhaseId } from "../components/logic/shared";

// Carries the in-progress wizard draft across the GitHub OAuth round trip.
// window.location.href to /api/auth/login is a hard full-page navigation —
// no React state survives it. sessionStorage does survive this exact shape
// (same-tab navigation away to github.com and back to the same origin),
// unlike a query param or the OAuth `state` param, which would put
// free-text user input into a URL/server logs and the CSRF `state` value is
// already spoken for. See callers in Navigation.tsx and Submit's sign-in
// CTA for where this gets written, and App.tsx for where it's read.

const KEY = "logicproject:resume";
const MAX_AGE_MS = 30 * 60 * 1000;

export interface ResumePayload {
  v: 1;
  savedAt: number;
  currentPhase: PhaseId;
  p1Description: string;
  p1Scenario: string;
  p5Fields: { parent: string; everydayName: string; docString: string };
  autoTitle: string;
  p3Answers: string[];
  p4Answers: string[];
  p4Elaboration: string;
  completedPhases: PhaseId[];
}

export function saveResumeState(payload: Omit<ResumePayload, "v" | "savedAt">) {
  try {
    const full: ResumePayload = { v: 1, savedAt: Date.now(), ...payload };
    sessionStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    // Storage unavailable (hardened privacy settings, etc.) — the OAuth
    // round trip still works, the draft just won't resume. Not a crash.
  }
}

/** Reads and clears the saved draft, or null if absent/stale/malformed. */
export function takeResumeState(): ResumePayload | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as ResumePayload;
    if (parsed.v !== 1 || typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}
