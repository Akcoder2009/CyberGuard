import Link from "next/link";
import clsx from "clsx";
import type { Employee } from "@/lib/types";
import { riskBand } from "@/lib/format";
import { ChevronRight } from "lucide-react";

const susceptibilityStyle: Record<Employee["phishing_susceptibility"], string> = {
  low: "text-good",
  medium: "text-amber",
  high: "text-critical",
};

const trainingLabel: Record<Employee["training_status"], string> = {
  not_started: "Not started",
  assigned: "Mission assigned",
  in_progress: "In progress",
  completed: "Completed",
};

export function EmployeeRow({ employee }: { employee: Employee }) {
  const band = riskBand(employee.risk_score);
  return (
    <Link
      href={`/employees/${employee.id}`}
      className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-overlay/40 transition-colors group"
    >
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium text-ink truncate">{employee.name}</div>
        <div className="text-[12px] text-ink-dim truncate">
          {employee.role} · {employee.department}
        </div>
      </div>

      <div className="hidden sm:block text-[12px] font-mono shrink-0 w-32">
        <span className={susceptibilityStyle[employee.phishing_susceptibility]}>
          {employee.phishing_susceptibility} susceptibility
        </span>
      </div>

      <div className="hidden md:block text-[12px] text-ink-dim shrink-0 w-32">
        {trainingLabel[employee.training_status]}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className={clsx("kpi-figure text-[15px] font-semibold", band.color)}>
            {employee.risk_score}
          </div>
          <div className="text-[10px] text-ink-faint">{band.label}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-ink-faint group-hover:text-ink-dim" />
      </div>
    </Link>
  );
}
