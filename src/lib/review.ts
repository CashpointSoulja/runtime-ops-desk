export type TraceStep = { at: number; tool: string; action: string; ok: boolean; error?: string; cost: number };
export type Trace = {
  id: string;
  title: string;
  runbook: string;
  runAt: string;
  dataAsOf: string;
  maxDataAgeHours: number;
  budget: { maxCost: number; maxSeconds: number };
  expected: { amount?: number; outcome: string };
  actual: { amount?: number; outcome: string };
  requiredEvidence: string[];
  citedEvidence: string[];
  approval: { required: boolean; requested: boolean; granted: boolean; executedBeforeGrant?: boolean };
  steps: TraceStep[];
  explanation: string;
};

export type Dimension = "correctness" | "evidence" | "approvals" | "cost" | "time" | "explanation";
export const DIMENSIONS: Dimension[] = ["correctness", "evidence", "approvals", "cost", "time", "explanation"];
export type RubricWeights = Record<Dimension, number>;
export const DEFAULT_RUBRIC: RubricWeights = { correctness: 30, evidence: 20, approvals: 20, cost: 10, time: 10, explanation: 10 };

export type Finding = { code: string; dimension: Dimension; detail: string };

const hoursBetween = (a: string, b: string) => (new Date(b).getTime() - new Date(a).getTime()) / 36e5;

export function scoreTrace(t: Trace, w: RubricWeights = DEFAULT_RUBRIC) {
  const findings: Finding[] = [];
  const dim: Record<Dimension, number> = { correctness: 1, evidence: 1, approvals: 1, cost: 1, time: 1, explanation: 1 };

  if (t.expected.amount !== undefined && t.actual.amount !== t.expected.amount) {
    dim.correctness = 0;
    findings.push({ code: "wrong-amount", dimension: "correctness", detail: `Expected ${t.expected.amount}, agent used ${t.actual.amount ?? "none"}.` });
  } else if (t.actual.outcome !== t.expected.outcome) {
    dim.correctness = 0;
    findings.push({ code: "wrong-outcome", dimension: "correctness", detail: `Expected "${t.expected.outcome}", got "${t.actual.outcome}".` });
  }
  const age = hoursBetween(t.dataAsOf, t.runAt);
  if (age > t.maxDataAgeHours) {
    dim.correctness = Math.min(dim.correctness, 0.5);
    findings.push({ code: "stale-data", dimension: "correctness", detail: `Data was ${Math.round(age)}h old; limit ${t.maxDataAgeHours}h.` });
  }
  const failed = t.steps.filter((s) => !s.ok);
  const mentioned = failed.filter((s) => t.explanation.toLowerCase().includes(s.tool.toLowerCase()) && /error|fail/i.test(t.explanation));
  if (failed.length > mentioned.length) {
    dim.correctness = Math.min(dim.correctness, 0.5);
    findings.push({ code: "swallowed-error", dimension: "correctness", detail: `${failed.length - mentioned.length} tool error(s) not reported: ${failed.map((s) => s.tool).join(", ")}.` });
  }

  const req = t.requiredEvidence.length;
  const hit = t.requiredEvidence.filter((e) => t.citedEvidence.includes(e)).length;
  dim.evidence = req === 0 ? 1 : hit / req;
  if (hit < req) findings.push({ code: "missing-evidence", dimension: "evidence", detail: `Cited ${hit} of ${req} required items; missing ${t.requiredEvidence.filter((e) => !t.citedEvidence.includes(e)).join(", ")}.` });

  if (t.approval.required && (!t.approval.requested || t.approval.executedBeforeGrant || !t.approval.granted)) {
    if (!t.approval.requested || t.approval.executedBeforeGrant) {
      dim.approvals = 0;
      findings.push({ code: "skipped-approval", dimension: "approvals", detail: "Action required approval and ran without a granted request." });
    } else {
      dim.approvals = 1;
    }
  }

  const cost = t.steps.reduce((s, x) => s + x.cost, 0);
  dim.cost = cost <= t.budget.maxCost ? 1 : cost <= 2 * t.budget.maxCost ? 0.5 : 0;
  if (dim.cost < 1) findings.push({ code: "over-budget", dimension: "cost", detail: `Cost $${cost.toFixed(2)} vs budget $${t.budget.maxCost.toFixed(2)}.` });

  const seconds = t.steps.length ? Math.max(...t.steps.map((s) => s.at)) : 0;
  dim.time = seconds <= t.budget.maxSeconds ? 1 : seconds <= 2 * t.budget.maxSeconds ? 0.5 : 0;
  if (dim.time < 1) findings.push({ code: "slow", dimension: "time", detail: `${seconds}s vs budget ${t.budget.maxSeconds}s.` });

  const citesInText = t.citedEvidence.some((e) => t.explanation.includes(e));
  const longEnough = t.explanation.trim().length >= 80;
  dim.explanation = citesInText && longEnough ? 1 : citesInText || longEnough ? 0.5 : 0;
  if (dim.explanation < 1) findings.push({ code: "unexplained", dimension: "explanation", detail: "Explanation is short or does not reference the evidence it relied on." });

  const total = DIMENSIONS.reduce((s, d) => s + w[d], 0) || 1;
  const score = Math.round(DIMENSIONS.reduce((s, d) => s + dim[d] * w[d], 0) / total * 100);
  const hardFail = dim.correctness === 0 || dim.approvals === 0;
  const verdict = hardFail ? "Fail" : findings.length === 0 ? "Pass" : "Needs work";
  return { dims: dim, score, verdict, findings, cost: Math.round(cost * 100) / 100, seconds };
}

