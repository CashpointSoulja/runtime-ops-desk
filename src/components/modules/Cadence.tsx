"use client";
import { ACCOUNTS } from "@/lib/data/accounts";
import { healthScore } from "@/lib/health";
import { metricsTree, PLACEHOLDER_INPUTS, type CadenceInputs } from "@/lib/cadence";
import { NINETY } from "@/lib/ninety";
import { Num, useLocal, Illustrative, download, usd } from "@/components/ui";

type Notes = { hiring: string; risks: string; asks: string; wins: string };
const NOTES: Notes = { hiring: "Placeholder: roles open, stage, target start.", risks: "Placeholder: top 3 risks and the mitigation for each.", asks: "Placeholder: intros or help wanted from investors.", wins: "Placeholder: one customer win and one product win." };

const FIELDS: [keyof CadenceInputs, string][] = [
  ["signedAccounts", "Signed accounts"], ["activatedAccounts", "Activated accounts"], ["weeklyActiveAgents", "Weekly active agents"], ["runsPerWeek", "Runs this week"],
  ["approvalsRequested", "Approvals requested"], ["approvalsGranted", "Approvals granted"], ["accountsUpForRenewal", "Accounts up for renewal"], ["accountsRetained", "Accounts retained"],
  ["cashRunwayMonths", "Runway (months)"], ["burnPerMonth", "Net burn per month (USD)"],
];

export default function Cadence() {
  const [i, setI] = useLocal<CadenceInputs>("cad.inputs", PLACEHOLDER_INPUTS);
  const [n, setN] = useLocal<Notes>("cad.notes", NOTES);
  const tree = metricsTree(i);
  const health = ACCOUNTS.map((a) => ({ a, h: healthScore(a) }));
  const rag = { Green: 0, Amber: 0, Red: 0 } as Record<string, number>;
  health.forEach((x) => rag[x.h.rag]++);
  const avg = Math.round(health.reduce((s, x) => s + x.h.score, 0) / health.length);
  const renewals = health.filter((x) => x.a.renewalDays <= 120).sort((a, b) => a.a.renewalDays - b.a.renewalDays);

  const md = `# Board and investor update

Illustrative data. All metrics are placeholders.

## Headline metrics
${tree.map((t) => `- ${t.node}: ${t.value} (${t.formula})${t.rate !== null ? `, ${t.rate}${t.rateLabel ? " " + t.rateLabel : "%"}` : ""}`).join("\n")}
- Runway: ${i.cashRunwayMonths} months at ${usd(i.burnPerMonth)} net burn per month

## Customer health
- Accounts: ${health.length}. Green ${rag.Green}, Amber ${rag.Amber}, Red ${rag.Red}. Average health ${avg}.
${renewals.map((r) => `- Renewal in ${r.a.renewalDays} days: ${r.a.name} (${r.a.archetype}), health ${r.h.score} ${r.h.rag}, risk ${r.h.renewalRisk}`).join("\n")}

## Wins
${n.wins}

## Hiring
${n.hiring}

## Risks
${n.risks}

## Asks
${n.asks}
`;

  return (
    <>
      <div className="row" style={{ marginBottom: 8 }}><h2 style={{ margin: 0 }}>Weekly operating review</h2><Illustrative /></div>
      <div className="grid g4">{FIELDS.map(([k, l]) => <Num key={k} label={l} value={i[k]} onChange={(v) => setI({ ...i, [k]: v })} kind="Placeholder" />)}</div>

      <h3 style={{ marginTop: 18 }}>Metrics tree</h3>
      <div className="grid g4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
        {tree.map((t, k) => (
          <div className="card kpi" key={t.node}>
            <div className="l">{k + 1}. {t.node}</div><div className="v">{t.value}</div>
            <div className="small muted mono">{t.formula}{t.rate !== null ? ` = ${t.rate}${t.rateLabel ? " " + t.rateLabel : "%"}` : ""}</div>
          </div>
        ))}
      </div>
      <p className="small muted">Activation → weekly active agents → runs → approvals → retained accounts.</p>

      <h3 style={{ marginTop: 18 }}>Customer health roll-up (from Customer Desk)</h3>
      <div className="grid g4">
        <div className="card kpi"><div className="l">Accounts</div><div className="v">{health.length}</div></div>
        <div className="card kpi"><div className="l">Green / Amber / Red</div><div className="v">{rag.Green} / {rag.Amber} / {rag.Red}</div></div>
        <div className="card kpi"><div className="l">Average health</div><div className="v">{avg}</div><div className="small muted mono">Σ health ÷ {health.length}</div></div>
        <div className="card kpi"><div className="l">Renewals ≤ 120 days</div><div className="v">{renewals.length}</div></div>
      </div>

      <h3 style={{ marginTop: 18 }}>Hiring, risks, wins, asks</h3>
      <div className="grid g2">
        {(Object.keys(n) as (keyof Notes)[]).map((k) => <label key={k} className="field"><span className="lab">{k[0].toUpperCase() + k.slice(1)}</span><textarea style={{ minHeight: 70, fontFamily: "var(--sans)", fontSize: 14 }} value={n[k]} onChange={(e) => setN({ ...n, [k]: e.target.value })} /></label>)}
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" onClick={() => download("board-update.md", md)}>Export board update (.md)</button>
      </div>
      <details className="card" style={{ marginTop: 12 }} open><summary><strong>Board update preview</strong></summary><pre>{md}</pre></details>

      <h2>First 90 days in the seat</h2>
      <div className="grid g3">
        {NINETY.map((p) => (
          <div className="card" key={p.phase}><h3>{p.phase}</h3>
            {p.items.map((x) => <div key={x.what} style={{ marginBottom: 10 }}><p className="small" style={{ margin: 0 }}>{x.what}</p><p className="small muted" style={{ margin: 0 }}><strong>Outcome:</strong> {x.measure}</p></div>)}
          </div>
        ))}
      </div>
    </>
  );
}
