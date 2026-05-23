import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Download,
  Filter,
  Mail,
  Phone,
  Search,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { useAPI } from "../hooks/useAPI";
import { getEmails, type FrontEmail } from "../lib/api";
import { normalizeRiskLevel, type RiskLevel } from "../lib/risk";

type AlertLevel = RiskLevel;

interface AlertItem {
  id: string;
  client: string;
  niveau: AlertLevel;
  montant: number | null;
  reference_facture: string | null;
  action: string;
  date: string;
  type_email: string;
  interne: boolean;
}

const LEVEL_STYLES: Record<AlertLevel, { label: string; badge: string; accent: string }> = {
  aucun: {
    label: "Aucun risque",
    badge: "bg-[#888780]/10 text-[#888780] border-[#888780]/20",
    accent: "#888780",
  },
  eleve: {
    label: "Eleve",
    badge: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    accent: "#EF4444",
  },
  moyen: {
    label: "Moyen",
    badge: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    accent: "#F59E0B",
  },
  faible: {
    label: "Faible",
    badge: "bg-[#6BCB77]/10 text-[#6BCB77] border-[#6BCB77]/20",
    accent: "#6BCB77",
  },
};

function getLevel(email: FrontEmail): AlertLevel {
  return normalizeRiskLevel(email.risque_impaye, email.technicite ?? 0);
}

function getRecommendedAction(email: FrontEmail, level: AlertLevel): string {
  const type = email.type_email.toLowerCase();
  const hasInvoiceContext = Boolean(email.reference_facture || email.montant);

  if (email.interne) {
    if (level === "aucun") return "Classer comme information interne sans action urgente";
    if (level === "eleve") return "Coordonner une action interne prioritaire avec le service concerne";
    return "Transmettre au bon service Codix avec le contexte d'analyse";
  }

  if (type.includes("mise en demeure")) {
    return "Preparer une reponse ferme et verifier le dossier facture avant envoi";
  }

  if (type.includes("contestation") || type.includes("litige")) {
    return hasInvoiceContext
      ? "Ouvrir un suivi litige avec la reference facture et demander les justificatifs"
      : "Ouvrir un suivi litige et demander les elements manquants au client";
  }

  if (type.includes("relance") || type.includes("retard") || type.includes("impaye")) {
    if (level === "eleve") return "Envoyer une relance prioritaire et proposer un point rapide";
    return "Planifier une relance client avec rappel de l'echeance";
  }

  if (type.includes("confirmation")) {
    return "Confirmer la bonne reception et mettre le dossier a jour";
  }

  if (level === "aucun") return "Aucune action prioritaire requise, conserver dans le suivi normal";
  if (level === "eleve") return "Traiter en priorite et verifier le risque financier";
  if (level === "moyen") return "Programmer un suivi sous 24h";
  return "Surveiller et classer apres verification";
}

function formatCurrency(amount: number | null) {
  if (typeof amount !== "number" || amount <= 0) return "Montant non detecte";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function AlertsPage() {
  const [selectedNiveau, setSelectedNiveau] = useState<string>("tous");
  const [selectedType, setSelectedType] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: emails, loading, error, refetch } = useAPI<FrontEmail[]>(() => getEmails(250), {
    delay: 0,
  });

  const alerts = useMemo<AlertItem[]>(() => {
    return (emails ?? []).map((email) => {
      const niveau = getLevel(email);
      return {
        id: email.email_id,
        client: email.client_nom,
        niveau,
        montant: email.montant ?? null,
        reference_facture: email.reference_facture ?? null,
        action: getRecommendedAction(email, niveau),
        date: email.date_envoi,
        type_email: email.type_email,
        interne: Boolean(email.interne),
      };
    });
  }, [emails]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesNiveau = selectedNiveau === "tous" || alert.niveau === selectedNiveau;
      const matchesType = selectedType === "tous" || alert.type_email === selectedType;
      const matchesSearch =
        searchTerm.trim() === "" ||
        alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (alert.reference_facture ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNiveau && matchesType && matchesSearch;
    });
  }, [alerts, searchTerm, selectedNiveau, selectedType]);

  const stats = {
    total: alerts.length,
    aucun: alerts.filter((alert) => alert.niveau === "aucun").length,
    eleve: alerts.filter((alert) => alert.niveau === "eleve").length,
    moyen: alerts.filter((alert) => alert.niveau === "moyen").length,
    faible: alerts.filter((alert) => alert.niveau === "faible").length,
  };

  const availableTypes = useMemo(() => {
    return Array.from(new Set(alerts.map((alert) => alert.type_email))).filter(Boolean).slice(0, 12);
  }, [alerts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {[
          { title: "Total alertes", value: stats.total, color: "bg-[#B983FF]/10 text-[#B983FF]", icon: AlertTriangle },
          { title: "Aucun risque", value: stats.aucun, color: "bg-[#888780]/10 text-[#888780]", icon: AlertTriangle },
          { title: "Risque eleve", value: stats.eleve, color: "bg-[#EF4444]/10 text-[#EF4444]", icon: TrendingUp },
          { title: "Risque moyen", value: stats.moyen, color: "bg-[#F59E0B]/10 text-[#F59E0B]", icon: ShieldAlert },
          { title: "Risque faible", value: stats.faible, color: "bg-[#6BCB77]/10 text-[#6BCB77]", icon: AlertTriangle },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[280px] flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un client, une action ou une reference..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtres
            </div>

            <select
              value={selectedNiveau}
              onChange={(event) => setSelectedNiveau(event.target.value)}
              className="cursor-pointer rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="tous">Tous les niveaux</option>
              <option value="aucun">Aucun risque</option>
              <option value="eleve">Risque eleve</option>
              <option value="moyen">Risque moyen</option>
              <option value="faible">Risque faible</option>
            </select>

            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="cursor-pointer rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="tous">Tous les types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={refetch}
              className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Actualiser
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {loading ? (
          <div className="p-8 text-sm text-muted-foreground">Chargement des alertes...</div>
        ) : error ? (
          <div className="p-8 text-sm text-destructive">Impossible de charger les alertes depuis le backend.</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Aucune alerte ne correspond aux filtres selectionnes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risque</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Montant / Reference</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action recommandee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAlerts.map((alert, index) => {
                  const level = LEVEL_STYLES[alert.niveau];
                  return (
                    <motion.tr
                      key={alert.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: level.accent }}
                          >
                            {alert.client.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{alert.client}</div>
                            <div className="text-xs text-muted-foreground">{alert.interne ? "Email interne Codix" : "Email client"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${level.badge}`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">{formatCurrency(alert.montant)}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.reference_facture ? `Ref: ${alert.reference_facture}` : "Reference non detectee"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{alert.action}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{alert.type_email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {new Date(alert.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg p-2 transition-colors hover:bg-primary/10 group">
                            <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                          <button className="rounded-lg p-2 transition-colors hover:bg-secondary/10 group">
                            <Phone className="h-4 w-4 text-muted-foreground group-hover:text-secondary" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
