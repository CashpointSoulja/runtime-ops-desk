"use client";
import { useEffect, useState } from "react";
import { RUNBOOKS, buildAgent, runbookBySlug } from "@/lib/runbooks";
import { sourceById } from "@/lib/sources";
import { Kind, useLocal, download } from "@/components/ui";

export default function Runbooks() {
  const [slug, setSlug] = useState(RUNBOOKS[1].slug);
  const [vals, setVals] = useLocal<Record<string, Record<string, number>>>("rb.values", {});
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("rb");
    if (q && runbookBySlug(q)) setSlug(q);
  }, []);
  const r = runbookBySlug(slug)!;
  const v = vals[slug] || {};
  const built = buildAgent(r, v);

  return (
    <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
      <label className="field" style={{ maxWidth: 420 }}>
        <span className="lab">Runbook ({RUNBOOKS.length})</span>
        <select value={slug} onChange={(e) => { setSlug(e.target.value); history.replaceState(null, "", `?rb=${e.target.value}`); }}>
          {RUNBOOKS.map((x, i) => <option key={x.slug} value={x.slug}>{i + 1}. {x.title}</option>)}
        </select>
      </label>

      <div className="grid g2">
        <section className="card" aria-labelledby="rb-h">
          <h2 id="rb-h" style={{ marginTop: 0 }}>{r.title}</h2>
          <p className="small"><strong>Trigger.</strong> {r.trigger}<br /><strong>Queue.</strong> {r.queue}</p>
          <p className="small"><strong>Systems read.</strong> {r.systems.join(" · ")}</p>
          <strong className="small">Steps</strong>
          <ol className="steps small">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <p className="small"><strong>Evidence to cite.</strong> {r.evidence.join("; ")}</p>
          <p className="small"><strong>Never.</strong> {r.never.join("; ")}</p>
          <p className="small"><strong>Metrics.</strong> {r.metrics.join("; ")}</p>
          <p className="small"><strong>Top failure modes.</strong> {r.failureModes.join("; ")}</p>
          <p className="small"><strong>Audit fields.</strong> <span className="mono">{r.audit.join(", ")}</span></p>
          <strong className="small">Public sources</strong>
          <ul className="clean small">{r.facts.map((f) => <li key={f.text}>{f.text} <Kind kind="Sourced" source={f.source} /> {f.check && <span className="tag Unverified">Needs expert check</span>}</li>)}</ul>
          {r.expertCheck.length > 0 && <div className="callout warn small"><strong>Needs expert check.</strong> {r.expertCheck.join(" ")}</div>}
        </section>

        <section className="card" aria-labelledby="b-h">
          <h2 id="b-h" style={{ marginTop: 0 }}>Runbook to agent</h2>
          <p className="small muted">Tweak thresholds. The spec, approval policy and audit entry regenerate in the browser.</p>
          <div className="grid g2">
            {built.thresholds.map((t) => (
              <label className="field" key={t.key}>
                <span className="lab">{t.label} ({t.unit}) <Kind kind="Placeholder" /></span>
                <input type="number" value={t.value} min={0} onChange={(e) => setVals({ ...vals, [slug]: { ...v, [t.key]: Number(e.target.value) } })} />
                <span className="small muted">{t.note}</span>
              </label>
            ))}
          </div>
          <h3 style={{ marginTop: 14 }}>Approval-policy preview</h3>
          <pre aria-label="Approval policy JSON">{JSON.stringify(built.policy, null, 2)}</pre>
          <h3>Generated agent spec</h3>
          <pre>{JSON.stringify(built.spec, null, 2)}</pre>
          <h3>Mock audit-trail entry</h3>
          <pre>{JSON.stringify(built.audit, null, 2)}</pre>
          <div className="row">
            <button className="btn primary" onClick={() => download(`${r.slug}-policy.json`, JSON.stringify(built.policy, null, 2), "application/json")}>Download policy JSON</button>
            <button className="btn" onClick={() => setVals({ ...vals, [slug]: {} })}>Reset thresholds</button>
          </div>
        </section>
      </div>
      <p className="small muted">Every domain fact links to its public source ({[...new Set(RUNBOOKS.flatMap((x) => x.facts.map((f) => f.source)))].map((id) => sourceById(id)?.title).filter(Boolean).length} sources across the library). Thresholds are placeholders to be set per customer.</p>
    </div>
  );
}
