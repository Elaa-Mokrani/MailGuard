export type RiskLevel = "aucun" | "faible" | "moyen" | "eleve";

export const RISK_COLORS: Record<RiskLevel, string> = {
  aucun: "#888780",
  faible: "#6BCB77",
  moyen: "#F59E0B",
  eleve: "#EF4444",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  aucun: "Aucun risque",
  faible: "Risque faible",
  moyen: "Risque moyen",
  eleve: "Risque eleve",
};

export function normalizeRiskLevel(risque?: string | null, score = 0): RiskLevel {
  const normalized = String(risque || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized === "aucun" || normalized === "faible" || normalized === "moyen" || normalized === "eleve") {
    return normalized;
  }

  if (score <= 0) return "aucun";
  if (score >= 70) return "eleve";
  if (score >= 40) return "moyen";
  return "faible";
}

export function getRiskBadgeStyle(level: RiskLevel) {
  const color = RISK_COLORS[level];
  return {
    label: RISK_LABELS[level],
    color,
    className:
      level === "aucun"
        ? "bg-[#888780]/10 text-[#888780] border-[#888780]/20"
        : level === "faible"
          ? "bg-primary/10 text-primary border-primary/20"
          : level === "moyen"
            ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
            : "bg-destructive/10 text-destructive border-destructive/20",
  };
}
