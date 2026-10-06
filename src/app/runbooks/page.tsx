import { Suspense } from "react";
import Runbooks from "@/components/modules/Runbooks";
import { PageHead } from "@/components/ui";
export const metadata = { title: "Runbook Library" };
export default function Page() {
  return (<><PageHead eyebrow="C · Runbook Library · procedures to agents" title="Payment-ops runbooks, turned into agent specs" lede="Ten procedures with triggers, systems, steps, evidence, approval thresholds, never-do lists, audit fields, metrics and failure modes. Public sources on every domain fact." /><Suspense><Runbooks /></Suspense></>);
}
