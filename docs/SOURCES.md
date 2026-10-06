# Sources

Every public source the app and docs rely on. This one file replaces the lowercase `sources.md` named in the spec (the two names collide on case-insensitive file systems). Rows marked **Unverified** could not be re-read signed out; anything resting on them is labelled in the app.

Generated from `src/lib/sources.ts` by `npm run docs:export`, so the app's Sources page and this file never drift.

| Id | Source | What it supports | Status |
| --- | --- | --- | --- |
| rt-home | [runtm.com homepage](https://www.runtm.com) | Positioning (AI agent harness for payment teams), read-only by default, approvals before money movement, every run stored with steps, cost and result, forward-deployed AI engineers, starting workflows (TM alerts, ACH returns, chargeback evidence, payout escalations), customer logos (Rain, Nixtla, Mono, LineLeap). | Read |
| rt-pricing | [Runtime pricing](https://www.runtm.com/pricing) | Free plan with 500 credits and no card; Teams from $99 per seat per month; Enterprise audit logs and SSO. | Read |
| rt-eng | [Runtime for engineering leaders](https://www.runtm.com/for/engineering-leaders) | Mission Control view of sessions, prompts and spend; spend limits per team; guardrails and approvals. | Read |
| rt-enterprise | [Runtime enterprise](https://www.runtm.com/enterprise) | Start with one SOP and one queue with agreed success measures; forward-deployed AI engineer builds the first agent with the customer team. | Read |
| rt-blog | [Runtime blog](https://www.runtm.com/blog) | Company posts, including joining YC P26. | Read |
| rt-docs | [Runtime docs: Introduction](https://docs.runtm.com) | Six-step agent build order: job, success measure, tools, how it works, prove it, then guardrails and approvals. Runs recorded with prompt, tool calls, cost, result and grade. | Read |
| rt-docs-support | [Runtime docs: Payment support agent guide](https://docs.runtm.com/guides/payments/support-agent) | Duplicate-charge category: list both charge ids, say which captured and which is a pending authorization, cite ledger rows, never promise a refund; drafts only behind an approval; last four digits only. | Read |
| rt-docs-approval | [Runtime docs: Request an approval from inside a run](https://docs.runtm.com/guides/recipes/request-approval-from-a-run) | Agent stops at a runbook step and waits for a human approve or reject. | Read |
| rt-docs-fraud | [Runtime docs: Fraud and risk review agent guide](https://docs.runtm.com/guides/payments/fraud-risk-agent) | Scheduled agent assembles review packets and leaves every block to a human. | Read |
| yc-company | [YC company page: Runtime](https://www.ycombinator.com/companies/runtime) | YC Spring 2026 (P26), San Francisco, team size 7, founders Gus Trigos and Carlos Volante, two open roles. | Read |
| yc-job-ops | [YC job post: Founding AI Ops](https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops) | Role scope: own customer experience, build internal agents (onboarding, support triage, sales ops, finance, recruiting, security and compliance), run operating cadence, be the toughest internal user. | Read |
| yc-job-fde | [YC job post: Forward Deployed AI Engineer](https://www.ycombinator.com/companies/runtime/jobs/exm704T-forward-deployed-ai-engineer) | Customer-facing engineering role that builds agents with customer teams. | Read |
| yc-launch | [YC Launch: Runtime - Let your whole team ship safely with coding agents](https://www.ycombinator.com/launches/Pw3-runtime-let-your-whole-team-ship-safely-with-coding-agents) | "Our team will personally set up your environments" so teams are shipping "within the first days"; guardrails, sandboxes, observability. | Read |
| gus-about | [gustrigos.com/about](https://gustrigos.com/about) | Gus Trigos is founder of Runtime (YC P26); works with fintech unicorns and payments companies. | Read |
| gus-li | [Gus Trigos LinkedIn posts (25 Sep and 2 Oct 2026)](https://www.linkedin.com/in/gustavoatrigos/) | Named in the brief as the source for "forward-deployed CTO treatment" and the support to customer success to fraud and risk expansion path. LinkedIn blocks signed-out reading, so these were not re-verified. | **Unverified** |
| nacha-rules | [Nacha Operating Rules](https://www.nacha.org/rules/operating-rules) | The ACH Network rules that govern return reason codes and timeframes. | Read |
| mt-rcodes | [Modern Treasury: ACH return codes](https://docs.moderntreasury.com/payments/docs/ach-return-codes) | R01 to R29 descriptions and return timeframes (2 banking days for most; 60 calendar days for R05, R07, R10, R11). | Read |
| cfpb-rege | [CFPB Regulation E, 12 CFR 1005.11](https://www.consumerfinance.gov/rules-policy/regulations/1005/11/) | Consumer error notice within 60 days of the statement; 10 business days to investigate, up to 45 days with provisional credit. | Read |
| cfpb-regz | [CFPB Regulation Z, 12 CFR 1026.13](https://www.consumerfinance.gov/rules-policy/regulations/1026/13/) | Billing error notice no later than 60 days after the first statement reflecting the error. | Read |
| stripe-disputes | [Stripe: Responding to disputes](https://docs.stripe.com/disputes/responding) | Response window usually 7 to 21 days depending on network; missing the deadline loses the dispute. | Read |
| stripe-how-disputes | [Stripe: How disputes work](https://docs.stripe.com/disputes/how-disputes-work) | Disputed amount plus a dispute fee is debited; evidence submission; inquiries. | Read |
| stripe-refunds | [Stripe: Refunds](https://docs.stripe.com/refunds) | Refund appears to the cardholder roughly 5 to 10 business days later depending on the bank. | Read |
| stripe-payout-recon | [Stripe: Payout reconciliation report](https://docs.stripe.com/reports/payout-reconciliation) | Matching the transactions in each payout to the bank deposit. | Read |
| stripe-payouts | [Stripe: Payouts](https://docs.stripe.com/payouts) | Payout schedules, statuses and failures. | Read |
| visa-dispute | [Visa: Dispute Management Guidelines for Merchants](https://usa.visa.com/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf) | Dispute categories, merchant response and evidence expectations. | Read |
| fincen-cdd | [FinCEN: CDD Final Rule](https://www.fincen.gov/resources/statutes-and-regulations/cdd-final-rule) | Covered institutions identify and verify beneficial owners of legal entity customers. | Read |
| fincen-sar-rule | [31 CFR 1020.320 (bank SAR rule)](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-C/section-1020.320) | SAR filing obligation and timing for banks. The page blocked automated reading, so timing is marked Needs expert check. | **Unverified** |
| fincen-sar-narrative | [FinCEN: SAR narrative guidance](https://www.fincen.gov/sites/default/files/shared/sarnarrcompletguidfinal_112003.pdf) | Who, what, when, where, why and how structure for SAR narratives. | Read |
| ffiec-manual | [FFIEC BSA/AML Examination Manual](https://bsaaml.ffiec.gov/manual) | Examiner expectations for suspicious activity monitoring and OFAC programs. Blocked automated reading; cited as the reference, specifics marked Needs expert check. | **Unverified** |
| ofac-faq-screen | [OFAC FAQs: sanctions list screening](https://ofac.treasury.gov/faqs/topic/1591) | Many potential matches are false positives; assess name, date of birth, ID, nationality and address; OFAC does not confirm matches; report blocked or rejected transactions within 10 business days. | Read |
| ofac-sdn | [OFAC: SDN list](https://ofac.treasury.gov/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists) | The list screened against. | Read |
