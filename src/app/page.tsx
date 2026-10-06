import Link from "next/link";
import { Src } from "@/components/ui";

const MAP = [
  { r: "Own customer experience end to end", m: [["Customer Desk", "/customers/"]] },
  { r: "Build internal agents for onboarding, support triage, sales ops, finance, recruiting, security and compliance", m: [["Automation Map", "/automation/"], ["Runbook Library", "/runbooks/"]] },
  { r: "Run the operating cadence: metrics, customer health, renewals, board and investor reporting", m: [["Operating Cadence", "/cadence/"], ["Customer Desk", "/customers/"]] },
  { r: "Be the toughest internal user, feeding bugs and product ideas to engineering", m: [["Run Review", "/review/"], ["Field Notes", "/field-notes/"]] },
];

const TOUR = [
  ["0:00", "Automation Map", "/automation/", "24 internal workflows ranked by an editable formula. Top 5 become the week 1 to 4 build order."],
  ["0:15", "Customer Desk", "/customers/", "14-day onboarding plan, a weighted health score for 6 archetype accounts, and a QBR brief export."],
  ["0:30", "Runbook Library", "/runbooks/", "10 payment-ops runbooks with cited sources. Pick one, move a threshold, get the agent spec and approval policy JSON."],
  ["0:45", "Run Review", "/review/", "9 synthetic run traces scored on a 6-part rubric. Findings roll up into a ranked Friction Log."],
  ["0:55", "Operating Cadence", "/cadence/", "Metrics tree, health roll-up, board update export and a 30/60/90 plan for the seat."],
];

export default function Home() {
  return (
    <>
      <div className="eyebrow">Start here</div>
      <h1>Runtime Ops Desk</h1>
      <p className="lede">The working system the Founding AI Ops hire at Runtime would want open on day one. One app for the four jobs in the <Src id="yc-job-ops">job post</Src>.</p>
      <div className="callout" style={{ margin: "18px 0 8px" }}>
        <strong>Independent concept.</strong> Built on public information only. All accounts, runs and metrics are synthetic and tagged <span className="tag illus">Illustrative data</span>. Not affiliated with Runtime.
      </div>

      <h2>Who it is for</h2>
      <p>Runtime&apos;s first operations hire. The <Src id="yc-job-ops">post</Src> asks this person to run the company the way Runtime&apos;s customers run theirs: build internal agents for every part of operations instead of hiring around each new problem, and own the customer experience.</p>

      <h2>Why it exists</h2>
      <p>Runtime is <Src id="rt-home">the AI agent harness for payment teams</Src>: payment ops, risk, compliance and support teams turn procedures into agents that ask before they act, with every run stored. The brief cites Gus Trigos&apos;s public posts that payment ops and risk is where leaders want help most <span className="tag Unverified">Unverified: LinkedIn not readable signed out</span>. What is public: Runtime&apos;s own solutions list starts with payment operations, payments support, partner-bank requests, underwriting, fraud and compliance (<Src id="rt-enterprise">enterprise page</Src>). The ops hire has to speak that language from week one, so the core of this desk is the <Link href="/runbooks/">Runbook Library</Link>.</p>

      <h2>60-second tour</h2>
      <div className="tablewrap"><table>
        <thead><tr><th>Time</th><th>Module</th><th>What you see</th></tr></thead>
        <tbody>{TOUR.map(([t, n, h, d]) => <tr key={n}><td className="mono">{t}</td><td><Link href={h}>{n}</Link></td><td>{d}</td></tr>)}</tbody>
      </table></div>

      <h2>Module to responsibility map</h2>
      <div className="grid g2">
        {MAP.map((x) => (
          <div className="card" key={x.r}>
            <div className="mono small muted">Job post</div>
            <p style={{ margin: "4px 0 10px" }}>{x.r}</p>
            <div className="row">{x.m.map(([n, h]) => <Link className="btn" key={n} href={h}>{n} →</Link>)}</div>
          </div>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 16 }}>Line-by-line mapping of the post: <Link href="/seat/">Seat map</Link>. Rollout ladder across teams: <Link href="/operate/">Operate</Link>. State is saved in this browser only; use Reset in the left rail to clear it.</p>
    </>
  );
}
