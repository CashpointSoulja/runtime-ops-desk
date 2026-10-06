# PRD: Runtime Ops Desk

## Problem
Runtime's first ops hire owns four jobs at once: customer experience, internal agents, the operating cadence and product feedback. Each normally lives in a separate tool or a separate person. A seven-person company needs one place to run all four, with payment-ops depth, from week one.

## Users
- Primary: the Founding AI Ops hire.
- Secondary: founders reading the weekly cadence and board update; engineering reading the Friction Log.

## Goals
1. Decide what to automate first inside Runtime, with a visible formula.
2. Onboard and monitor design partners, and brief renewals.
3. Turn payment-ops procedures into agent specs with approval policies.
4. Score agent runs and turn failures into ranked product fixes.
5. Produce the weekly metrics view and the board update.

## Non-goals
Real integrations, real customer data, sign-in, a backend.

## Modules
| Module | Route | Core output |
| --- | --- | --- |
| Start Here | / | 60-second tour, responsibility map |
| Seat map | /seat/ | Job-post line to artifact map |
| Operate | /operate/ | Six-rung rollout ladder |
| A. Automation Map | /automation/ | 24 workflows ranked, payback, build order, agent specs |
| B. Customer Desk | /customers/ | 14-day plan, health model, weekly actions, QBR export |
| C. Runbook Library | /runbooks/ | 10 runbooks, builder, approval-policy JSON, audit entry |
| D. Run Review | /review/ | Rubric, paste-a-trace, Friction Log, digest |
| E. Operating Cadence | /cadence/ | Metrics tree, roll-up, board update, 30/60/90 |
| Field Notes | /field-notes/ | First-hand onboarding log, 6 Oct 2026 |
| Sources | /sources/ | Public source ledger |

## Requirements
- Every computed number shows its formula; every input is tagged Sourced, Estimated, Placeholder or Assumption; demo data is tagged Illustrative data.
- Works signed out, on desktop and at 390 px.
- Reset returns all edits to defaults.
- Exports: agent spec JSON, QBR brief, Friction Log, weekly digest, board update (Markdown).

See [success-metrics.md](success-metrics.md) and [test-plan.md](test-plan.md). Live: https://cashpointsoulja.github.io/runtime-ops-desk/
