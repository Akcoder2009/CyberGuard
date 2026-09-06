import { api } from "@/lib/api";
import { PageHeader, DataSourceBadge } from "@/components/Primitives";
import { EmployeeRow } from "@/components/EmployeeRow";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const { data: employees, isLive } = await api.getEmployees();
  const sorted = [...employees].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div>
      <PageHeader
        eyebrow="Human loop"
        title="Employees"
        description="Risk scores reflect phishing susceptibility, recent incident involvement, and training progress."
        right={<DataSourceBadge isLive={isLive} />}
      />
      <div className="px-8 py-6">
        <div className="panel overflow-hidden">
          <div className="divide-y divide-line-soft">
            {sorted.map((employee) => (
              <EmployeeRow key={employee.id} employee={employee} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
