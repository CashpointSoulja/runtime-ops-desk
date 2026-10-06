import { mkdirSync, writeFileSync } from "fs";
import { RUNBOOKS, runbookMarkdown } from "../src/lib/runbooks";
import { SOURCES, sourceById } from "../src/lib/sources";
import { SEAT_ROWS, NOT_SHOWN, JOB_URL } from "../src/lib/seat";
import { RUNGS, type Claim } from "../src/lib/operate";
import { NINETY } from "../src/lib/ninety";
import { FIELD_LOG, OBSERVATIONS, SUGGESTIONS, SCREENS } from "../src/lib/fieldnotes";

const SITE = "https://cashpointsoulja.github.io/runtime-ops-desk";
const cite = (id: string) => sourceById(id);
const claim = (c: Claim) => {
  const s = c.source ? cite(c.source) : undefined;
  return c.kind === "Sourced" && s ? `${c.text} (Sourced: [${s.title}](${s.url}))` : `${c.text} (Assumption)`;
};

mkdirSync("docs/runbooks", { recursive: true });
RUNBOOKS.forEach((r, i) => writeFileSync(`docs/runbooks/${String(i + 1).padStart(2, "0")}-${r.slug}.md`, runbookMarkdown(r, cite)));

const unverified = (s: { supports: string }) => /not re-verified|blocked automated reading|Needs expert check/i.test(s.supports);
writeFileSync("docs/SOURCES.md", [
  "# Sources",
  "",
  "Every public source the app and docs rely on. This one file replaces the lowercase `sources.md` named in the spec (the two names collide on case-insensitive file systems). Rows marked **Unverified** could not be re-read signed out; anything resting on them is labelled in the app.",
  "",
  "Generated from `src/lib/sources.ts` by `npm run docs:export`, so the app's Sources page and this file never drift.",
  "",
  "| Id | Source | What it supports | Status |",
  "| --- | --- | --- | --- |",
  ...SOURCES.map((s) => `| ${s.id} | [${s.title}](${s.url}) | ${s.supports.replace(/\|/g, "/")} | ${unverified(s) ? "**Unverified**" : "Read"} |`),
  "",
].join("\n"));

writeFileSync("docs/ROLE-MAP.md", [
  "# Role map",
  "",
  `Each line of the public [Founding AI Ops job post](${JOB_URL}) mapped to the artifact in this app that shows it. Artifacts, not biography. Live page: [${SITE}/seat/](${SITE}/seat/).`,
  "",
  "One line is quoted with an elision `[...]` where the post lists specific products by name; the original is at the link above.",
  "",
  "| Section | Job post line | Module | Artifact |",
  "| --- | --- | --- | --- |",
  ...SEAT_ROWS.map((r) => `| ${r.section} | "${r.line}" | [${r.module}](${SITE}${r.href}) | ${r.artifact} |`),
  "",
  "## Not shown here",
  "",
  "| Line | Why not |",
  "| --- | --- |",
  ...NOT_SHOWN.map((n) => `| ${n.line} | ${n.why} |`),
  "",
  "## Rollout ladder (from /operate)",
  "",
  ...RUNGS.flatMap((r) => [
    `### Rung ${r.n}: ${r.name}`,
    "",
    `- First agent: ${claim(r.firstAgent)}`,
    `- Human sign-off: ${claim(r.signOff)}`,
    `- Proof metric: ${claim(r.proof)}`,
    `- Failure to watch: ${claim(r.failure)}`,
    `- Runbook: ${r.runbook ? `[${r.runbook.title}](${SITE}/runbooks/?rb=${r.runbook.slug})` : "None yet"}`,
    ...(r.note ? [`- Note: ${claim(r.note)}`] : []),
    "",
  ]),
].join("\n"));

writeFileSync("docs/FIRST-90-DAYS.md", [
  "# First 90 days",
  "",
  `The plan shown in [Operating Cadence](${SITE}/cadence/). Every outcome is measurable; every target is a proposal, not a Runtime commitment.`,
  "",
  ...NINETY.flatMap((p) => [`## ${p.phase}`, "", "| Do | Measured by |", "| --- | --- |", ...p.items.map((i) => `| ${i.what} | ${i.measure} |`), ""]),
  "## How each item maps to a module",
  "",
  `- Five internal agents: [Automation Map](${SITE}/automation/) build order, weeks 1 to 4.`,
  `- First health review: [Customer Desk](${SITE}/customers/) health model and weekly actions.`,
  `- First board update: [Operating Cadence](${SITE}/cadence/) board update builder.`,
  `- First product feedback cycle: [Run Review](${SITE}/review/) Friction Log and weekly digest.`,
  `- Renewal briefs: [Customer Desk](${SITE}/customers/) QBR brief export.`,
  "",
].join("\n"));

const usage = [
  "Signed up on the free plan (500 credits, no card) on 6 Oct 2026 and went through onboarding end to end. First person, in order, only what happened.",
  "",
  "## Headline",
  "",
  "The setup agent's API check failed with \"No key\" while the flow still said the agent was Live.",
  "",
  "**Proposed fix:** make Live depend on a passing connection check. If the key fails, show Draft with the reason and a link to Settings.",
  "",
  "## Log, 6 Oct 2026",
  "",
  ...FIELD_LOG.map((l, i) => `${i + 1}. ${l}`),
  "",
  "## What I noticed",
  "",
  ...OBSERVATIONS.map((o) => `- ${o}`),
  "",
  "## What I would change",
  "",
  ...SUGGESTIONS.map((s, i) => `${i + 1}. **${s.title}.** ${s.why}`),
  "",
  "## The three screens, in words",
  "",
  ...SCREENS.flatMap((s) => [`### ${s.title}`, "", `- Shown: ${s.shown}`, `- What I did: ${s.did}`, `- What it said: ${s.said}`, ""]),
  "## What this is not",
  "",
  "One session, one test request I wrote myself, nothing connected. It says nothing about how Runtime behaves with connected tools or real customer data.",
  "",
];
writeFileSync("docs/FIRST-HAND-USAGE.md", ["# First-hand usage", "", ...usage].join("\n"));
writeFileSync("docs/field-notes.md", ["# Field notes", "", `Same content as the [Field Notes page](${SITE}/field-notes/) and [FIRST-HAND-USAGE.md](FIRST-HAND-USAGE.md).`, "", ...usage].join("\n"));
console.log(`wrote ${RUNBOOKS.length} runbooks, SOURCES, ROLE-MAP, FIRST-90-DAYS, FIRST-HAND-USAGE, field-notes`);
