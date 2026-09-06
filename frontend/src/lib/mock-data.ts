import type {
  Incident,
  Employee,
  CopilotBriefing,
  CyberRangeMission,
  OrgRiskSnapshot,
  SecurityEvent,
} from "./types";

// This file exists so every screen renders real, story-consistent data
// the moment `next dev` starts -- before any backend endpoint exists.
// Swap points are marked in lib/api.ts; nothing in components/ imports
// this file directly except as a fallback inside api.ts.

const now = new Date();
const at = (minsAgo: number) =>
  new Date(now.getTime() - minsAgo * 60_000).toISOString();

export const mockEmployee: Employee = {
  id: "emp_priya_nair",
  name: "Priya Nair",
  role: "Senior Account Executive",
  department: "Sales",
  email: "priya.nair@northwind-corp.io",
  risk_score: 58,
  phishing_susceptibility: "high",
  training_status: "assigned",
  last_score_before: 58,
  active_incident_ids: ["inc_2026_0914"],
};

const events: SecurityEvent[] = [
  {
    id: "evt_1",
    incident_id: "inc_2026_0914",
    type: "phishing_email",
    timestamp: at(94),
    employee_id: "emp_priya_nair",
    description:
      "Priya opened an email impersonating IT Support and submitted her credentials on a spoofed login page.",
    severity: "medium",
    contained: false,
  },
  {
    id: "evt_2",
    incident_id: "inc_2026_0914",
    type: "account_compromise",
    timestamp: at(91),
    employee_id: "emp_priya_nair",
    description: "Credentials reused within minutes from an unrecognized network.",
    severity: "medium",
    contained: false,
  },
  {
    id: "evt_3",
    incident_id: "inc_2026_0914",
    type: "unusual_login",
    timestamp: at(89),
    employee_id: "emp_priya_nair",
    source_ip: "185.220.101.47",
    description: "Login from a new IP and device fingerprint, 6,200km from her last session.",
    severity: "high",
    contained: false,
  },
  {
    id: "evt_4",
    incident_id: "inc_2026_0914",
    type: "admin_api_access",
    timestamp: at(85),
    employee_id: "emp_priya_nair",
    description: "Session issued an admin-scoped API token Priya's role does not normally use.",
    severity: "high",
    contained: false,
  },
  {
    id: "evt_5",
    incident_id: "inc_2026_0914",
    type: "privilege_escalation",
    timestamp: at(80),
    employee_id: "emp_priya_nair",
    description: "Admin token used to grant the session read access to the customer database.",
    severity: "critical",
    contained: false,
  },
  {
    id: "evt_6",
    incident_id: "inc_2026_0914",
    type: "database_access",
    timestamp: at(76),
    employee_id: "emp_priya_nair",
    description: "Bulk read of the customer records table, well outside Priya's normal query pattern.",
    severity: "critical",
    contained: false,
  },
  {
    id: "evt_7",
    incident_id: "inc_2026_0914",
    type: "data_exfiltration",
    timestamp: at(72),
    employee_id: "emp_priya_nair",
    description: "412MB transferred to an external storage endpoint over HTTPS.",
    severity: "critical",
    contained: false,
  },
];

export const mockIncident: Incident = {
  id: "inc_2026_0914",
  title: "Customer database exfiltration via compromised Sales account",
  severity: "critical",
  status: "open",
  created_at: events[0].timestamp,
  updated_at: events[events.length - 1].timestamp,
  employee_id: "emp_priya_nair",
  entry_point: "phishing_email",
  affected_systems: ["Auth Service", "Internal Admin API", "Customer Database"],
  events,
  graph: {
    nodes: [
      { id: "n_employee", label: "Priya Nair", type: "employee", status: "detected" },
      { id: "n_phish", label: "Phishing email opened", type: "phishing_email", status: "detected", timestamp: events[0].timestamp },
      { id: "n_compromise", label: "Account compromised", type: "account_compromise", status: "detected", timestamp: events[1].timestamp },
      { id: "n_login", label: "Unusual login", type: "unusual_login", status: "detected", timestamp: events[2].timestamp },
      { id: "n_api", label: "Admin API access", type: "admin_api_access", status: "detected", timestamp: events[3].timestamp },
      { id: "n_privesc", label: "Privilege escalation", type: "privilege_escalation", status: "detected", timestamp: events[4].timestamp },
      { id: "n_db", label: "Database access", type: "database_access", status: "detected", timestamp: events[5].timestamp },
      { id: "n_exfil", label: "Data exfiltration", type: "data_exfiltration", status: "detected", timestamp: events[6].timestamp },
    ],
    edges: [
      { id: "e1", source: "n_employee", target: "n_phish" },
      { id: "e2", source: "n_phish", target: "n_compromise" },
      { id: "e3", source: "n_compromise", target: "n_login" },
      { id: "e4", source: "n_login", target: "n_api" },
      { id: "e5", source: "n_api", target: "n_privesc" },
      { id: "e6", source: "n_privesc", target: "n_db" },
      { id: "e7", source: "n_db", target: "n_exfil" },
    ],
  },
};

