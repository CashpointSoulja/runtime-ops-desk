# Runtime Ops Desk

An independent concept for Runtime's public [Founding AI Ops](https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops) role: the working desk that seat would run, built on public information and synthetic data.

**Live:** https://cashpointsoulja.github.io/runtime-ops-desk/

Independent concept by Ayo Ahmed. Public information only. Not a Runtime product. Not affiliated with Runtime.

## What's inside

| Page | What it does |
| --- | --- |
| [Start Here](https://cashpointsoulja.github.io/runtime-ops-desk/) | 60-second tour and how each module maps to the four jobs in the post |
| [Seat map](https://cashpointsoulja.github.io/runtime-ops-desk/seat/) | Every line of the job post mapped to the artifact that shows it, plus a "Not shown here" section |
| [Operate](https://cashpointsoulja.github.io/runtime-ops-desk/operate/) | Six-rung rollout ladder: support triage, CS, implementation, payouts, fraud/risk, compliance |
| [A. Automation Map](https://cashpointsoulja.github.io/runtime-ops-desk/automation/) | 24 internal workflows ranked by an editable formula, payback for a seven-person company, week 1 to 4 build order, one-page agent spec each |
| [B. Customer Desk](https://cashpointsoulja.github.io/runtime-ops-desk/customers/) | 14-day design-partner plan, weighted health model for six archetype accounts, weekly actions, QBR brief export |
| [C. Runbook Library](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/) | 10 payment-ops runbooks with cited sources, and a builder that emits an agent spec, approval-policy JSON and a mock audit entry |
| [D. Run Review](https://cashpointsoulja.github.io/runtime-ops-desk/review/) | 9 synthetic run traces on a six-part rubric, paste-a-trace scoring, ranked Friction Log, weekly digest |
| [E. Operating Cadence](https://cashpointsoulja.github.io/runtime-ops-desk/cadence/) | Metrics tree, health roll-up, board update builder, 30/60/90 plan |
| [Field Notes](https://cashpointsoulja.github.io/runtime-ops-desk/field-notes/) | First-hand onboarding log, 6 Oct 2026 |
| [Sources](https://cashpointsoulja.github.io/runtime-ops-desk/sources/) | Public source ledger |

Every computed number shows its formula. Inputs are tagged Sourced, Estimated, Placeholder or Assumption; demo data is tagged Illustrative data. Edits are saved in your browser; Reset saved state clears them.

## Docs

- [PRD](docs/PRD.md) · [Five whys](docs/five-whys.md) · [Jobs to be done](docs/jtbd.md) · [Success metrics](docs/success-metrics.md)
- [Research](docs/RESEARCH.md) · [Sources](docs/SOURCES.md) · [Role map](docs/ROLE-MAP.md) · [First 90 days](docs/FIRST-90-DAYS.md)
- [Interview Q&A: 12 payment-ops questions](docs/INTERVIEW-QA.md)
- [First-hand usage](docs/FIRST-HAND-USAGE.md) · [Field notes](docs/field-notes.md)
- [Build decisions](docs/BUILD-DECISIONS.md) · [Viability memo](docs/viability-memo.md) · [Roadmap v2](docs/roadmap-v2.md) · [ELI5](docs/eli5.md)
- [Test plan](docs/test-plan.md) · [Test results](docs/test-results.md)
- [Brand sheet](docs/brand-sheet.md) · [Visual guide](docs/visual-guide.md)
- [Runbooks as Markdown](docs/runbooks/) · [Screenshots](docs/screenshots/) · [Demo video](docs/video/)

## Run it

```bash
npm ci
npm run dev          # http://localhost:3000
npm test             # unit tests for every scoring module
npm run lint && npm run typecheck
npm run build        # static export to out/
npm run docs:export  # regenerate runbooks, SOURCES, ROLE-MAP, FIRST-90-DAYS, FIRST-HAND-USAGE from src/lib
```

Deploys to GitHub Pages from `main` via `.github/workflows/pages.yml` (`BASE_PATH=/runtime-ops-desk`).

## Stack

Next.js (App Router, static export), TypeScript, Vitest, Playwright for screenshots. No backend, no sign-in, no API keys. Runtime mark used unmodified from runtm.com; Inter and JetBrains Mono as on runtm.com.