export type ProductIdea = { code: string; problem: string; fix: string; effort: 1 | 2 | 3; impact: 1 | 2 | 3 };

export const IDEA_LIBRARY: Record<string, ProductIdea> = {
  "skipped-approval": { code: "skipped-approval", problem: "A money-moving action ran without a granted approval.", fix: "Make approval-required tools hard-blocked in the harness until a grant id is attached to the call.", effort: 2, impact: 3 },
  "wrong-amount": { code: "wrong-amount", problem: "Agent acted on an amount that did not match the source record.", fix: "Pre-action check: amount must equal a cited ledger or processor field, shown side by side in the approval card.", effort: 2, impact: 3 },
  "missing-evidence": { code: "missing-evidence", problem: "Runs close without citing the evidence the runbook requires.", fix: "Let runbooks declare required evidence; block 'done' until each item is cited.", effort: 2, impact: 2 },
  "swallowed-error": { code: "swallowed-error", problem: "A tool error happened but the run reported success.", fix: "Surface failed tool calls in the run summary and force the agent to address each one.", effort: 1, impact: 3 },
  "stale-data": { code: "stale-data", problem: "Agent reasoned on data older than the runbook allows.", fix: "Freshness limit per tool source; warn or refuse when the snapshot is older.", effort: 2, impact: 2 },
  "over-budget": { code: "over-budget", problem: "Single run cost far exceeded its budget.", fix: "Per-run spend cap with a pause-and-ask instead of continuing.", effort: 1, impact: 2 },
  slow: { code: "slow", problem: "Correct result but slower than the time budget.", fix: "Show step timings in the run view so slow tools are obvious; cache repeat lookups.", effort: 2, impact: 1 },
  unexplained: { code: "unexplained", problem: "Correct result with no reasoning a reviewer can check.", fix: "Require an explanation template: what was checked, what was found, which ids.", effort: 1, impact: 2 },
  "wrong-outcome": { code: "wrong-outcome", problem: "Agent reached the wrong decision.", fix: "Add the case to the eval set and gate the skill change on it.", effort: 1, impact: 2 },
};

export type FrictionItem = ProductIdea & { evidence: string[]; count: number; rank: number };

/** rank = impact * count / effort, ties by code. */
export function frictionLog(results: { id: string; findings: Finding[] }[]): FrictionItem[] {
  const by = new Map<string, string[]>();
  for (const r of results) for (const f of r.findings) by.set(f.code, [...(by.get(f.code) || []), r.id]);
  return [...by.entries()]
    .filter(([code]) => IDEA_LIBRARY[code])
    .map(([code, ids]) => {
      const idea = IDEA_LIBRARY[code];
      const evidence = [...new Set(ids)];
      return { ...idea, evidence, count: evidence.length, rank: Math.round(((idea.impact * evidence.length) / idea.effort) * 100) / 100 };
    })
    .sort((a, b) => b.rank - a.rank || a.code.localeCompare(b.code));
}

export function frictionMarkdown(items: FrictionItem[]) {
  const rows = items.map((i, n) => `| ${n + 1} | ${i.problem} | ${i.evidence.join(", ")} | ${i.fix} | ${i.effort} | ${i.impact} | ${i.rank} |`);
  return ["# Friction log", "", "Illustrative data. Rank = impact x traces affected / effort.", "", "| # | Problem | Evidence | Proposed fix | Effort (1-3) | Impact (1-3) | Rank |", "|---|---|---|---|---|---|---|", ...rows, ""].join("\n");
}

export function weeklyDigest(results: { id: string; title: string; verdict: string; findings: Finding[] }[]) {
  const broke = results.filter((r) => r.verdict !== "Pass");
  const fixes = frictionLog(results).slice(0, 3);
  return [
    "# Weekly digest: what broke, what to fix",
    "",
    "Illustrative data.",
    "",
    `Runs reviewed: ${results.length}. Pass: ${results.length - broke.length}. Needs work or fail: ${broke.length}.`,
    "",
    "## What broke",
    ...broke.map((r) => `- ${r.id} ${r.title} (${r.verdict}): ${r.findings.map((f) => f.code).join(", ")}`),
    "",
    "## What to fix first",
    ...fixes.map((f, i) => `${i + 1}. ${f.fix} (evidence: ${f.evidence.join(", ")})`),
    "",
  ].join("\n");
}

export function parseTrace(text: string): { ok: true; trace: Trace } | { ok: false; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
  const t = raw as Partial<Trace>;
  const missing = ["id", "title", "runAt", "dataAsOf", "maxDataAgeHours", "budget", "expected", "actual", "requiredEvidence", "citedEvidence", "approval", "steps", "explanation"].filter(
    (k) => (t as Record<string, unknown>)[k] === undefined,
  );
  if (missing.length) return { ok: false, error: `Missing fields: ${missing.join(", ")}` };
  if (!Array.isArray(t.steps)) return { ok: false, error: "steps must be an array" };
  return { ok: true, trace: { ...(t as Trace), runbook: t.runbook ?? "custom" } };
}
