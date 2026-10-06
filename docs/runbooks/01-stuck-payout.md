# Stuck payout trace

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
Merchant reports a payout not received, or a payout is past its expected arrival date.

Queue: Support inbox and payment-ops channel ("where is my payout" escalations)

## Systems read
- Ticketing
- Processor dashboard / API (payout object, status, failure code)
- Ledger / DB (payout batch, balance transactions)
- Bank portal or statement (deposit lines)
- Logs (payout job)

## Steps
1. Read the ticket and extract merchant id, payout id(s), amount, expected date.
2. Look up each payout in the processor: status (pending, in transit, paid, failed, canceled) and failure code if any.
3. Pull the balance transactions included in the payout and confirm the total.
4. Check the bank statement for a matching deposit (amount, date, trace or reference).
5. If failed: read the failure code and map it to the next action (bank details, account closed, etc.).
6. If paid and not found: prepare the bank trace request with the reference.
7. Draft the merchant reply with status, ids, and next step. Never promise a date the bank controls.
8. If a re-issue or ledger correction is needed, stop and request approval.

## Evidence the agent must cite
- Payout id and processor status
- Failure code if present
- Ledger batch id and total
- Bank statement line or 'not found'

## Approval thresholds
- Re-issued payout always needs approval above: 0 USD (0 means every re-issue)
- Escalate to bank when past expected date by: 48 hours (Placeholder; set with the customer)

## The agent must never
- Re-issue or cancel a payout without approval
- Change merchant bank details
- Promise an arrival date
- Post a ledger correction

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
- `payout_ids`
- `processor_status`
- `bank_reference`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Share of payouts traced to a definite status on first run

## Top failure modes
- Treating 'paid' at the processor as received at the bank
- Missing a batch split across two payouts
- Reading a stale snapshot of payout status

## Public sources
- Payouts have statuses and can fail with a failure code. Source: [Stripe: Payouts](https://docs.stripe.com/payouts)
- Payout reconciliation matches the transactions in each payout to the bank deposit. Source: [Stripe: Payout reconciliation report](https://docs.stripe.com/reports/payout-reconciliation)
- "Where is my payout" escalations are a common first queue. Source: [runtm.com homepage](https://www.runtm.com)
