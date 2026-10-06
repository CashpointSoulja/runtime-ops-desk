# Sanctions-hit review prep

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
Screening returns a potential match.

Queue: Sanctions screening queue

## Systems read
- Screening tool
- Customer / KYC record
- SDN list

## Steps
1. Read the hit: list entry and matched fields.
2. Compare name, date of birth, ID, nationality and address.
3. List each field as match, no match, or unknown.
4. Draft the reviewer note with a false-positive or escalate recommendation.

## Evidence the agent must cite
- Hit id and list entry
- Field-by-field comparison

## Approval thresholds
- Reviewer decision within: 24 hours (Placeholder)

## The agent must never
- Clear a hit
- Process a blocked or rejected transaction
- Tell the customer

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
- `hit_id`
- `list_entry`
- `field_comparison`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- False-positive rate

## Top failure modes
- Clearing on name alone
- Unexplained recommendation

## Public sources
- Many potential matches are false positives; compare name, DOB, ID, nationality, address; OFAC does not confirm matches; report blocked or rejected transactions within 10 business days. Source: [OFAC FAQs: sanctions list screening](https://ofac.treasury.gov/faqs/topic/1591)
- The SDN list is the list screened against. Source: [OFAC: SDN list](https://ofac.treasury.gov/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists)
- OFAC program expectations. (Needs expert check) Source: [FFIEC BSA/AML Examination Manual](https://bsaaml.ffiec.gov/manual)

## Needs expert check
- Program-specific reporting requirements.
