import { getRiskBadgeStyle, normalizeRiskLevel } from "../lib/risk";

interface RiskBadgeProps {
  score: number;
  risque?: string | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RiskBadge({ score, risque, size = "md", showLabel = true }: RiskBadgeProps) {
  const level = getRiskBadgeStyle(normalizeRiskLevel(risque, score));

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${level.color}20`,
        color: level.color,
        border: `1px solid ${level.color}40`,
      }}
    >
      {score}
      {showLabel && <span className="opacity-75">- {level.label}</span>}
    </span>
  );
}
