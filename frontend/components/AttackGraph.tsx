"use client";

import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

type GraphNode = { id: string; label: string };
type GraphEdge = { source: string; target: string };

type AttackGraphProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export default function AttackGraph({ nodes, edges }: AttackGraphProps) {
  const flowNodes: Node[] = nodes.map((n, i) => ({
    id: n.id,
    position: { x: i * 220, y: 100 },
    data: { label: n.label },
    style: {
      background: "#1e293b",
      color: "#f87171",
      border: "1px solid #f87171",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "12px",
      width: 180,
    },
  }));

  const flowEdges: Edge[] = edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: "#f87171" },
  }));

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
        <Background color="#334155" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
