// Drafts Phase 6's candidate natural-language statements about a concept.
// Uses the shared api/_lib/llm.js provider (GenAI-MIL, falling back to the
// public Gemini API — see that file for why).

const { draftJSON } = require("./_lib/llm");

const MAX_TEXT_LEN = 4000;

function buildPrompt(termName, description) {
  return `You help draft candidate factual statements about a new ontology concept, for a human to review and approve or drop.
Concept: "${termName}" — described as: ${description}

Propose 3 short, plain-English statements that are likely true of this concept based on the description. Each should be a simple factual claim (not a question), the kind that could later be formalized as a logical rule.

Output ONLY this JSON object, no other words, no markdown fences, no questions:
{"statements": ["...", "...", "..."]}`;
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
  const { termName, description } = body || {};
  if (!termName || !description || typeof description !== "string" || !description.trim()) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "termName and description are required" }));
  }
  if (description.length > MAX_TEXT_LEN || termName.length > 200) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "input too long" }));
  }

  let parsed;
  try {
    parsed = await draftJSON(buildPrompt(termName, description), { temperature: 0.4, maxTokens: 300 });
  } catch (err) {
    console.error("statements.js: drafting failed:", err);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "could not reach the drafting service" }));
  }

  if (!parsed || !Array.isArray(parsed.statements) || parsed.statements.length === 0) {
    console.error("statements.js: unexpected result:", parsed);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "drafting service returned an unexpected response" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    statements: parsed.statements.slice(0, 3).map((s) => String(s).slice(0, 300)),
  }));
};
