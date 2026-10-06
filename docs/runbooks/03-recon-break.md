# Reconciliation break clearing

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
Daily reconciliation flags a break between processor payouts, ledger and bank.

Queue: Finance / payment-ops reconciliation queue

## Systems read
- Reconciliation report
- Processor payout reconciliation
- Ledger / DB
- Bank statement

## Steps
1. Read the break: amount, date, the two sides that disagree.
2. Classify: timing, amount, missing on one side, duplicate.
3. For timing: find the matching item on the next bank day.
4. For amount: list the component transactions and find the difference (fees, refunds, disputes).
5. For missing: search both sides with a date window.
6. Propose a resolution with ids. Any ledger entry goes to approval.

## Evidence the agent must cite
- Break id
- Matching or missing item ids on each side
- Explanation of the difference with arithmetic

## Approval thresholds
- Ledger adjustments need approval above: 0 USD (Every adjustment)
- Escalate breaks above: 10000 USD (Placeholder)

## The agent must never
- Book a ledger entry without approval
- Net breaks against each other to hide a gap
- Close a break as timing without the matching item

## Audit-trail fields
- `run_id`
- `trigger`
- `queue_item_id`
- `agent_version`
- `tools_called`
- `records_read`
- `evidence_cited`
- `decision`
- `approval_request_id`
- `approver`
- `approved_at`
- `cost_usd`
- `duration_s`
- `outcome`
- `break_id`
- `classification`
- `matched_items`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Breaks open over 3 days

## Top failure modes
- Calling every break timing
- Ignoring fees netted in the payout
- Running many expensive queries without narrowing the window

## Public sources
- Payout reconciliation ties payout transactions to bank deposits. Source: [Stripe: Payout reconciliation report](https://docs.stripe.com/reports/payout-reconciliation)
- Clearing reconciliation breaks is a named use case. Source: [YC job post: Founding AI Ops](https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops)
