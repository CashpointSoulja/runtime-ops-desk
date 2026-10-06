import { SOURCES } from "@/lib/sources";
import { PageHead } from "@/components/ui";

export const metadata = { title: "Sources" };

export default function Sources() {
  return (
    <>
      <PageHead eyebrow="Sources" title="Every public source used" lede="What each one supports. Anything not backed by a source here is labelled Estimated, Placeholder, Assumption or Unverified where it appears." />
      <div className="tablewrap"><table>
        <thead><tr><th>Source</th><th>What it supports</th></tr></thead>
        <tbody>{SOURCES.map((s) => <tr key={s.id}><td style={{ minWidth: 200 }}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></td><td>{s.supports}</td></tr>)}</tbody>
      </table></div>
    </>
  );
}
