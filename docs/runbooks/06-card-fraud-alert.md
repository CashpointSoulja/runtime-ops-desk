# Card-fraud alert triage

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
A fraud rule or model raises an alert on a card or account.

Queue: Fraud alert queue

## Systems read
- Case tool
- Processor (authorization history)
- Customer record
- Device / login logs

## Steps
1. Read the alert and rule that fired.
2. Pull authorization history around the alert window.
3. List the signals that support and that contradict fraud.
4. Assemble the review packet with a recommended action and confidence.
5. Leave the block or release decision to the analyst.

## Evidence the agent must cite
- Alert id and rule
- Authorization ids reviewed
- Signals for and against

## Approval thresholds
- Packet ready within: 1 hours (Placeholder)

## The agent must never
- Block or unblock a card
- Contact the cardholder
- Show full PAN

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
- `alert_id`
- `auth_ids`
- `recommendation`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- False-positive rate: alerts closed as not fraud / alerts reviewed

## Top failure modes
- Packet with only supporting signals
- Slow authorization history pulls

## Public sources
- Runtime's fraud and risk guide: the agent assembles review packets and leaves every block to a human. Source: [Runtime docs: Fraud and risk review agent guide](https://docs.runtm.com/guides/payments/fraud-risk-agent)
