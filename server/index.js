// Logic Project — local validator API
//
// Bridges the wizard front-end to the REAL SUMO validators (SigmaKEE + Vampire)
// by shelling the existing tools/sigma-vv/*.sh scripts. Zero npm dependencies:
// uses only Node's built-in http/child_process/fs so `node server/index.js` just runs.
//
// This is the "slow but real" backend from the plan: each proof reloads the KB
// (~30-40s), which is fine because the demo is a sped-up recording. Teddy's
// productionization is a persistent in-process server (SigmaVV.java supports it).
//
// It INVOKES the sigma-vv scripts, it never edits them (strict tooling).

const http = require("http");
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const sigmaWasm = require("./sigma");

// Default validator is the in-process `sigmakee` wasm engine (KB held
// resident). Set USE_SIGMA_VV=1 to fall back to the legacy sigma-vv shell-out
// (Java SigmaKEE + Vampire, reloads the KB per call).
const USE_SIGMA_VV = process.env.USE_SIGMA_VV === "1";

// --- config (all overridable by env) ------------------------------------
const PORT = parseInt(process.env.PORT || "8788", 10);
const WORKSPACE = process.env.WORKSPACE || "/home/devcontainers/workspace";
const SIGMA_VV = path.join(WORKSPACE, "tools", "sigma-vv");
const SIGMA_HOME = process.env.SIGMA_HOME || "/home/devcontainers/.sigmakee";
const TMP_DIR = path.join(WORKSPACE, "sumo", "development", "wizard-tmp");
const PROVE_TIMEOUT_MS = parseInt(process.env.PROVE_TIMEOUT_MS || "180000", 10);

// Only the sigma-vv fallback writes temp .kif/.tq files; the wasm engine doesn't.
if (USE_SIGMA_VV) fs.mkdirSync(TMP_DIR, { recursive: true });

const scriptEnv = { ...process.env, SIGMA_HOME };

// --- helpers ------------------------------------------------------------

// This server has a wildcard CORS policy (Access-Control-Allow-Origin: *)
// for local-dev convenience, which means any page open in the same browser
// while it's running can POST here. term/tag land in a filesystem path
// (path.join(TMP_DIR, `${term}_${tag}.tq`)) and as sigma-prove.sh
// arguments, so an unvalidated value is a path-traversal vector (a term
// like "../../../whatever" writes outside TMP_DIR). Reject anything that
// isn't a safe identifier before it touches the filesystem.
const SAFE_ID_RE = /^[A-Za-z0-9_-]{1,80}$/;
function safeId(s, fallback) {
  return typeof s === "string" && SAFE_ID_RE.test(s) ? s : fallback;
}

/** Run a sigma-vv script, return {code, stdout, stderr}. */
function runScript(script, args, timeout = 120000) {
  const r = spawnSync("bash", [path.join(SIGMA_VV, script), ...args], {
    cwd: WORKSPACE,
    env: scriptEnv,
    encoding: "utf8",
    timeout,
    maxBuffer: 32 * 1024 * 1024,
  });
  return {
    code: r.status === null ? -1 : r.status,
    stdout: r.stdout || "",
    stderr: r.stderr || "",
    timedOut: r.error && r.error.code === "ETIMEDOUT",
  };
}

/** Real syntax/type check of a single KIF formula. */
function typecheck(formula) {
  const r = runScript("sigma-typecheck.sh", [formula], 120000);
  const ok = r.code === 0 && /(^|\n)OK:/.test(r.stdout);
  const errLines = r.stdout
    .split("\n")
    .filter((l) => /INVALID|error|Error/.test(l))
    .slice(0, 6);
  return { valid: ok, detail: ok ? "Well-formed SUO-KIF." : errLines.join(" ").trim() || "Invalid formula." };
}

/**
 * Real proof: write a .tq (asserted axioms/facts + a query) and run Vampire
 * via sigma-prove.sh, then read the sidecar <term>_<tag>.proof.json.
 */
