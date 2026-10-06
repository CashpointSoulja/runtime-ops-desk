import Link from "next/link";
import { SEAT_ROWS, NOT_SHOWN, JOB_URL } from "@/lib/seat";
import { PageHead } from "@/components/ui";

export const metadata = { title: "Seat map" };

export default function Seat() {
  return (
    <>
      <PageHead eyebrow="Seat map" title="Every line of the job post, mapped to an artifact" lede="Lines are quoted from the public Founding AI Ops post. Each maps to something you can open and use here, not to a CV line." />
      <p className="small">Source: <a href={JOB_URL} target="_blank" rel="noreferrer">YC job post: Founding AI Ops</a>. Lines marked [...] are shortened; the original is at the link.</p>
      <div className="tablewrap"><table>
        <thead><tr><th style={{ width: "38%" }}>Job post line</th><th>Module</th><th>Artifact that shows it</th></tr></thead>
        <tbody>
          {SEAT_ROWS.map((r) => (
            <tr key={r.line}>
              <td><div className="mono small muted">{r.section}</div>{r.section === "Rollout" ? r.line : <>&ldquo;{r.line}&rdquo;</>}</td>
              <td><Link href={r.href}>{r.module}</Link></td>
              <td>{r.artifact}</td>
            </tr>
          ))}
          {NOT_SHOWN.map((r, i) => (
            <tr key={r.line} style={{ background: "var(--soft)" }}>
              <td>{i === 0 ? <div className="mono small muted">Not shown here</div> : null}{r.line}</td>
              <td><span className="tag Placeholder">Not shown here</span></td>
              <td>{r.why}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
