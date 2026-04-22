import { useState } from "react";
import { motion } from "motion/react";
import { Building2, User, DollarSign, Calendar, FileCheck } from "lucide-react";

const documentText = `CONTRAT DE PRÊT

Date: 15 janvier 2024
Parties: BNP Paribas et TechCorp SA

CONTRAT conclu ce 15 janvier 2024, entre BNP Paribas, institution bancaire organisée selon les lois françaises (« Prêteur »), et TechCorp SA, société organisée selon le droit français (« Emprunteur »).

MONTANT PRINCIPAL : 45 000 000 € (Quarante-cinq millions d'euros)

TAUX D'INTÉRÊT : 4,25% par an

DURÉE : 60 mois à compter de la date du premier décaissement

GARANT : Jean-Pierre Durand (PDG, TechCorp SA)

OBJET : Le produit du prêt sera utilisé exclusivement pour :
1. Expansion de l'infrastructure technologique
2. Initiatives de recherche et développement
3. Besoins en fonds de roulement

GARANTIES : Sûreté de premier rang sur :
- Tous les actifs présents et futurs de TechCorp SA
- Garantie personnelle de Jean-Pierre Durand
- Nantissement de 35% des capitaux propres dans les filiales

COVENANTS FINANCIERS :
- Ratio de couverture du service de la dette : minimum 1,25x
- Ratio de liquidité générale : minimum 1,50x
- Levier total maximum : 3,5x EBITDA

EXIGENCES DE REPORTING :
- États financiers trimestriels sous 45 jours
- États financiers annuels audités sous 120 jours
- Prévisions de trésorerie mensuelles

CALENDRIER DE REMBOURSEMENT :
Versements trimestriels commençant le 31 mars 2024
Paiement final dû le 15 janvier 2029

Ce contrat est régi par le droit français.`;

interface Entity {
  text: string;
  type: "organization" | "person" | "money" | "date";
  confidence: number;
}

const entities: Entity[] = [
  { text: "BNP Paribas", type: "organization", confidence: 0.98 },
  { text: "TechCorp SA", type: "organization", confidence: 0.97 },
  { text: "Jean-Pierre Durand", type: "person", confidence: 0.95 },
  { text: "45 000 000 €", type: "money", confidence: 0.99 },
  { text: "15 janvier 2024", type: "date", confidence: 0.96 },
  { text: "31 mars 2024", type: "date", confidence: 0.94 },
  { text: "15 janvier 2029", type: "date", confidence: 0.96 },
];

const getEntityColor = (type: string) => {
  switch (type) {
    case "organization": return { bg: "#6D28D9", text: "#6D28D9" };
    case "person": return { bg: "#10B981", text: "#10B981" };
    case "money": return { bg: "#F59E0B", text: "#F59E0B" };
    case "date": return { bg: "#059669", text: "#059669" };
    default: return { bg: "#6B7280", text: "#6B7280" };
  }
};

const getEntityIcon = (type: string) => {
  switch (type) {
    case "organization": return Building2;
    case "person": return User;
    case "money": return DollarSign;
    case "date": return Calendar;
    default: return FileCheck;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "organization": return "Organisation";
    case "person": return "Personne";
    case "money": return "Montant";
    case "date": return "Date";
    default: return "Autre";
  }
};

export function DocumentAnalysis() {
  const [riskScore] = useState(85);
  const [highlightedEntity, setHighlightedEntity] = useState<string | null>(null);

  const highlightText = () => {
    let highlighted = documentText;
    entities.forEach((entity) => {
      const color = getEntityColor(entity.type);
      const isHighlighted = highlightedEntity === entity.text;
      highlighted = highlighted.replace(
        new RegExp(entity.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        `<mark style="background-color: ${color.bg}20; color: ${color.text}; padding: 2px 4px; border-radius: 4px; font-weight: 500; ${isHighlighted ? "background-color: " + color.bg + "40; box-shadow: 0 0 0 2px " + color.bg + ";" : ""}">${entity.text}</mark>`
      );
    });
    return highlighted;
  };

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-[#111827]">BNP_Contract_2024_Q1.pdf</h2>
            <p className="text-[#6B7280]">TechCorp SA • BNP Paribas • 15 janvier 2024</p>
          </div>
          <div>
            <span
              className="px-4 py-2 rounded-full text-sm font-medium inline-block"
              style={{
                backgroundColor: "#EF444420",
                color: "#EF4444",
                border: "1px solid #EF444440",
              }}
            >
              Risque: {riskScore}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Document Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Contenu du Document</h3>
          <div
            className="prose prose-sm max-w-none leading-relaxed text-[#111827] whitespace-pre-wrap font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: highlightText() }}
            onMouseLeave={() => setHighlightedEntity(null)}
          />
        </motion.div>

        {/* Extracted Entities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#111827]">Entités Détectées</h3>
            <div className="space-y-3">
              {entities.map((entity, index) => {
                const color = getEntityColor(entity.type);
                const Icon = getEntityIcon(entity.type);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                    onMouseEnter={() => setHighlightedEntity(entity.text)}
                    onMouseLeave={() => setHighlightedEntity(null)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color.bg}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: color.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#111827] truncate">{entity.text}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#6B7280]">{getTypeLabel(entity.type)}</span>
                        <span className="text-xs text-[#6B7280]">•</span>
                        <span className="text-xs font-medium" style={{ color: color.text }}>
                          {Math.round(entity.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#111827]">Facteurs de Risque</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#FEF2F2] rounded-lg border border-[#FEE2E2]">
                <span className="text-sm text-[#EF4444]">Levier financier élevé</span>
                <span className="text-sm font-bold text-[#EF4444]">3.5x</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#FEF3C7] rounded-lg border border-[#FDE68A]">
                <span className="text-sm text-[#F59E0B]">Concentration client</span>
                <span className="text-sm font-bold text-[#F59E0B]">Moyen</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#D1FAE5] rounded-lg border border-[#A7F3D0]">
                <span className="text-sm text-[#059669]">Garanties solides</span>
                <span className="text-sm font-bold text-[#059669]">✓</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
