import { PageHead } from "@/components/ui";
import { FIELD_LOG, SUGGESTIONS, OBSERVATIONS, SCREENS } from "@/lib/fieldnotes";

export const metadata = { title: "Field Notes" };

export default function FieldNotes() {
  return (
    <>
      <PageHead eyebrow="Field notes · 6 Oct 2026 · first-hand" title={"The setup check said \"No key\". The Guide still said Live."} lede="I signed up to Runtime on 6 Oct 2026 (free plan, 500 credits, no card, sign-in with GitHub) and ran the onboarding end to end. This is what happened, in order, and what I would change." />
      <div className="callout warn">
        <strong>Headline.</strong> When the setup agent tried to verify the dashboard connection it hit an API authentication error, with &ldquo;No key&rdquo; in the session footer, and told me to check or rotate the API key in Settings. The flow still declared the agent &ldquo;Live&rdquo;. A first-time user would not know whether it works.
        <br /><strong>Proposed fix.</strong> Show the API-key and connection state before the word Live: a check that is green only when the key verifies, and otherwise a status like &ldquo;Draft: connect a key to go live&rdquo; with a one-click link to Settings.
      </div>

      <h2>Log</h2>
      <ol className="steps">{FIELD_LOG.map((x, i) => <li key={i}>{x}</li>)}</ol>

      <h2>The three screens, in words</h2>
      <div className="grid g3">{SCREENS.map((s) => <section key={s.title} className="card"><h3>{s.title}</h3><p className="small"><strong>Shown.</strong> {s.shown}</p><p className="small"><strong>What I did.</strong> {s.did}</p><p className="small" style={{ margin: 0 }}><strong>What it said.</strong> {s.said}</p></section>)}</div>

      <h2>What an ops owner would notice</h2>
      <p className="small muted">Observations from one session, not claims about how Runtime works inside.</p>
      <ul className="clean">{OBSERVATIONS.map((x) => <li key={x}>{x}</li>)}</ul>

      <h2>First 10 minutes: teardown</h2>
      <p className="small muted">My suggestions, offered as a user. Respectfully, in priority order.</p>
      <div className="grid g2">{SUGGESTIONS.map((s, i) => <div className="card" key={s.title}><div className="mono small muted">Suggestion {i + 1}</div><h3>{s.title}</h3><p className="small" style={{ margin: 0 }}>{s.why}</p></div>)}</div>
    </>
  );
}
