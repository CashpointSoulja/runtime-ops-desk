# Transaction-monitoring and AML alert prep

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
Transaction-monitoring rule fires.

Queue: TM alert queue

## Systems read
- TM system
- Case tool
- Customer / KYC record
- Transactions warehouse

## Steps
1. Read the alert and scenario.
2. Pull the customer profile and expected activity.
3. Pull transactions in the lookback window.
4. Summarise who, what, when, where, why and how.
5. Draft the investigator note and a disposition recommendation.

## Evidence the agent must cite
- Alert id
- Transaction ids
- KYC profile fields used

## Approval thresholds
- Lookback window: 2160 hours (90 days; placeholder)

## The agent must never
- File or decide on a SAR
- Tell the customer about an investigation
- Close an alert

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
- `scenario`
- `lookback`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- False-positive rate
- Alerts aged over policy

## Top failure modes
- Narrative without the why
- Wrong lookback

## Public sources
- SAR narratives should cover who, what, when, where, why and how. Source: [FinCEN: SAR narrative guidance](https://www.fincen.gov/sites/default/files/shared/sarnarrcompletguidfinal_112003.pdf)
- SAR filing obligations for banks. (Needs expert check) Source: [31 CFR 1020.320 (bank SAR rule)](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-C/section-1020.320)
- Examiner expectations for suspicious activity monitoring. (Needs expert check) Source: [FFIEC BSA/AML Examination Manual](https://bsaaml.ffiec.gov/manual)

## Needs expert check
- SAR filing timing and thresholds.
- Exact examiner expectations for alert documentation.
