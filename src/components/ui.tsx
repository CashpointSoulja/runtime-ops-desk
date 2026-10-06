"use client";
import { useEffect, useState } from "react";
import { sourceById } from "@/lib/sources";

const PREFIX = "rod:";
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${p}`;

export function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
  }, [key]);
  const set = (n: T | ((p: T) => T)) =>
    setV((prev) => {
      const next = typeof n === "function" ? (n as (p: T) => T)(prev) : n;
      try { localStorage.setItem(PREFIX + key, JSON.stringify(next)); } catch {}
      return next;
    });
  return [v, set];
}

export function resetAll() {
  Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
  location.reload();
}

export const Illustrative = () => <span className="tag illus" title="Synthetic demo data">Illustrative data</span>;

export function Kind({ kind, source }: { kind: "Sourced" | "Estimated" | "Placeholder" | "Assumption" | "Unverified"; source?: string }) {
  const s = source ? sourceById(source) : undefined;
  if (s) return <a className={`tag ${kind}`} href={s.url} target="_blank" rel="noreferrer" title={s.title}>{kind} ↗</a>;
  return <span className={`tag ${kind}`}>{kind}</span>;
}

export function Src({ id, children }: { id: string; children?: React.ReactNode }) {
  const s = sourceById(id);
  if (!s) return null;
  return <a href={s.url} target="_blank" rel="noreferrer">{children || s.title}</a>;
}

export function Num({ label, value, onChange, kind, source, step = 1, min = 0, max }: { label: string; value: number; onChange: (n: number) => void; kind: "Sourced" | "Estimated" | "Placeholder"; source?: string; step?: number; min?: number; max?: number }) {
  return (
    <label className="field">
      <span className="lab">{label} <Kind kind={kind} source={source} /></span>
      <input type="number" value={value} step={step} min={min} max={max} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
    </label>
  );
}

export function download(name: string, text: string, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function PageHead({ eyebrow, title, lede, illustrative }: { eyebrow: string; title: string; lede: string; illustrative?: boolean }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="eyebrow">{eyebrow} {illustrative && <Illustrative />}</div>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
    </div>
  );
}

export const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 })}`;
