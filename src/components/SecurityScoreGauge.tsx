"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { riskBand } from "@/lib/format";

export function SecurityScoreGauge({
  score,
  previousScore,
}: {
  score: number;
  previousScore?: number;
}) {
  const band = riskBand(score);
  const delta = previousScore !== undefined ? score - previousScore : undefined;
  const color =
    score >= 70 ? "#EF6461" : score >= 50 ? "#F0B858" : score >= 30 ? "#49D3C4" : "#5FD98A";

  return (
    <div className="panel px-5 py-4 flex items-center gap-5">
      <div className="relative h-[104px] w-[104px] shrink-0">
        <RadialBarChart
          width={104}
          height={104}
          cx={52}
          cy={52}
          innerRadius={38}
          outerRadius={50}
          barSize={9}
          data={[{ value: score, fill: color }]}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: "#1E2C47" }} dataKey="value" cornerRadius={6} />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="kpi-figure text-[24px] font-semibold leading-none" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <div>
        <div className="data-label">Org risk score</div>
        <div className="text-[15px] font-medium mt-1" style={{ color }}>
          {band.label}
        </div>
        {delta !== undefined && (
          <div className="text-[12px] text-ink-dim mt-0.5">
            {delta > 0 ? "+" : ""}
            {delta} vs. last snapshot
          </div>
        )}
      </div>
    </div>
  );
}
