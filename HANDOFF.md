# The Logic Project — handoff notes

The wizard front-end, a local API that runs **real** SUMO validation (SigmaKEE +
Vampire), and a real GitHub-auth + submit pipeline that opens pull requests on
[jdev-02/sumo-contributions](https://github.com/jdev-02/sumo-contributions) (a
private staging repo whose own CI re-validates every submission against the same
toolchain). Patent Pending.

**First-time prod setup (OAuth App, bot token, Vercel env vars) is in
[SETUP.md](./SETUP.md) — only Jon can do those steps.**

## Backend orientation (read this first — written for a new contributor or an AI agent)

**One request, end to end:**

```
Wizard UI (React)
  --HTTP fetch (VITE_API_BASE_URL)-->  server/index.js
      --spawns bash-->  ~/workspace/tools/sigma-vv/*.sh
          --java-->  SigmaKEE (sigmakee/build/sigmakee.jar) + Vampire binary
      <--exit code + report/.proof.json--
  <--JSON: per-gate {status, detail} + proof {szs, wallMs}--
```

**Files in this repo:**
- `server/index.js` — zero-dependency Node HTTP server. Writes each formula/scenario to a
  temp `.kif`/`.tq`, shells the matching sigma-vv script, parses its exit code + the
  report/`.proof.json` it emits. Endpoints: `/health`, `/api/typecheck`, `/api/prove`, `/api/gates`.
- `src/app/services/api.ts` — front-end client (`runGates`, `typecheck`); reads `VITE_API_BASE_URL`.
  Also holds `DEMO_TERM` (SoftwareBug → Defective).
- `src/app/components/logic/screens/index.tsx` → `P7VerifyScreen` — calls `runGates()` on mount,
  renders per-gate pass/fail + the Vampire result. This is the only screen wired to the backend.

**Lives on the workstation, NOT in this repo (the server calls them):**
`~/workspace/tools/sigma-vv/*.sh` (the real validators), `~/workspace/sigmakee/build/sigmakee.jar`,
the Vampire binary, and KB config at `~/.sigmakee/KBs/config.xml`. To run the backend you need that
SUMO workspace present. `server/index.js` is only the HTTP glue.

**Gotchas:**
- Each call reloads the whole SUMO KB (~30–40s). Fine for a recording; the fast path is a
  persistent in-process server — `tools/sigma-vv/SigmaVV.java` is built to be called after one
  `KBmanager.initializeOnce()`.
- Full-KB proof scenarios regressed on Vampire 5 (instruction limits during SInE selection on the
  large KB). The demo uses **self-contained** proofs, which resolve in <1s and are unaffected.
- `src/app/components/wizard/` is dead code (nothing imports it) — safe to delete.

## Submit orientation (the GitHub auth + PR pipeline)

**One submit, end to end:**

```
Splash screen "Sign in with GitHub"
  --302-->  api/auth/login.js  (sets state cookie, redirects to GitHub)
  --user approves-->  api/auth/callback.js
      --exchanges code for a token server-side, reads /user-->
  <--302 to "/", sets a signed httpOnly session cookie (login + avatar)--

Submit screen, on mount
  --POST /api/submit  (contribution: term/parent/docString/everydayName/formulas)-->
      api/submit.js: verifies the session cookie, assembles the .kif + meta.json,
      opens a branch + PR on jdev-02/sumo-contributions using GH_BOT_TOKEN
      (a repo-scoped PAT — never the signed-in user's own token)
  <--{ prUrl, prNumber }--

jdev-02/sumo-contributions: validate.yml runs on that PR
  --shells its OWN vendored copy of the sigma-vv toolchain-->
  posts a pass/fail comment with the same gates Phase 7 already ran client-side
```

**Files:** `api/auth/{login,callback,me,logout}.js`, `api/submit.js`,
`api/_lib/{session.js,kif.js,github.js}` (session signing, KIF assembly, the
GitHub REST client — none are routes themselves, the `_` prefix keeps Vercel from
treating them as endpoints). Zero new npm dependencies (`node:crypto` + `fetch`).

