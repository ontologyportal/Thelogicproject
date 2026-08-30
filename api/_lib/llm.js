// Shared JSON-drafting helper used by api/draft.js, api/distinguish.js,
// api/statements.js, api/rules.js.
//
// Tries seven providers in order, first configured-and-successful one wins:
// GenAI-MIL -> public Gemini -> Groq -> NVIDIA NIM -> Cerebras -> Mistral ->
// OpenRouter. Seven independent providers/quotas so a single vendor outage
// or rate limit (each has happened live) doesn't take the drafting flow
// down during a demo.
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
// Groq, NVIDIA NIM, Cerebras, Mistral, and OpenRouter are the backups,
// after GenAI-MIL and Gemini: five separate free-tier quotas, none tied to
// Google's. All five speak the same OpenAI-compatible chat/completions
// shape, so they share one request/response helper (callOpenAICompatible)
// instead of five near-identical functions. Only Groq's JSON mode
// (response_format: json_object) is verified live — the other four rely on
// extractJson's regex fallback instead of a provider-side JSON mode, since
// an unverified json_object param risks a 400 that kills the request
// outright.
//
// Every model pinned below was picked deliberately free of Chinese-origin
// models (no DeepSeek, Qwen, GLM, Yi, MiniMax, Kimi, etc.), including on
// OpenRouter, whose free catalog carries several of those alongside the
// ones used here.

const GENAI_MIL_URL = "https://api.genai.mil/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5";
const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = "gpt-oss-120b";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-small-latest";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemma-4-31b-it:free";

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

/**
 * Shared caller for every OpenAI-compatible chat/completions provider
 * (Groq, NVIDIA NIM, Cerebras, Mistral, OpenRouter). jsonMode should only be
 * set for a provider whose json_object support has actually been verified —
 * see the file header. Providers without it still get reliable JSON via
 * extractJson's regex fallback.
 */
async function callOpenAICompatible({ name, url, model, apiKey, prompt, temperature, maxTokens, jsonMode }) {
  const body = {
    model,
    temperature,
    max_tokens: Math.max(maxTokens, 500),
    messages: [{ role: "user", content: prompt }],
  };
  if (jsonMode) body.response_format = { type: "json_object" };

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!upstream.ok) {
    const errBody = await upstream.text().catch(() => "");
    throw new Error(`${name} ${upstream.status}: ${errBody.slice(0, 300)}`);
  }
  const completion = await upstream.json();
  const content = completion?.choices?.[0]?.message?.content;
  const parsed = content ? extractJson(content) : null;
  if (!parsed) throw new Error(`${name}: unparseable completion`);
  return parsed;
}

// Ordered fallback chain. Each entry's call signature is (prompt, {temperature,
// maxTokens}) -> parsed JSON, matching callGenaiMil/callGemini so draftJSON
// can loop uniformly instead of repeating an if-block per provider.
const PROVIDERS = [
  { envKey: "GENAI_MIL_API_KEY", name: "genai-mil", call: callGenaiMil },
  { envKey: "GEMINI_API_KEY", name: "gemini", call: callGemini },
  {
    envKey: "GROQ_API_KEY",
    name: "groq",
    call: (prompt, opts) =>
      callOpenAICompatible({
        name: "groq",
        url: GROQ_URL,
        model: GROQ_MODEL,
        apiKey: process.env.GROQ_API_KEY,
        prompt,
        ...opts,
        jsonMode: true,
      }),
  },
  {
    envKey: "NVIDIA_API_KEY",
    name: "nvidia-nim",
    call: (prompt, opts) =>
      callOpenAICompatible({
        name: "nvidia-nim",
        url: NVIDIA_URL,
        model: NVIDIA_MODEL,
        apiKey: process.env.NVIDIA_API_KEY,
        prompt,
        ...opts,
      }),
  },
  {
    envKey: "CEREBRAS_API_KEY",
    name: "cerebras",
    call: (prompt, opts) =>
      callOpenAICompatible({
        name: "cerebras",
        url: CEREBRAS_URL,
        model: CEREBRAS_MODEL,
        apiKey: process.env.CEREBRAS_API_KEY,
        prompt,
        ...opts,
      }),
  },
  {
    envKey: "MISTRAL_API_KEY",
    name: "mistral",
    call: (prompt, opts) =>
      callOpenAICompatible({
        name: "mistral",
        url: MISTRAL_URL,
        model: MISTRAL_MODEL,
        apiKey: process.env.MISTRAL_API_KEY,
        prompt,
        ...opts,
      }),
  },
  {
    envKey: "OPENROUTER_API_KEY",
    name: "openrouter",
    call: (prompt, opts) =>
      callOpenAICompatible({
        name: "openrouter",
        url: OPENROUTER_URL,
        model: OPENROUTER_MODEL,
        apiKey: process.env.OPENROUTER_API_KEY,
        prompt,
        ...opts,
      }),
  },
];

/**
 * Drafts JSON from a prompt, trying each configured provider in PROVIDERS
 * order (see file header for the chain and why each provider is in it).
 * Throws if none are configured or all fail — callers already handle that
 * by falling back to static placeholders.
 */
async function draftJSON(prompt, opts = {}) {
  const temperature = opts.temperature ?? 0.3;
  const maxTokens = opts.maxTokens ?? 300;
  const errors = [];

  for (const provider of PROVIDERS) {
    if (!process.env[provider.envKey]) continue;
    try {
      return await provider.call(prompt, { temperature, maxTokens });
    } catch (err) {
      errors.push(String(err.message || err));
    }
  }

  if (errors.length === 0) {
    throw new Error(`no LLM provider configured (set one of: ${PROVIDERS.map((p) => p.envKey).join(", ")})`);
  }
  throw new Error(errors.join(" | "));
}

module.exports = { draftJSON };
