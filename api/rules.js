// Drafts the real formula + test scenario that Phase 7 proves and the final
// PR submits — the piece HANDOFF.md flagged as unwired ("every submission
// currently validates/submits the same demo term's formulas regardless of
// what the user described"). Uses the shared api/_lib/llm.js provider
// (GenAI-MIL, falling back to the public Gemini API).
//
// Deliberately scoped to ONE formula + ONE matching scenario per term,
// mirroring DEMO_TERM's own shape exactly — the same reason DEMO_TERM's rule
// is simple: self-contained proofs (no dependency on anything beyond the
// bare Merge.kif the in-browser prover holds resident) are the reliable
// path, per HANDOFF.md's own note that full-KB scenarios have regressed.
//
// This is the "draft" half of the formalize loop in
// src/app/services/formalize.ts — that loop is what actually runs the
// deterministic vocabulary/syntax/proof checks and drives retries. This
// endpoint just proposes; it never validates against the KB itself (it
// can't — the KB only exists in the browser's WASM session).

const { draftJSON } = require("./_lib/llm");
const { isValidIdentifier, isSingleBalancedForm } = require("./_lib/kif");

const MAX_TEXT_LEN = 4000;
const MAX_HISTORY = 4;

function buildPrompt({ term, parent, description, scenario, statements, failureHistory }) {
  const statementsBlock = statements && statements.length
    ? `\nApproved statements about it:\n${statements.map((s) => `- ${s}`).join("\n")}`
    : "";
  const scenarioBlock = scenario && scenario.trim()
    ? `\nShould verify: ${scenario}`
    : "";
  const historyBlock = failureHistory && failureHistory.length
    ? `\n\nA previous attempt was rejected by a deterministic checker. Do not repeat the same mistake:\n${failureHistory
        .slice(-MAX_HISTORY)
        .map((h) => `- ${h.validator} check failed on "${h.payload}"${h.userAnswer ? `. The person clarified: "${h.userAnswer}"` : ""}`)
        .join("\n")}`
    : "";

  return `You help formalize a natural-language description of a concept into one SUO-KIF logical rule and a matching test case, for a formal ontology (SUMO).

Term: ${term} (a subclass of ${parent})
Description: ${description}${scenarioBlock}${statementsBlock}${historyBlock}

Use ONLY simple, extremely common SUO-KIF predicates: "instance", "attribute", "subclass", or a single other common relation if strictly necessary. Do not invent predicates. The rule must be exactly this shape, one implication, using ?X as the variable:
(=> (instance ?X ${term}) (attribute ?X SomePropertyClass))
(SomePropertyClass should be an existing, extremely common, general SUMO class, e.g. Defective, Dangerous, Beneficial — pick whichever plain adjective-like class best matches the description. If none fit attribute-style, a single other very common binary relation is acceptable, but keep the same overall (=> (instance ?X ${term}) (...)) shape.)

Then give a test case: a made-up instance name for this rule (a single CamelCase identifier, e.g. ${term}Case1), the fact asserting that instance is a ${term}, and the query that follows from the rule with the instance substituted in.

Output ONLY this JSON object, no other words, no markdown fences, no questions:
{"formula": "(=> (instance ?X ${term}) (...))", "instanceName": "...", "fact": "(instance ... ${term})", "query": "(...)", "scenarioNote": "one sentence describing the test case"}`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "method not allowed" }));
  }

  if (!process.env.GENAI_MIL_API_KEY && !process.env.GEMINI_API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "drafting is not configured yet (missing GENAI_MIL_API_KEY / GEMINI_API_KEY)" }));
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const { term, parent, description, scenario, statements, failureHistory } = body || {};
  if (!term || !isValidIdentifier(term)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "term must be a plain identifier" }));
  }
  if (!parent || !isValidIdentifier(parent)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "parent must be a plain identifier" }));
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "description is required" }));
  }
  if (description.length > MAX_TEXT_LEN || (scenario && (typeof scenario !== "string" || scenario.length > MAX_TEXT_LEN))) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "input too long" }));
  }
  if (statements !== undefined && !Array.isArray(statements)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "statements must be an array" }));
  }
  if (failureHistory !== undefined && !Array.isArray(failureHistory)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "failureHistory must be an array" }));
  }

  let parsed;
  try {
    parsed = await draftJSON(
      buildPrompt({ term, parent, description, scenario, statements, failureHistory }),
      { temperature: 0.25, maxTokens: 300 }
    );
  } catch (err) {
    console.error("rules.js: drafting failed:", err);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "could not reach the drafting service" }));
  }

  const { formula, instanceName, fact, query, scenarioNote } = parsed || {};
  const wellFormed =
    isSingleBalancedForm(formula) &&
    isSingleBalancedForm(fact) &&
    isSingleBalancedForm(query) &&
    typeof instanceName === "string" &&
    /^[A-Za-z][A-Za-z0-9_]{0,79}$/.test(instanceName);
  if (!wellFormed) {
    console.error("rules.js: unexpected result:", parsed);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "drafting service returned an unexpected response" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    formula,
    instanceName,
    fact,
    query,
    scenarioNote: String(scenarioNote || "").slice(0, 300),
  }));
};
