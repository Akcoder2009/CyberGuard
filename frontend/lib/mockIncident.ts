//Hard coded data, will be integrated with backend later

export const mockIncident = {
  id: "mock-1",
  title: "Suspected account compromise - Jane Doe",
  status: "open",
  severity: "critical",
  employee: {
    id: "e1",
    name: "Jane Doe",
    department: "Finance",
  },
  timeline: [
    { event_type: "phishing_click", created_at: "2026-09-06T10:00:00Z" },
    { event_type: "unusual_login", created_at: "2026-09-06T10:02:00Z" },
    { event_type: "admin_api_access", created_at: "2026-09-06T10:05:00Z" },
    { event_type: "privilege_escalation", created_at: "2026-09-06T10:06:00Z" },
    { event_type: "db_access", created_at: "2026-09-06T10:07:00Z" },
    { event_type: "data_download", created_at: "2026-09-06T10:08:00Z" },
  ],
  graph: {
    nodes: [
      { id: "n1", label: "Phishing Email" },
      { id: "n2", label: "Account Compromise" },
      { id: "n3", label: "Unusual Login" },
      { id: "n4", label: "Admin API Access" },
      { id: "n5", label: "Privilege Escalation" },
      { id: "n6", label: "Database Access" },
      { id: "n7", label: "Data Exfiltration" },
    ],
    edges: [
      { source: "n1", target: "n2" },
      { source: "n2", target: "n3" },
      { source: "n3", target: "n4" },
      { source: "n4", target: "n5" },
      { source: "n5", target: "n6" },
      { source: "n6", target: "n7" },
    ],
  },
  containment_actions: ["lock_account", "revoke_sessions", "block_ip", "restrict_api"],
};