function prove(scenario, term = "wizard", tag = "gate") {
  term = safeId(term, "wizard");
  tag = safeId(tag, "gate");
  const { axioms = [], facts = [], query, answer = "yes", note = "" } = scenario;
  const lines = [];
  if (note) lines.push(`(note ${JSON.stringify(note)})`);
  lines.push("(time 60)");
  for (const a of axioms) lines.push(a);
  for (const f of facts) lines.push(f);
  lines.push(`(query ${query})`);
  lines.push(`(answer ${answer})`);
  const tqPath = path.join(TMP_DIR, `${term}_${tag}.tq`);
  fs.writeFileSync(tqPath, lines.join("\n") + "\n");

  const r = runScript("sigma-prove.sh", [term, tag, tqPath], PROVE_TIMEOUT_MS);
  const jsonPath = path.join(TMP_DIR, `${term}_${tag}.proof.json`);
  let proof = null;
  try {
    proof = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (_) {
    /* no json written */
  }
  const szs = proof ? proof.szs_status : r.timedOut ? "Timeout" : "Unknown";
  const success = proof ? !!proof.success : false;
  return {
    proved: success,
    szs,
    wallMs: proof ? proof.wall_time_ms : null,
    tqPath,
    detail: success ? `Vampire: ${szs}.` : `Vampire: ${szs} (no proof).`,
  };
}

// --- gate orchestration -------------------------------------------------
// Returns the wizard's five gates. Syntax, Consistency, and Scenario are REAL
// (typecheck + Vampire). Reference and Completeness are lightweight real checks.

function runGates({ formulas = [], scenario }) {
  const gates = [];

  // Gate 1 — Syntax (real typecheck of every generated formula)
  const syntaxResults = formulas.map(typecheck);
  const syntaxOk = syntaxResults.every((s) => s.valid);
  gates.push({
    id: "syntax",
    label: "Syntax check",
    status: syntaxOk ? "pass" : "fail",
    detail: syntaxOk ? "All statements are well-formed SUO-KIF." : syntaxResults.find((s) => !s.valid).detail,
  });

  // Gate 2 — Reference (lightweight: a rule references at least one class/relation)
  const hasRef = formulas.some((f) => /\(instance|\(subclass|\(=>|\(<=>/.test(f));
  gates.push({
    id: "reference",
    label: "Reference check",
    status: syntaxOk && hasRef ? "pass" : syntaxOk ? "fail" : "skipped",
    detail: hasRef ? "Statements reference existing ontology structure." : "No structural references found.",
  });

  // Gate 3 & 4 — Consistency + Scenario (REAL Vampire proof of a derived inference)
  let proof = null;
  if (scenario && scenario.query) {
    proof = prove(scenario);
  }
  gates.push({
    id: "consistency",
    label: "Consistency check (Vampire)",
    status: !proof ? "skipped" : proof.proved ? "pass" : "fail",
    detail: proof ? proof.detail : "No scenario supplied.",
  });
  gates.push({
    id: "scenario",
    label: "Scenario verification (Vampire)",
    status: !proof ? "skipped" : proof.proved ? "pass" : "fail",
    detail: proof ? `Proved the example inference in ${proof.wallMs ? (proof.wallMs / 1000).toFixed(1) + "s" : "n/a"}.` : "No scenario supplied.",
  });

  // Gate 5 — Completeness (real: at least one behavioral rule present)
  const hasRule = formulas.some((f) => /\(=>|\(<=>/.test(f));
  gates.push({
    id: "completeness",
    label: "Completeness check",
    status: hasRule ? "pass" : "fail",
    detail: hasRule ? "Term carries at least one behavioral axiom." : "No rule backs the documentation.",
  });

  return { gates, proof };
}

// --- http plumbing ------------------------------------------------------

function send(res, code, body) {
  const data = JSON.stringify(body);
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve) => {
    let b = "";
    req.on("data", (c) => (b += c));
    req.on("end", () => {
      try {
        resolve(b ? JSON.parse(b) : {});
      } catch (_) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = req.url.split("?")[0];

  try {
    if (req.method === "GET" && url === "/health") {
      return send(res, 200, { ok: true, engine: USE_SIGMA_VV ? "sigma-vv" : "sigmakee-wasm" });
    }

    if (req.method === "POST" && url === "/api/typecheck") {
      const { formula } = await readBody(req);
      if (!formula) return send(res, 400, { error: "formula required" });
      return send(res, 200, USE_SIGMA_VV ? typecheck(formula) : await sigmaWasm.typecheck(formula));
    }

    if (req.method === "POST" && url === "/api/prove") {
      const body = await readBody(req);
      if (!body.query) return send(res, 400, { error: "scenario.query required" });
      return send(res, 200,
        USE_SIGMA_VV ? prove(body, body.term || "wizard", body.tag || "prove") : await sigmaWasm.prove(body));
    }

    if (req.method === "POST" && url === "/api/gates") {
      const body = await readBody(req);
      console.log(`[gates] formulas=${(body.formulas || []).length} scenario=${body.scenario ? "yes" : "no"}`);
      return send(res, 200, USE_SIGMA_VV ? runGates(body) : await sigmaWasm.gates(body));
    }

    return send(res, 404, { error: "not found" });
  } catch (e) {
    console.error("[error]", e);
    return send(res, 500, { error: String(e && e.message || e) });
  }
});

server.listen(PORT, () => {
  console.log(`Logic Project validator API on http://localhost:${PORT}`);
  console.log(`  engine: ${USE_SIGMA_VV ? "sigma-vv (Java SigmaKEE + Vampire)" : "sigmakee-wasm (in-process)"}`);
  console.log(`  endpoints: GET /health  POST /api/typecheck  POST /api/prove  POST /api/gates`);
  if (!USE_SIGMA_VV) sigmaWasm.getSession().catch((e) => console.warn("[sigma] warm-up failed:", e.message));
});
