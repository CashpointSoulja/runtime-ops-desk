"use client";
import { Fragment, useState } from "react";
import { WORKFLOWS } from "@/lib/data/workflows";
import { rankWorkflows, payback, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS, DEFAULT_PAYBACK, type Weights, type Thresholds, type PaybackInputs, type Tier } from "@/lib/automation";
import { Num, useLocal, Illustrative, usd, Kind } from "@/components/ui";

const tierClass = (t: Tier) => (t === "Automate Now" ? "tier-now" : t === "Next" ? "tier-next" : "tier-not");

const WHY: Record<string, string> = {
  "sup-01": "Most weekly hours of any workflow, low sensitivity, drafts only. It is also the same job Runtime's own onboarding offers first, so it doubles as dogfooding.",
  "sup-02": "High error cost: a customer's failed run is the moment trust is won or lost. Read-only, so it can ship fast.",
  "fin-03": "Four hours a month of high-stakes work. The agent only ties out and lists; every journal entry stays with a person.",
  "onb-01": "Every new design partner gets the same day 1 pack within an hour of signing. Feeds the 14-day plan in Customer Desk.",
  "onb-02": "Security questionnaires gate payments deals. Drafts from an approved answer bank only; the CTO signs off.",
};

export default function Automation() {
  const [w, setW] = useLocal<Weights>("auto.weights", DEFAULT_WEIGHTS);
  const [t, setT] = useLocal<Thresholds>("auto.thresholds", DEFAULT_THRESHOLDS);
  const [p, setP] = useLocal<PaybackInputs>("auto.payback", DEFAULT_PAYBACK);
  const [open, setOpen] = useState<string | null>(null);
  const [view, setView] = useState<"rank" | "order">("rank");
  const ranked = rankWorkflows(WORKFLOWS, w, t);
  const now = ranked.filter((r) => r.tier === "Automate Now").map((r) => r.w);
  const pb = payback(now, p);
  const order = ranked.slice(0, 5);
  const counts = { now: now.length, next: ranked.filter((r) => r.tier === "Next").length, not: ranked.filter((r) => r.tier === "Not Yet").length };

  return (
    <>
      <div className="formula" aria-label="Scoring formula">
        score = 100 × ( {w.volume} × min(1, hours/week ÷ {t.volumeCapHours}) + {w.errorCost} × errorCost − {w.sensitivity} × sensitivity − {w.approval} × approvalNeeded )
        <br />low = 0, med = 0.5, high = 1 · approval yes = 1 · Automate Now ≥ {t.now}, Next ≥ {t.next}, else Not Yet · high sensitivity is capped at Next
      </div>
      <details className="card" style={{ marginTop: 12 }}>
        <summary><strong>Edit weights and tiers</strong></summary>
        <div className="grid g4" style={{ marginTop: 12 }}>
          <Num label="Weight: volume" value={w.volume} step={0.05} onChange={(v) => setW({ ...w, volume: v })} kind="Estimated" />
          <Num label="Weight: error cost" value={w.errorCost} step={0.05} onChange={(v) => setW({ ...w, errorCost: v })} kind="Estimated" />
          <Num label="Penalty: sensitivity" value={w.sensitivity} step={0.05} onChange={(v) => setW({ ...w, sensitivity: v })} kind="Estimated" />
          <Num label="Penalty: approval" value={w.approval} step={0.05} onChange={(v) => setW({ ...w, approval: v })} kind="Estimated" />
          <Num label="Volume cap (h/week)" value={t.volumeCapHours} step={0.5} onChange={(v) => setT({ ...t, volumeCapHours: v || 1 })} kind="Estimated" />
          <Num label="Automate Now at score ≥" value={t.now} onChange={(v) => setT({ ...t, now: v })} kind="Estimated" />
          <Num label="Next at score ≥" value={t.next} onChange={(v) => setT({ ...t, next: v })} kind="Estimated" />
        </div>
        <button className="btn" style={{ marginTop: 10 }} onClick={() => { setW(DEFAULT_WEIGHTS); setT(DEFAULT_THRESHOLDS); }}>Restore defaults</button>
      </details>

      <div className="grid g4" style={{ marginTop: 16 }}>
        <div className="card kpi"><div className="l">Automate Now / Next / Not Yet</div><div className="v">{counts.now} / {counts.next} / {counts.not}</div><div className="small muted">of {ranked.length} workflows</div></div>
        <div className="card kpi"><div className="l">Hours saved per week</div><div className="v">{pb.hoursSaved}</div><div className="small muted">{pb.grossHours} h × {p.automationShare} share</div></div>
        <div className="card kpi"><div className="l">Net value per week</div><div className="v">{usd(pb.weeklyNet)}</div><div className="small muted">{usd(pb.weeklyValue)} − {usd(pb.runSpend)} runs − {usd(pb.seatSpend)} seats</div></div>
        <div className="card kpi"><div className="l">Payback</div><div className="v">{pb.paybackWeeks === null ? "Never" : `${pb.paybackWeeks} wk`}</div><div className="small muted">{usd(pb.buildCost)} build ÷ net per week</div></div>
      </div>

      <details className="card" style={{ marginTop: 12 }}>
        <summary><strong>Payback assumptions</strong> <span className="small muted">for a 7-person company, Automate Now tier only</span></summary>
        <div className="formula" style={{ marginTop: 10 }}>
          hours saved = Σ(runs/week × min/run ÷ 60) × share · value = hours saved × hourly cost · seats/week = seats × price × 12 ÷ 52 · net = value − runs/week × run cost − seats/week · payback = agents × build hours × hourly cost ÷ net
        </div>
        <div className="grid g3" style={{ marginTop: 12 }}>
          <Num label="Team size / seats" value={p.seats} onChange={(v) => setP({ ...p, seats: v })} kind="Sourced" source="yc-company" />
          <Num label="Seat price per month (USD)" value={p.seatPricePerMonth} onChange={(v) => setP({ ...p, seatPricePerMonth: v })} kind="Sourced" source="rt-pricing" />
          <Num label="Share of time the agent removes" value={p.automationShare} step={0.05} max={1} onChange={(v) => setP({ ...p, automationShare: v })} kind="Estimated" />
          <Num label="Loaded hourly cost (USD)" value={p.hourlyCost} onChange={(v) => setP({ ...p, hourlyCost: v })} kind="Estimated" />
          <Num label="Build hours per agent" value={p.buildHoursPerAgent} onChange={(v) => setP({ ...p, buildHoursPerAgent: v })} kind="Estimated" />
          <Num label="Cost per run (USD)" value={p.runCost} step={0.05} onChange={(v) => setP({ ...p, runCost: v })} kind="Placeholder" />
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>Team size 7 from the YC company page. $99 is the public Teams starting price per seat; Runtime&apos;s own internal cost is not public.</p>
      </details>

      <div className="row" style={{ margin: "20px 0 10px" }} role="group" aria-label="View">
        <button className="btn" aria-pressed={view === "rank"} onClick={() => setView("rank")}>Ranked backlog</button>
        <button className="btn" aria-pressed={view === "order"} onClick={() => setView("order")}>Build order: weeks 1 to 4</button>
        <Illustrative />
      </div>

      {view === "order" ? (
        <div className="grid">
          {order.map((r, i) => (
            <div className="card" key={r.w.id}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h3 style={{ margin: 0 }}><span className="mono muted">Agent {i + 1} · week {[1, 1, 2, 3, 4][i]}</span> · {r.w.name}</h3>
                <span className={`rag ${tierClass(r.tier)}`}>{r.tier} · {r.score}</span>
              </div>
              <p className="small" style={{ margin: "8px 0 0" }}>{WHY[r.w.id] || `Score ${r.score}: ${r.hours} h/week, error cost ${r.w.errorCost}, sensitivity ${r.w.sensitivity}.`} <span className="muted">{r.w.area} · {r.hours} h/week.</span></p>
            </div>
          ))}
          <p className="small muted">Order = top 5 by score. Week assignment: two in week 1 (triage first, it unblocks the others), then one per week.</p>
        </div>
      ) : (
        <div className="tablewrap"><table>
          <thead><tr><th>#</th><th>Workflow</th><th className="num">Runs/wk</th><th className="num">Min/run</th><th className="num">h/wk</th><th>Err</th><th>Sens</th><th>Appr</th><th className="num">Score</th><th>Tier</th></tr></thead>
          <tbody>
            {ranked.map((r, i) => (
              <Fragment key={r.w.id}>
                <tr>
                  <td className="mono">{i + 1}</td>
                  <td><button className="btn" style={{ padding: "2px 6px", border: 0, background: "none", textAlign: "left" }} aria-expanded={open === r.w.id} onClick={() => setOpen(open === r.w.id ? null : r.w.id)}>{open === r.w.id ? "▾" : "▸"} {r.w.name}</button><div className="small muted" style={{ paddingLeft: 6 }}>{r.w.area} · {r.w.owner} · {r.w.tools.join(", ")}</div></td>
                  <td className="num">{r.w.perWeek}</td><td className="num">{r.w.minutesPerRun}</td><td className="num">{r.hours}</td>
                  <td>{r.w.errorCost}</td><td>{r.w.sensitivity}</td><td>{r.w.approval ? "yes" : "no"}</td>
                  <td className="num" title={`volume ${r.parts.volume.toFixed(1)} + error ${r.parts.errorCost.toFixed(1)} ${r.parts.sensitivity.toFixed(1)} ${r.parts.approval.toFixed(1)}`}>{r.score}</td>
                  <td><span className={`rag ${tierClass(r.tier)}`}>{r.tier}</span></td>
                </tr>
                {open === r.w.id && (
                  <tr><td></td><td colSpan={9}>
                    <div className="formula small" style={{ marginBottom: 10 }}>{r.parts.volume.toFixed(1)} volume + {r.parts.errorCost.toFixed(1)} error − {Math.abs(r.parts.sensitivity).toFixed(1)} sensitivity − {Math.abs(r.parts.approval).toFixed(1)} approval = {r.score}</div>
                    <div className="grid g2">
                      <div><h3>Agent spec: {r.w.id}-agent</h3><p className="small"><strong>Trigger.</strong> {r.w.spec.trigger}</p><p className="small"><strong>Inputs.</strong> {r.w.spec.inputs.join("; ")}</p><p className="small"><strong>Tools.</strong> {r.w.tools.join(", ")} (read-only unless gated)</p><strong className="small">Steps</strong><ol className="steps small">{r.w.spec.steps.map((s) => <li key={s}>{s}</li>)}</ol></div>
                      <div><p className="small"><strong>Approval gates.</strong> {r.w.spec.gates.join("; ")}</p><p className="small"><strong>Failure handling.</strong> {r.w.spec.failure.join("; ")}</p><p className="small"><strong>Success measured by.</strong> {r.w.spec.success.join("; ")}</p><p className="small muted">Frequency and minutes are <Kind kind="Estimated" /> for a 7-person startup.</p></div>
                    </div>
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table></div>
      )}
    </>
  );
}
