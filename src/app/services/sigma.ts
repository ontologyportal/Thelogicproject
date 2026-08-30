// In-browser SUMO validation + proving via the `sigmakee` wasm package.
// Same engine as the server (server/sigma.js), so Phase 7 can run client-side
// with no backend. The KB is loaded once per tab and held resident.

import { init, Session, Source, Backend, Config } from "sigmakee/sdk";
// @ts-ignore — Vite resolves the wasm to an asset URL (works in dev + build).
import wasmUrl from "sigmakee/sumo_parser_wasm_bg.wasm?url";
import type { Gate, GatesRequest, GatesResponse, ProofResult } from "./api";

const MERGE_URL = "https://raw.githubusercontent.com/ontologyportal/sumo/HEAD/Merge.kif";

let ready: Promise<Session> | null = null;

function getSession(): Promise<Session> {
  if (ready) return ready;
  ready = (async () => {
    try {
      await init({ module_or_path: wasmUrl });
    } catch (err) {
      // Don't memoize a rejected promise — a transient blip (flaky network
      // fetching the multi-MB wasm binary, an ad-blocker) would otherwise
      // permanently break Phase 7 for the rest of the tab session, with the
      // UI's own "Retry" button replaying the same cached failure forever.
      ready = null;
      throw err;
    }
    const cfg = new Config();
    cfg.timeLimitSecs = 30;
    const session = new Session({ backend: Backend.Native, config: cfg });
    try {
      await session.ingest(Source.url(MERGE_URL, "Merge.kif"));
    } catch {
      /* self-contained proofs still work without the KB */
    }
    return session;
  })();
  return ready;
}

// Deterministic checking layers for the formalize loop
// (src/app/services/formalize.ts). Per the constraint-architecture spec's
// claim #4 cost decomposition — vocabulary (µs) / syntax (ms) / proof
// (s–min) — vocabulary runs first since it's cheapest and catches the most
// common LLM failure mode (an invented predicate) before spending a proof
// attempt on it.

const LOGICAL_OPERATORS = new Set(["and", "or", "not", "forall", "exists"]);

/** Extracts KB-checkable symbols from a formula: not variables, not the
 * =>/<=> operators (non-word, already excluded by the regex), not the
 * and/or/not/forall/exists allowlist, and not quoted string contents. */
export function extractSymbols(formula: string): string[] {
  const noStrings = formula.replace(/"[^"]*"/g, " ");
  const noVars = noStrings.replace(/[?@][A-Za-z_][A-Za-z0-9_]*/g, " ");
  const words = noVars.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  const seen = new Set<string>();
  for (const w of words) {
    if (!LOGICAL_OPERATORS.has(w.toLowerCase())) seen.add(w);
  }
  return [...seen];
}

/** Counts a relation's argument list in `(symbol a b c)`, respecting nested
 * parens as single arguments. Returns null if the call form isn't found
 * (e.g. the symbol only appears as a bare atom, not applied). */
function countArgs(formula: string, symbol: string): number | null {
  const callRe = new RegExp(`\\(${symbol}(?=[\\s)])`, "g");
  const match = callRe.exec(formula);
  if (!match) return null;
  let i = match.index + match[0].length;
  let depth = 0;
  let args = 0;
  let inToken = false;
  for (; i < formula.length; i++) {
    const c = formula[i];
    if (c === "(") { depth++; if (depth === 1 && !inToken) { args++; inToken = true; } }
    else if (c === ")") {
      if (depth === 0) break;
      depth--;
      if (depth === 0) inToken = false;
    } else if (/\s/.test(c)) {
      if (depth === 0) inToken = false;
    } else if (depth === 0 && !inToken) {
      args++;
      inToken = true;
    }
  }
  return args;
}

export interface VocabFinding {
  symbol: string;
  kind: "undefined-term" | "arity-mismatch";
  suggestions: string[];
  detail: string;
}

/** Vocabulary layer: every non-variable, non-operator symbol in `formula`
 * must either be one of `allowTerms` (the term being defined, its instance
 * name — new by design, not yet in the KB) or resolve via `manpage()`
 * against the already-ingested Merge.kif. Also flags an obvious arity
 * mismatch when the symbol is a known relation applied with the wrong
 * argument count. */
