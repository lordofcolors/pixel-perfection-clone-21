import { useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ---------------------------------------------------------------------------
// Shared node/edge style helpers
// ---------------------------------------------------------------------------

const nodeStyle = {
  background: "hsl(222 47% 11%)",
  border: "1px solid hsl(215 25% 27%)",
  borderRadius: "12px",
  padding: "16px",
  width: 260,
  boxShadow: "0 0 12px 2px hsla(180, 80%, 50%, 0.15)",
};

const edgeStyle = { stroke: "hsl(180 60% 50%)", strokeDasharray: "6 4" };

function makeNode(id: string, y: number, title: string, desc: string): Node {
  return {
    id,
    position: { x: 250, y },
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-sm text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{desc}</div>
        </div>
      ),
    },
    style: { ...nodeStyle },
  };
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `e${source}-${target}`,
    source,
    target,
    style: { ...edgeStyle },
    type: "smoothstep",
  };
}

// ---------------------------------------------------------------------------
// Pre-built skill maps
// ---------------------------------------------------------------------------

const SKILL_MAPS: Array<{ nodes: Node[]; edges: Edge[] }> = [
  {
    nodes: [
      makeNode("1", 0, "Getting Started with Jump Rope", "An introduction to jump rope, including its benefits and basic…"),
      makeNode("2", 130, "Basic Techniques", "Learn the fundamental jump rope techniques, including basic jumps…"),
      makeNode("3", 260, "Choosing the Right Rope", "Understand how to select the appropriate jump rope based on…"),
      makeNode("4", 390, "Single Bounce", "Master the single bounce, a fundamental jump rope technique…"),
      makeNode("5", 520, "Alternate Foot Step", "Learn the alternate foot step to add variety and challenge…"),
      makeNode("6", 650, "Rope Materials", "Explore different materials used in jump ropes and their impact…"),
    ],
    edges: [makeEdge("1","2"), makeEdge("2","3"), makeEdge("3","4"), makeEdge("4","5"), makeEdge("5","6")],
  },
  {
    nodes: [
      makeNode("1", 0, "Solar System Overview", "Introduction to our solar system and its major components…"),
      makeNode("2", 130, "Inner Planets", "Explore Mercury, Venus, Earth, and Mars — the rocky planets…"),
      makeNode("3", 260, "Outer Planets", "Learn about Jupiter, Saturn, Uranus, and Neptune — the gas giants…"),
      makeNode("4", 390, "Moons & Satellites", "Discover the fascinating moons orbiting planets in our solar system…"),
      makeNode("5", 520, "Asteroids & Comets", "Understand the difference between asteroids, comets, and meteoroids…"),
    ],
    edges: [makeEdge("1","2"), makeEdge("2","3"), makeEdge("3","4"), makeEdge("4","5")],
  },
  {
    nodes: [
      makeNode("1", 0, "Introduction to Cooking", "Basic kitchen safety, tools, and terminology for beginners…"),
      makeNode("2", 130, "Knife Skills", "Learn proper cutting techniques: dice, julienne, chiffonade…"),
      makeNode("3", 260, "Heat & Cooking Methods", "Understand sautéing, boiling, roasting, grilling, and braising…"),
      makeNode("4", 390, "Flavor Building", "Explore seasoning, spice pairing, and balancing sweet, sour, salty…"),
      makeNode("5", 520, "Meal Planning", "Put it all together with weekly meal prep and balanced nutrition…"),
    ],
    edges: [makeEdge("1","2"), makeEdge("2","3"), makeEdge("3","4"), makeEdge("4","5")],
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SkillMapPanelProps {
  className?: string;
  hideTitle?: boolean;
  /** Incremented each time "Break It Down" is triggered — cycles to next map. */
  mapIndex?: number;
}

// ---------------------------------------------------------------------------
// Inner component with React Flow hooks
// ---------------------------------------------------------------------------

function SkillMapInner({
  hideTitle,
  nodes: initialNodes,
  edges: initialEdges,
}: {
  hideTitle?: boolean;
  nodes: Node[];
  edges: Edge[];
}) {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      fitView({ padding: 0.3, duration: 0 });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitView]);

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.3, duration: 300 }), 50);
  }, [initialNodes, fitView]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
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
        {!hideTitle && <Controls showInteractive={false} />}
      </ReactFlow>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component — single view, cycles on each trigger
// ---------------------------------------------------------------------------

export function SkillMapPanel({ className, hideTitle, mapIndex = 0 }: SkillMapPanelProps) {
  const currentMap = SKILL_MAPS[mapIndex % SKILL_MAPS.length];

  return (
    <div className={`${className || ""} skill-map-panel`} style={{ width: "100%", height: "100%" }}>
      <style>{`
        .skill-map-panel .react-flow__controls {
          background: hsl(222 47% 11% / 0.9);
          border: 1px solid hsl(215 25% 27%);
          border-radius: 8px;
          box-shadow: 0 2px 8px hsl(0 0% 0% / 0.3);
        }
        .skill-map-panel .react-flow__controls-button {
          background: transparent;
          border-bottom: 1px solid hsl(215 25% 27%);
          fill: hsl(210 40% 80%);
          color: hsl(210 40% 80%);
        }
        .skill-map-panel .react-flow__controls-button:hover {
          background: hsl(215 25% 20%);
        }
        .skill-map-panel .react-flow__controls-button:last-child {
          border-bottom: none;
        }
        .skill-map-panel .react-flow__controls-button svg {
          fill: hsl(210 40% 80%);
        }
      `}</style>
      <ReactFlowProvider key={mapIndex}>
        <SkillMapInner hideTitle={hideTitle} nodes={currentMap.nodes} edges={currentMap.edges} />
      </ReactFlowProvider>
    </div>
  );
}
