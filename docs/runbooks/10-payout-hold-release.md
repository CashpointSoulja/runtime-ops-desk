# Payout-hold release

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
Merchant asks for held funds, or a hold review date arrives.

Queue: Risk ops queue

## Systems read
- Case tool
- Processor (balance, holds, reserves)
- Dispute history

## Steps
1. Read the hold reason and its review criteria.
2. Check the risk case outcome.
3. Check disputes and refunds since the hold.
4. Propose release, partial release, or keep, with the reasons.
5. Request approval. Do not release before approval.

## Evidence the agent must cite
- Hold id
- Risk case id and outcome
- Dispute ratio since hold

## Approval thresholds
- Releases always need approval above: 0 USD (Every release)

## The agent must never
- Release funds without approval
- Change a reserve percentage

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
- `hold_id`
- `risk_case_id`
- `proposed_release`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Holds past review date

## Top failure modes
- Executing release before approval
- Ignoring recent disputes

## Public sources
- Releasing a held payout is named as a step that needs a person. Source: [runtm.com homepage](https://www.runtm.com)

## Needs expert check
- Reserve and hold terms are contractual and vary by acquirer.
