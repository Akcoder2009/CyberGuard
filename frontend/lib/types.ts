// Shared types mirroring the FastAPI/Pydantic response models.
// Keep this file in sync with the backend schemas (Goal 1 / Goal 2 / Goal 3).

export type Severity = "low" | "medium" | "high" | "critical";
export type EventType =
  | "phishing_email"
  | "account_compromise"
  | "unusual_login"
  | "admin_api_access"
  | "privilege_escalation"
  | "database_access"
  | "data_exfiltration";

export type ContainmentAction =
  | "lock_account"
  | "revoke_sessions"
  | "block_ip"
  | "restrict_api";

export interface SecurityEvent {
  id: string;
  incident_id: string;
  type: EventType;
  timestamp: string; // ISO 8601
  employee_id: string;
  source_ip?: string;
  description: string;
  severity: Severity;
  contained: boolean;
}

export interface AttackGraphNode {
  id: string;
  label: string;
  type: EventType | "employee" | "system";
  status: "detected" | "in_progress" | "contained";
  timestamp?: string;
}

export interface AttackGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: "open" | "contained" | "resolved";
  created_at: string;
  updated_at: string;
  employee_id: string;
  entry_point: EventType;
  affected_systems: string[];
  events: SecurityEvent[];
  graph: { nodes: AttackGraphNode[]; edges: AttackGraphEdge[] };
}

export interface CopilotBriefing {
  incident_id: string;
  summary: string;
  why_critical: string;
  likely_entry_point: string;
  affected_systems: string[];
  recommended_actions: ContainmentAction[];
  generated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  risk_score: number; // 0-100
  phishing_susceptibility: "low" | "medium" | "high";
  training_status: "not_started" | "assigned" | "in_progress" | "completed";
  last_score_before?: number;
  last_score_after?: number;
  active_incident_ids: string[];
}

export interface CyberRangeQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correct_index: number;
  explanation: string;
}

export interface CyberRangeMission {
  id: string;
  employee_id: string;
  title: string;
  scenario: string;
  questions: CyberRangeQuestion[];
  status: "assigned" | "in_progress" | "completed";
  score_before: number;
  score_after?: number;
}

export interface OrgRiskSnapshot {
  org_risk_score: number; // 0-100, lower is better
  previous_score: number;
  open_incidents: number;
  high_risk_employees: number;
  trend: { date: string; score: number }[];
  department_breakdown: { department: string; avg_risk: number }[];
}
