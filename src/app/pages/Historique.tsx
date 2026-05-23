import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  History as HistoryIcon,
  LogIn,
  LogOut,
  Mail,
  Search,
  Sparkles,
} from "lucide-react";
import { useAPI } from "../hooks/useAPI";
import { getEmails, type FrontEmail } from "../lib/api";
import { readUserHistoryEvents, type UserHistoryEvent } from "../lib/history";
import { normalizeRiskLevel, RISK_LABELS } from "../lib/risk";

type HistoryType = "analyse" | "validation" | "alerte" | "facture" | "interne" | "login" | "logout" | "suggestion";

interface HistoryEvent {
  id: string;
  type: HistoryType;
  client: string;
  titre: string;
  description: string;
  date: string;
  statut: "succes" | "en_cours" | "prioritaire";
}

function getRiskLabel(email: FrontEmail) {
  return RISK_LABELS[normalizeRiskLevel(email.risque_impaye, email.technicite ?? 0)].toLowerCase();
}

function buildEvents(emails: FrontEmail[]): HistoryEvent[] {
  return emails.flatMap((email) => {
    const baseDescription = [
      email.type_email,
      getRiskLabel(email),
      email.reference_facture ? `ref ${email.reference_facture}` : null,
      email.montant ? `${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(email.montant)}` : null,
    ]
      .filter(Boolean)
      .join(" - ");

    const events: HistoryEvent[] = [
      {
        id: `${email.email_id}-analyse`,
        type: "analyse",
        client: email.client_nom,
        titre: "Analyse BiLSTM effectuee",
        description: baseDescription,
        date: email.date_envoi,
        statut: normalizeRiskLevel(email.risque_impaye, email.technicite ?? 0) === "eleve" ? "prioritaire" : "en_cours",
      },
    ];

    if (normalizeRiskLevel(email.risque_impaye, email.technicite ?? 0) === "eleve") {
      events.push({
        id: `${email.email_id}-alerte`,
        type: "alerte",
        client: email.client_nom,
        titre: "Alerte risque eleve",
        description: baseDescription,
        date: email.date_envoi,
        statut: "prioritaire",
      });
    }

    if (email.reference_facture || email.montant) {
      events.push({
        id: `${email.email_id}-facture`,
        type: "facture",
        client: email.client_nom,
        titre: "Information facture detectee",
        description: email.reference_facture ? `Reference facture ${email.reference_facture}` : "Montant detecte dans le mail",
        date: email.date_envoi,
        statut: "succes",
      });
    }

    if (email.interne) {
      events.push({
        id: `${email.email_id}-interne`,
        type: "interne",
        client: email.client_nom,
        titre: "Email interne Codix",
        description: "Message identifie comme communication interne",
        date: email.date_envoi,
        statut: "en_cours",
      });
    }

    return events;
  });
}

function toHistoryEvent(event: UserHistoryEvent): HistoryEvent {
  return event;
}

export default function Historique() {
  const [selectedType, setSelectedType] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [userEvents, setUserEvents] = useState<UserHistoryEvent[]>(() => readUserHistoryEvents());
  const { data: emails, loading, error, refetch } = useAPI<FrontEmail[]>(() => getEmails(250), { delay: 0 });

  useEffect(() => {
    const syncUserEvents = () => setUserEvents(readUserHistoryEvents());
    window.addEventListener("mailguard-history-updated", syncUserEvents);
    window.addEventListener("storage", syncUserEvents);
    return () => {
      window.removeEventListener("mailguard-history-updated", syncUserEvents);
      window.removeEventListener("storage", syncUserEvents);
    };
  }, []);

  const events = useMemo(() => {
    return [...userEvents.map(toHistoryEvent), ...buildEvents(emails ?? [])].sort(
      (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    );
  }, [emails, userEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesType = selectedType === "tous" || event.type === selectedType;
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !search ||
        event.client.toLowerCase().includes(search) ||
        event.titre.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search);

      return matchesType && matchesSearch;
    });
  }, [events, searchTerm, selectedType]);

  const getEventIcon = (type: HistoryType) => {
    switch (type) {
      case "validation":
        return { icon: CheckCircle, color: "bg-primary/10 text-primary" };
      case "alerte":
        return { icon: AlertTriangle, color: "bg-destructive/10 text-destructive" };
      case "facture":
        return { icon: FileText, color: "bg-[#F59E0B]/10 text-[#F59E0B]" };
      case "interne":
        return { icon: Sparkles, color: "bg-secondary/10 text-secondary" };
      case "login":
        return { icon: LogIn, color: "bg-primary/10 text-primary" };
      case "logout":
        return { icon: LogOut, color: "bg-muted text-muted-foreground" };
      case "suggestion":
        return { icon: Sparkles, color: "bg-secondary/10 text-secondary" };
      default:
        return { icon: Mail, color: "bg-muted text-muted-foreground" };
    }
  };

  const getStatusBadge = (status: HistoryEvent["statut"]) => {
    switch (status) {
      case "succes":
        return "bg-primary/10 text-primary border-primary/20";
      case "prioritaire":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Evenements", value: events.length, icon: HistoryIcon, color: "bg-secondary/10 text-secondary" },
          { label: "Validations", value: events.filter((event) => event.type === "validation").length, icon: CheckCircle, color: "bg-primary/10 text-primary" },
          { label: "Alertes", value: events.filter((event) => event.type === "alerte").length, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
          { label: "Factures", value: events.filter((event) => event.type === "facture").length, icon: FileText, color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher dans l'historique..."
              className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="rounded-xl border border-border bg-muted px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="tous">Tous les evenements</option>
            <option value="analyse">Analyses</option>
            <option value="validation">Validations</option>
            <option value="alerte">Alertes</option>
            <option value="facture">Factures</option>
            <option value="interne">Internes</option>
            <option value="suggestion">Reponses suggerees</option>
            <option value="login">Connexions</option>
            <option value="logout">Deconnexions</option>
          </select>
          <button onClick={refetch} className="rounded-xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
            Actualiser
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="p-8 text-sm text-muted-foreground">Chargement de l'historique...</div>
        ) : error ? (
          <div className="p-8 text-sm text-destructive">Impossible de charger l'historique depuis le backend.</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Aucun evenement ne correspond aux filtres.</div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEvents.map((event, index) => {
              const eventIcon = getEventIcon(event.type);
              const Icon = eventIcon.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="flex items-start gap-4 p-5"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${eventIcon.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-3">
                      <p className="font-medium text-foreground">{event.titre}</p>
                      <span className={`rounded-lg border px-2.5 py-1 text-xs ${getStatusBadge(event.statut)}`}>
                        {event.statut === "succes" ? "Succes" : event.statut === "prioritaire" ? "Prioritaire" : "En cours"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.client}</p>
                    <p className="mt-1 text-sm text-foreground">{event.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(event.date).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
