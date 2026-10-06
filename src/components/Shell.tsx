"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asset, resetAll } from "./ui";

const NAV: { group: string; items: { href: string; label: string; k?: string }[] }[] = [
  { group: "Start", items: [{ href: "/", label: "Start Here" }, { href: "/seat/", label: "Seat map" }, { href: "/operate/", label: "Operate" }] },
  { group: "Modules", items: [
    { href: "/automation/", label: "Automation Map", k: "A" },
    { href: "/customers/", label: "Customer Desk", k: "B" },
    { href: "/runbooks/", label: "Runbook Library", k: "C" },
    { href: "/review/", label: "Run Review", k: "D" },
    { href: "/cadence/", label: "Operating Cadence", k: "E" },
  ] },
  { group: "Notes", items: [{ href: "/field-notes/", label: "Field Notes" }, { href: "/sources/", label: "Sources" }] },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  const active = (href: string) => (href === "/" ? norm(path) === "/" : norm(path).startsWith(href));
  return (
    <div className="app">
      <a href="#main" className="skip">Skip to content</a>
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Runtime Ops Desk home"><img src={asset("/brand/runtm-logo-dark.svg")} alt="Runtime" /><span>Runtime</span></Link>
        <button className="btn" aria-expanded={open} aria-controls="rail" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </header>
      <aside id="rail" className={`rail${open ? " open" : ""}`}>
        <Link href="/" className="logo brand" aria-label="Runtime Ops Desk home"><img src={asset("/brand/runtm-logo-dark.svg")} alt="Runtime" /><span>Runtime</span></Link>
        <div className="mono small muted" style={{ marginTop: -8 }}>Ops Desk · concept</div>
        <nav aria-label="Main">
          {NAV.map((g) => (
            <div key={g.group} style={{ display: "contents" }}>
              <div className="group">{g.group}</div>
              {g.items.map((i) => (
                <Link key={i.href} href={i.href} aria-current={active(i.href) ? "page" : undefined}>
                  <span className="k">{i.k || ""}</span>{i.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="spacer" />
        <button className="btn" onClick={() => { if (confirm("Reset all edits saved in this browser?")) resetAll(); }}>Reset saved state</button>
      </aside>
      <div className="main">
        <main id="main" className="content">{children}</main>
        <footer className="footer">Independent concept by Ayo Ahmed. Public information only. Not a Runtime product.</footer>
      </div>
    </div>
  );
}