export const mockCopilotBriefing: CopilotBriefing = {
  incident_id: "inc_2026_0914",
  summary:
    "Priya Nair's account was compromised through a phishing email, then used to reach the admin API, escalate privileges, and pull a large volume of customer records to an external destination.",
  why_critical:
    "Customer records left the environment. This is a confirmed exfiltration, not a contained attempt, and the access path bypassed normal role boundaries for a Sales account.",
  likely_entry_point: "Phishing email impersonating IT Support, opened by Priya Nair.",
  affected_systems: ["Auth Service", "Internal Admin API", "Customer Database"],
  recommended_actions: ["lock_account", "revoke_sessions", "block_ip", "restrict_api"],
  generated_at: at(70),
};

export const mockOrgRisk: OrgRiskSnapshot = {
  org_risk_score: 71,
  previous_score: 54,
  open_incidents: 1,
  high_risk_employees: 4,
  trend: [
    { date: "Mon", score: 49 },
    { date: "Tue", score: 51 },
    { date: "Wed", score: 50 },
    { date: "Thu", score: 54 },
    { date: "Fri", score: 71 },
  ],
  department_breakdown: [
    { department: "Sales", avg_risk: 66 },
    { department: "Engineering", avg_risk: 31 },
    { department: "Finance", avg_risk: 44 },
    { department: "Support", avg_risk: 38 },
  ],
};

export const mockHighRiskEmployees: Employee[] = [
  mockEmployee,
  {
    id: "emp_daniel_ross",
    name: "Daniel Ross",
    role: "Account Manager",
    department: "Sales",
    email: "daniel.ross@northwind-corp.io",
    risk_score: 61,
    phishing_susceptibility: "medium",
    training_status: "not_started",
    active_incident_ids: [],
  },
  {
    id: "emp_maya_chen",
    name: "Maya Chen",
    role: "Support Lead",
    department: "Support",
    email: "maya.chen@northwind-corp.io",
    risk_score: 47,
    phishing_susceptibility: "medium",
    training_status: "completed",
    last_score_before: 60,
    last_score_after: 88,
    active_incident_ids: [],
  },
  {
    id: "emp_leo_ferrer",
    name: "Leo Ferrer",
    role: "Finance Analyst",
    department: "Finance",
    email: "leo.ferrer@northwind-corp.io",
    risk_score: 44,
    phishing_susceptibility: "low",
    training_status: "not_started",
    active_incident_ids: [],
  },
];

export const mockMission: CyberRangeMission = {
  id: "mission_priya_phishing_01",
  employee_id: "emp_priya_nair",
  title: "Spotting spoofed IT Support emails",
  scenario:
    "You receive an email from 'IT-Support@northwind-corp-help.io' asking you to verify your password before a system migration tonight.",
  status: "assigned",
  score_before: 58,
  questions: [
    {
      id: "q1",
      prompt: "What's the first sign this email might not be legitimate?",
      choices: [
        "The sender domain looks close to, but not exactly, the real company domain",
        "The email uses your first name",
        "It was sent during business hours",
        "It has a company logo in the header",
      ],
      correct_index: 0,
      explanation:
        "Lookalike domains (an extra word, a swapped letter, a different TLD) are one of the most common phishing tells. Real IT communications come from the verified corporate domain.",
    },
    {
      id: "q2",
      prompt: "The email asks you to confirm your password by replying directly. What should you do?",
      choices: [
        "Reply with your password since it's urgent",
        "Never send a password over email; report the message to security instead",
        "Change your password to something similar and send that",
        "Ignore it and delete it without telling anyone",
      ],
      correct_index: 1,
      explanation:
        "No legitimate IT team will ever ask for your password over email. Reporting it (rather than just deleting it) lets security block the sender for everyone else too.",
    },
    {
      id: "q3",
      prompt: "You already clicked the link and entered your credentials before realizing something was off. What's the right next step?",
      choices: [
        "Wait and see if anything happens",
        "Change your password on other sites where you reused it, eventually",
        "Immediately report it to security so your account can be secured, then change your password",
        "Do nothing since it was probably fine",
      ],
      correct_index: 2,
      explanation:
        "Speed matters. Reporting immediately lets the security team lock the account and revoke sessions before an attacker can act on the stolen credentials.",
    },
  ],
};
