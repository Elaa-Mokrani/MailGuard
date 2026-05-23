import { motion } from "motion/react";
import React from "react";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Building2,
  Globe,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { DatasetInfo } from "../components/DatasetInfo";
import { useAPI } from "../hooks/useAPI";
import { getClients, type FrontClient } from "../lib/api";

export default function ClientsPage() {
  const { data: clientsData, loading, error, refetch } = useAPI<FrontClient[]>(() => getClients(60), {
    delay: 0,
  });

  const clients = clientsData ?? [];
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].client_id);
    }
  }, [clients, selectedClientId]);

  const selectedClient = clients.find((client) => client.client_id === selectedClientId) ?? clients[0];

  const getHealthScore = (sante: string) => {
    switch (sante) {
      case "EXCELLENTE":
        return 95;
      case "BONNE":
        return 75;
      case "MOYENNE":
        return 50;
      case "RISQUÉE":
        return 30;
      case "FRAGILE":
        return 15;
      default:
        return 50;
    }
  };

  const getRiskBadge = (sante: string) => {
    switch (sante) {
      case "EXCELLENTE":
        return { label: "Excellente sante", color: "bg-primary/10 text-primary border-primary/20" };
      case "BONNE":
        return { label: "Bonne sante", color: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" };
      case "MOYENNE":
        return { label: "Sante moyenne", color: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" };
      case "RISQUÉE":
        return { label: "Sante risquee", color: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" };
      case "FRAGILE":
        return { label: "Sante fragile", color: "bg-destructive/10 text-destructive border-destructive/20" };
      default:
        return { label: "Sante moyenne", color: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" };
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const topClients = [...clients]
    .sort((a, b) => b.client_encours - a.client_encours)
    .slice(0, 6)
    .map((client) => ({
      nom: client.client_nom,
      encours: Math.round(client.client_encours / 1000),
    }));

  return (
    <div className="space-y-6">
      <DatasetInfo />

      {error ? (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <p className="text-sm text-destructive mb-3">Impossible de charger les clients depuis le backend.</p>
          <button onClick={refetch} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
            Reessayer
          </button>
        </div>
      ) : null}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {loading ? (
          <div className="text-sm text-muted-foreground">Chargement des clients...</div>
        ) : (
          clients.map((client) => {
            const badge = getRiskBadge(client.client_sante);
            const isSelected = selectedClient?.client_id === client.client_id;

            return (
              <motion.button
                key={client.client_id}
                onClick={() => setSelectedClientId(client.client_id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 w-72 p-4 rounded-xl border-2 transition-all ${
                  isSelected ? "bg-secondary/10 border-secondary" : "bg-card border-border hover:border-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    {client.client_nom.charAt(0)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{client.client_nom}</p>
                    <span className={`text-xs px-2 py-0.5 rounded border ${badge.color}`}>{badge.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{client.client_pays}</span>
                  <span>{client.nb_emails} emails</span>
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      {selectedClient ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedClient.client_nom.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-1">{selectedClient.client_nom}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {selectedClient.client_secteur}
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {selectedClient.client_pays}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedClient.nb_emails} emails
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <span className={`inline-flex px-4 py-2 rounded-xl text-sm font-medium border ${getRiskBadge(selectedClient.client_sante).color}`}>
                    {getRiskBadge(selectedClient.client_sante).label}
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {getHealthScore(selectedClient.client_sante)}
                  <span className="text-lg text-muted-foreground">/100</span>
                </p>
                <p className="text-xs text-muted-foreground">Score sante financiere</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Calendar className="w-4 h-4" />
              Derniere interaction : {formatDate(selectedClient.derniere_interaction)}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground">Encours total</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedClient.client_encours)}</p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-secondary" />
                  <span className="text-xs text-muted-foreground">Emails echanges</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{selectedClient.nb_emails}</p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                  <span className="text-xs text-muted-foreground">Taux paiement</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{getHealthScore(selectedClient.client_sante)}%</p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-xs text-muted-foreground">Sante client</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{selectedClient.client_sante}</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Top clients par encours</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topClients} layout="vertical" margin={{ top: 8, right: 56, bottom: 8, left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis
                  dataKey="nom"
                  type="category"
                  width={190}
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [`${value} K€`, "Encours"]}
                />
                <Bar dataKey="encours" fill="#B983FF" radius={[0, 8, 8, 0]}>
                  <LabelList
                    dataKey="encours"
                    position="right"
                    formatter={(value: number) => `${value} K€`}
                    fill="var(--foreground)"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      ) : null}
    </div>
  );
}
