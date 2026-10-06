import Automation from "@/components/modules/Automation";
import { PageHead } from "@/components/ui";
export const metadata = { title: "Automation Map" };
export default function Page() {
  return (<><PageHead eyebrow="A · Automation Map · internal ops" title="What to automate first inside Runtime" lede="24 internal workflows across the six areas in the job post. A visible, editable formula ranks each one. Click a row for its one-page agent spec." illustrative /><Automation /></>);
}
