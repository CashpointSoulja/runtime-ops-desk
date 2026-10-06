# Chargeback evidence pack

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
A dispute or inquiry is opened on a charge.

Queue: Disputes queue

## Systems read
- Processor (dispute object, reason, due date)
- Order system
- Shipping / fulfilment
- Ticketing (customer contact)

## Steps
1. Read the dispute: reason category, amount, evidence due date.
2. Decide accept or fight using the policy table; if accept, draft the accept note and stop.
3. Collect evidence that answers the reason: delivery proof, receipt, policy shown at checkout, customer messages.
4. Write a short rebuttal tied to the reason code.
5. Request approval to submit before the due date.

## Evidence the agent must cite
- Dispute id, reason, due date
- Each evidence file and why it answers the reason

## Approval thresholds
- Fight disputes above: 25 USD (Placeholder; below this accept)
- Submit at least this many hours before due: 48 hours (Placeholder)

## The agent must never
- Submit without approval
- Miss the due date
- Include full card numbers or unrelated customer data

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
- `dispute_id`
- `reason`
- `due_by`
- `evidence_files`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Win rate on fought disputes
- Disputes missed past due (target 0)

## Top failure modes
- Evidence that does not match the reason
- Stale order snapshot
- Submitting late

## Public sources
- Response windows are usually 7 to 21 days depending on network; missing the deadline loses the dispute. Source: [Stripe: Responding to disputes](https://docs.stripe.com/disputes/responding)
- The disputed amount and a dispute fee are debited when a dispute opens. Source: [Stripe: How disputes work](https://docs.stripe.com/disputes/how-disputes-work)
- Network dispute categories and merchant evidence expectations. Source: [Visa: Dispute Management Guidelines for Merchants](https://usa.visa.com/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf)

## Needs expert check
- Reason-code specific evidence lists vary by network and change; confirm against the current network guide.
