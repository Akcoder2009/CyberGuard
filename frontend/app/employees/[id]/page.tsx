import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader, StatCard, DataSourceBadge } from "@/components/Primitives";
import { riskBand } from "@/lib/format";
import clsx from "clsx";
import { GraduationCap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const trainingLabel: Record<string, string> = {
  not_started: "Not started",
  assigned: "Mission assigned",
  in_progress: "In progress",
  completed: "Completed",
};

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const { data: employee, isLive } = await api.getEmployee(params.id);
  const band = riskBand(employee.risk_score);
  const hasBeforeAfter =
    employee.last_score_before !== undefined && employee.last_score_after !== undefined;

  return (
    <div>
      <PageHeader
        eyebrow={employee.department}
        title={employee.name}
        description={`${employee.role} · ${employee.email}`}
        right={<DataSourceBadge isLive={isLive} />}
      />

      <div className="px-8 py-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Current risk score"
            value={String(employee.risk_score)}
            sub={band.label}
            tone={
              band.label === "Critical" ? "critical" : band.label === "Healthy" ? "good" : "amber"
            }
          />
          <StatCard
            label="Phishing susceptibility"
            value={employee.phishing_susceptibility}
          />
          <StatCard
            label="Training status"
            value={trainingLabel[employee.training_status]}
          />
        </div>

        {hasBeforeAfter && (
          <div className="panel px-5 py-4">
            <div className="data-label mb-3">Training impact</div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="kpi-figure text-[22px] font-semibold text-critical">
                  {employee.last_score_before}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">before</div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-faint" />
              <div className="text-center">
                <div className="kpi-figure text-[22px] font-semibold text-good">
                  {employee.last_score_after}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">after</div>
              </div>
              <div className="text-[13px] text-ink-dim ml-2">
                Security score improved by{" "}
                <span className="text-good font-medium">
                  +{(employee.last_score_after ?? 0) - (employee.last_score_before ?? 0)}
                </span>{" "}
                after completing CyberRange training.
              </div>
            </div>
          </div>
        )}

        {employee.active_incident_ids.length > 0 && (
          <div className="panel px-5 py-4">
            <div className="data-label mb-3">Active incidents</div>
            {employee.active_incident_ids.map((id) => (
              <Link
                key={id}
                href={`/incidents/${id}`}
                className="text-[13px] text-signal hover:underline"
              >
                {id} →
              </Link>
            ))}
          </div>
        )}

        {employee.training_status !== "completed" && (
          <Link
            href={`/cyberrange/mission_priya_phishing_01`}
            className={clsx(
              "flex items-center justify-between px-5 py-4 rounded-md ring-1 ring-line",
              "bg-overlay hover:bg-overlay/70 transition-colors"
            )}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-signal" strokeWidth={1.75} />
              <div>
                <div className="text-[13.5px] font-medium text-ink">
                  Start CyberRange training mission
                </div>
                <div className="text-[12px] text-ink-dim">
                  Targeted at this employee&apos;s phishing susceptibility
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-faint" />
          </Link>
        )}
      </div>
    </div>
  );
}
