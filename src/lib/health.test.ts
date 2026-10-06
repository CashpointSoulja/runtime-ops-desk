import { describe, it, expect } from "vitest";
import { healthScore, renewalRisk, weeklyActions } from "./health";
import { ACCOUNTS } from "./data/accounts";

const acc = (id: string) => ACCOUNTS.find((a) => a.id === id)!;

describe("health score (hand-calculated)", () => {
  it("Issuer A = (66.67*20 + 100*20 + 86*15 + 100*10 + 73.33*15 + 100*10 + 100*10) / 100 = 87.2 -> 87 Green", () => {
    const h = healthScore(acc("acc-issuer-a"));
    expect(h.score).toBe(87);
    expect(h.rag).toBe("Green");
    expect(h.coverage).toBe(100);
  });
  it("Platform F missing metrics score 0 points: 38.67 -> 39 Red, coverage 60%", () => {
    const h = healthScore(acc("acc-platform-f"));
    expect(h.score).toBe(39);
    expect(h.coverage).toBe(60);
    expect(h.rag).toBe("Red");
    expect(h.renewalRisk).toBe("Medium");
  });
  it("Issuer E: incidents 3 -> 0, cost 3.2 -> 62.2, overrides above ceiling -> 0", () => {
    const h = healthScore(acc("acc-issuer-e"));
    const c = Object.fromEntries(h.components.map((x) => [x.key, x.value]));
    expect(c.incidents).toBe(0);
    expect(c.cost).toBe(62);
    expect(c.overrides).toBe(0);
    expect(h.rag).toBe("Red");
    expect(h.renewalRisk).toBe("High");
  });
  it("renewal risk rules", () => {
    expect(renewalRisk("Amber", 90, 100)).toBe("High");
    expect(renewalRisk("Amber", 91, 100)).toBe("Medium");
    expect(renewalRisk("Green", 200, 100)).toBe("Low");
    expect(renewalRisk("Green", 200, 50)).toBe("Unknown");
  });
  it("actions are deterministic and rule-tagged", () => {
    const a = weeklyActions(acc("acc-acquirer-b"));
    expect(a.map((x) => x.rule)).toEqual(["incidents30d > 0", "overrideRate >= 15%", "approvalRate < 70%", "costPerCase > target", "runsPerWeek < 50% of target", "support live, CS not live", "execEngagement <= 1", "renewalDays <= 90"]);
    expect(weeklyActions(acc("acc-acquirer-b"))).toEqual(a);
  });
});
