# Test plan

## Unit (Vitest, `npm test`)
- Automation score: hand-calculated cases for volume cap, error cost, sensitivity cap at Next, Not Yet tier, deterministic ranking.
- Payback: hand-calculated hours, value, run spend, seat spend, net and payback weeks; null when net ≤ 0.
- Health: hand-calculated weighted scores, missing-metric coverage, RAG thresholds, renewal-risk rules, deterministic weekly actions.
- Run Review: each failure trace raises its finding; hand-calculated rubric scores; Friction Log ranking; trace parser rejects bad input.
- Runbooks: ≥ 10, every cited source exists, threshold overrides reach the approval policy.
- Cadence: metrics-tree rates from placeholder inputs.

## Static checks
`npm run lint`, `npm run typecheck`, `npm run build` (static export).

## Browser (Playwright, `node scripts/shoot.mjs <base-url>`)
Every route at 1366×900 and 390×844, signed out: HTTP 200, no horizontal overflow, logo rendered, no console errors or failed requests, no third-party requests, footer text exact. Run against the local export and again against the live Pages URL.

## Manual
Reset clears edits; downloads open; print view of the QBR brief; keyboard focus visible.

## Content
Search source, docs, build output and commit messages for tool, assistant and model names, and for text addressed to agents.
