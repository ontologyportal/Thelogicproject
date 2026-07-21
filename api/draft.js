// Drafts the Phase 5 fields (parent category / everyday name / one-sentence
// description) from the user's Phase 1 description. This is the first wired
// slice of the LLM-drafting layer described in HANDOFF.md — the rest of the
// wizard (rule-drafting into real KIF formulas) is still stubbed.
//
// Uses the shared api/_lib/llm.js provider (GenAI-MIL, falling back to the
// public Gemini API — see that file for why). If neither is configured or
// both fail, this returns a clear error and the client falls back to the
// existing static placeholders — a broken/unset key must never break the
// wizard.

const { draftJSON } = require("./_lib/llm");

const MAX_TEXT_LEN = 4000;

function buildPrompt(userContent) {
  return `You help draft a formal ontology term (SUMO-style) from a plain-English description.
Given the description below (and optionally what should be verified about it), propose:
- parent: the single most specific broader category this concept is a kind of (a short CamelCase-ish class name, e.g. "ComputerProgram", "PhysicalObject")
- everydayName: a short, friendly, human-readable label for the concept (a few words, plain English)
- docString: one clear sentence defining the concept

Output ONLY this JSON object with the values filled in, no other words, no markdown fences, no questions, no memory/save requests:
{"parent": "...", "everydayName": "...", "docString": "..."}

${userContent}`;
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
  const { description, scenario } = body || {};
  if (!description || typeof description !== "string" || !description.trim()) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "description is required" }));
  }
  if (description.length > MAX_TEXT_LEN || (scenario && scenario.length > MAX_TEXT_LEN)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "input too long" }));
  }

  const userContent = scenario && scenario.trim()
    ? `Description: ${description}\n\nShould verify: ${scenario}`
    : `Description: ${description}`;

  let parsed;
  try {
    parsed = await draftJSON(buildPrompt(userContent), { temperature: 0.3, maxTokens: 300 });
  } catch (err) {
    console.error("draft.js: drafting failed:", err);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "could not reach the drafting service" }));
  }

  if (!parsed || !parsed.parent || !parsed.everydayName || !parsed.docString) {
    console.error("draft.js: unexpected result:", parsed);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "drafting service returned an unexpected response" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    parent: String(parsed.parent).slice(0, 200),
    everydayName: String(parsed.everydayName).slice(0, 200),
    docString: String(parsed.docString).slice(0, 500),
  }));
};
