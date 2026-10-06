# Research

What is publicly known about Runtime and the seat, and the payment-ops domain facts the app leans on. Every claim links its source. Claims I could not re-read are marked **Unverified**. Full ledger: [SOURCES.md](SOURCES.md).

## Runtime

| Claim | Source |
| --- | --- |
| Runtime describes itself as "the AI agent harness for payment teams". | [runtm.com](https://www.runtm.com) |
| Agents are read-only by default, ask before acting, and every run is stored with steps, cost and result. | [runtm.com](https://www.runtm.com) |
| Named starting workflows include TM alerts, ACH returns, chargeback evidence and payout escalations. | [runtm.com](https://www.runtm.com) |
| Logos shown on the site include Rain, Nixtla, Mono and LineLeap. Nothing here says how they use it. | [runtm.com](https://www.runtm.com) |
| Enterprise rollout starts with one SOP and one queue with agreed success measures; a forward-deployed AI engineer builds the first agent with the customer. | [Enterprise](https://www.runtm.com/enterprise) |
| Free plan has 500 credits and needs no card; Teams starts at $99 per seat per month. | [Pricing](https://www.runtm.com/pricing) |
| "Our team will personally set up your environments" so teams ship "within the first days". | [YC Launch](https://www.ycombinator.com/launches/Pw3-runtime-let-your-whole-team-ship-safely-with-coding-agents) |
| YC Spring 2026 (P26), San Francisco, team size 7, founders Gus Trigos and Carlos Volante. | [YC company page](https://www.ycombinator.com/companies/runtime) |
| Docs cover payment support, approval recipes and fraud/risk guides. | [Docs](https://docs.runtm.com) |
| Gus Trigos's posts describe "forward-deployed CTO treatment" and a support to CS to fraud/risk expansion path. **Unverified**: LinkedIn blocks signed-out reading. | [LinkedIn](https://www.linkedin.com/in/gustavoatrigos/) |

## The seat

| Claim | Source |
| --- | --- |
| The Founding AI Ops hire owns customer experience, builds internal agents on Runtime, runs the operating cadence (metrics, health, renewals, board reporting) and is the toughest internal user. | [Job post](https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops) |
| Looking for ops, CS or support experience at a fintech, payments company or bank, and a bias to automate the second time. | [Job post](https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops) |
| A separate Forward Deployed AI Engineer role exists. | [Job post](https://www.ycombinator.com/companies/runtime/jobs) |

## Payment-ops domain

| Claim | Source |
| --- | --- |
| Most ACH returns are due within 2 banking days; R05, R07, R10, R11 (unauthorized) allow 60 calendar days. | [Modern Treasury](https://docs.moderntreasury.com/payments/docs/ach-return-codes), [Nacha](https://www.nacha.org/rules/operating-rules) |
| Reg E: 60 days to give notice; 10 business days to investigate, up to 45 with provisional credit. | [CFPB 1005.11](https://www.consumerfinance.gov/rules-policy/regulations/1005/11/) |
| Reg Z: billing error notice within 60 days of the first statement. | [CFPB 1026.13](https://www.consumerfinance.gov/rules-policy/regulations/1026/13/) |
| Dispute evidence and response windows depend on the reason code. | [Stripe disputes](https://docs.stripe.com/disputes), [Visa](https://usa.visa.com/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf) |
| Many sanctions-screen hits are false positives; review identifiers; report blocked/rejected within 10 business days. | [OFAC FAQ](https://ofac.treasury.gov/faqs/topic/1591) |
| SAR narratives follow who/what/when/where/why/how. | [FinCEN](https://www.fincen.gov/sites/default/files/shared/sarnarrcompletguidfinal_112003.pdf) |
| SAR filing timing for banks. **Unverified** for this build (page blocked automated reading); marked Needs expert check. | [31 CFR 1020.320](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-C/section-1020.320) |
| Examiner expectations for monitoring and OFAC programs. **Unverified** specifics; cited as the reference. | [FFIEC manual](https://bsaaml.ffiec.gov/manual) |
| Customer due diligence and beneficial ownership requirements. | [FinCEN CDD](https://www.fincen.gov/resources/statutes-and-regulations/cdd-final-rule) |

## What is not known

No Runtime customer data, internal metrics, revenue, tooling or roadmap. Every account, run and metric in the app is synthetic and labelled Illustrative data.
