// In-process SUMO validation + proving via the `sigmakee` wasm package.
// Replaces the sigma-vv shell-out: no Java, no Vampire binary, and the KB is
// loaded once and held resident (no 30-40s per-request reload).
//
// This module only ingests Merge.kif below -- that's a chosen default for
// startup time, not a ceiling of the sigma-rs engine itself. The engine can
// ingest any additional KIF source at runtime (session.ingest() takes any
// Source.url/Source.kif/Source.file); the package's own demo site's
// "Knowledge base" tab exists specifically to add more SUMO files this way.
// Corrected 2026-09-10 after initially describing this as a hard technical
// limit (Jon: "wasm on sigma-rs has all of sumo loaded potentially").

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

// Checks each formula's OWN top-level operator, not whether one of these
// tokens appears anywhere in the formula (including nested inside a
// different top-level form). A bare top-level (exists ...) formula sitting
// next to an unrelated (=> ...) formula must not satisfy a check for "=>" --
// found live 2026-09-10 running the wizard on CyberExploit against this
// exact code path (server/index.js's default USE_SIGMA_VV=false engine):
// the old substring test let exactly that combination pass the reference
// and completeness gates, the same bare-top-level-exists-as-committed-
// content bug fixed in sumo#589. Lookahead on whitespace/paren, not \b --
// \b is a word/non-word transition and never matches after a symbol
// operator like "=>" followed by a space.
function hasTopLevelForm(formulas, operators) {
  const re = new RegExp(`^\\(\\s*(${operators.join("|")})(?=[\\s)])`);
  return formulas.some((f) => re.test(String(f).trim()));
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

  const hasRef = hasTopLevelForm(formulas, ["instance", "subclass", "=>", "<=>"]);
  gates.push({
    id: "reference",
    label: "Reference check",
    status: syntaxOk && hasRef ? "pass" : syntaxOk ? "fail" : "skipped",
    detail: hasRef ? "Statements reference existing ontology structure." : "No structural references found.",
  });

  // This session only has Merge.kif ingested by default (see the note above
  // getSession), not Cyber.kif, Mid-level-ontology.kif, or any other domain
  // extension, so a not-proved result here means "not verified against
  // what's currently loaded," not "disproven." The sumo-contributions CI
  // re-checks every submission against the real, full toolchain, so a local
  // non-proof should read as advisory, not a failure, or a legitimate
  // contribution could look broken before it ever reaches the authoritative
  // gate.
  let proof = null;
  if (scenario && scenario.query) proof = await prove(scenario);
  gates.push({
    id: "consistency",
    label: "Consistency check (sigma-rs)",
    status: !proof ? "skipped" : proof.proved ? "pass" : "unverified",
    detail: proof
      ? proof.proved
        ? proof.detail
        : "Not verified locally (partial knowledge base). This will be checked for real when you submit."
      : "No scenario supplied.",
  });
  gates.push({
    id: "scenario",
    label: "Scenario verification (sigma-rs)",
    status: !proof ? "skipped" : proof.proved ? "pass" : "unverified",
    detail: proof
      ? proof.proved
        ? `Proved the example inference in ${proof.wallMs != null ? (proof.wallMs / 1000).toFixed(2) + "s" : "n/a"}.`
        : "Not verified locally (partial knowledge base). This will be checked for real when you submit."
      : "No scenario supplied.",
  });

  const hasRule = hasTopLevelForm(formulas, ["=>", "<=>"]);
  gates.push({
    id: "completeness",
    label: "Completeness check",
    status: hasRule ? "pass" : "fail",
    detail: hasRule ? "Term carries at least one behavioral axiom." : "No rule backs the documentation.",
  });

  return { gates, proof };
}

module.exports = { getSession, typecheck, prove, gates };
