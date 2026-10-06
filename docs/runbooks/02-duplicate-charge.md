# Duplicate charge and refund

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
Cardholder or merchant reports being charged twice for one purchase.

Queue: Payments support inbox

## Systems read
- Ticketing
- Processor (charges, authorizations, refunds)
- Ledger / DB (order and fulfilment rows)

## Steps
1. Read the ticket; extract order id, amount, date, card last four only.
2. List both charge ids. For each say whether it is captured or a pending authorization.
3. If one is a pending authorization, explain it will drop off and do not refund.
4. If both captured, check the ledger for one or two fulfilments.
5. If one fulfilment: draft a refund for exactly one charge amount.
6. Request approval for the refund draft with both charge ids and ledger rows cited.
7. Draft the reply. Do not promise the refund before approval; state that refunds take several business days to appear.

## Evidence the agent must cite
- Both charge ids with capture status
- Ledger rows for the order
- Refund amount equals one charge amount

## Approval thresholds
- Refunds above this need human approval: 50 USD (Placeholder; set per customer)
- Close pending-authorization cases without refund: 1 count (1 = on)

## The agent must never
- Promise a refund before approval
- Refund both charges
- Show more than the last four card digits
- Refund a pending authorization

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
- `charge_ids`
- `capture_status`
- `refund_amount`

## Metrics
- Time to resolution (median, p90)
- Rework rate: cases reopened or overridden within 7 days
- Cost per case: run cost / cases closed
- Wrong-amount refunds (target 0)

## Top failure modes
- Refunding the sum of both charges
- Confusing an authorization hold with a capture
- Refunding on a different order

## Public sources
- Runtime's payment support guide: list both charge ids, say which captured and which is a pending authorization, cite ledger rows, never promise a refund, drafts behind an approval, last four only. Source: [Runtime docs: Payment support agent guide](https://docs.runtm.com/guides/payments/support-agent)
- Refunds take roughly 5 to 10 business days to appear, depending on the bank. Source: [Stripe: Refunds](https://docs.stripe.com/refunds)
- Consumer error-resolution timeframes may apply to debit (Reg E) and billing errors on credit (Reg Z). (Needs expert check) Source: [CFPB Regulation E, 12 CFR 1005.11](https://www.consumerfinance.gov/rules-policy/regulations/1005/11/)

## Needs expert check
- Which of Reg E or Reg Z applies depends on the product and who the customer is.
