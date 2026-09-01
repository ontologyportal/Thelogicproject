# Prod setup checklist (Jon only)

Six things only you can do — the code and infra are ready and waiting on these.
Everything else (the staging repo, the CI gate, the Vercel functions, the wired
front-end) is already built and pushed.

## 1. Create a GitHub OAuth App

github.com/settings/developers → **New OAuth App**

- Application name: `The Logic Project`
- Homepage URL: `https://thelogicproject.vercel.app`
- Authorization callback URL: `https://thelogicproject.vercel.app/api/auth/callback`

Save it, then **Generate a new client secret**. Copy both the **Client ID** and
the **Client Secret** — you'll paste them into Vercel in step 3.

## 2. Create a fine-grained personal access token (the submit bot)

github.com/settings/personal-access-tokens/new

- Resource owner: `jdev-02`
- Repository access: **Only select repositories** → `sumo-contributions`
- Permissions: **Contents** (Read and write), **Pull requests** (Read and write)
- No other scopes.

Copy the token — this is `GH_BOT_TOKEN`. It's what opens pull requests on the
contribution repo on a signed-in user's behalf; it never leaves the server.

## 3. Set Vercel environment variables

Vercel dashboard → the `thelogicproject` project → **Settings → Environment
Variables**. Add four:

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from step 1 |
| `GITHUB_CLIENT_SECRET` | from step 1 |
| `SESSION_SECRET` | any long random string (e.g. `openssl rand -hex 32`) |
| `GH_BOT_TOKEN` | from step 2 |

Redeploy after adding them (Vercel doesn't apply new env vars to an existing
deployment automatically — trigger a new deploy, or it'll pick them up on the
next push).

## 4. Decide on Deployment Protection

The live URL is currently public (anyone with the link sees the wizard UI; the
source stays private either way, since the repo itself is private). If you want
the URL itself gated: **Settings → Deployment Protection → Vercel
Authentication**. On the free plan this reliably protects preview deployments;
gating the production URL may need a paid tier — if you hit that wall, share the
protected preview link instead, or add collaborators to the Vercel project
directly.

## 5. LLM provider keys, and the health-check workflow's secrets

`api/_lib/llm.js` tries seven providers in order for drafting (see that
file's header comment for the full rationale). Each is optional — only the
ones with a key set are tried — but more configured means more independent
free-tier quotas backing a demo.

| Env var | Where to get it |
|---|---|
| `GENAI_MIL_API_KEY` | DoD GenAI-MIL gateway (IL5/CUI network only). One key per account, not per model — the platform's ChatGPT Mil and Grok for Government are chat-UI-only, no API access as of 2026-09-01. The key self-locks roughly every 8 days; unlock it in the platform UI if requests start failing. |
| `GEMINI_API_KEY` | aistudio.google.com → Get API key |
| `GROQ_API_KEY` | console.groq.com → API Keys |
| `NVIDIA_API_KEY` | build.nvidia.com → sign in with the NVIDIA Developer Program (free), pick a model, generate a key |
| `CEREBRAS_API_KEY` | cloud.cerebras.ai → API Keys (free tier, no card) |
| `MISTRAL_API_KEY` | console.mistral.ai → API Keys (the free "Experiment" tier on La Plateforme) |
| `OPENROUTER_API_KEY` | openrouter.ai/settings/keys |

Set the ones you have locally in `.env.local` (for `npm run dev`) and, for
the ones you want the scheduled health check to cover, also as **repo
secrets**: github.com/ontologyportal/Thelogicproject → **Settings → Secrets
and variables → Actions → New repository secret**, same names as above.
`.github/workflows/llm-provider-health.yml` runs daily and on demand
(`gh workflow run llm-provider-health.yml`); it skips any provider without a
matching secret and fails the run if a *configured* one stops resolving —
that's the tripwire for a vendor deprecating a pinned model ID or a key
expiring quietly. GenAI-MIL is intentionally excluded from that workflow —
GitHub-hosted runners can't reach its IP-gated endpoint, so verify it
locally instead.

## 6. Nothing else to create — verify instead

Once 1-3 are done, the full loop should work: sign in with GitHub on the splash
screen → author a term → Phase 7 runs a real proof (needs a validator backend
reachable at `VITE_API_BASE_URL` — see `HANDOFF.md`) → Submit opens a real PR on
`jdev-02/sumo-contributions` → that repo's own CI re-validates the same
contribution and comments the result on the PR.

If submit fails with a 401, the session cookie didn't get set — check steps 1
and 3. If it fails with a GitHub API error, check step 2's token scope.
