"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import type { OrgRiskSnapshot } from "@/lib/types";

const tooltipStyle = {
  background: "#17233A",
  border: "1px solid #26314A",
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "var(--font-plex-mono)",
  color: "#E7ECF5",
};

export function RiskTrendChart({ trend }: { trend: OrgRiskSnapshot["trend"] }) {
  return (
    <div className="panel px-5 py-4">
      <div className="data-label mb-3">Org risk — 5 day trend</div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1B2740" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#5C6A88", fontSize: 11, fontFamily: "var(--font-plex-mono)" }}
            axisLine={{ stroke: "#26314A" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#5C6A88", fontSize: 11, fontFamily: "var(--font-plex-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#9AA7C2" }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#F0B858"
            strokeWidth={2}
            dot={{ r: 3, fill: "#F0B858", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentRiskChart({
  data,
}: {
  data: OrgRiskSnapshot["department_breakdown"];
}) {
  return (
    <div className="panel px-5 py-4">
      <div className="data-label mb-3">Average risk by department</div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1B2740" />
          <XAxis
            dataKey="department"
            tick={{ fill: "#5C6A88", fontSize: 11, fontFamily: "var(--font-plex-mono)" }}
            axisLine={{ stroke: "#26314A" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#5C6A88", fontSize: 11, fontFamily: "var(--font-plex-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#9AA7C2" }} />
          <Bar dataKey="avg_risk" fill="#49D3C4" radius={[3, 3, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
