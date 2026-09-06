import clsx from "clsx";
import type { Severity } from "@/lib/types";
import { severityStyles } from "@/lib/format";

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 px-8 pt-8 pb-6 border-b border-line-soft">
      <div>
        {eyebrow && (
          <div className="data-label mb-1.5">{eyebrow}</div>
        )}
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 text-[13.5px] text-ink-dim max-w-2xl">{description}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = severityStyles[severity];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium ring-1",
        s.text,
        s.bg,
        s.ring
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", s.text.replace("text-", "bg-"))} />
      {s.label}
    </span>
  );
}

export function DataSourceBadge({ isLive }: { isLive: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-mono",
        isLive
          ? "text-good bg-good-dim ring-1 ring-good/30"
          : "text-ink-faint bg-overlay ring-1 ring-line"
      )}
      title={
        isLive
          ? "Rendering live data from the backend API"
          : "Backend unreachable — showing demo data so the UI still works"
      }
    >
      <span
        className={clsx(
          "h-1.5 w-1.5 rounded-full",
          isLive ? "bg-good animate-pulse-slow" : "bg-ink-faint"
        )}
      />
      {isLive ? "live" : "demo data"}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "critical" | "good" | "amber";
}) {
  const toneClass = {
    default: "text-ink",
    critical: "text-critical",
    good: "text-good",
    amber: "text-amber",
  }[tone];

  return (
    <div className="panel px-5 py-4">
      <div className="data-label">{label}</div>
      <div className={clsx("kpi-figure text-[28px] font-semibold mt-1.5", toneClass)}>
        {value}
      </div>
      {sub && <div className="text-[12px] text-ink-dim mt-1">{sub}</div>}
    </div>
  );
}
