import { describe, it, expect } from "vitest";
import { scoreTrace, frictionLog, parseTrace } from "./review";
import { TRACES } from "./data/traces";

const tr = (id: string) => TRACES.find((t) => t.id === id)!;
const codes = (id: string) => scoreTrace(tr(id)).findings.map((f) => f.code);

describe("run review rubric", () => {
  it("good run passes at 100", () => {
    const r = scoreTrace(tr("run-101"));
    expect(r.score).toBe(100);
    expect(r.verdict).toBe("Pass");
  });
  it("wrong amount: correctness 0 -> (0*30 + 70) = 70, Fail", () => {
    const r = scoreTrace(tr("run-102"));
    expect(r.score).toBe(70);
    expect(r.verdict).toBe("Fail");
    expect(codes("run-102")).toContain("wrong-amount");
  });
  it("each failure trace raises its finding", () => {
    expect(codes("run-103")).toContain("missing-evidence");
    expect(codes("run-104")).toContain("skipped-approval");
    expect(codes("run-105")).toContain("over-budget");
    expect(codes("run-106")).toContain("stale-data");
    expect(codes("run-107")).toContain("swallowed-error");
    expect(codes("run-108")).toContain("slow");
    expect(codes("run-109")).toContain("unexplained");
  });
  it("runaway cost: 14 x 0.11 = 1.54 > 2 x 0.60 -> cost 0, score 90", () => {
    const r = scoreTrace(tr("run-105"));
    expect(r.cost).toBe(1.54);
    expect(r.dims.cost).toBe(0);
    expect(r.score).toBe(90);
    expect(r.verdict).toBe("Needs work");
  });
  it("missing evidence: 1 of 3 -> evidence 0.333; explanation 0.5", () => {
    const r = scoreTrace(tr("run-103"));
    expect(r.dims.evidence).toBeCloseTo(1 / 3);
    expect(r.dims.explanation).toBe(0.5);
    expect(r.score).toBe(82);
  });
  it("friction log ranks by impact x count / effort", () => {
    const fl = frictionLog(TRACES.map((t) => ({ id: t.id, findings: scoreTrace(t).findings })));
    // unexplained: impact 2 x 2 traces / effort 1 = 4; swallowed-error: 3 x 1 / 1 = 3
    expect(fl[0].code).toBe("unexplained");
    expect(fl[0].rank).toBe(4);
    expect(fl[1].code).toBe("swallowed-error");
    expect(fl.every((x, i) => i === 0 || fl[i - 1].rank >= x.rank)).toBe(true);
  });
  it("parseTrace rejects bad JSON and missing fields", () => {
    expect(parseTrace("{").ok).toBe(false);
    const r = parseTrace('{"id":"x"}');
    expect(r.ok).toBe(false);
  });
});
