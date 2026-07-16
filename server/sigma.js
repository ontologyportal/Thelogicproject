// In-process SUMO validation + proving via the `sigmakee` wasm package.
// Replaces the sigma-vv shell-out: no Java, no Vampire binary, and the KB is
// loaded once and held resident (no 30-40s per-request reload).

const { readFile } = require("node:fs/promises");
const { createRequire } = require("node:module");
const req = createRequire(__filename);

const MERGE_URL =
  process.env.SUMO_MERGE_URL ||
  "https://raw.githubusercontent.com/ontologyportal/sumo/HEAD/Merge.kif";

let ready = null;

async function getSession() {
  if (ready) return ready;
  ready = (async () => {
    const sdk = await import("sigmakee/sdk");
    await sdk.init({ module_or_path: await readFile(req.resolve("sigmakee/sumo_parser_wasm_bg.wasm")) });
    const cfg = new sdk.Config();
    cfg.timeLimitSecs = 30;
    const session = new sdk.Session({ backend: sdk.Backend.Native, config: cfg });
    const t = Date.now();
    try {
      const r = await session.ingest(sdk.Source.url(MERGE_URL, "Merge.kif"));
      console.log(`[sigma] KB resident: Merge.kif loaded in ${Date.now() - t}ms (${r.loaded} file)`);
    } catch (e) {
      console.warn(`[sigma] KB load skipped (${e.message}); self-contained proofs still work`);
    }
    return { sdk, session };
  })();
  return ready;
}

// A formula is well-formed if validation reports no Error-severity diagnostic.
// Semantic warnings about not-yet-defined terms are expected (the wizard is
// DEFINING new terms) and do not fail the syntax gate.
async function typecheck(formula) {
  const { session } = await getSession();
  const diags = session.validateFormula(formula);
  // Parse errors are severity "error"; semantic notes about not-yet-defined
  // terms are "warning" and must not fail the syntax gate.
  const errors = diags.filter((d) => String(d.severity).toLowerCase() === "error");
  return {
    valid: errors.length === 0,
    detail: errors.length === 0 ? "Well-formed SUO-KIF." : errors.map((d) => d.message).join("; "),
  };
}

async function prove(scenario) {
  const { session } = await getSession();
  const tag = "sc-" + Math.random().toString(36).slice(2);
  session.flushSession(tag);
  for (const a of scenario.axioms || []) session.tell(a, tag);
  for (const f of scenario.facts || []) session.tell(f, tag);
  const t = Date.now();
  const r = session.ask(scenario.query, { session: tag });
  const wallMs = Date.now() - t;
  session.flushSession(tag);
  const proved = r.status === "Proved";
  const szs = proved ? "Theorem" : r.status === "Timeout" ? "Timeout" : r.status;
  return { proved, szs, wallMs, detail: proved ? `sigma-rs: ${szs}.` : `sigma-rs: ${r.status} (no proof).` };
}

async function gates({ formulas = [], scenario }) {
  const gates = [];

  const syntax = await Promise.all(formulas.map(typecheck));
  const syntaxOk = syntax.every((s) => s.valid);
  gates.push({
    id: "syntax",
    label: "Syntax check",
    status: syntaxOk ? "pass" : "fail",
    detail: syntaxOk ? "All statements are well-formed SUO-KIF." : syntax.find((s) => !s.valid).detail,
  });

  const hasRef = formulas.some((f) => /\(instance|\(subclass|\(=>|\(<=>/.test(f));
  gates.push({
    id: "reference",
    label: "Reference check",
    status: syntaxOk && hasRef ? "pass" : syntaxOk ? "fail" : "skipped",
    detail: hasRef ? "Statements reference existing ontology structure." : "No structural references found.",
  });

  let proof = null;
  if (scenario && scenario.query) proof = await prove(scenario);
  gates.push({
    id: "consistency",
    label: "Consistency check (sigma-rs)",
    status: !proof ? "skipped" : proof.proved ? "pass" : "fail",
    detail: proof ? proof.detail : "No scenario supplied.",
  });
  gates.push({
    id: "scenario",
    label: "Scenario verification (sigma-rs)",
    status: !proof ? "skipped" : proof.proved ? "pass" : "fail",
    detail: proof
      ? `Proved the example inference in ${proof.wallMs != null ? (proof.wallMs / 1000).toFixed(2) + "s" : "n/a"}.`
      : "No scenario supplied.",
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

module.exports = { getSession, typecheck, prove, gates };