**Why a bot token instead of the user's own GitHub access:** `sumo-contributions`
is private, so an arbitrary signed-in user can't open a PR on it directly even if
we had their token. The bot token (scoped to only that one repo) does it instead,
crediting the real user in the commit message, PR title, and `meta.json`.

## What's wired vs. what's stubbed

| Piece | State |
|-------|-------|
| Wizard UI (Phases 1–8) | Real UI, client-side. Drafting content (search, sense candidates, statement generation) is still placeholder — this is the LLM-drafting layer to wire next. |
| **Phase 5 (define)** | Real. The parent/everyday-name/doc-string fields the user confirms are lifted into a `Contribution` object (`App.tsx`) and are what actually gets submitted. |
| **Phase 7 validation gates** | **Real.** Syntax + a real Vampire proof via `server/`. Not a timer. |
| Backend `server/index.js` | Real. Zero-dependency Node HTTP server that shells the existing `tools/sigma-vv/*.sh` validators against SigmaKEE + Vampire. |
| **GitHub sign-in** | **Real** OAuth (`api/auth/*.js`, Vercel serverless functions). Identity only — the wizard never requests repo access from the user. |
| **Submit** | **Real.** Signed-in users get an actual PR opened on `sumo-contributions` (`api/submit.js`), whose own CI re-runs the same validators. Guests see the same success screen without a real PR (told to sign in). |
| Rule-drafting (the actual KIF formulas) | **Not wired** — the LLM-drafting layer. Every submission currently validates/submits the same demo term's formulas (`SoftwareBug -> Defective`) regardless of what the user described; only the structural fields (term/parent/name/doc) are real per-session input. |

## Run it locally

One process, no local SUMO/SigmaKEE/Vampire install needed:

```bash
npm install
npm run dev                                  # http://localhost:5173
```

Phase 7 runs a real Vampire proof **in-browser via WASM** by default (see
`src/app/services/sigma.ts`) — nothing else to start. Walk to Phase 7 and hit
Verify: the gates run client-side and a real Vampire `Theorem` comes back. The
demo term is `SoftwareBug -> Defective` (a self-contained inference that proves
reliably and fast, in well under a second).

The Node backend below (`server/index.js`) is an older, optional path — only
needed if you explicitly set `VITE_LOCAL_SIGMA=0` to force the wizard at a
remote validator API instead of the in-browser engine. Not required for normal
local dev or for the classroom stress-test.

## Hosting

The repo is **private** (protecting the code + IP), so public GitHub Pages is not
used. Iterate by cloning and running locally (above). For a private live URL, use
**Vercel with deployment protection** (repo stays private, URL is login-gated) or
GitHub Pro (private Pages). Set the build base with `VITE_BASE=/Thelogicproject/`
only if hosting under a subpath; Vercel serves at root so no base is needed.

**Important:** any static host serves the wizard UI only. It cannot run
Vampire/SigmaKEE, so Phase 7 shows a "connect a backend" message unless
`VITE_API_BASE_URL` points at a running `server/` (local, or hosted on a box with
the SUMO toolchain).

## Backend API

- `GET  /health`
- `POST /api/typecheck` `{ formula }` → `{ valid, detail }`
- `POST /api/prove` `{ axioms[], facts[], query, answer }` → `{ proved, szs, wallMs }`
- `POST /api/gates` `{ formulas[], scenario }` → `{ gates[], proof }`

The backend reloads the KB per call (~30–40s) — fine for a sped-up recording. The
fast path Teddy wants is a **persistent in-process server**: `tools/sigma-vv/SigmaVV.java`
is written to be called in-process after one `KBmanager.initializeOnce()`, avoiding
the per-request KB load.

## Notes

- `src/app/components/wizard/` is a **dead, older UI set** (nothing imports it).
  Safe to delete before serious iteration.
- Known regression for later: full-KB proof scenarios (`sumo/development/proof-scenarios/pr1–pr8`)
  now hit Vampire 5.0.1 instruction limits during SInE selection over the large KB,
  and one flagged a possible KB inconsistency. The demo uses self-contained proofs,
  which are unaffected.
