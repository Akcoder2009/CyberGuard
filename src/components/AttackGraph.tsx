"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import type { AttackGraphEdge, AttackGraphNode } from "@/lib/types";
import { User, Mail, KeyRound, LogIn, Terminal, ShieldAlert, Database, UploadCloud } from "lucide-react";
import clsx from "clsx";

/**
 * AttackGraph.tsx — Goal 3 (D)
 * React Flow is the least-familiar library on the team (see onboarding
 * notes), so this file is intentionally self-contained: one custom node
 * renderer, a simple left-to-right auto-layout, and no external layout
 * library. If the chain grows beyond ~8 nodes, swap the manual x-spacing
 * below for `dagre` or `elkjs`.
 */

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  employee: User,
  phishing_email: Mail,
  account_compromise: KeyRound,
  unusual_login: LogIn,
  admin_api_access: Terminal,
  privilege_escalation: ShieldAlert,
  database_access: Database,
  data_exfiltration: UploadCloud,
  system: Database,
};

const statusStyles: Record<AttackGraphNode["status"], string> = {
  detected: "border-amber/50 bg-amber-dim text-amber",
  in_progress: "border-signal/50 bg-signal-dim text-signal",
  contained: "border-good/50 bg-good-dim text-good",
};

function AttackNode({ data }: NodeProps<{ node: AttackGraphNode }>) {
  const node = data.node;
  const Icon = iconFor[node.type] ?? Database;
  return (
    <div
      className={clsx(
        "rounded-md border px-3.5 py-2.5 w-[168px] shadow-none",
        statusStyles[node.status]
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-line !border-none" />
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-[12px] font-medium text-ink leading-tight">{node.label}</span>
      </div>
      <div className="text-[10px] font-mono mt-1 opacity-80 capitalize">
        {node.status.replace("_", " ")}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-line !border-none" />
    </div>
  );
}

const nodeTypes = { attackNode: AttackNode };

export function AttackGraph({
  nodes,
  edges,
}: {
  nodes: AttackGraphNode[];
  edges: AttackGraphEdge[];
}) {
  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((n, i) => ({
        id: n.id,
        type: "attackNode",
        position: { x: i * 210, y: i % 2 === 0 ? 40 : 130 },
        data: { node: n },
      })),
    [nodes]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        style: { stroke: "#26314A" },
        labelStyle: { fill: "#9AA7C2", fontSize: 10, fontFamily: "var(--font-plex-mono)" },
      })),
    [edges]
  );

  return (
    <div className="panel h-[280px]">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#1B2740" />
      </ReactFlow>
    </div>
  );
}
