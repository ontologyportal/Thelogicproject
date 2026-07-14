# The Logic Project — handoff notes

The wizard front-end plus a local API that runs **real** SUMO validation
(SigmaKEE + Vampire). Patent Pending.

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
