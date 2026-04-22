import { useState } from "react";
import { motion } from "motion/react";
import { ZoomIn, ZoomOut, Maximize, Building2, User } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "bank" | "company" | "person";
  x: number;
  y: number;
  risk?: number;
}

interface Edge {
  from: string;
  to: string;
  type: "FINANCES" | "MANAGES" | "GUARANTEES";
  amount?: string;
}

const nodes: Node[] = [
  { id: "1", label: "BNP Paribas", type: "bank", x: 400, y: 100, risk: 45 },
  { id: "2", label: "TechCorp SA", type: "company", x: 400, y: 250, risk: 85 },
  { id: "3", label: "Jean-Pierre Durand", type: "person", x: 250, y: 250 },
  { id: "4", label: "GlobalTrade Inc", type: "company", x: 550, y: 250, risk: 72 },
  { id: "5", label: "Société Générale", type: "bank", x: 550, y: 100, risk: 38 },
  { id: "6", label: "InnovateHub", type: "company", x: 400, y: 400, risk: 68 },
];

const edges: Edge[] = [
  { from: "1", to: "2", type: "FINANCES", amount: "€45M" },
  { from: "3", to: "2", type: "MANAGES" },
  { from: "3", to: "4", type: "GUARANTEES", amount: "€32M" },
  { from: "5", to: "4", type: "FINANCES", amount: "€32M" },
  { from: "2", to: "6", type: "FINANCES", amount: "€12M" },
];

const getNodeColor = (type: string) => {
  switch (type) {
    case "bank": return { fill: "#6D28D9", stroke: "#8B5CF6", text: "#FFFFFF" };
    case "company": return { fill: "#10B981", stroke: "#059669", text: "#FFFFFF" };
    case "person": return { fill: "#F59E0B", stroke: "#D97706", text: "#FFFFFF" };
    default: return { fill: "#6B7280", stroke: "#4B5563", text: "#FFFFFF" };
  }
};

const getRiskColor = (risk?: number) => {
  if (!risk) return "#6B7280";
  if (risk >= 80) return "#EF4444";
  if (risk >= 60) return "#F59E0B";
  return "#10B981";
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "bank": return "Banque";
    case "company": return "Entreprise";
    case "person": return "Personne";
    default: return "Autre";
  }
};

const getRelationLabel = (type: string) => {
  switch (type) {
    case "FINANCES": return "Finance";
    case "MANAGES": return "Dirige";
    case "GUARANTEES": return "Garantit";
    default: return type;
  }
};

export function GraphIntelligence() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  const getConnectedEdges = (nodeId: string) => {
    return edges.filter(e => e.from === nodeId || e.to === nodeId);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Graphe de Relations</h2>
          <p className="text-[#6B7280]">Visualisation des connexions entre entités financières</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <ZoomOut className="w-5 h-5 text-[#111827]" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <Maximize className="w-5 h-5 text-[#111827]" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <ZoomIn className="w-5 h-5 text-[#111827]" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm overflow-hidden"
        >
          <div className="relative h-[600px] bg-[#F8FAFC] rounded-lg overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              className="transition-transform duration-300"
            >
              {/* Edges */}
              <g>
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;

                  return (
                    <g key={index}>
                      <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#E5E7EB"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      {edge.amount && (
                        <text
                          x={midX}
                          y={midY - 10}
                          textAnchor="middle"
                          fill="#6B7280"
                          fontSize="12"
                          fontWeight="600"
                        >
                          {edge.amount}
                        </text>
                      )}
                      <text
                        x={midX}
                        y={midY + (edge.amount ? 5 : 0)}
                        textAnchor="middle"
                        fill="#6D28D9"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {getRelationLabel(edge.type)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#E5E7EB" />
                </marker>
              </defs>

              {/* Nodes */}
              <g>
                {nodes.map((node, index) => {
                  const colors = getNodeColor(node.type);
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <motion.g
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                      onClick={() => setSelectedNode(node)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 42 : 35}
                        fill={colors.fill}
                        stroke={isSelected ? colors.stroke : colors.fill}
                        strokeWidth={isSelected ? 4 : 0}
                        filter={isSelected ? "url(#glow)" : ""}
                        className="transition-all duration-300"
                      />
                      {node.risk && (
                        <circle
                          cx={node.x + 20}
                          cy={node.y - 20}
                          r="12"
                          fill={getRiskColor(node.risk)}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      )}
                      <text
                        x={node.x}
                        y={node.y + 50}
                        textAnchor="middle"
                        fill="#111827"
                        fontSize="13"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                      {node.risk && (
                        <text
                          x={node.x + 20}
                          y={node.y - 16}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontWeight="700"
                        >
                          {node.risk}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </g>

              {/* Glow filter */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Node Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {selectedNode ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getNodeColor(selectedNode.type).fill }}
                >
                  {selectedNode.type === "person" ? (
                    <User className="w-6 h-6 text-white" />
                  ) : (
                    <Building2 className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">{selectedNode.label}</h3>
                  <p className="text-sm text-[#6B7280]">{getTypeLabel(selectedNode.type)}</p>
                </div>
              </div>

              {selectedNode.risk && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6B7280]">Score de Risque</span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getRiskColor(selectedNode.risk)}20`,
                        color: getRiskColor(selectedNode.risk),
                        border: `1px solid ${getRiskColor(selectedNode.risk)}40`,
                      }}
                    >
                      {selectedNode.risk}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-3">Relations Connectées</h4>
                <div className="space-y-2">
                  {getConnectedEdges(selectedNode.id).map((edge, index) => {
                    const otherNode = nodes.find(
                      n => n.id === (edge.from === selectedNode.id ? edge.to : edge.from)
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg text-sm"
                      >
                        <div>
                          <div className="font-medium text-[#111827]">{otherNode?.label}</div>
                          <div className="text-xs text-[#6B7280]">{getRelationLabel(edge.type)}</div>
                        </div>
                        {edge.amount && (
                          <div className="text-sm font-semibold text-[#6D28D9]">{edge.amount}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm text-center">
              <div className="text-[#6B7280] mb-2">
                Sélectionnez un nœud pour voir ses détails
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-[#111827] mb-3">Légende</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#6D28D9]"></div>
                <span className="text-sm text-[#6B7280]">Banque</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#10B981]"></div>
                <span className="text-sm text-[#6B7280]">Entreprise</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
                <span className="text-sm text-[#6B7280]">Personne</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
