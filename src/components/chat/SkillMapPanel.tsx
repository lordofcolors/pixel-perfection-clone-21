import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const skillNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">Getting Started with Jump Rope</div>
          <div className="text-xs text-muted-foreground mt-1">An introduction to jump rope, including its benefits and basic…</div>
        </div>
      ),
    },
    style: {
      background: "hsl(222 47% 11%)",
      border: "1px solid hsl(215 25% 27%)",
      borderRadius: "12px",
      padding: "16px",
      width: 260,
      boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
    },
  },
  {
    id: "2",
    position: { x: 250, y: 130 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">Basic Techniques</div>
          <div className="text-xs text-muted-foreground mt-1">Learn the fundamental jump rope techniques, including basic jumps…</div>
        </div>
      ),
    },
    style: {
      background: "hsl(222 47% 11%)",
      border: "1px solid hsl(215 25% 27%)",
      borderRadius: "12px",
      padding: "16px",
      width: 260,
      boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
    },
  },
  {
    id: "3",
    position: { x: 250, y: 260 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">Choosing the Right Rope</div>
          <div className="text-xs text-muted-foreground mt-1">Understand how to select the appropriate jump rope based on…</div>
        </div>
      ),
    },
    style: {
      background: "hsl(222 47% 11%)",
      border: "1px solid hsl(215 25% 27%)",
      borderRadius: "12px",
      padding: "16px",
      width: 260,
      boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
    },
  },
  {
    id: "4",
    position: { x: 250, y: 390 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">Single Bounce</div>
          <div className="text-xs text-muted-foreground mt-1">Master the single bounce, a fundamental jump rope technique…</div>
        </div>
      ),
    },
    style: {
      background: "hsl(222 47% 11%)",
      border: "1px solid hsl(215 25% 27%)",
      borderRadius: "12px",
      padding: "16px",
      width: 260,
      boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
    },
  },
  {
    id: "5",
    position: { x: 250, y: 520 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">Alternate Foot Step</div>
          <div className="text-xs text-muted-foreground mt-1">Learn the alternate foot step to add variety and challenge to your jum…</div>
        </div>
      ),
    },
    style: {
      background: "hsl(222 47% 11%)",
      border: "1px solid hsl(215 25% 27%)",
      borderRadius: "12px",
      padding: "16px",
      width: 260,
      boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
    },
  },
  {
    id: "6",
    position: { x: 250, y: 650 },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">Rope Materials</div>
          <div className="text-xs text-muted-foreground mt-1">Explore different materials used in jump ropes and their impact on…</div>
        </div>
      ),
    },
    style: {
      background: "hsl(222 47% 11%)",
      border: "1px solid hsl(215 25% 27%)",
      borderRadius: "12px",
      padding: "16px",
      width: 260,
      boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
    },
  },
];

const skillEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", style: { stroke: "hsl(180 60% 50%)", strokeDasharray: "6 4" }, type: "smoothstep" },
  { id: "e2-3", source: "2", target: "3", style: { stroke: "hsl(180 60% 50%)", strokeDasharray: "6 4" }, type: "smoothstep" },
  { id: "e3-4", source: "3", target: "4", style: { stroke: "hsl(180 60% 50%)", strokeDasharray: "6 4" }, type: "smoothstep" },
  { id: "e4-5", source: "4", target: "5", style: { stroke: "hsl(180 60% 50%)", strokeDasharray: "6 4" }, type: "smoothstep" },
  { id: "e5-6", source: "5", target: "6", style: { stroke: "hsl(180 60% 50%)", strokeDasharray: "6 4" }, type: "smoothstep" },
];

interface SkillMapPanelProps {
  className?: string;
  hideTitle?: boolean;
}

export function SkillMapPanel({ className, hideTitle }: SkillMapPanelProps) {
  const [nodes] = useNodesState(skillNodes);
  const [edges] = useEdgesState(skillEdges);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      {!hideTitle && (
        <div className="absolute top-3 left-4 z-10 text-sm font-semibold text-foreground">
          Quick Start
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        panOnDrag
        zoomOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(215 25% 20%)" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
