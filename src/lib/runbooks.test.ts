import { describe, it, expect } from "vitest";
import { RUNBOOKS, buildAgent, runbookBySlug } from "./runbooks";
import { sourceById } from "./sources";
import { metricsTree, PLACEHOLDER_INPUTS } from "./cadence";

describe("runbooks", () => {
  it("has at least 10 runbooks, every fact has a known source", () => {
    expect(RUNBOOKS.length).toBeGreaterThanOrEqual(10);
    for (const r of RUNBOOKS) {
      expect(r.steps.length).toBeGreaterThan(2);
      expect(r.never.length).toBeGreaterThan(0);
      for (const f of r.facts) expect(sourceById(f.source), `${r.slug}:${f.source}`).toBeDefined();
    }
  });
  it("builder applies threshold overrides to the approval policy", () => {
    const b = buildAgent(runbookBySlug("duplicate-charge")!, { refundApproval: 100 });
    expect(b.policy.requireApproval.some((x) => x.when === "amount_usd > 100")).toBe(true);
    expect(b.policy.default).toBe("read-only");
  });
});

describe("cadence metrics tree", () => {
  it("rates from placeholder inputs", () => {
    const t = metricsTree(PLACEHOLDER_INPUTS);
    expect(t[0].rate).toBe(80);
    expect(t[3].rate).toBe(83.3);
    expect(t[4].rate).toBe(75);
    expect(t[2].rate).toBe(50);
  });
});
