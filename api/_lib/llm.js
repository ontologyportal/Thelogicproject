// Shared JSON-drafting helper used by api/draft.js, api/distinguish.js,
// api/statements.js, api/rules.js.
//
// Tries three providers in order, first configured-and-successful one wins:
// GenAI-MIL (GENAI_MIL_API_KEY) -> public Gemini (GEMINI_API_KEY) -> Groq
// (GROQ_API_KEY). Three independent providers/quotas so a single vendor
// outage or rate limit (each has happened live) doesn't take the drafting
// flow down during a demo.
//
// GenAI-MIL is the DoD Gemini gateway, which is what we want to demo when
// reachable. It's IP-gated (IL5/CUI network policy) and rejects requests
// from Vercel's serverless egress ranges with a custom "Unauthorized
// Access" block page, so it works from a local dev machine but not from the
// deployed app.
//
// GenAI-MIL also wraps the model in a "Gemini Enterprise" memory-assistant
// persona that ignores the system role and tries to ask the user to save
// things to memory instead of following instructions — a single forceful
// user-role message reliably avoids that (verified against the live
// endpoint). The direct Gemini API doesn't have this problem and supports
// responseMimeType: "application/json" for reliable structured output.
//
// Groq is the last resort: a separate free-tier quota from Google's, so
// Gemini rate-limiting doesn't take out Groq too.

const GENAI_MIL_URL = "https://api.genai.mil/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function callGenaiMil(prompt, { temperature, maxTokens }) {
  const upstream = await fetch(GENAI_MIL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GENAI_MIL_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; TheLogicProject/1.0)",
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      temperature,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!upstream.ok) {
    const errBody = await upstream.text().catch(() => "");
    throw new Error(`genai-mil ${upstream.status}: ${errBody.slice(0, 300)}`);
  }
  const completion = await upstream.json();
  const content = completion?.choices?.[0]?.message?.content;
  const parsed = content ? extractJson(content) : null;
  if (!parsed) throw new Error("genai-mil: unparseable completion");
  return parsed;
}

async function callGemini(prompt, { temperature, maxTokens }) {
  // gemini-flash-latest resolves to a "thinking" model that spends part of
  // maxOutputTokens on invisible reasoning tokens before writing the visible
  // answer — a caller-requested budget as low as 300 gets consumed entirely
  // by thinking, producing a truncated non-JSON response. thinkingBudget: 0
  // is rejected by this model (400 invalid argument), so the fix is a much
  // larger floor here instead — verified against the live endpoint.
  const geminiMaxTokens = Math.max(maxTokens, 2000);
  const upstream = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: geminiMaxTokens,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!upstream.ok) {
    const errBody = await upstream.text().catch(() => "");
    throw new Error(`gemini ${upstream.status}: ${errBody.slice(0, 300)}`);
  }
  const completion = await upstream.json();
  const text = completion?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = text ? extractJson(text) : null;
  if (!parsed) throw new Error("gemini: unparseable completion");
  return parsed;
}

async function callGroq(prompt, { temperature, maxTokens }) {
  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature,
      max_tokens: Math.max(maxTokens, 500),
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!upstream.ok) {
    const errBody = await upstream.text().catch(() => "");
    throw new Error(`groq ${upstream.status}: ${errBody.slice(0, 300)}`);
  }
  const completion = await upstream.json();
  const content = completion?.choices?.[0]?.message?.content;
  const parsed = content ? extractJson(content) : null;
  if (!parsed) throw new Error("groq: unparseable completion");
  return parsed;
}

/**
 * Drafts JSON from a prompt, trying GenAI-MIL, then the public Gemini API,
 * then Groq. Throws if none are configured or all fail — callers already
 * handle that by falling back to static placeholders.
 */
async function draftJSON(prompt, opts = {}) {
  const temperature = opts.temperature ?? 0.3;
  const maxTokens = opts.maxTokens ?? 300;
  const errors = [];

  if (process.env.GENAI_MIL_API_KEY) {
    try {
      return await callGenaiMil(prompt, { temperature, maxTokens });
    } catch (err) {
      errors.push(String(err.message || err));
    }
  }
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(prompt, { temperature, maxTokens });
    } catch (err) {
      errors.push(String(err.message || err));
    }
  }
  if (process.env.GROQ_API_KEY) {
    try {
      return await callGroq(prompt, { temperature, maxTokens });
    } catch (err) {
      errors.push(String(err.message || err));
    }
  }
  if (errors.length === 0) {
    throw new Error("no LLM provider configured (set GENAI_MIL_API_KEY, GEMINI_API_KEY, and/or GROQ_API_KEY)");
  }
  throw new Error(errors.join(" | "));
}

module.exports = { draftJSON };
