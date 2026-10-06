# Build decisions

| Decision | Why | Trade-off |
| --- | --- | --- |
| Static Next.js export on GitHub Pages | No backend, no sign-in, no keys. Anyone can open it. | No shared state; each visitor's edits live in their own browser. |
| All logic in pure TypeScript modules (`src/lib`) | Scores are testable by hand calculation and identical in the UI, tests and docs. | Formulas are deliberately simple so a reader can check them. |
| Formula shown above every computed number | A payments buyer should never have to trust a black box. | Takes space at the top of each module. |
| Missing health metrics score 0 points and lower coverage, not re-weighted | Missing data is a risk signal, not a reason to look healthier. | Accounts with gaps read worse than they might be. |
| High sensitivity caps an automation at Next | Recruiting and security data should not jump the queue because of volume. | Some high-volume work waits. |
| Verdict Pass only with zero findings | A run that was slow or unexplained still needs a look. | Fewer passes on the sample. |
| Runbook thresholds are placeholders | Real limits are set per customer and per partner bank. | Numbers must be agreed before use. |
| Sourced / Assumption / Placeholder / Illustrative tags on every figure | Keeps public fact, my judgement and synthetic data visibly separate. | Visual noise; accepted. |
| One `docs/SOURCES.md` instead of `sources.md` + `SOURCES.md` | The two names collide on case-insensitive file systems. | Spec's lowercase name not used. |
| Docs generated from the same data as the app (`npm run docs:export`) | Role map, sources, runbooks and field notes cannot drift from the site. | Edit the TypeScript, not the Markdown, for those files. |
| One job-post line quoted with `[...]` | It lists specific products by name; the original is linked. | Not fully verbatim on that line. |
| Field Notes screens described in plain text, not shown as images | The three screenshots were never supplied, and recreating them would fabricate evidence. Each screen is written up from the recorded log only: what was shown, what I did, what it said. | No image placeholders on the page or in the docs. |
| Official Runtime mark from runtm.com, palette and fonts sampled from the live site | Feels native to the team reviewing it. | Clearly marked independent concept, not a Runtime product. |
| localStorage with one Reset button | Edits survive reloads; one click returns to defaults. | Per browser only. |
