// Drafts Phase 2's "how does your concept differ from X" reasoning.
// Uses the shared api/_lib/llm.js provider (GenAI-MIL, falling back to the
// public Gemini API — see that file for why).

const { draftJSON } = require("./_lib/llm");

const MAX_TEXT_LEN = 4000;

function buildPrompt(termName, description, candidates) {
  return `You help distinguish a new ontology concept from similar existing ones.
New concept: "${termName}" — described as: ${description}
Existing candidates it might be confused with: ${candidates.join(", ")}

For each candidate, write one short clause (under 12 words) explaining how the new concept likely differs from it, based only on the description given. If you can't tell from the description, say so briefly rather than guessing specifics.

Output ONLY this JSON object, no other words, no markdown fences, no questions:
{"distinguishers": [{"candidate": "...", "reason": "..."}, ...]}`;
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
  const { termName, description, candidates } = body || {};
  if (!termName || !description || !Array.isArray(candidates) || candidates.length === 0) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "termName, description, and candidates are required" }));
  }
  if (description.length > MAX_TEXT_LEN || termName.length > 200) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "input too long" }));
  }

  let parsed;
  try {
    parsed = await draftJSON(buildPrompt(termName, description, candidates.slice(0, 3)), { temperature: 0.3, maxTokens: 300 });
  } catch (err) {
    console.error("distinguish.js: drafting failed:", err);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "could not reach the drafting service" }));
  }

  if (!parsed || !Array.isArray(parsed.distinguishers)) {
    console.error("distinguish.js: unexpected result:", parsed);
    res.writeHead(502, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "drafting service returned an unexpected response" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    distinguishers: parsed.distinguishers.slice(0, 3).map((d) => ({
      candidate: String(d.candidate || "").slice(0, 100),
      reason: String(d.reason || "").slice(0, 200),
    })),
  }));
};
