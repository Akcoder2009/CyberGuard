// app/incidents/[id]/page.tsx
"use client";
import AttackGraph from "@/components/AttackGraph";
import { mockIncident } from "@/lib/mockIncident";

export default function IncidentPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">{mockIncident.title}</h1>
      <AttackGraph
        nodes={mockIncident.graph.nodes}
        edges={mockIncident.graph.edges}
      />
    </div>
  );
}
