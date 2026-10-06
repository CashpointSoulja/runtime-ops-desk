# Role map

Each line of the public [Founding AI Ops job post](https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops) mapped to the artifact in this app that shows it. Artifacts, not biography. Live page: [https://cashpointsoulja.github.io/runtime-ops-desk/seat/](https://cashpointsoulja.github.io/runtime-ops-desk/seat/).

One line is quoted with an elision `[...]` where the post lists specific products by name; the original is at the link above.

| Section | Job post line | Module | Artifact |
| --- | --- | --- | --- |
| What you'll do | "Own customer experience end to end, from onboarding and support to making sure every customer team gets real value from Runtime week after week" | [Customer Desk](https://cashpointsoulja.github.io/runtime-ops-desk/customers/) | 14-day onboarding plan with owner, exit criteria and risk per day; health model with weekly action list per account; QBR brief export. |
| What you'll do | "Build and run internal agents on Runtime for our own operations, like customer onboarding, support triage, sales ops, finance, recruiting, and security and compliance work" | [Automation Map](https://cashpointsoulja.github.io/runtime-ops-desk/automation/) | 24 internal workflows across those six areas, scored by an editable formula, with a one-page agent spec each and a week 1 to 4 build order. |
| What you'll do | "Use coding agents [...] daily to automate workflows, write scripts, and pull data together" | [This site](https://cashpointsoulja.github.io/runtime-ops-desk/field-notes/) | The site itself: static TypeScript app, pure scoring modules with unit tests, CI build. Field Notes records first-hand use of Runtime's onboarding. |
| What you'll do | "Run the operating cadence of the company, including metrics, customer health, renewals, and board and investor reporting" | [Operating Cadence](https://cashpointsoulja.github.io/runtime-ops-desk/cadence/) | Metrics tree, health roll-up from Customer Desk, renewals list, board update builder with markdown export. |
| What you'll do | "Be our toughest internal user, feeding bugs and product ideas straight to engineering" | [Run Review](https://cashpointsoulja.github.io/runtime-ops-desk/review/) | Rubric scoring of 9 run traces, paste-a-trace scoring, ranked Friction Log with markdown export, weekly what-broke digest. Field Notes adds 6 suggestions from real use. |
| What we're looking for | "Experience in operations, customer success, or support at a fintech, payments company, bank, or other financial institution" | [Runbook Library](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/) | 10 payment-ops runbooks with cited public sources, approval thresholds and audit fields, plus a runbook-to-agent builder. |
| What we're looking for | "Hands-on use of coding agents and AI tools. You don't need to be an engineer, but you should be comfortable building things yourself" | [Runbook Library](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/) | Builder that turns a runbook into an agent spec, an approval-policy JSON and a mock audit entry. |
| What we're looking for | "Comfort working with customers at every level, from an ops analyst to a COO or CFO" | [Customer Desk](https://cashpointsoulja.github.io/runtime-ops-desk/customers/) | Weekly actions written for the champion (ops analyst level) and the QBR brief written for an executive sponsor. |
| What we're looking for | "A strong bias to automate the second time you do something by hand" | [Automation Map](https://cashpointsoulja.github.io/runtime-ops-desk/automation/) | Volume term in the score: weekly hours drive the ranking; payback estimate shows when a build pays for itself. |
| Rollout | "(Role scope across support, CS, implementation, payouts, fraud/risk, compliance)" | [Operate](https://cashpointsoulja.github.io/runtime-ops-desk/operate/) | Six-rung rollout ladder with first agent, human sign-off, proof metric, failure to watch and runbook link per rung. |

## Not shown here

| Line | Why not |
| --- | --- |
| Comfort with ambiguity and moving fast on a small team, in person in SF | A working style and location requirement. An artifact cannot prove it. |
| Real customer data, real renewals, real board numbers | Everything here is public information or synthetic. No access to Runtime's customers, metrics or systems. |
| Building agents on Runtime itself beyond onboarding | Field Notes covers one onboarding session on the free plan. No connected tools, so no production agent was built. |

## Rollout ladder (from /operate)

### Rung 1: Support triage

- First agent: Inbound request triage: category, urgency with reasons, owner, first reply draft asking for missing ids. (Sourced: [Runtime docs: Payment support agent guide](https://docs.runtm.com/guides/payments/support-agent))
- Human sign-off: Support lead sends every customer reply; refunds wait behind an approval. (Sourced: [Runtime docs: Payment support agent guide](https://docs.runtm.com/guides/payments/support-agent))
- Proof metric: Time to first response and correct-routing rate on a weekly 20-ticket sample. (Assumption)
- Failure to watch: Promising a refund or a date before approval. (Sourced: [Runtime docs: Payment support agent guide](https://docs.runtm.com/guides/payments/support-agent))
- Runbook: [Duplicate charge and refund](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=duplicate-charge)

### Rung 2: Customer success

- First agent: Weekly account health note: runs, approvals, overrides, incidents, next step for the champion. (Assumption)
- Human sign-off: CS owner reviews each note before it reaches the customer. (Assumption)
- Proof metric: Share of accounts with a health note every week; renewals with a brief 90 days out. (Assumption)
- Failure to watch: Health score trusted when inputs are missing (coverage under 60%). (Assumption)
- Runbook: None yet
- Note: Support, then customer success, then fraud and risk is the expansion path in the brief, attributed to Gus Trigos's LinkedIn. Not re-verified: LinkedIn blocks signed-out reading. (Assumption)

### Rung 3: Implementation

- First agent: Start with one SOP and one queue with an agreed success measure, built with the customer team. (Sourced: [Runtime enterprise](https://www.runtm.com/enterprise))
- Human sign-off: Customer ops lead and their security team agree boundaries and approval points before go-live. (Sourced: [Runtime enterprise](https://www.runtm.com/enterprise))
- Proof metric: First agent live on one queue within the first days of kickoff. (Sourced: [YC Launch: Runtime - Let your whole team ship safely with coding agents](https://www.ycombinator.com/launches/Pw3-runtime-let-your-whole-team-ship-safely-with-coding-agents))
- Failure to watch: Starting with a queue that has no agreed success measure. (Sourced: [Runtime enterprise](https://www.runtm.com/enterprise))
- Runbook: [Merchant onboarding / KYB review prep](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=kyb-prep)

### Rung 4: Payouts

- First agent: Stuck payout trace: processor status, ledger batch, bank deposit, drafted reply. (Sourced: [runtm.com homepage](https://www.runtm.com))
- Human sign-off: A person approves releasing a held payout or booking a ledger entry. (Sourced: [runtm.com homepage](https://www.runtm.com))
- Proof metric: Share of payouts traced to a definite status on the first run; median time to resolution. (Assumption)
- Failure to watch: Treating processor 'paid' as received at the bank. (Assumption)
- Runbook: [Stuck payout trace](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=stuck-payout)

### Rung 5: Fraud and risk

- First agent: Alert review packet with signals for and against; no block applied. (Sourced: [Runtime docs: Fraud and risk review agent guide](https://docs.runtm.com/guides/payments/fraud-risk-agent))
- Human sign-off: Analyst makes every block, release or reserve decision. (Sourced: [Runtime docs: Fraud and risk review agent guide](https://docs.runtm.com/guides/payments/fraud-risk-agent))
- Proof metric: Packet ready within 1 hour; false-positive rate tracked per rule. (Assumption)
- Failure to watch: One-sided packets that only list supporting signals. (Assumption)
- Runbook: [Card-fraud alert triage](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=card-fraud-alert)

### Rung 6: Compliance

- First agent: Sanctions hit and TM alert prep: field-by-field comparison and a who/what/when/where/why/how note. (Sourced: [OFAC FAQs: sanctions list screening](https://ofac.treasury.gov/faqs/topic/1591))
- Human sign-off: Compliance officer clears hits and owns every SAR decision. (Assumption)
- Proof metric: Reviewer accepts the prepared note without rework; aged alerts trend down. (Assumption)
- Failure to watch: Clearing a hit on name alone; any customer tip-off. (Sourced: [OFAC FAQs: sanctions list screening](https://ofac.treasury.gov/faqs/topic/1591))
- Runbook: [Sanctions-hit review prep](https://cashpointsoulja.github.io/runtime-ops-desk/runbooks/?rb=sanctions-hit)
