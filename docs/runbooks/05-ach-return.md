# ACH return (R-code) handling

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
An ACH entry is returned with an R-code.

Queue: ACH returns queue

## Systems read
- Processor / ODFI return file
- Ledger / DB
- Customer record
- Email

## Steps
1. Read the return: R-code, entry id, amount, account.
2. Map the R-code: R01/R09 funds, R02/R03/R04 account issues, R05/R07/R10/R11 unauthorized or authorization issues.
3. Post the return entry to the ledger (or request approval if policy says so).
4. For funds codes: draft a retry or notice per policy.
5. For unauthorized codes: stop debits on that authorization and flag for review.
6. Draft the customer notice.

## Evidence the agent must cite
- Return id and R-code
- Original entry id
- Ledger entry id posted

## Approval thresholds
- Max retries for R01/R09: 2 count (Needs expert check against Nacha rules)
- Unauthorized return rate review above: 0.5 % (Needs expert check)

## The agent must never
- Retry an unauthorized-code return
- Retry beyond the rule limit
- Ignore a failed ledger write

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
- `r_code`
- `entry_id`
- `ledger_entry_id`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Return rate by R-code

## Top failure modes
- Swallowing a ledger write failure
- Treating R10 like R01
- Missing the 60-day window cases

## Public sources
- ACH return reason codes and timeframes are governed by the Nacha Operating Rules. Source: [Nacha Operating Rules](https://www.nacha.org/rules/operating-rules)
- Most returns within 2 banking days; R05, R07, R10, R11 within 60 calendar days. Source: [Modern Treasury: ACH return codes](https://docs.moderntreasury.com/payments/docs/ach-return-codes)
- ACH returns are a named starting workflow. Source: [runtm.com homepage](https://www.runtm.com)

## Needs expert check
- Retry limits and unauthorized return thresholds must be confirmed against the current Nacha rule book.
