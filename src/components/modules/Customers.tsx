"use client";
import { useState } from "react";
import { ACCOUNTS } from "@/lib/data/accounts";
import { healthScore, weeklyActions, DEFAULT_HEALTH_WEIGHTS, DEFAULT_TARGETS, LABELS, type HealthWeights, type HealthTargets, type Account } from "@/lib/health";
import { ONBOARDING_14 } from "@/lib/onboarding";
import { Num, useLocal, Illustrative, Kind, download, usd } from "@/components/ui";

export function qbrMarkdown(a: Account, w: HealthWeights, t: HealthTargets) {
  const h = healthScore(a, w, t);
  const acts = weeklyActions(a, t);
  return `# QBR and renewal brief: ${a.name}

Illustrative data. ${a.archetype} archetype, not a real customer.

| Field | Value |
|---|---|
| Health | ${h.score} / 100 (${h.rag}) |
| Coverage | ${h.coverage}% of weight has data |
| Renewal | in ${a.renewalDays} days, risk ${h.renewalRisk} |
| Champion | ${a.champion} |
| Teams live | ${[a.teamsLive.support && "Support", a.teamsLive.cs && "Customer success", a.teamsLive.fraudRisk && "Fraud and risk"].filter(Boolean).join(", ") || "None"} |

## Health components
| Component | Score (0-100) | Weight | Points |
|---|---|---|---|
${h.components.map((c) => `| ${c.label} | ${c.value ?? "missing"} | ${c.weight} | ${c.points.toFixed(1)} |`).join("\n")}

## Value delivered
- Runs per week: ${a.runsPerWeek ?? "missing"}
- Approval rate: ${a.approvalRate === null ? "missing" : Math.round(a.approvalRate * 100) + "%"}
- Cost per resolved case: ${a.costPerCase === null ? "missing" : usd(a.costPerCase)}
- Overrides: ${a.overrideRate === null ? "missing" : Math.round(a.overrideRate * 100) + "%"}
- Incidents in 30 days: ${a.incidents30d ?? "missing"}

## This quarter
${acts.map((x) => `- ${x.action}`).join("\n")}

## Ask
Agree the next team on the expansion path and the measure that defines renewal value.
`;
}

