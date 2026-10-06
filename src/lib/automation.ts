export type Level = "low" | "med" | "high";
export type Area =
  | "Customer onboarding"
  | "Support triage"
  | "Sales ops"
  | "Finance"
  | "Recruiting"
  | "Security and compliance";

export type Workflow = {
  id: string;
  area: Area;
  name: string;
  perWeek: number;
  minutesPerRun: number;
  errorCost: Level;
  sensitivity: Level;
  approval: boolean;
  owner: string;
  tools: string[];
  spec: AgentSpec;
};

export type AgentSpec = {
  trigger: string;
  inputs: string[];
  steps: string[];
  gates: string[];
  failure: string[];
  success: string[];
};

export type Weights = { volume: number; errorCost: number; sensitivity: number; approval: number };
export const DEFAULT_WEIGHTS: Weights = { volume: 0.5, errorCost: 0.3, sensitivity: 0.25, approval: 0.15 };

export type Thresholds = { now: number; next: number; volumeCapHours: number };
export const DEFAULT_THRESHOLDS: Thresholds = { now: 40, next: 20, volumeCapHours: 4 };

export const LEVEL_VALUE: Record<Level, number> = { low: 0, med: 0.5, high: 1 };

export type Tier = "Automate Now" | "Next" | "Not Yet";

export const hoursPerWeek = (w: Pick<Workflow, "perWeek" | "minutesPerRun">) =>
  (w.perWeek * w.minutesPerRun) / 60;

/**
 * score = 100 * (wV * min(1, hours / cap) + wE * error - wS * sensitivity - wA * approval)
 * Tier: high sensitivity never ranks Automate Now.
 */
export function scoreWorkflow(w: Workflow, weights: Weights = DEFAULT_WEIGHTS, t: Thresholds = DEFAULT_THRESHOLDS) {
  const hours = hoursPerWeek(w);
  const volume = Math.min(1, hours / t.volumeCapHours);
  const parts = {
    volume: weights.volume * volume * 100,
    errorCost: weights.errorCost * LEVEL_VALUE[w.errorCost] * 100,
    sensitivity: -weights.sensitivity * LEVEL_VALUE[w.sensitivity] * 100,
    approval: -weights.approval * (w.approval ? 1 : 0) * 100,
  };
  const score = round1(parts.volume + parts.errorCost + parts.sensitivity + parts.approval);
  let tier: Tier = score >= t.now ? "Automate Now" : score >= t.next ? "Next" : "Not Yet";
  if (tier === "Automate Now" && w.sensitivity === "high") tier = "Next";
  return { hours: round1(hours), volume: round1(volume * 100), parts, score, tier };
}

export function rankWorkflows(list: Workflow[], weights = DEFAULT_WEIGHTS, t = DEFAULT_THRESHOLDS) {
  return list
    .map((w) => ({ w, ...scoreWorkflow(w, weights, t) }))
    .sort((a, b) => b.score - a.score || a.w.id.localeCompare(b.w.id));
}

export type PaybackInputs = {
  automationShare: number;
  hourlyCost: number;
  buildHoursPerAgent: number;
  runCost: number;
  seats: number;
  seatPricePerMonth: number;
};

export const DEFAULT_PAYBACK: PaybackInputs = {
  automationShare: 0.6,
  hourlyCost: 75,
  buildHoursPerAgent: 8,
  runCost: 0.4,
  seats: 7,
  seatPricePerMonth: 99,
};

/** Payback for the given workflows (normally the Automate Now tier). */
export function payback(items: Workflow[], p: PaybackInputs = DEFAULT_PAYBACK) {
  const grossHours = items.reduce((s, w) => s + hoursPerWeek(w), 0);
  const hoursSaved = grossHours * p.automationShare;
  const runsPerWeek = items.reduce((s, w) => s + w.perWeek, 0);
  const runSpend = runsPerWeek * p.runCost;
  const seatSpend = (p.seats * p.seatPricePerMonth * 12) / 52;
  const weeklyValue = hoursSaved * p.hourlyCost;
  const weeklyNet = weeklyValue - runSpend - seatSpend;
  const buildCost = items.length * p.buildHoursPerAgent * p.hourlyCost;
  const paybackWeeks = weeklyNet > 0 ? buildCost / weeklyNet : null;
  return {
    agents: items.length,
    grossHours: round1(grossHours),
    hoursSaved: round1(hoursSaved),
    runsPerWeek,
    runSpend: round2(runSpend),
    seatSpend: round2(seatSpend),
    weeklyValue: round2(weeklyValue),
    weeklyNet: round2(weeklyNet),
    buildCost: round2(buildCost),
    paybackWeeks: paybackWeeks === null ? null : round1(paybackWeeks),
  };
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
