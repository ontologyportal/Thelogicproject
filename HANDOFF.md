# The Logic Project — handoff notes

The wizard front-end plus a local API that runs **real** SUMO validation
(SigmaKEE + Vampire). Patent Pending.

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

## What's wired vs. what's stubbed

| Piece | State |
|-------|-------|
| Wizard UI (Phases 1–8) | Real UI, client-side. Drafting content (search, sense candidates, statement generation) is still placeholder — this is the LLM-drafting layer to wire next. |
| **Phase 7 validation gates** | **Real.** Syntax + a real Vampire proof via `server/`. Not a timer. |
| Backend `server/index.js` | Real. Zero-dependency Node HTTP server that shells the existing `tools/sigma-vv/*.sh` validators against SigmaKEE + Vampire. |
| LLM ideation (Socratic dialogue, drafting) | **Not wired** — the intended next step (open model via Ollama by default, per the constraint architecture). |

## Run it locally

Two processes:

```bash
# 1. Backend (needs the SUMO workspace + SigmaKEE + Vampire on this machine)
cd server
SIGMA_HOME=~/.sigmakee node index.js        # serves http://localhost:8788

# 2. Front-end
npm install
npm run dev                                  # http://localhost:5173
# .env already points VITE_API_BASE_URL at http://localhost:8788
```

Walk to Phase 7: the gates call the backend and a real Vampire `Theorem` comes
back. The demo term is `SoftwareBug -> Defective` (a self-contained inference that
proves reliably and fast).

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
