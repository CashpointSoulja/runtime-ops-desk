export type Threshold = { key: string; label: string; unit: "USD" | "%" | "count" | "hours"; value: number; note: string };

export type Runbook = {
  slug: string;
  title: string;
  queue: string;
  trigger: string;
  systems: string[];
  steps: string[];
  evidence: string[];
  thresholds: Threshold[];
  never: string[];
  audit: string[];
  metrics: string[];
  failureModes: string[];
  facts: { text: string; source: string; check?: boolean }[];
  expertCheck: string[];
};

const AUDIT_BASE = ["run_id", "trigger", "queue_item_id", "agent_version", "tools_called", "records_read", "evidence_cited", "decision", "approval_request_id", "approver", "approved_at", "cost_usd", "duration_s", "outcome"];
const METRICS_BASE = ["Time to resolution (median, p90)", "Rework rate: cases reopened or overridden within 7 days", "Cost per case: run cost / cases closed"];

export const RUNBOOKS: Runbook[] = [
  {
    slug: "stuck-payout", title: "Stuck payout trace", queue: "Support inbox and payment-ops channel (\"where is my payout\" escalations)",
    trigger: "Merchant reports a payout not received, or a payout is past its expected arrival date.",
    systems: ["Ticketing", "Processor dashboard / API (payout object, status, failure code)", "Ledger / DB (payout batch, balance transactions)", "Bank portal or statement (deposit lines)", "Logs (payout job)"],
    steps: ["Read the ticket and extract merchant id, payout id(s), amount, expected date.", "Look up each payout in the processor: status (pending, in transit, paid, failed, canceled) and failure code if any.", "Pull the balance transactions included in the payout and confirm the total.", "Check the bank statement for a matching deposit (amount, date, trace or reference).", "If failed: read the failure code and map it to the next action (bank details, account closed, etc.).", "If paid and not found: prepare the bank trace request with the reference.", "Draft the merchant reply with status, ids, and next step. Never promise a date the bank controls.", "If a re-issue or ledger correction is needed, stop and request approval."],
    evidence: ["Payout id and processor status", "Failure code if present", "Ledger batch id and total", "Bank statement line or 'not found'"],
    thresholds: [{ key: "reissueApproval", label: "Re-issued payout always needs approval above", unit: "USD", value: 0, note: "0 means every re-issue" }, { key: "escalateAge", label: "Escalate to bank when past expected date by", unit: "hours", value: 48, note: "Placeholder; set with the customer" }],
    never: ["Re-issue or cancel a payout without approval", "Change merchant bank details", "Promise an arrival date", "Post a ledger correction"],
    audit: [...AUDIT_BASE, "payout_ids", "processor_status", "bank_reference"],
    metrics: [...METRICS_BASE, "Share of payouts traced to a definite status on first run"],
    failureModes: ["Treating 'paid' at the processor as received at the bank", "Missing a batch split across two payouts", "Reading a stale snapshot of payout status"],
    facts: [{ text: "Payouts have statuses and can fail with a failure code.", source: "stripe-payouts" }, { text: "Payout reconciliation matches the transactions in each payout to the bank deposit.", source: "stripe-payout-recon" }, { text: "\"Where is my payout\" escalations are a common first queue.", source: "rt-home" }],
    expertCheck: [],
  },
  {
    slug: "duplicate-charge", title: "Duplicate charge and refund", queue: "Payments support inbox",
    trigger: "Cardholder or merchant reports being charged twice for one purchase.",
    systems: ["Ticketing", "Processor (charges, authorizations, refunds)", "Ledger / DB (order and fulfilment rows)"],
    steps: ["Read the ticket; extract order id, amount, date, card last four only.", "List both charge ids. For each say whether it is captured or a pending authorization.", "If one is a pending authorization, explain it will drop off and do not refund.", "If both captured, check the ledger for one or two fulfilments.", "If one fulfilment: draft a refund for exactly one charge amount.", "Request approval for the refund draft with both charge ids and ledger rows cited.", "Draft the reply. Do not promise the refund before approval; state that refunds take several business days to appear."],
    evidence: ["Both charge ids with capture status", "Ledger rows for the order", "Refund amount equals one charge amount"],
    thresholds: [{ key: "refundApproval", label: "Refunds above this need human approval", unit: "USD", value: 50, note: "Placeholder; set per customer" }, { key: "autoCloseAuth", label: "Close pending-authorization cases without refund", unit: "count", value: 1, note: "1 = on" }],
    never: ["Promise a refund before approval", "Refund both charges", "Show more than the last four card digits", "Refund a pending authorization"],
    audit: [...AUDIT_BASE, "charge_ids", "capture_status", "refund_amount"],
    metrics: [...METRICS_BASE, "Wrong-amount refunds (target 0)"],
    failureModes: ["Refunding the sum of both charges", "Confusing an authorization hold with a capture", "Refunding on a different order"],
    facts: [{ text: "Runtime's payment support guide: list both charge ids, say which captured and which is a pending authorization, cite ledger rows, never promise a refund, drafts behind an approval, last four only.", source: "rt-docs-support" }, { text: "Refunds take roughly 5 to 10 business days to appear, depending on the bank.", source: "stripe-refunds" }, { text: "Consumer error-resolution timeframes may apply to debit (Reg E) and billing errors on credit (Reg Z).", source: "cfpb-rege", check: true }],
    expertCheck: ["Which of Reg E or Reg Z applies depends on the product and who the customer is."],
  },
  {
    slug: "recon-break", title: "Reconciliation break clearing", queue: "Finance / payment-ops reconciliation queue",
    trigger: "Daily reconciliation flags a break between processor payouts, ledger and bank.",
    systems: ["Reconciliation report", "Processor payout reconciliation", "Ledger / DB", "Bank statement"],
    steps: ["Read the break: amount, date, the two sides that disagree.", "Classify: timing, amount, missing on one side, duplicate.", "For timing: find the matching item on the next bank day.", "For amount: list the component transactions and find the difference (fees, refunds, disputes).", "For missing: search both sides with a date window.", "Propose a resolution with ids. Any ledger entry goes to approval."],
    evidence: ["Break id", "Matching or missing item ids on each side", "Explanation of the difference with arithmetic"],
    thresholds: [{ key: "ledgerApproval", label: "Ledger adjustments need approval above", unit: "USD", value: 0, note: "Every adjustment" }, { key: "materiality", label: "Escalate breaks above", unit: "USD", value: 10000, note: "Placeholder" }],
    never: ["Book a ledger entry without approval", "Net breaks against each other to hide a gap", "Close a break as timing without the matching item"],
    audit: [...AUDIT_BASE, "break_id", "classification", "matched_items"],
    metrics: [...METRICS_BASE, "Breaks open over 3 days"],
    failureModes: ["Calling every break timing", "Ignoring fees netted in the payout", "Running many expensive queries without narrowing the window"],
    facts: [{ text: "Payout reconciliation ties payout transactions to bank deposits.", source: "stripe-payout-recon" }, { text: "Clearing reconciliation breaks is a named use case.", source: "yc-job-ops" }],
    expertCheck: [],
  },
  {
    slug: "chargeback-pack", title: "Chargeback evidence pack", queue: "Disputes queue",
    trigger: "A dispute or inquiry is opened on a charge.",
    systems: ["Processor (dispute object, reason, due date)", "Order system", "Shipping / fulfilment", "Ticketing (customer contact)"],
    steps: ["Read the dispute: reason category, amount, evidence due date.", "Decide accept or fight using the policy table; if accept, draft the accept note and stop.", "Collect evidence that answers the reason: delivery proof, receipt, policy shown at checkout, customer messages.", "Write a short rebuttal tied to the reason code.", "Request approval to submit before the due date."],
    evidence: ["Dispute id, reason, due date", "Each evidence file and why it answers the reason"],
    thresholds: [{ key: "fightMin", label: "Fight disputes above", unit: "USD", value: 25, note: "Placeholder; below this accept" }, { key: "dueBuffer", label: "Submit at least this many hours before due", unit: "hours", value: 48, note: "Placeholder" }],
    never: ["Submit without approval", "Miss the due date", "Include full card numbers or unrelated customer data"],
    audit: [...AUDIT_BASE, "dispute_id", "reason", "due_by", "evidence_files"],
    metrics: [...METRICS_BASE, "Win rate on fought disputes", "Disputes missed past due (target 0)"],
    failureModes: ["Evidence that does not match the reason", "Stale order snapshot", "Submitting late"],
    facts: [{ text: "Response windows are usually 7 to 21 days depending on network; missing the deadline loses the dispute.", source: "stripe-disputes" }, { text: "The disputed amount and a dispute fee are debited when a dispute opens.", source: "stripe-how-disputes" }, { text: "Network dispute categories and merchant evidence expectations.", source: "visa-dispute" }],
    expertCheck: ["Reason-code specific evidence lists vary by network and change; confirm against the current network guide."],
  },
  {
    slug: "ach-return", title: "ACH return (R-code) handling", queue: "ACH returns queue",
    trigger: "An ACH entry is returned with an R-code.",
    systems: ["Processor / ODFI return file", "Ledger / DB", "Customer record", "Email"],
    steps: ["Read the return: R-code, entry id, amount, account.", "Map the R-code: R01/R09 funds, R02/R03/R04 account issues, R05/R07/R10/R11 unauthorized or authorization issues.", "Post the return entry to the ledger (or request approval if policy says so).", "For funds codes: draft a retry or notice per policy.", "For unauthorized codes: stop debits on that authorization and flag for review.", "Draft the customer notice."],
    evidence: ["Return id and R-code", "Original entry id", "Ledger entry id posted"],
    thresholds: [{ key: "retryMax", label: "Max retries for R01/R09", unit: "count", value: 2, note: "Needs expert check against Nacha rules" }, { key: "unauthReview", label: "Unauthorized return rate review above", unit: "%", value: 0.5, note: "Needs expert check" }],
    never: ["Retry an unauthorized-code return", "Retry beyond the rule limit", "Ignore a failed ledger write"],
    audit: [...AUDIT_BASE, "r_code", "entry_id", "ledger_entry_id"],
    metrics: [...METRICS_BASE, "Return rate by R-code"],
    failureModes: ["Swallowing a ledger write failure", "Treating R10 like R01", "Missing the 60-day window cases"],
    facts: [{ text: "ACH return reason codes and timeframes are governed by the Nacha Operating Rules.", source: "nacha-rules" }, { text: "Most returns within 2 banking days; R05, R07, R10, R11 within 60 calendar days.", source: "mt-rcodes" }, { text: "ACH returns are a named starting workflow.", source: "rt-home" }],
    expertCheck: ["Retry limits and unauthorized return thresholds must be confirmed against the current Nacha rule book."],
  },
  {
    slug: "card-fraud-alert", title: "Card-fraud alert triage", queue: "Fraud alert queue",
    trigger: "A fraud rule or model raises an alert on a card or account.",
    systems: ["Case tool", "Processor (authorization history)", "Customer record", "Device / login logs"],
    steps: ["Read the alert and rule that fired.", "Pull authorization history around the alert window.", "List the signals that support and that contradict fraud.", "Assemble the review packet with a recommended action and confidence.", "Leave the block or release decision to the analyst."],
    evidence: ["Alert id and rule", "Authorization ids reviewed", "Signals for and against"],
    thresholds: [{ key: "packetSla", label: "Packet ready within", unit: "hours", value: 1, note: "Placeholder" }],
    never: ["Block or unblock a card", "Contact the cardholder", "Show full PAN"],
    audit: [...AUDIT_BASE, "alert_id", "auth_ids", "recommendation"],
    metrics: [...METRICS_BASE, "False-positive rate: alerts closed as not fraud / alerts reviewed"],
    failureModes: ["Packet with only supporting signals", "Slow authorization history pulls"],
    facts: [{ text: "Runtime's fraud and risk guide: the agent assembles review packets and leaves every block to a human.", source: "rt-docs-fraud" }],
    expertCheck: [],
  },
  {
    slug: "kyb-prep", title: "Merchant onboarding / KYB review prep", queue: "Underwriting / onboarding queue",
    trigger: "New merchant application submitted.",
    systems: ["Application form", "Business registry lookups", "Website", "Case tool"],
    steps: ["Read the application: legal name, address, owners, MCC, volume.", "Collect registry evidence for the entity.", "List beneficial owners as stated and what still needs verification.", "Check website: products match MCC, refund policy, contact info.", "Assemble the underwriting memo draft with gaps listed."],
    evidence: ["Registry record", "Owners list with verification status", "Website snapshot notes"],
    thresholds: [{ key: "volumeReview", label: "Senior review above monthly volume", unit: "USD", value: 250000, note: "Placeholder" }],
    never: ["Approve or decline a merchant", "Mark an owner verified without the document"],
    audit: [...AUDIT_BASE, "application_id", "owners", "gaps"],
    metrics: [...METRICS_BASE, "Memo accepted without rework"],
    failureModes: ["Missing an owner", "Website changed since application"],
    facts: [{ text: "Covered institutions must identify and verify beneficial owners of legal entity customers.", source: "fincen-cdd" }, { text: "Underwriting memo preparation is a named use case.", source: "rt-docs" }],
    expertCheck: ["Ownership percentage thresholds and which entities are covered depend on the institution type."],
  },
  {
    slug: "aml-alert-prep", title: "Transaction-monitoring and AML alert prep", queue: "TM alert queue",
    trigger: "Transaction-monitoring rule fires.",
    systems: ["TM system", "Case tool", "Customer / KYC record", "Transactions warehouse"],
    steps: ["Read the alert and scenario.", "Pull the customer profile and expected activity.", "Pull transactions in the lookback window.", "Summarise who, what, when, where, why and how.", "Draft the investigator note and a disposition recommendation."],
    evidence: ["Alert id", "Transaction ids", "KYC profile fields used"],
    thresholds: [{ key: "lookback", label: "Lookback window", unit: "hours", value: 2160, note: "90 days; placeholder" }],
    never: ["File or decide on a SAR", "Tell the customer about an investigation", "Close an alert"],
    audit: [...AUDIT_BASE, "alert_id", "scenario", "lookback"],
    metrics: [...METRICS_BASE, "False-positive rate", "Alerts aged over policy"],
    failureModes: ["Narrative without the why", "Wrong lookback"],
    facts: [{ text: "SAR narratives should cover who, what, when, where, why and how.", source: "fincen-sar-narrative" }, { text: "SAR filing obligations for banks.", source: "fincen-sar-rule", check: true }, { text: "Examiner expectations for suspicious activity monitoring.", source: "ffiec-manual", check: true }],
    expertCheck: ["SAR filing timing and thresholds.", "Exact examiner expectations for alert documentation."],
  },
  {
    slug: "sanctions-hit", title: "Sanctions-hit review prep", queue: "Sanctions screening queue",
    trigger: "Screening returns a potential match.",
    systems: ["Screening tool", "Customer / KYC record", "SDN list"],
    steps: ["Read the hit: list entry and matched fields.", "Compare name, date of birth, ID, nationality and address.", "List each field as match, no match, or unknown.", "Draft the reviewer note with a false-positive or escalate recommendation."],
    evidence: ["Hit id and list entry", "Field-by-field comparison"],
    thresholds: [{ key: "reviewSla", label: "Reviewer decision within", unit: "hours", value: 24, note: "Placeholder" }],
    never: ["Clear a hit", "Process a blocked or rejected transaction", "Tell the customer"],
    audit: [...AUDIT_BASE, "hit_id", "list_entry", "field_comparison"],
    metrics: [...METRICS_BASE, "False-positive rate"],
    failureModes: ["Clearing on name alone", "Unexplained recommendation"],
    facts: [{ text: "Many potential matches are false positives; compare name, DOB, ID, nationality, address; OFAC does not confirm matches; report blocked or rejected transactions within 10 business days.", source: "ofac-faq-screen" }, { text: "The SDN list is the list screened against.", source: "ofac-sdn" }, { text: "OFAC program expectations.", source: "ffiec-manual", check: true }],
    expertCheck: ["Program-specific reporting requirements."],
  },
  {
    slug: "payout-hold-release", title: "Payout-hold release", queue: "Risk ops queue",
    trigger: "Merchant asks for held funds, or a hold review date arrives.",
    systems: ["Case tool", "Processor (balance, holds, reserves)", "Dispute history"],
    steps: ["Read the hold reason and its review criteria.", "Check the risk case outcome.", "Check disputes and refunds since the hold.", "Propose release, partial release, or keep, with the reasons.", "Request approval. Do not release before approval."],
    evidence: ["Hold id", "Risk case id and outcome", "Dispute ratio since hold"],
    thresholds: [{ key: "releaseApproval", label: "Releases always need approval above", unit: "USD", value: 0, note: "Every release" }],
    never: ["Release funds without approval", "Change a reserve percentage"],
    audit: [...AUDIT_BASE, "hold_id", "risk_case_id", "proposed_release"],
    metrics: [...METRICS_BASE, "Holds past review date"],
    failureModes: ["Executing release before approval", "Ignoring recent disputes"],
    facts: [{ text: "Releasing a held payout is named as a step that needs a person.", source: "rt-home" }],
    expertCheck: ["Reserve and hold terms are contractual and vary by acquirer."],
  },
];

