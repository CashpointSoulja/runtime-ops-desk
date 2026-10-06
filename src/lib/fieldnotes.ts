export const FIELD_LOG = [
  "Signed in with GitHub (read-only email and profile permission). It landed me on a Quickstart with three steps: create an organization, invite teammates, set up a first agent. A progress bar ran across the top and a side panel filled in as I answered.",
  "Created a workspace and skipped invites. The Skip button opened an invite modal first, which I had to cancel and then skip again. Small friction.",
  "Answered four short questions. What do you do: Ops. What should it take off your plate first: \"Triage inbound requests\". Where do requests live: skipped, nothing connected. Where should the agent live: the Runtime dashboard.",
  "It proposed an \"Ops Request Triage Agent\" with a plain-English summary and a \"Set this up (~10 min)\" button. It finished in about 2 minutes.",
  "A setup agent asked for one real inbound request to run a live triage before anything was connected. I pasted a test request I wrote myself, labelled as a test: 14 stuck merchant payouts, about 38,400 USD, books close Friday.",
  "The triage came back with a category (settlement/reconciliation mismatch), urgency High with reasons, a suggested owner, key facts, what needs approval (any ledger correction or re-issued payout needs finance sign-off), and a drafted first reply asking for the settlement batch ID, the 14 payout IDs and the system of record.",
  "When the setup agent tried to verify the dashboard connection it hit an API authentication error (\"No key\" in the session footer) and told me to check or rotate the API key in Settings. The flow still declared the agent \"Live\".",
];

export const OBSERVATIONS = [
  "Time to a working triage agent was minutes.",
  "The setup is conversational.",
  "Nothing was connected, so the agent only knew what I pasted, and it said so.",
  "Approvals were flagged but not enforced, because no policy existed yet.",
  "The first-run path never asked about approval thresholds, audit trail, or spend limits: the things a payments buyer cares about most.",
];

export const SUGGESTIONS = [
  { title: "Surface the API-key state before saying Live", why: "Make Live depend on a passing connection check. If the key fails, show Draft with the reason and a link to Settings." },
  { title: "Offer a payments-ops starter template", why: "One click for stuck payouts and refund approval, with the approval step and evidence list already filled in." },
  { title: "Ask for an approval threshold during setup", why: "One question: above what amount should a person approve? The triage already knew a ledger correction needs finance sign-off; let the user turn that into a rule." },
  { title: "Show the audit trail on the first run", why: "Open the stored run next to the triage result so a buyer sees the record their bank or auditor would ask for." },
  { title: "Ask for a spend limit up front", why: "A default monthly budget for the agent, shown during setup, answers the cost question before it is asked." },
  { title: "Make Skip on invites skip", why: "Skip should not open the invite modal. One click, no cancel." },
];

export const SHOTS = ["01-quickstart-first-agent-setup.png", "02-agent-drafted-ready-to-build.png", "03-first-run-triage-and-api-key-error.png"];
