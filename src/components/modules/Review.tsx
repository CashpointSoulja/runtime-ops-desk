"use client";
import { useState } from "react";
import { TRACES } from "@/lib/data/traces";
import { scoreTrace, frictionLog, frictionMarkdown, weeklyDigest, parseTrace, DEFAULT_RUBRIC, DIMENSIONS, type RubricWeights, type Trace } from "@/lib/review";
import { Illustrative, Num, useLocal, download, Kind } from "@/components/ui";

const SAMPLE = JSON.stringify({ id: "run-pasted", title: "Pasted trace", runAt: "2026-10-05T14:00:00Z", dataAsOf: "2026-10-05T13:00:00Z", maxDataAgeHours: 4, budget: { maxCost: 0.6, maxSeconds: 180 }, expected: { amount: 20, outcome: "refund-drafted" }, actual: { amount: 20, outcome: "refund-drafted" }, requiredEvidence: ["ch_1", "ledger:1"], citedEvidence: ["ch_1"], approval: { required: true, requested: true, granted: true }, steps: [{ at: 5, tool: "processor", action: "list charges", ok: true, cost: 0.05 }], explanation: "ch_1 captured twice; drafted refund of 20.00 and requested approval." }, null, 2);

export default function Review() {
  const [w, setW] = useLocal<RubricWeights>("review.rubric", DEFAULT_RUBRIC);
  const [sel, setSel] = useState("run-102");
  const [paste, setPaste] = useState(SAMPLE);
  const [pasted, setPasted] = useState<{ trace?: Trace; error?: string }>({});
  const all = [...TRACES, ...(pasted.trace ? [pasted.trace] : [])];
  const results = all.map((t) => ({ t, ...scoreTrace(t, w) }));
  const cur = results.find((r) => r.t.id === sel) || results[0];
  const fl = frictionLog(results.map((r) => ({ id: r.t.id, findings: r.findings })));
  const digest = weeklyDigest(results.map((r) => ({ id: r.t.id, title: r.t.title, verdict: r.verdict, findings: r.findings })));
  const total = DIMENSIONS.reduce((s, d) => s + w[d], 0);
  const vClass = (v: string) => (v === "Pass" ? "Green" : v === "Fail" ? "Red" : "Amber");

  return (
    <>
      <div className="formula">
        score = Σ(dimension 0..1 × weight) ÷ {total} × 100 · correctness: wrong amount or outcome = 0, stale data or unreported tool error ≤ 0.5 · evidence = cited ÷ required · approvals = 0 if required and not granted before acting · cost/time: ≤ budget 1, ≤ 2× 0.5, else 0 · explanation: cites evidence and ≥ 80 chars = 1, one of two = 0.5 · Fail if correctness or approvals = 0 · Pass only with zero findings · else Needs work
      </div>
      <details className="card" style={{ marginTop: 12 }}><summary><strong>Edit rubric weights</strong></summary>
        <div className="grid g3" style={{ marginTop: 12 }}>{DIMENSIONS.map((d) => <Num key={d} label={`Weight: ${d}`} value={w[d]} onChange={(v) => setW({ ...w, [d]: v })} kind="Estimated" />)}</div>
        <button className="btn" style={{ marginTop: 10 }} onClick={() => setW(DEFAULT_RUBRIC)}>Restore defaults</button>
      </details>

      <div className="row" style={{ margin: "18px 0 8px" }}><h2 style={{ margin: 0 }}>Runs</h2><Illustrative /></div>
      <div className="tablewrap"><table>
        <thead><tr><th>Run</th><th>Title</th>{DIMENSIONS.map((d) => <th key={d} className="num">{d.slice(0, 5)}</th>)}<th className="num">Score</th><th>Verdict</th></tr></thead>
        <tbody>{results.map((r) => (
          <tr key={r.t.id} style={r.t.id === cur.t.id ? { background: "var(--soft)" } : undefined}>
            <td><button className="btn" style={{ padding: "2px 8px" }} aria-pressed={r.t.id === cur.t.id} onClick={() => setSel(r.t.id)}>{r.t.id}</button></td>
            <td>{r.t.title}</td>{DIMENSIONS.map((d) => <td key={d} className="num">{Math.round(r.dims[d] * 100) / 100}</td>)}<td className="num">{r.score}</td><td><span className={`rag ${vClass(r.verdict)}`}>{r.verdict}</span></td>
          </tr>))}</tbody>
      </table></div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <section className="card" aria-labelledby="tr-h">
          <div className="row" style={{ justifyContent: "space-between" }}><h3 id="tr-h" style={{ margin: 0 }}>{cur.t.id}: {cur.score} <span className={`rag ${vClass(cur.verdict)}`}>{cur.verdict}</span></h3><Illustrative /></div>
          <p className="small muted">{cur.t.title} · cost ${cur.cost} of ${cur.t.budget.maxCost} · {cur.seconds}s of {cur.t.budget.maxSeconds}s</p>
          <strong className="small">Findings</strong>
          {cur.findings.length ? <ul className="clean small">{cur.findings.map((f) => <li key={f.code}><span className="mono">{f.code}</span> ({f.dimension}): {f.detail}</li>)}</ul> : <p className="small">No findings.</p>}
          <strong className="small">Steps</strong>
          <table><thead><tr><th className="num">t (s)</th><th>Tool</th><th>Action</th><th>OK</th><th className="num">$</th></tr></thead>
            <tbody>{cur.t.steps.map((s, i) => <tr key={i}><td className="num">{s.at}</td><td className="mono">{s.tool}</td><td>{s.action}</td><td>{s.ok ? "ok" : <span className="rag Red">{s.error || "error"}</span>}</td><td className="num">{s.cost.toFixed(2)}</td></tr>)}</tbody></table>
          <p className="small" style={{ marginTop: 8 }}><strong>Agent explanation.</strong> {cur.t.explanation}</p>
        </section>
        <section className="card" aria-labelledby="paste-h">
          <h3 id="paste-h">Score a pasted trace</h3>
          <label className="field"><span className="lab">Trace JSON (same shape as the sample)</span><textarea value={paste} onChange={(e) => setPaste(e.target.value)} spellCheck={false} /></label>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn primary" onClick={() => { const p = parseTrace(paste); if (p.ok) { setPasted({ trace: { ...p.trace, title: p.trace.title + " (pasted)" } }); setSel(p.trace.id); } else setPasted({ error: p.error }); }}>Score it</button>
            <button className="btn" onClick={() => { setPaste(SAMPLE); setPasted({}); }}>Reset sample</button>
          </div>
          {pasted.error && <p className="small" role="alert" style={{ color: "var(--red)", marginTop: 8 }}>{pasted.error}</p>}
          {pasted.trace && <p className="small" style={{ marginTop: 8 }}>Added {pasted.trace.id} to the table and selected it.</p>}
        </section>
      </div>

      <div className="row" style={{ margin: "24px 0 8px" }}><h2 style={{ margin: 0 }}>Friction Log for engineering</h2><Illustrative /></div>
      <p className="small muted">rank = impact × traces affected ÷ effort. Effort and impact are <Kind kind="Estimated" /> guesses (1 to 3).</p>
      <div className="tablewrap"><table>
        <thead><tr><th>#</th><th>Problem</th><th>Evidence</th><th>Proposed fix</th><th className="num">Effort</th><th className="num">Impact</th><th className="num">Rank</th></tr></thead>
        <tbody>{fl.map((f, i) => <tr key={f.code}><td className="mono">{i + 1}</td><td>{f.problem}</td><td className="mono small">{f.evidence.join(", ")}</td><td>{f.fix}</td><td className="num">{f.effort}</td><td className="num">{f.impact}</td><td className="num">{f.rank}</td></tr>)}</tbody>
      </table></div>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn primary" onClick={() => download("friction-log.md", frictionMarkdown(fl))}>Export Friction Log (.md)</button>
        <button className="btn" onClick={() => download("weekly-digest.md", digest)}>Export weekly digest (.md)</button>
      </div>
      <details className="card" style={{ marginTop: 12 }}><summary><strong>Weekly digest: what broke, what to fix</strong></summary><pre>{digest}</pre></details>
    </>
  );
}
