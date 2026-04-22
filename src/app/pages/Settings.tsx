import { motion } from "motion/react";
import { User, Bell, Shield, Palette, Database, Key } from "lucide-react";

const settingSections = [
  {
    icon: User,
    title: "Paramètres du Profil",
    description: "Gérez les informations et préférences de votre compte",
    color: "#6D28D9",
  },
  {
    icon: Bell,
    title: "Préférences de Notification",
    description: "Configurez les seuils d'alerte et les canaux de notification",
    color: "#8B5CF6",
  },
  {
    icon: Shield,
    title: "Sécurité & Confidentialité",
    description: "Authentification à deux facteurs et paramètres de confidentialité",
    color: "#10B981",
  },
  {
    icon: Palette,
    title: "Apparence",
    description: "Personnalisez le thème du tableau de bord et les préférences de mise en page",
    color: "#F59E0B",
  },
  {
    icon: Database,
    title: "Gestion des Données",
    description: "Exportez des rapports, sauvegardez des données et politiques de rétention",
    color: "#059669",
  },
  {
    icon: Key,
    title: "API & Intégrations",
    description: "Gérez les clés API et les intégrations tierces",
    color: "#EF4444",
  },
];

export function Settings() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold mb-2 text-[#111827]">Paramètres</h2>
        <p className="text-[#6B7280]">Gérez la configuration de votre Plateforme Analytique FinGraph</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${section.color}20` }}
              >
                <section.icon className="w-6 h-6" style={{ color: section.color }} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 text-[#111827]">{section.title}</h3>
                <p className="text-sm text-[#6B7280]">{section.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
