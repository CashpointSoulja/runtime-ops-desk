export type SeatRow = { section: string; line: string; elided?: boolean; module: string; href: string; artifact: string };

export const JOB_URL = "https://www.ycombinator.com/companies/runtime/jobs/pNjYg79-founding-ai-ops";

export const SEAT_ROWS: SeatRow[] = [
  { section: "What you'll do", line: "Own customer experience end to end, from onboarding and support to making sure every customer team gets real value from Runtime week after week", module: "Customer Desk", href: "/customers/", artifact: "14-day onboarding plan with owner, exit criteria and risk per day; health model with weekly action list per account; QBR brief export." },
  { section: "What you'll do", line: "Build and run internal agents on Runtime for our own operations, like customer onboarding, support triage, sales ops, finance, recruiting, and security and compliance work", module: "Automation Map", href: "/automation/", artifact: "24 internal workflows across those six areas, scored by an editable formula, with a one-page agent spec each and a week 1 to 4 build order." },
  { section: "What you'll do", line: "Use coding agents [...] daily to automate workflows, write scripts, and pull data together", elided: true, module: "This site", href: "/field-notes/", artifact: "The site itself: static TypeScript app, pure scoring modules with unit tests, CI build. Field Notes records first-hand use of Runtime's onboarding." },
  { section: "What you'll do", line: "Run the operating cadence of the company, including metrics, customer health, renewals, and board and investor reporting", module: "Operating Cadence", href: "/cadence/", artifact: "Metrics tree, health roll-up from Customer Desk, renewals list, board update builder with markdown export." },
  { section: "What you'll do", line: "Be our toughest internal user, feeding bugs and product ideas straight to engineering", module: "Run Review", href: "/review/", artifact: "Rubric scoring of 9 run traces, paste-a-trace scoring, ranked Friction Log with markdown export, weekly what-broke digest. Field Notes adds 6 suggestions from real use." },
  { section: "What we're looking for", line: "Experience in operations, customer success, or support at a fintech, payments company, bank, or other financial institution", module: "Runbook Library", href: "/runbooks/", artifact: "10 payment-ops runbooks with cited public sources, approval thresholds and audit fields, plus a runbook-to-agent builder." },
  { section: "What we're looking for", line: "Hands-on use of coding agents and AI tools. You don't need to be an engineer, but you should be comfortable building things yourself", module: "Runbook Library", href: "/runbooks/", artifact: "Builder that turns a runbook into an agent spec, an approval-policy JSON and a mock audit entry." },
  { section: "What we're looking for", line: "Comfort working with customers at every level, from an ops analyst to a COO or CFO", module: "Customer Desk", href: "/customers/", artifact: "Weekly actions written for the champion (ops analyst level) and the QBR brief written for an executive sponsor." },
  { section: "What we're looking for", line: "A strong bias to automate the second time you do something by hand", module: "Automation Map", href: "/automation/", artifact: "Volume term in the score: weekly hours drive the ranking; payback estimate shows when a build pays for itself." },
  { section: "Rollout", line: "(Role scope across support, CS, implementation, payouts, fraud/risk, compliance)", module: "Operate", href: "/operate/", artifact: "Six-rung rollout ladder with first agent, human sign-off, proof metric, failure to watch and runbook link per rung." },
];

export const NOT_SHOWN: { line: string; why: string }[] = [
  { line: "Comfort with ambiguity and moving fast on a small team, in person in SF", why: "A working style and location requirement. An artifact cannot prove it." },
  { line: "Real customer data, real renewals, real board numbers", why: "Everything here is public information or synthetic. No access to Runtime's customers, metrics or systems." },
  { line: "Building agents on Runtime itself beyond onboarding", why: "Field Notes covers one onboarding session on the free plan. No connected tools, so no production agent was built." },
];
