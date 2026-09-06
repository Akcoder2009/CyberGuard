import type {
  Incident,
  Employee,
  CopilotBriefing,
  CyberRangeMission,
  OrgRiskSnapshot,
  ContainmentAction,
} from "./types";
import {
  mockIncident,
  mockEmployee,
  mockCopilotBriefing,
  mockOrgRisk,
  mockHighRiskEmployees,
  mockMission,
} from "./mock-data";

// Every FastAPI endpoint this app expects lives in one place. When Backend
// (A), Detection (B), Incident (D) and AI (E) stand up the real routes,
// nothing outside this file needs to change.
//
// Set NEXT_PUBLIC_API_URL in .env.local, e.g.:
//   NEXT_PUBLIC_API_URL=http://localhost:8000

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiUnavailableError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiUnavailableError("NEXT_PUBLIC_API_URL is not set");
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    // Incident/risk data changes constantly during the demo; never let the
    // browser or Next.js cache a stale response.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`${path} -> HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Wraps a live call with a mock fallback so every screen still renders
 * (with a visible "demo data" badge) if the backend isn't running yet. */
async function withFallback<T>(
  live: () => Promise<T>,
  fallback: T
): Promise<{ data: T; isLive: boolean }> {
  try {
    const data = await live();
    return { data, isLive: true };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[api] falling back to mock data:", (err as Error).message);
    }
    return { data: fallback, isLive: false };
  }
}

export const api = {
  getOrgRisk: () =>
    withFallback(() => request<OrgRiskSnapshot>("/api/org/risk"), mockOrgRisk),

  getIncidents: () =>
    withFallback(() => request<Incident[]>("/api/incidents"), [mockIncident]),

  getIncident: (id: string) =>
    withFallback(() => request<Incident>(`/api/incidents/${id}`), mockIncident),

  getCopilotBriefing: (incidentId: string) =>
    withFallback(
      () => request<CopilotBriefing>(`/api/incidents/${incidentId}/copilot`),
      mockCopilotBriefing
    ),

  containIncident: (incidentId: string, action: ContainmentAction) =>
    withFallback(
      () =>
        request<{ action: ContainmentAction; contained: boolean }>(
          `/api/incidents/${incidentId}/contain`,
          { method: "POST", body: JSON.stringify({ action }) }
        ),
      { action, contained: true }
    ),

  getEmployees: () =>
    withFallback(
      () => request<Employee[]>("/api/employees"),
      mockHighRiskEmployees
    ),

  getEmployee: (id: string) =>
    withFallback(
      () => request<Employee>(`/api/employees/${id}`),
      { ...mockEmployee, id }
    ),

  getMission: (missionId: string) =>
    withFallback(
      () => request<CyberRangeMission>(`/api/cyberrange/missions/${missionId}`),
      mockMission
    ),

  submitMissionScore: (missionId: string, scoreAfter: number) =>
    withFallback(
      () =>
        request<CyberRangeMission>(
          `/api/cyberrange/missions/${missionId}/complete`,
          { method: "POST", body: JSON.stringify({ score_after: scoreAfter }) }
        ),
      { ...mockMission, status: "completed" as const, score_after: scoreAfter }
    ),
};
