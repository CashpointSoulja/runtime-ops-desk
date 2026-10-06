# Interview Q&A: 12 hard payment-ops questions

Each answer is how I would run it, linked to the module that shows it. Domain facts carry a public source; judgement calls are marked as mine. Thresholds are placeholders to agree per customer.

### 1. A merchant says 14 payouts are stuck and the books close Friday. What do you do in the first hour?
Split it: confirm each payout id and status in the processor, compare to the bank settlement file, and group by failure reason (in transit, failed, returned, held). Reply with what is known and the next update time; ask for the payout ids and the system of record if missing. Nothing gets re-issued without finance sign-off. Processor payouts move through pending, in transit, paid or failed states, and failed payouts usually come back with a reason code ([Stripe payouts](https://docs.stripe.com/payouts)).
Module: [Runbook: Stuck payout trace](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=stuck-payout).

### 2. A cardholder sees two charges. When do you refund, and when don't you?
First tell a pending authorization from a captured charge: an uncaptured authorization drops off by itself, so refunding it is a mistake. If both are captured and the ledger shows one fulfilment, refund exactly one charge amount, behind an approval above the threshold. Refunds take several business days to appear ([Stripe refunds](https://docs.stripe.com/refunds)).
Module: [Runbook: Duplicate charge and refund](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=duplicate-charge).

### 3. A chargeback lands with 7 days left on the response window. How do you build the evidence pack?
Pull the reason code first; it decides what evidence counts. Gather order, delivery or usage proof, customer communication and refund history, then write a short rebuttal tied to the reason code. A person submits; the agent never does. Response windows and evidence types are set by the network and processor ([Stripe disputes](https://docs.stripe.com/disputes), [Visa dispute guidelines](https://usa.visa.com/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf)).
Module: [Runbook: Chargeback evidence pack](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=chargeback-pack).

### 4. An ACH debit comes back R10. What happens next, and what's different from R01?
R01 (insufficient funds) can be re-presented within Nacha limits. R10 (not authorized) is an unauthorized return with a longer window (60 calendar days for consumer accounts) and should block that debit and trigger an authorization review, not a retry ([Modern Treasury return codes](https://docs.moderntreasury.com/payments/docs/ach-return-codes), [Nacha rules](https://www.nacha.org/rules/operating-rules)). Return-rate thresholds per originator: Needs expert check.
Module: [Runbook: ACH return handling](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=ach-return).

### 5. A consumer disputes a debit-card transfer under Reg E. What clock are you on?
The consumer has 60 days from the statement to give notice. The institution has 10 business days to investigate, or up to 45 days if it gives provisional credit ([CFPB Reg E 1005.11](https://www.consumerfinance.gov/rules-policy/regulations/1005/11/)). For credit cards, Reg Z billing-error rules apply instead ([CFPB Reg Z 1026.13](https://www.consumerfinance.gov/rules-policy/regulations/1026/13/)). The agent tracks the clock and drafts; a person decides credit.
Modules: [Runbook: Duplicate charge](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=duplicate-charge), [Runbook: Card-fraud alert triage](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=card-fraud-alert).

### 6. A sanctions screen fires on a new merchant's director. Can an agent clear it?
It can prepare, not decide. Compare name, date of birth, nationality, ID and address against the SDN entry and write up which fields match. Most hits are false positives; OFAC does not confirm matches for you, and blocked or rejected transactions must be reported within 10 business days ([OFAC screening FAQs](https://ofac.treasury.gov/faqs/topic/1591), [SDN list](https://ofac.treasury.gov/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists)). Clearance is a compliance officer's call, always.
Module: [Runbook: Sanctions-hit review prep](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=sanctions-hit).

### 7. Where does an agent stop on an AML alert?
It gathers the account history, counterparties and prior alerts, and drafts a who/what/when/where/why/how summary ([FinCEN SAR narrative guidance](https://www.fincen.gov/sites/default/files/shared/sarnarrcompletguidfinal_112003.pdf)). It never decides to file or not file, and never tells the customer. SAR timing for the customer's institution type: Needs expert check (the [rule text](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-C/section-1020.320) could not be re-read for this build).
Module: [Runbook: AML alert prep](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=aml-alert-prep).

### 8. How do you prove an agent is safe enough to move from drafting to acting?
Score every run on the same rubric (correctness, evidence, approvals, cost, time, explanation). Promote only when the pass rate holds for a set period on a sample a person reviewed, with zero skipped approvals. Approvals stay on for money movement regardless. Runtime publicly describes read-only defaults, approvals before money moves, and stored runs ([runtm.com](https://www.runtm.com), [approval recipe](https://docs.runtm.com)).
Module: [Run Review](https://cashpointsoulja.github.io/runtime-ops-desk/review/) and [Operate ladder](https://cashpointsoulja.github.io/runtime-ops-desk/operate/).

### 9. A design partner's approval rate drops from 85% to 60% in two weeks. Is that good or bad?
Could be either: reviewers rejecting bad drafts (bad) or the queue mix changing (neutral). Check override reasons and the runs behind them before touching the agent. The health model treats approval rate and override rate separately for this reason, and the weekly actions fire on each.
Module: [Customer Desk](https://cashpointsoulja.github.io/runtime-ops-desk/customers/).

### 10. You have one week and seven people. Which internal workflow do you automate first?
The one with the most weekly hours, low sensitivity and a draft-only output, so it can ship without an approval chain. In this map that is inbound support triage (40 runs a week at about 6 minutes each; illustrative figures). The formula and weights are on the page and editable.
Module: [Automation Map](https://cashpointsoulja.github.io/runtime-ops-desk/automation/).

### 11. A reconciliation break of a few thousand dollars won't clear. How do you work it?
Match on amount and date window, then by reference id, then look for splits and fees netted from payouts. List every unmatched item with ids; never post a manual journal entry from the agent. Processor payout reconciliation reports exist for exactly this ([Stripe payout reconciliation](https://docs.stripe.com/reports/payout-reconciliation)).
Module: [Runbook: Reconciliation break clearing](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=recon-break).

### 12. Risk wants to hold a merchant's payouts and the merchant is escalating. What does a good release decision look like?
Written criteria agreed before the hold: the reason, what evidence would release it (for example dispute rate back under a threshold, KYB documents received), and who signs off. The agent assembles evidence against those criteria and drafts the merchant update; a risk lead releases. Thresholds: placeholders to agree per customer.
Module: [Runbook: Payout-hold release](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=payout-hold-release).
