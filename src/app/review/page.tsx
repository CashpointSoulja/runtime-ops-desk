import Review from "@/components/modules/Review";
import { PageHead } from "@/components/ui";
export const metadata = { title: "Run Review" };
export default function Page() {
  return (<><PageHead eyebrow="D · Run Review · toughest user" title="Score agent runs, ship the fixes" lede="Nine synthetic run traces, one good and eight with realistic failures, scored on a six-part rubric in the browser. Paste your own trace. Findings become ranked product ideas." illustrative /><Review /></>);
}
