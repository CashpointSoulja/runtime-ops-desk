export type Account = {
  id: string;
  name: string;
  archetype: "Card issuer" | "Acquirer / ISO" | "Lender" | "Payments platform";
  renewalDays: number;
  teamsLive: { support: boolean; cs: boolean; fraudRisk: boolean };
  runsPerWeek: number | null;
  approvalRate: number | null;
  costPerCase: number | null;
  overrideRate: number | null;
  incidents30d: number | null;
  execEngagement: number | null;
  champion: string;
  notes: string;
};

export type HealthWeights = {
  breadth: number;
  runs: number;
  approval: number;
  cost: number;
  overrides: number;
  incidents: number;
  exec: number;
};

export const DEFAULT_HEALTH_WEIGHTS: HealthWeights = {
  breadth: 20,
  runs: 20,
  approval: 15,
  cost: 10,
  overrides: 15,
  incidents: 10,
  exec: 10,
};

export type HealthTargets = { runsTarget: number; costTarget: number; overrideCeiling: number };
export const DEFAULT_TARGETS: HealthTargets = { runsTarget: 200, costTarget: 1.5, overrideCeiling: 0.3 };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export type Component = { key: keyof HealthWeights; label: string; value: number | null; weight: number; points: number };

/** Each metric maps to 0..100. Unknown metrics score 0 points (never renormalised) and lower coverage. */
export function componentScores(a: Account, t: HealthTargets = DEFAULT_TARGETS): Record<keyof HealthWeights, number | null> {
  const teams = [a.teamsLive.support, a.teamsLive.cs, a.teamsLive.fraudRisk].filter(Boolean).length;
  return {
    breadth: clamp((teams / 3) * 100),
    runs: a.runsPerWeek === null ? null : clamp((a.runsPerWeek / t.runsTarget) * 100),
    approval: a.approvalRate === null ? null : clamp(a.approvalRate * 100),
    cost:
      a.costPerCase === null
        ? null
        : a.costPerCase <= t.costTarget
          ? 100
          : clamp(100 - ((a.costPerCase - t.costTarget) / (t.costTarget * 3)) * 100),
    overrides: a.overrideRate === null ? null : clamp(100 - (a.overrideRate / t.overrideCeiling) * 100),
    incidents: a.incidents30d === null ? null : clamp(100 - 35 * a.incidents30d),
    exec: a.execEngagement === null ? null : clamp((a.execEngagement / 3) * 100),
  };
}

export const LABELS: Record<keyof HealthWeights, string> = {
  breadth: "Adoption breadth",
  runs: "Runs per week",
  approval: "Approval rate",
  cost: "Cost per resolved case",
  overrides: "Overrides",
  incidents: "Incidents (30d)",
  exec: "Executive engagement",
};

export type Rag = "Green" | "Amber" | "Red";

export function healthScore(a: Account, w: HealthWeights = DEFAULT_HEALTH_WEIGHTS, t: HealthTargets = DEFAULT_TARGETS) {
  const comps = componentScores(a, t);
  const total = Object.values(w).reduce((s, v) => s + v, 0) || 1;
  const components: Component[] = (Object.keys(w) as (keyof HealthWeights)[]).map((k) => {
    const value = comps[k];
    return { key: k, label: LABELS[k], value: value === null ? null : Math.round(value), weight: w[k], points: value === null ? 0 : (value * w[k]) / total };
  });
  const score = Math.round(components.reduce((s, c) => s + c.points, 0));
  const coverage = Math.round((components.filter((c) => c.value !== null).reduce((s, c) => s + c.weight, 0) / total) * 100);
  const rag: Rag = score >= 70 ? "Green" : score >= 45 ? "Amber" : "Red";
  return { score, coverage, rag, components, renewalRisk: renewalRisk(rag, a.renewalDays, coverage) };
}

export function renewalRisk(rag: Rag, renewalDays: number, coverage: number): "High" | "Medium" | "Low" | "Unknown" {
  if (coverage < 60) return "Unknown";
  if (rag === "Red") return renewalDays <= 120 ? "High" : "Medium";
  if (rag === "Amber") return renewalDays <= 90 ? "High" : "Medium";
  return renewalDays <= 30 ? "Medium" : "Low";
}

export type Action = { rule: string; action: string };

/** Deterministic weekly actions. Order is fixed; first match per rule. */
export function weeklyActions(a: Account, t: HealthTargets = DEFAULT_TARGETS): Action[] {
  const out: Action[] = [];
  const h = healthScore(a, DEFAULT_HEALTH_WEIGHTS, t);
  if (a.incidents30d !== null && a.incidents30d > 0)
    out.push({ rule: "incidents30d > 0", action: `Send a written incident review for the ${a.incidents30d} incident(s) and confirm the fix with ${a.champion}.` });
  if (a.overrideRate !== null && a.overrideRate >= 0.15)
    out.push({ rule: "overrideRate >= 15%", action: "Pull the last 20 overridden runs, tag the cause (data, policy, prompt) and ship one skill fix." });
  if (a.approvalRate !== null && a.approvalRate < 0.7)
    out.push({ rule: "approvalRate < 70%", action: "Review rejected approvals with the approver; tighten the proposal or raise the threshold." });
  if (a.costPerCase !== null && a.costPerCase > t.costTarget)
    out.push({ rule: "costPerCase > target", action: "Find the three most expensive run types and test a cheaper route or a scripted step." });
  if (a.runsPerWeek !== null && a.runsPerWeek < t.runsTarget * 0.5)
    out.push({ rule: "runsPerWeek < 50% of target", action: "Map a second queue with the team lead; usage is below half of target." });
  if (!a.teamsLive.cs && a.teamsLive.support)
    out.push({ rule: "support live, CS not live", action: "Propose the next team on the expansion path (customer success) with one SOP and a success measure." });
  else if (a.teamsLive.cs && !a.teamsLive.fraudRisk)
    out.push({ rule: "CS live, fraud and risk not live", action: "Book a scoping call with fraud and risk; bring one alert queue and an approval policy draft." });
  if (a.execEngagement !== null && a.execEngagement <= 1)
    out.push({ rule: "execEngagement <= 1", action: "Get an executive sponsor review on the calendar before renewal." });
  if (a.execEngagement === null || a.runsPerWeek === null || a.costPerCase === null)
    out.push({ rule: "missing metrics", action: "Fill the missing health inputs; the score cannot be trusted below 60% coverage." });
  if (a.renewalDays <= 90)
    out.push({ rule: "renewalDays <= 90", action: `Draft the renewal brief now: ${a.renewalDays} days to renewal, health ${h.score} (${h.rag}).` });
  if (out.length === 0) out.push({ rule: "no rule fired", action: "Healthy. Ask for a reference or a case study." });
  return out;
}
