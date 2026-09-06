import { api } from "@/lib/api";
import { PageHeader, DataSourceBadge } from "@/components/Primitives";
import { MissionQuiz } from "@/components/MissionQuiz";

export const dynamic = "force-dynamic";

export default async function MissionPage({ params }: { params: { missionId: string } }) {
  const { data: mission, isLive } = await api.getMission(params.missionId);

  return (
    <div>
      <PageHeader
        eyebrow="CyberRange"
        title={mission.title}
        description={mission.scenario}
        right={<DataSourceBadge isLive={isLive} />}
      />
      <div className="px-8 py-6 max-w-xl">
        <MissionQuiz mission={mission} />
      </div>
    </div>
  );
}
