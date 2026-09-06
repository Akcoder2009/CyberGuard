import type { Severity, EventType, ContainmentAction } from "./types";

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const severityStyles: Record<
  Severity,
  { text: string; bg: string; ring: string; label: string }
> = {
  low: { text: "text-ink-dim", bg: "bg-overlay", ring: "ring-line", label: "Low" },
  medium: { text: "text-amber", bg: "bg-amber-dim", ring: "ring-amber/30", label: "Medium" },
  high: { text: "text-amber", bg: "bg-amber-dim", ring: "ring-amber/40", label: "High" },
  critical: { text: "text-critical", bg: "bg-critical-dim", ring: "ring-critical/40", label: "Critical" },
};

export const eventTypeLabels: Record<EventType, string> = {
  phishing_email: "Phishing email",
  account_compromise: "Account compromised",
  unusual_login: "Unusual login",
  admin_api_access: "Admin API access",
  privilege_escalation: "Privilege escalation",
  database_access: "Database access",
  data_exfiltration: "Data exfiltration",
};

export const containmentActionLabels: Record<ContainmentAction, string> = {
  lock_account: "Lock account",
  revoke_sessions: "Revoke sessions",
  block_ip: "Block IP",
  restrict_api: "Restrict API access",
};

export function riskBand(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Critical", color: "text-critical" };
  if (score >= 50) return { label: "Elevated", color: "text-amber" };
  if (score >= 30) return { label: "Watch", color: "text-signal" };
  return { label: "Healthy", color: "text-good" };
}
