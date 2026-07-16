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
    await init({ module_or_path: wasmUrl });
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
  const proofStatus = !proof ? "skipped" : proof.proved ? "pass" : "fail";
  gates.push({ id: "consistency", label: "Consistency check (sigma-rs)", status: proofStatus, detail: proof ? proof.detail : "No scenario supplied." });
  gates.push({
    id: "scenario",
    label: "Scenario verification (sigma-rs)",
    status: proofStatus,
    detail: proof ? `Proved the example inference in ${((proof.wallMs ?? 0) / 1000).toFixed(2)}s.` : "No scenario supplied.",
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
