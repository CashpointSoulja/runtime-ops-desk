# Field notes

Same content as the [Field Notes page](https://cashpointsoulja.github.io/runtime-ops-desk/field-notes/) and [FIRST-HAND-USAGE.md](FIRST-HAND-USAGE.md).

Signed up on the free plan (500 credits, no card) on 6 Oct 2026 and went through onboarding end to end. First person, in order, only what happened.

## Headline

The setup agent's API check failed with "No key" while the flow still said the agent was Live.

**Proposed fix:** make Live depend on a passing connection check. If the key fails, show Draft with the reason and a link to Settings.

## Log, 6 Oct 2026

1. Signed in with GitHub (read-only email and profile permission). It landed me on a Quickstart with three steps: create an organization, invite teammates, set up a first agent. A progress bar ran across the top and a side panel filled in as I answered.
2. Created a workspace and skipped invites. The Skip button opened an invite modal first, which I had to cancel and then skip again. Small friction.
3. Answered four short questions. What do you do: Ops. What should it take off your plate first: "Triage inbound requests". Where do requests live: skipped, nothing connected. Where should the agent live: the Runtime dashboard.
4. It proposed an "Ops Request Triage Agent" with a plain-English summary and a "Set this up (~10 min)" button. It finished in about 2 minutes.
5. A setup agent asked for one real inbound request to run a live triage before anything was connected. I pasted a test request I wrote myself, labelled as a test: 14 stuck merchant payouts, about 38,400 USD, books close Friday.
6. The triage came back with a category (settlement/reconciliation mismatch), urgency High with reasons, a suggested owner, key facts, what needs approval (any ledger correction or re-issued payout needs finance sign-off), and a drafted first reply asking for the settlement batch ID, the 14 payout IDs and the system of record.
7. When the setup agent tried to verify the dashboard connection it hit an API authentication error ("No key" in the session footer) and told me to check or rotate the API key in Settings. The flow still declared the agent "Live".

## What I noticed

- Time to a working triage agent was minutes.
- The setup is conversational.
- Nothing was connected, so the agent only knew what I pasted, and it said so.
- Approvals were flagged but not enforced, because no policy existed yet.
- The first-run path never asked about approval thresholds, audit trail, or spend limits: the things a payments buyer cares about most.

## What I would change

1. **Surface the API-key state before saying Live.** Make Live depend on a passing connection check. If the key fails, show Draft with the reason and a link to Settings.
2. **Offer a payments-ops starter template.** One click for stuck payouts and refund approval, with the approval step and evidence list already filled in.
3. **Ask for an approval threshold during setup.** One question: above what amount should a person approve? The triage already knew a ledger correction needs finance sign-off; let the user turn that into a rule.
4. **Show the audit trail on the first run.** Open the stored run next to the triage result so a buyer sees the record their bank or auditor would ask for.
5. **Ask for a spend limit up front.** A default monthly budget for the agent, shown during setup, answers the cost question before it is asked.
6. **Make Skip on invites skip.** Skip should not open the invite modal. One click, no cancel.

## Screenshots

Not yet supplied. The app keeps a labelled empty slot for each rather than recreating them:

- `01-quickstart-first-agent-setup.png`
- `02-agent-drafted-ready-to-build.png`
- `03-first-run-triage-and-api-key-error.png`

## What this is not

One session, one test request I wrote myself, nothing connected. It says nothing about how Runtime behaves with connected tools or real customer data.
