# Merchant onboarding / KYB review prep

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
New merchant application submitted.

Queue: Underwriting / onboarding queue

## Systems read
- Application form
- Business registry lookups
- Website
- Case tool

## Steps
1. Read the application: legal name, address, owners, MCC, volume.
2. Collect registry evidence for the entity.
3. List beneficial owners as stated and what still needs verification.
4. Check website: products match MCC, refund policy, contact info.
5. Assemble the underwriting memo draft with gaps listed.

## Evidence the agent must cite
- Registry record
- Owners list with verification status
- Website snapshot notes

## Approval thresholds
- Senior review above monthly volume: 250000 USD (Placeholder)

## The agent must never
- Approve or decline a merchant
- Mark an owner verified without the document

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
- `application_id`
- `owners`
- `gaps`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Memo accepted without rework

## Top failure modes
- Missing an owner
- Website changed since application

## Public sources
- Covered institutions must identify and verify beneficial owners of legal entity customers. Source: [FinCEN: CDD Final Rule](https://www.fincen.gov/resources/statutes-and-regulations/cdd-final-rule)
- Underwriting memo preparation is a named use case. Source: [Runtime docs: Introduction](https://docs.runtm.com)

## Needs expert check
- Ownership percentage thresholds and which entities are covered depend on the institution type.
