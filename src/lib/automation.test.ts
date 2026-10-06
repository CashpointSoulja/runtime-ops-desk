import { describe, it, expect } from "vitest";
import { scoreWorkflow, payback, rankWorkflows, hoursPerWeek } from "./automation";
import { WORKFLOWS } from "./data/workflows";

const wf = (id: string) => WORKFLOWS.find((w) => w.id === id)!;

describe("automation score (hand-calculated)", () => {
  it("sup-01: 40 runs x 6 min = 4 h; 50 + 15 - 0 - 0 = 65, Automate Now", () => {
    const r = scoreWorkflow(wf("sup-01"));
    expect(r.hours).toBe(4);
    expect(r.score).toBe(65);
    expect(r.tier).toBe("Automate Now");
  });
  it("onb-02: 4.5 h capped at 1; 50 + 30 - 12.5 - 15 = 52.5", () => {
    expect(scoreWorkflow(wf("onb-02")).score).toBe(52.5);
  });
  it("rec-01: 50 + 15 - 25 = 40 would be Automate Now but high sensitivity caps at Next", () => {
    const r = scoreWorkflow(wf("rec-01"));
    expect(r.score).toBe(40);
    expect(r.tier).toBe("Next");
  });
  it("sec-01: 1 h -> volume 0.25; 12.5 + 30 - 25 - 15 = 2.5, Not Yet", () => {
    const r = scoreWorkflow(wf("sec-01"));
    expect(r.score).toBe(2.5);
    expect(r.tier).toBe("Not Yet");
  });
  it("has at least 24 workflows across six areas and ranks deterministically", () => {
    expect(WORKFLOWS.length).toBeGreaterThanOrEqual(24);
    expect(new Set(WORKFLOWS.map((w) => w.area)).size).toBe(6);
    expect(rankWorkflows(WORKFLOWS).map((r) => r.w.id)).toEqual(rankWorkflows([...WORKFLOWS].reverse()).map((r) => r.w.id));
  });
});

describe("payback (hand-calculated)", () => {
  it("sup-01 alone with defaults", () => {
    const p = payback([wf("sup-01")]);
    expect(hoursPerWeek(wf("sup-01"))).toBe(4);
    expect(p.hoursSaved).toBe(2.4);
    expect(p.weeklyValue).toBe(180);
    expect(p.runSpend).toBe(16);
    expect(p.seatSpend).toBe(159.92);
    expect(p.weeklyNet).toBe(4.08);
    expect(p.buildCost).toBe(600);
    expect(p.paybackWeeks).toBe(147.2);
  });
  it("returns null payback when net is not positive", () => {
    expect(payback([wf("sec-01")]).paybackWeeks).toBeNull();
  });
});