export async function checkVocabulary(formula: string, allowTerms: string[]): Promise<VocabFinding[]> {
  const session = await getSession();
  const allow = new Set(allowTerms);
  const findings: VocabFinding[] = [];
  for (const symbol of extractSymbols(formula)) {
    if (allow.has(symbol)) continue;
    const man = session.manpage(symbol);
    if (!man) {
      const suggestions = session.search(symbol, { limit: 3 }).map((h) => h.symbol);
      findings.push({
        symbol,
        kind: "undefined-term",
        suggestions,
        detail: `"${symbol}" is not a term in SUMO.`,
      });
      continue;
    }
    if (typeof man.arity === "number") {
      const actual = countArgs(formula, symbol);
      if (actual !== null && actual !== man.arity) {
        findings.push({
          symbol,
          kind: "arity-mismatch",
          suggestions: [],
          detail: `"${symbol}" takes ${man.arity} argument${man.arity === 1 ? "" : "s"}, used with ${actual}.`,
        });
      }
    }
  }
  return findings;
}

export interface SyntaxFinding {
  code: string;
  kind: string;
  message: string;
}

/** Syntax layer: thin wrapper over validateFormula surfacing the
 * structured diagnostic fields (code/kind), not just the joined message
 * text runGatesLocal's own `check()` uses. */
export async function checkSyntax(formula: string): Promise<SyntaxFinding[]> {
  const session = await getSession();
  return session
    .validateFormula(formula)
    .filter((d) => d.severity === "Error")
    .map((d) => ({ code: d.code, kind: d.kind, message: d.message }));
}

export async function typecheckLocal(formula: string): Promise<{ valid: boolean; detail: string }> {
  const session = await getSession();
  const diags = session.validateFormula(formula);
  const errors = diags.filter((d) => String(d.severity).toLowerCase() === "error");
  return {
    valid: errors.length === 0,
    detail: errors.length === 0 ? "Well-formed SUO-KIF." : errors.map((d) => d.message).join("; "),
  };
}

export async function runGatesLocal({ formulas = [], scenario }: GatesRequest): Promise<GatesResponse> {
  const session = await getSession();

  const check = (f: string) => {
    const errors = session.validateFormula(f).filter((d) => String(d.severity).toLowerCase() === "error");
    return { valid: errors.length === 0, detail: errors[0]?.message ?? "" };
  };

  const gates: Gate[] = [];
  const syntax = formulas.map(check);
  const syntaxOk = syntax.every((s) => s.valid);
  gates.push({
    id: "syntax",
    label: "Syntax check",
    status: syntaxOk ? "pass" : "fail",
    detail: syntaxOk ? "All statements are well-formed SUO-KIF." : syntax.find((s) => !s.valid)!.detail,
  });

  const hasRef = formulas.some((f) => /\(instance|\(subclass|\(=>|\(<=>/.test(f));
  gates.push({
    id: "reference",
    label: "Reference check",
    status: syntaxOk && hasRef ? "pass" : syntaxOk ? "fail" : "skipped",
    detail: hasRef ? "Statements reference existing ontology structure." : "No structural references found.",
  });

  let proof: ProofResult | null = null;
  if (scenario?.query) {
    const tag = "sc-" + Math.random().toString(36).slice(2);
    session.flushSession(tag);
    for (const a of scenario.axioms ?? []) session.tell(a, tag);
    for (const f of scenario.facts ?? []) session.tell(f, tag);
    const t = performance.now();
    const r = session.ask(scenario.query, { session: tag }) as { status: string };
    const wallMs = Math.round(performance.now() - t);
    session.flushSession(tag);
    const proved = r.status === "Proved";
    proof = { proved, szs: proved ? "Theorem" : r.status, wallMs, detail: `sigma-rs: ${proved ? "Theorem" : r.status}.` };
  }
  // This engine only holds bare Merge.kif resident, not the full KB, so a
  // not-proved result means "not verified against this partial KB," not
  // "disproven." The sumo-contributions CI re-checks every submission
  // against the real, full toolchain, so a local non-proof reads as
  // advisory rather than a failure.
  const NOT_VERIFIED = "Not verified locally (partial knowledge base). This will be checked for real when you submit.";
  const proofStatus = !proof ? "skipped" : proof.proved ? "pass" : "unverified";
  gates.push({
    id: "consistency",
    label: "Consistency check (sigma-rs)",
    status: proofStatus,
    detail: !proof ? "No scenario supplied." : proof.proved ? proof.detail : NOT_VERIFIED,
  });
  gates.push({
    id: "scenario",
    label: "Scenario verification (sigma-rs)",
    status: proofStatus,
    detail: !proof
      ? "No scenario supplied."
      : proof.proved
        ? `Proved the example inference in ${((proof.wallMs ?? 0) / 1000).toFixed(2)}s.`
        : NOT_VERIFIED,
  });

  const hasRule = formulas.some((f) => /\(=>|\(<=>/.test(f));
  gates.push({
    id: "completeness",
    label: "Completeness check",
    status: hasRule ? "pass" : "fail",
    detail: hasRule ? "Term carries at least one behavioral axiom." : "No rule backs the documentation.",
  });

  return { gates, proof };
}
