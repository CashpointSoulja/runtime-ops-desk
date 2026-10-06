import Link from "next/link";
import { RUNGS, type Claim } from "@/lib/operate";
import { Kind } from "@/components/ui";
import { PageHead } from "@/components/ui";

export const metadata = { title: "Operate" };

const C = ({ c }: { c: Claim }) => (
  <span>{c.text} <Kind kind={c.kind} source={c.source} /></span>
);

export default function Operate() {
  return (
    <>
      <PageHead eyebrow="Operate · rollout ladder" title="One queue at a time, six rungs" lede="How agents could roll out across a payments customer, or across Runtime's own ops. Each rung: the first agent, who signs off, the metric that proves it, the failure to watch, and the runbook it starts from." />
      <p className="small"><Kind kind="Sourced" /> links to a public page. <Kind kind="Assumption" /> is my reasoning, not a Runtime statement. Public basis for the ladder shape: Runtime starts with one SOP and one queue with agreed success measures, then the next team builds on the same harness (<a href="https://www.runtm.com/enterprise" target="_blank" rel="noreferrer">enterprise</a>, <a href="https://www.runtm.com" target="_blank" rel="noreferrer">home</a>).</p>
      <div className="grid" style={{ marginTop: 16 }}>
        {RUNGS.map((r) => (
          <section className="card" key={r.n} aria-labelledby={`rung-${r.n}`}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h3 id={`rung-${r.n}`} style={{ margin: 0 }}><span className="mono muted">Rung {r.n}</span> · {r.name}</h3>
              {r.runbook ? <Link className="btn" href={`/runbooks/?rb=${r.runbook.slug}`}>Runbook: {r.runbook.title} →</Link> : <span className="tag Placeholder">No payment runbook; uses Customer Desk</span>}
            </div>
            <dl className="grid g2" style={{ marginTop: 12, marginBottom: 0 }}>
              <div><dt className="mono small muted">First agent</dt><dd style={{ margin: 0 }}><C c={r.firstAgent} /></dd></div>
              <div><dt className="mono small muted">Human sign-off</dt><dd style={{ margin: 0 }}><C c={r.signOff} /></dd></div>
              <div><dt className="mono small muted">Proof metric</dt><dd style={{ margin: 0 }}><C c={r.proof} /></dd></div>
              <div><dt className="mono small muted">Failure to watch</dt><dd style={{ margin: 0 }}><C c={r.failure} /></dd></div>
            </dl>
            {r.note && <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}><C c={r.note} /> {!r.runbook && <Link href="/customers/">Customer Desk →</Link>}</p>}
          </section>
        ))}
      </div>
    </>
  );
}
