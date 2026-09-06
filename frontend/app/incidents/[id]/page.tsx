import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader, SeverityBadge, DataSourceBadge } from "@/components/Primitives";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { AttackGraph } from "@/components/AttackGraph";
import { CopilotPanel } from "@/components/CopilotPanel";
import { ContainmentPanel } from "@/components/ContainmentPanel";
import { timeAgo, eventTypeLabels } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function IncidentPage({ params }: { params: { id: string } }) {
  const [{ data: incident, isLive }, { data: briefing }] = await Promise.all([
    api.getIncident(params.id),
    api.getCopilotBriefing(params.id),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow={`Incident · ${incident.id}`}
        title={incident.title}
        description={`Entry point: ${eventTypeLabels[incident.entry_point]} · opened ${timeAgo(
          incident.created_at
        )} · assigned to `}
        right={
          <div className="flex items-center gap-2">
            <DataSourceBadge isLive={isLive} />
            <SeverityBadge severity={incident.severity} />
          </div>
        }
      />

      <div className="px-8 py-6 space-y-4">
        <p className="text-[12.5px] -mt-2 mb-2">
          <Link
            href={`/employees/${incident.employee_id}`}
            className="text-signal hover:underline"
          >
            view affected employee →
          </Link>
        </p>

        <AttackGraph nodes={incident.graph.nodes} edges={incident.graph.edges} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
          <div className="xl:col-span-1">
            <IncidentTimeline events={incident.events} />
          </div>
          <div className="xl:col-span-1">
            <CopilotPanel briefing={briefing} />
          </div>
          <div className="xl:col-span-1">
            <ContainmentPanel incidentId={incident.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
