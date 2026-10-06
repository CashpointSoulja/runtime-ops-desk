export type PlanDay = { day: number; step: string; owner: string; exit: string; risk: string; basis?: string };

export const ONBOARDING_14: PlanDay[] = [
  { day: 1, step: "Kickoff: agree the first SOP, the one queue it covers and the success measure (for example time to resolution or cases per analyst).", owner: "Founding AI Ops + customer ops lead", exit: "SOP, queue and success measure written in the shared channel.", risk: "Customer picks a queue with no baseline metric.", basis: "rt-enterprise" },
  { day: 2, step: "Environment set up personally with the customer: deployment option, read-only tool access to ticketing, processor and ledger.", owner: "Forward-deployed engineer", exit: "Agent can read one real case end to end.", risk: "Security review blocks access; start on non-PCI work.", basis: "rt-enterprise" },
  { day: 3, step: "Collect 20 resolved cases from the queue as the eval set, with the human outcome for each.", owner: "Customer ops lead", exit: "20 cases with outcome labels.", risk: "Cases lack the final outcome." },
  { day: 4, step: "Build the first agent from the SOP: job, success measure, tools, how it works.", owner: "Forward-deployed engineer", exit: "Agent runs on the 20 cases read-only.", risk: "SOP has unwritten steps; capture them now.", basis: "rt-docs" },
  { day: 5, step: "Grade the 20 runs with the customer. Fix the top two failure causes.", owner: "Founding AI Ops", exit: "Pass rate recorded; two fixes shipped.", risk: "Grading criteria disputed; write them down." },
  { day: 6, step: "Add guardrails and approvals: which actions need a person, thresholds, approvers.", owner: "Customer ops lead + security", exit: "Approval policy signed off.", risk: "Approver not available in the channel.", basis: "rt-docs" },
  { day: 7, step: "Ship to live queue with approvals on. First live cases.", owner: "Forward-deployed engineer", exit: "Agent working live cases in the first week.", risk: "Volume spike; cap runs per day.", basis: "yc-launch" },
  { day: 8, step: "Daily review of every live run with the queue owner.", owner: "Founding AI Ops", exit: "Every run reviewed; overrides tagged with cause.", risk: "Overrides not explained." },
  { day: 9, step: "Ship one skill fix from tagged overrides.", owner: "Forward-deployed engineer", exit: "Override rate down on the next 20 runs.", risk: "Fix regresses an old case; rerun the eval set." },
  { day: 10, step: "Train the customer's admin to edit the agent and read runs.", owner: "Founding AI Ops", exit: "Admin makes one change unaided.", risk: "Single admin; name a backup.", basis: "rt-enterprise" },
  { day: 11, step: "Cost and time review: cost per case and time to resolution vs the day 1 baseline.", owner: "Founding AI Ops", exit: "Numbers shared in the channel.", risk: "Baseline was never measured." },
  { day: 12, step: "Pick the second queue on the same harness.", owner: "Customer ops lead", exit: "Second SOP and success measure agreed.", risk: "Next team not engaged yet.", basis: "rt-home" },
  { day: 13, step: "Write the 2-week review: what worked, what broke, what is next.", owner: "Founding AI Ops", exit: "Review doc sent to the executive sponsor.", risk: "No executive sponsor named." },
  { day: 14, step: "Executive check-in. Agree success criteria for the renewal.", owner: "Founder + Founding AI Ops", exit: "Sponsor agrees the measure that defines value.", risk: "Sponsor cannot attend; reschedule within the week." },
];
