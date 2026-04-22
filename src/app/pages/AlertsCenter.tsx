import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Users, Eye } from "lucide-react";

const alerts = [
  {
    id: 1,
    title: "Client à Haut Risque Détecté",
    level: "critical",
    description: "FinServe Ltd a dépassé le seuil de risque avec un score de 91. Révision immédiate recommandée.",
    date: "2026-02-13 14:30",
    entity: "FinServe Ltd",
  },
  {
    id: 2,
    title: "Limite d'Exposition Dépassée",
    level: "high",
    description: "L'exposition totale de TechCorp SA a atteint 63M€, dépassant le seuil de 50M€.",
    date: "2026-02-13 12:15",
    entity: "TechCorp SA",
  },
  {
    id: 3,
    title: "Relation Suspecte Détectée",
    level: "medium",
    description: "Schéma de garantie croisée identifié entre Jean-Pierre Durand et plusieurs entités à haut risque.",
    date: "2026-02-13 10:45",
    entity: "Jean-Pierre Durand",
  },
  {
    id: 4,
    title: "Alerte de Risque de Concentration",
    level: "high",
    description: "BNP Paribas détient 24% de l'exposition totale du portefeuille, approchant la limite de diversification.",
    date: "2026-02-13 09:20",
    entity: "BNP Paribas",
  },
  {
    id: 5,
    title: "Avertissement de Violation de Covenant",
    level: "critical",
    description: "Le ratio DSCR d'AutoFinance est tombé à 1.15x, sous le minimum requis de 1.25x.",
    date: "2026-02-12 16:50",
    entity: "AutoFinance",
  },
  {
    id: 6,
    title: "Retard de Paiement Détecté",
    level: "medium",
    description: "GlobalTrade Inc a manqué la date limite de paiement trimestriel de 15 jours.",
    date: "2026-02-12 14:30",
    entity: "GlobalTrade Inc",
  },
  {
    id: 7,
    title: "Détérioration du Score de Risque",
    level: "medium",
    description: "Le score de risque de CloudNet GmbH est passé de 65 à 78 au dernier trimestre.",
    date: "2026-02-12 11:00",
    entity: "CloudNet GmbH",
  },
  {
    id: 8,
    title: "Problème de Conformité Réglementaire",
    level: "high",
    description: "SmartChain Co manque de documentation requise pour le renouvellement KYC.",
    date: "2026-02-11 15:45",
    entity: "SmartChain Co",
  },
];

const getLevelConfig = (level: string) => {
  switch (level) {
    case "critical":
      return {
        color: "#EF4444",
        bg: "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.4)",
        label: "Critique",
        glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
      };
    case "high":
      return {
        color: "#F59E0B",
        bg: "rgba(245, 158, 11, 0.1)",
        border: "rgba(245, 158, 11, 0.4)",
        label: "Élevé",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      };
    case "medium":
      return {
        color: "#10B981",
        bg: "rgba(16, 185, 129, 0.1)",
        border: "rgba(16, 185, 129, 0.4)",
        label: "Moyen",
        glow: "",
      };
    default:
      return {
        color: "#6B7280",
        bg: "rgba(107, 114, 128, 0.1)",
        border: "rgba(107, 114, 128, 0.4)",
        label: "Faible",
        glow: "",
      };
  }
};

export function AlertsCenter() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-[rgba(239,68,68,0.3)] p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[rgba(239,68,68,0.1)] rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">12</span>
          </div>
          <div className="text-sm text-[#6B7280]">Alertes Critiques</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-[rgba(245,158,11,0.3)] p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[rgba(245,158,11,0.1)] rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">28</span>
          </div>
          <div className="text-sm text-[#6B7280]">Priorité Élevée</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-[rgba(16,185,129,0.3)] p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[rgba(16,185,129,0.1)] rounded-lg">
              <Users className="w-5 h-5 text-[#10B981]" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">45</span>
          </div>
          <div className="text-sm text-[#6B7280]">Priorité Moyenne</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-lg">
              <Eye className="w-5 h-5 text-[#6D28D9]" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">8</span>
          </div>
          <div className="text-sm text-[#6B7280]">En Révision</div>
        </motion.div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const config = getLevelConfig(alert.level);
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={`bg-white rounded-xl border p-6 hover:scale-[1.01] transition-all shadow-sm ${config.glow}`}
              style={{ borderColor: config.border }}
            >
              <div className="flex items-start gap-4">
                {/* Alert Icon */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.bg }}
                >
                  <AlertTriangle className="w-6 h-6" style={{ color: config.color }} />
                </div>

                {/* Alert Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#111827]">{alert.title}</h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: config.bg,
                        color: config.color,
                        border: `1px solid ${config.border}`,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>

                  <p className="text-[#6B7280] text-sm mb-3">{alert.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <span>{alert.date}</span>
                      <span>•</span>
                      <span className="text-[#111827] font-medium">{alert.entity}</span>
                    </div>

                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{
                        backgroundColor: config.bg,
                        color: config.color,
                        border: `1px solid ${config.border}`,
                      }}
                    >
                      Voir le Dossier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-4"
      >
        <button className="px-6 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#111827] hover:bg-[#F8FAFC] hover:border-[#6D28D9]/40 transition-all shadow-sm">
          Charger Plus d'Alertes
        </button>
      </motion.div>
    </div>
  );
}
