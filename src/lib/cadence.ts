export type CadenceInputs = {
  signedAccounts: number;
  activatedAccounts: number;
  weeklyActiveAgents: number;
  runsPerWeek: number;
  approvalsRequested: number;
  approvalsGranted: number;
  accountsUpForRenewal: number;
  accountsRetained: number;
  cashRunwayMonths: number;
  burnPerMonth: number;
};

export const PLACEHOLDER_INPUTS: CadenceInputs = {
  signedAccounts: 10,
  activatedAccounts: 8,
  weeklyActiveAgents: 24,
  runsPerWeek: 1200,
  approvalsRequested: 180,
  approvalsGranted: 150,
  accountsUpForRenewal: 4,
  accountsRetained: 3,
  cashRunwayMonths: 20,
  burnPerMonth: 120000,
};

const ratio = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);

export function metricsTree(i: CadenceInputs) {
  return [
    { node: "Activation", value: `${i.activatedAccounts} / ${i.signedAccounts}`, formula: "activated / signed", rate: ratio(i.activatedAccounts, i.signedAccounts) },
    { node: "Weekly active agents", value: String(i.weeklyActiveAgents), formula: "agents with >= 1 run this week", rate: i.activatedAccounts ? Math.round((i.weeklyActiveAgents / i.activatedAccounts) * 10) / 10 : null, rateLabel: "per activated account" },
    { node: "Runs", value: String(i.runsPerWeek), formula: "runs this week", rate: i.weeklyActiveAgents ? Math.round(i.runsPerWeek / i.weeklyActiveAgents) : null, rateLabel: "per active agent" },
    { node: "Approvals", value: `${i.approvalsGranted} / ${i.approvalsRequested}`, formula: "granted / requested", rate: ratio(i.approvalsGranted, i.approvalsRequested) },
    { node: "Retained accounts", value: `${i.accountsRetained} / ${i.accountsUpForRenewal}`, formula: "retained / up for renewal", rate: ratio(i.accountsRetained, i.accountsUpForRenewal) },
  ];
}