export default function Customers() {
  const [w, setW] = useLocal<HealthWeights>("cust.weights", DEFAULT_HEALTH_WEIGHTS);
  const [t, setT] = useLocal<HealthTargets>("cust.targets", DEFAULT_TARGETS);
  const [sel, setSel] = useState(ACCOUNTS[1].id);
  const [tab, setTab] = useState<"health" | "plan">("health");
  const rows = ACCOUNTS.map((a) => ({ a, h: healthScore(a, w, t) }));
  const cur = rows.find((r) => r.a.id === sel)!;
  const total = Object.values(w).reduce((s, v) => s + v, 0);
  const md = qbrMarkdown(cur.a, w, t);

  return (
    <>
      <div className="row" role="group" aria-label="View" style={{ marginBottom: 14 }}>
        <button className="btn" aria-pressed={tab === "health"} onClick={() => setTab("health")}>Health and renewals</button>
        <button className="btn" aria-pressed={tab === "plan"} onClick={() => setTab("plan")}>14-day onboarding plan</button>
      </div>

      {tab === "plan" ? (
        <>
          <p className="small">Public basis: <Kind kind="Sourced" source="rt-enterprise" /> start with one SOP, one queue and agreed success measures, built with a forward-deployed AI engineer; <Kind kind="Sourced" source="yc-launch" /> &ldquo;our team will personally set up your environments&rdquo; so teams ship &ldquo;within the first days&rdquo;. The brief also quotes &ldquo;forward-deployed CTO treatment&rdquo; from Gus Trigos&apos;s LinkedIn <Kind kind="Unverified" source="gus-li" />. Steps without a link are my plan.</p>
          <div className="tablewrap"><table>
            <thead><tr><th>Day</th><th>Step</th><th>Owner</th><th>Exit criteria</th><th>Risk</th></tr></thead>
            <tbody>{ONBOARDING_14.map((d) => <tr key={d.day}><td className="mono">{d.day}</td><td>{d.step} {d.basis && <Kind kind="Sourced" source={d.basis} />}</td><td className="small">{d.owner}</td><td className="small">{d.exit}</td><td className="small">{d.risk}</td></tr>)}</tbody>
          </table></div>
        </>
      ) : (
        <>
          <div className="formula">
            health = Σ(component × weight) ÷ Σweights ({total}) · breadth = teams live ÷ 3 (support → customer success → fraud and risk) · runs = runs/wk ÷ {t.runsTarget} · approval = rate · cost = 100 if ≤ ${t.costTarget}, else 100 − (cost − {t.costTarget}) ÷ ({t.costTarget} × 3) × 100 · overrides = 100 − rate ÷ {t.overrideCeiling} × 100 · incidents = 100 − 35 × count · exec = engagement ÷ 3 · each clamped 0..100 · missing = 0 points · Green ≥ 70, Amber ≥ 45
          </div>
          <details className="card" style={{ marginTop: 12 }}>
            <summary><strong>Edit weights and targets</strong></summary>
            <div className="grid g4" style={{ marginTop: 12 }}>
              {(Object.keys(w) as (keyof HealthWeights)[]).map((k) => <Num key={k} label={`Weight: ${LABELS[k]}`} value={w[k]} onChange={(v) => setW({ ...w, [k]: v })} kind="Estimated" />)}
              <Num label="Runs/week target" value={t.runsTarget} onChange={(v) => setT({ ...t, runsTarget: v || 1 })} kind="Placeholder" />
              <Num label="Cost per case target (USD)" value={t.costTarget} step={0.1} onChange={(v) => setT({ ...t, costTarget: v || 0.1 })} kind="Placeholder" />
              <Num label="Override ceiling (share)" value={t.overrideCeiling} step={0.05} onChange={(v) => setT({ ...t, overrideCeiling: v || 0.01 })} kind="Placeholder" />
            </div>
            <button className="btn" style={{ marginTop: 10 }} onClick={() => { setW(DEFAULT_HEALTH_WEIGHTS); setT(DEFAULT_TARGETS); }}>Restore defaults</button>
            <p className="small muted" style={{ marginTop: 8 }}>The support → customer success → fraud and risk path is from the brief, attributed to Gus Trigos&apos;s public posts about a named customer. <Kind kind="Unverified" source="gus-li" /></p>
          </details>

          <div className="row" style={{ margin: "16px 0 8px" }}><h2 style={{ margin: 0 }}>Accounts</h2><Illustrative /></div>
          <div className="tablewrap"><table>
            <thead><tr><th>Account</th><th>Archetype</th><th className="num">Health</th><th>RAG</th><th className="num">Coverage</th><th className="num">Renewal</th><th>Renewal risk</th></tr></thead>
            <tbody>{rows.map(({ a, h }) => (
              <tr key={a.id} style={a.id === sel ? { background: "var(--soft)" } : undefined}>
                <td><button className="btn" style={{ padding: "2px 8px" }} aria-pressed={a.id === sel} onClick={() => setSel(a.id)}>{a.name}</button></td>
                <td>{a.archetype}</td><td className="num">{h.score}</td><td><span className={`rag ${h.rag}`}>{h.rag}</span></td><td className="num">{h.coverage}%</td><td className="num">{a.renewalDays} d</td><td>{h.renewalRisk}</td>
              </tr>))}</tbody>
          </table></div>
          <p className="small muted">Renewal risk: coverage &lt; 60% → Unknown; Red → High if ≤ 120 days; Amber → High if ≤ 90 days; Green → Medium if ≤ 30 days; else Medium/Low.</p>

          <div className="grid g2" style={{ marginTop: 16 }}>
            <section className="card" aria-labelledby="acct-h">
              <div className="row" style={{ justifyContent: "space-between" }}><h3 id="acct-h" style={{ margin: 0 }}>{cur.a.name} · {cur.h.score} <span className={`rag ${cur.h.rag}`}>{cur.h.rag}</span></h3><Illustrative /></div>
              <p className="small muted">{cur.a.notes}</p>
              <table><thead><tr><th>Component</th><th className="num">0-100</th><th className="num">Wt</th><th className="num">Pts</th></tr></thead>
                <tbody>{cur.h.components.map((c) => <tr key={c.key}><td>{c.label}</td><td className="num">{c.value ?? "missing"}</td><td className="num">{c.weight}</td><td className="num">{c.points.toFixed(1)}</td></tr>)}
                  <tr><td><strong>Total</strong></td><td></td><td className="num">{total}</td><td className="num"><strong>{cur.h.score}</strong></td></tr></tbody></table>
            </section>
            <section className="card" aria-labelledby="act-h">
              <h3 id="act-h">What to do this week</h3>
              <ol className="steps small">{weeklyActions(cur.a, t).map((x) => <li key={x.rule}>{x.action} <span className="mono muted">[{x.rule}]</span></li>)}</ol>
              <p className="small muted">Deterministic rules, fixed order, no external calls.</p>
              <div className="row noprint">
                <button className="btn primary" onClick={() => download(`qbr-${cur.a.id}.md`, md)}>Export QBR brief (.md)</button>
                <button className="btn" onClick={() => { const win = window.open("", "_blank"); if (win) { win.document.write(`<title>QBR ${cur.a.name}</title><pre style="font:13px/1.5 ui-monospace,monospace;white-space:pre-wrap;max-width:780px;margin:32px auto">${md.replace(/</g, "&lt;")}</pre>`); win.document.close(); win.print(); } }}>Printable view</button>
              </div>
            </section>
          </div>
          <details className="card" style={{ marginTop: 12 }}><summary><strong>Preview QBR brief</strong></summary><pre>{md}</pre></details>
        </>
      )}
    </>
  );
}
