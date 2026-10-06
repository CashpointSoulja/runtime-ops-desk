import { chromium } from "playwright";
const base = process.argv[2] || "http://localhost:4173/runtime-ops-desk";
const out = process.argv[3] || "docs/screenshots";
const routes = ["", "seat/", "operate/", "automation/", "customers/", "runbooks/", "review/", "cadence/", "field-notes/", "sources/"];
const name = (r) => (r ? r.replace(/\/$/, "") : "start-here");
const browser = await chromium.launch();
let bad = 0;
for (const [vp, w, h] of [["desktop", 1366, 900], ["mobile", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: vp === "mobile" ? 2 : 1 });
  for (const r of routes) {
    const page = await ctx.newPage();
    const errs = [];
    const ext = new Set();
    page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    page.on("pageerror", (e) => errs.push(String(e)));
    page.on("requestfailed", (q) => errs.push("failed " + q.url()));
    page.on("request", (q) => { const u = new URL(q.url()); if (!u.host.startsWith("localhost") && !q.url().startsWith(base)) ext.add(u.host); });
    const res = await page.goto(base + "/" + r, { waitUntil: "networkidle" });
    const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const logo = await page.evaluate(() => [...document.querySelectorAll('img[alt="Runtime"]')].some((i) => i.complete && i.naturalWidth > 0 && i.getBoundingClientRect().width > 0));
    const footer = await page.evaluate(() => document.querySelector("footer")?.textContent);
    await page.screenshot({ path: `${out}/${name(r)}-${vp}.png`, fullPage: vp === "desktop" ? false : false });
    const ok = res.status() === 200 && ow <= 0 && logo && errs.length === 0 && ext.size === 0;
    if (!ok) bad++;
    console.log(`${ok ? "OK  " : "FAIL"} ${vp} /${r} status=${res.status()} overflow=${ow} logo=${logo} errors=${errs.length ? errs.join(" | ") : 0} external=${[...ext].join(",") || 0} footer=${footer === "Independent concept by Ayo Ahmed. Public information only. Not a Runtime product."}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
