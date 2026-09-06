import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader, StatCard, DataSourceBadge, SeverityBadge } from "@/components/Primitives";
import { SecurityScoreGauge } from "@/components/SecurityScoreGauge";
import { RiskTrendChart, DepartmentRiskChart } from "@/components/RiskCharts";
import { EmployeeRow } from "@/components/EmployeeRow";
import { timeAgo } from "@/lib/format";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [{ data: risk, isLive: riskLive }, { data: incidents }, { data: employees }] =
    await Promise.all([api.getOrgRisk(), api.getIncidents(), api.getEmployees()]);

  const sortedEmployees = [...employees].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div>
      <PageHeader
        eyebrow="Security operations"
        title="Overview"
        description="Live posture across the organization — one loop from human awareness to application-level detection."
        right={<DataSourceBadge isLive={riskLive} />}
      />

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <SecurityScoreGauge score={risk.org_risk_score} previousScore={risk.previous_score} />
          <StatCard
            label="Open incidents"
            value={String(risk.open_incidents)}
            tone={risk.open_incidents > 0 ? "critical" : "good"}
          />
          <StatCard
            label="High-risk employees"
            value={String(risk.high_risk_employees)}
            tone="amber"
          />
          <StatCard
            label="Trend (5 days)"
            value={`${risk.trend[0].score} → ${risk.trend[risk.trend.length - 1].score}`}
            sub="org risk score"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RiskTrendChart trend={risk.trend} />
          <DepartmentRiskChart data={risk.department_breakdown} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2 panel overflow-hidden">
            <div className="data-label px-5 pt-4 pb-2">Open incidents</div>
            <div className="divide-y divide-line-soft">
              {incidents.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/incidents/${incident.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-overlay/40 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-ink truncate">
                      {incident.title}
                    </div>
                    <div className="text-[11px] text-ink-faint font-mono mt-0.5">
                      opened {timeAgo(incident.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <SeverityBadge severity={incident.severity} />
                    <ChevronRight className="h-4 w-4 text-ink-faint group-hover:text-ink-dim" />
                  </div>
                </Link>
              ))}
              {incidents.length === 0 && (
                <div className="px-5 py-6 text-[13px] text-ink-dim">
                  No open incidents. All clear.
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-3 panel overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="data-label">High-risk employees</span>
              <Link href="/employees" className="text-[12px] text-signal hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-line-soft">
              {sortedEmployees.slice(0, 4).map((employee) => (
                <EmployeeRow key={employee.id} employee={employee} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