export const runbookBySlug = (slug: string) => RUNBOOKS.find((r) => r.slug === slug);

/** Generated agent spec + approval policy + mock audit entry. Pure. */
export function buildAgent(r: Runbook, values: Record<string, number>) {
  const t = r.thresholds.map((x) => ({ ...x, value: values[x.key] ?? x.value }));
  const spec = {
    name: `${r.slug}-agent`,
    job: r.title,
    trigger: r.trigger,
    queue: r.queue,
    access: { read: r.systems, write: [] as string[] },
    steps: r.steps,
    mustCite: r.evidence,
    never: r.never,
    successMeasures: r.metrics,
  };
  const policy = {
    agent: spec.name,
    default: "read-only",
    requireApproval: [
      ...r.never.filter((n) => /without approval/i.test(n)).map((n) => ({ action: n.replace(/ without approval/i, ""), when: "always" })),
      ...t.filter((x) => x.unit === "USD").map((x) => ({ action: x.label, when: `amount_usd > ${x.value}` })),
    ],
    deny: r.never.filter((n) => !/without approval/i.test(n)),
    limits: Object.fromEntries(t.filter((x) => x.unit !== "USD").map((x) => [x.key, `${x.value} ${x.unit}`])),
    approvers: ["queue owner"],
    audit: r.audit,
  };
  const audit = Object.fromEntries(
    r.audit.map((f) => [f, f === "run_id" ? "run_demo_0001" : f === "agent_version" ? "v1" : f === "approver" ? "(pending)" : f === "cost_usd" ? 0.21 : f === "duration_s" ? 64 : `<${f}>`]),
  );
  return { spec, policy, audit, thresholds: t };
}

export function runbookMarkdown(r: Runbook, cite: (id: string) => { title: string; url: string } | undefined) {
  const L = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");
  return `# ${r.title}

Illustrative runbook built from public sources. Thresholds are placeholders to be set with each customer.

## Trigger and queue
${r.trigger}

Queue: ${r.queue}

## Systems read
${L(r.systems)}

## Steps
${r.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## Evidence the agent must cite
${L(r.evidence)}

## Approval thresholds
${L(r.thresholds.map((t) => `${t.label}: ${t.value} ${t.unit} (${t.note})`))}

## The agent must never
${L(r.never)}

## Audit-trail fields
${L(r.audit.map((a) => "`" + a + "`"))}

## Metrics
${L(r.metrics)}

## Top failure modes
${L(r.failureModes)}

## Public sources
${L(r.facts.map((f) => { const s = cite(f.source); return `${f.text}${f.check ? " (Needs expert check)" : ""} Source: [${s?.title}](${s?.url})`; }))}
${r.expertCheck.length ? `\n## Needs expert check\n${L(r.expertCheck)}\n` : ""}`;
}
