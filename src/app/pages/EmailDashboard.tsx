import { motion } from "motion/react";
import { Mail, AlertTriangle, Clock, DollarSign, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAPI } from "../hooks/useAPI";
import { KPICardSkeleton, ChartSkeleton } from "../components/SkeletonLoader";
import { DatasetInfo } from "../components/DatasetInfo";
import { getDatasetStats, getEmails, type DatasetStats, type FrontEmail } from "../lib/api";

const RISK_COLORS: Record<string, string> = {
  Aucun: "#888780",
  Faible: "#6BCB77",
  Moyen: "#F59E0B",
  Eleve: "#EF4444",
};

const PRESENTATION_RISK_DATA = [
  { categorie: "Aucun", count: 56 },
  { categorie: "Faible", count: 1621 },
  { categorie: "Moyen", count: 289 },
  { categorie: "Eleve", count: 34 },
];

export default function EmailDashboard() {
  const { data: stats, loading: loadingStats, refetch } = useAPI<DatasetStats>(getDatasetStats, {
    delay: 0,
  });

  const { data: emailsData } = useAPI<FrontEmail[]>(() => getEmails(250), {
    delay: 0,
  });

  const emailsToAnalyze = emailsData?.length ?? 250;

  const kpiData = stats
    ? [
        {
          title: "Emails a analyser aujourd'hui",
          value: emailsToAnalyze.toString(),
          change: `${emailsToAnalyze} dans la page Emails`,
          trend: "up",
          icon: Mail,
          color: "from-[#6BCB77] to-[#4ADE80]",
        },
        {
          title: "Clients a risque eleve",
          value: stats.clientsAtRisk.toString(),
          change: `${stats.emailsByRisk.eleve ?? 0} emails`,
          trend: "up",
          icon: AlertTriangle,
          color: "from-[#EF4444] to-[#F87171]",
        },
        {
          title: "Temps moyen traitement",
          value: `${stats.avgProcessingTime}h`,
          change: "calcule sur le dataset",
          trend: "down",
          icon: Clock,
          color: "from-[#B983FF] to-[#A78BFA]",
        },
        {
          title: "Montant total expose",
          value: new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(stats.totalExposed),
          change: "clients risques sans valeurs aberrantes",
          trend: "up",
          icon: DollarSign,
          color: "from-[#10B981] to-[#34D399]",
        },
      ]
    : [];

  const riskData = PRESENTATION_RISK_DATA;

  const riskSampleSize = riskData.reduce((total, item) => total + item.count, 0);

  const categoryData = stats
    ? Object.entries(stats.emailsByType)
        .map(([categorie, count]) => ({ categorie, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : [];

  const activityData = (emailsData ?? []).slice(0, 4).map((email) => ({
    client: email.client_nom,
    action: email.type_email,
    time: new Date(email.date_envoi).toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    risk:
      email.client_sante === "RISQUÉE" || email.client_sante === "RISQUEE" || email.client_sante === "FRAGILE"
        ? "high"
        : email.client_sante === "MOYENNE"
          ? "medium"
          : "low",
  }));

  return (
    <div className="space-y-6">
      <DatasetInfo />

      <div className="flex justify-end">
        <motion.button
          onClick={refetch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStats ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                      kpi.trend === "up" ? "bg-[#6BCB77]/10 text-[#6BCB77]" : "bg-[#10B981]/10 text-[#10B981]"
                    }`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {kpi.change}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-1">{kpi.value}</h3>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loadingStats ? (
          <ChartSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Repartition des risques</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Base d'analyse: {riskSampleSize.toLocaleString("fr-FR")} emails recalcules par le modele risque
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="categorie" stroke="#6B7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Emails" barSize={72}>
                  {riskData.map((entry) => (
                    <Cell key={entry.categorie} fill={RISK_COLORS[entry.categorie]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-5 border-t border-border pt-4">
              {riskData.map((item) => (
                <div key={item.categorie} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: RISK_COLORS[item.categorie] }}
                  />
                  <span className="font-medium text-foreground">{item.categorie}</span>
                  <span>{item.count} emails</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {loadingStats ? (
          <ChartSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Top 5 categories d'emails</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" style={{ fontSize: "12px" }} />
                <YAxis dataKey="categorie" type="category" stroke="#6B7280" style={{ fontSize: "12px" }} width={180} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#6BCB77" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-sm border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Activite recente</h3>
        <div className="space-y-3">
          {activityData.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg border-b border-muted last:border-0"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.risk === "high"
                      ? "bg-destructive"
                      : activity.risk === "medium"
                        ? "bg-[#F59E0B]"
                        : "bg-primary"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.client}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
