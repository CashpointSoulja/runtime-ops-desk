import Customers from "@/components/modules/Customers";
import { PageHead } from "@/components/ui";
export const metadata = { title: "Customer Desk" };
export default function Page() {
  return (<><PageHead eyebrow="B · Customer Desk · customer experience" title="Onboard, measure health, brief the renewal" lede="A 14-day design-partner plan, a weighted health model for six archetype accounts, a weekly action list from fixed rules, and a QBR brief export." illustrative /><Customers /></>);
}
