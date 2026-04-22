import { motion } from 'motion/react';
import { Mail, AlertTriangle, Clock, DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAPI } from '../hooks/useAPI';
import { KPICardSkeleton, ChartSkeleton, TableRowSkeleton } from '../components/SkeletonLoader';
import { DatasetInfo } from '../components/DatasetInfo';
import { getStatistics, realEmails } from '../data/mockData';

// Données pour les graphiques (basées sur les vraies données)
const getRiskEvolutionData = () => {
  // Simuler l'évolution sur 7 jours basée sur les données réelles
  return [
    { date: 'Lun', faible: 42, moyen: 28, eleve: 12 },
    { date: 'Mar', faible: 48, moyen: 31, eleve: 15 },
    { date: 'Mer', faible: 45, moyen: 29, eleve: 18 },
    { date: 'Jeu', faible: 51, moyen: 26, eleve: 11 },
    { date: 'Ven', faible: 53, moyen: 30, eleve: 14 },
    { date: 'Sam', faible: 38, moyen: 21, eleve: 7 },
    { date: 'Dim', faible: 41, moyen: 19, eleve: 6 },
  ];
};

const getEmailCategoryData = () => {
  const stats = getStatistics();
  return Object.entries(stats.emailsByType)
    .map(([categorie, count]) => ({ categorie, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

export default function EmailDashboard() {
  const stats = getStatistics();

  // KPI Data avec vraies données
  const kpiData = [
    {
      title: 'Emails à analyser',
      value: stats.todayEmails > 0 ? stats.todayEmails.toString() : realEmails.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: Mail,
      color: 'from-[#6BCB77] to-[#4ADE80]',
    },
    {
      title: 'Clients à risque élevé',
      value: stats.clientsAtRisk.toString(),
      change: '-8%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-[#EF4444] to-[#F87171]',
    },
    {
      title: 'Temps moyen traitement',
      value: `${stats.avgProcessingTime}h`,
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'from-[#B983FF] to-[#A78BFA]',
    },
    {
      title: 'Montant total exposé',
      value: `${(stats.totalExposed / 1000).toFixed(0)}K€`,
      change: '+5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-[#10B981] to-[#34D399]',
    },
  ];

  // Simulate API calls with loading states
  const { data: kpis, loading: loadingKPIs, refetch: refetchKPIs } = useAPI(
    async () => kpiData,
    { delay: 800 }
  );

  const { data: riskData, loading: loadingRisk } = useAPI(
    async () => getRiskEvolutionData(),
    { delay: 1000 }
  );

  const { data: categoryData, loading: loadingCategory } = useAPI(
    async () => getEmailCategoryData(),
    { delay: 1200 }
  );

  // Activités récentes (vraies données)
  const activityData = realEmails
    .slice(0, 4)
    .map((email) => ({
      client: email.client_nom,
      action: email.type_email,
      time: new Date(email.date_envoi).toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      risk: email.client_sante === 'RISQUÉE' || email.client_sante === 'FRAGILE' ? 'high' :
            email.client_sante === 'MOYENNE' ? 'medium' : 'low',
    }));

  return (
    <div className="space-y-6">
      {/* Dataset Info */}
      <DatasetInfo />

      {/* Refresh Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={refetchKPIs}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingKPIs ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          kpis?.map((kpi, index) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, shadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                      kpi.trend === 'up'
                        ? 'bg-[#6BCB77]/10 text-[#6BCB77]'
                        : 'bg-[#10B981]/10 text-[#10B981]'
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Evolution Chart */}
        {loadingRisk ? (
          <ChartSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -2 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Évolution des risques (7 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskData}>
                <CartesianGrid key="grid-risk" strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-[#3A3A3A]" />
                <XAxis
                  key="xaxis-risk"
                  dataKey="date"
                  stroke="#6B7280"
                  className="dark:stroke-[#9CA3AF]"
                  style={{ fontSize: '12px' }}
                />
                <YAxis key="yaxis-risk" stroke="#6B7280" className="dark:stroke-[#9CA3AF]" style={{ fontSize: '12px' }} />
                <Tooltip
                  key="tooltip-risk"
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  key="legend-risk"
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Line
                  key="line-faible"
                  type="monotone"
                  dataKey="faible"
                  stroke="#6BCB77"
                  strokeWidth={2}
                  dot={{ fill: '#6BCB77', r: 4 }}
                  name="Risque faible"
                />
                <Line
                  key="line-moyen"
                  type="monotone"
                  dataKey="moyen"
                  stroke="#B983FF"
                  strokeWidth={2}
                  dot={{ fill: '#B983FF', r: 4 }}
                  name="Risque moyen"
                />
                <Line
                  key="line-eleve"
                  type="monotone"
                  dataKey="eleve"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', r: 4 }}
                  name="Risque élevé"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Email Categories Chart */}
        {loadingCategory ? (
          <ChartSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -2 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Top 5 catégories d'emails
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid key="grid-category" strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-[#3A3A3A]" />
                <XAxis key="xaxis-category" type="number" stroke="#6B7280" className="dark:stroke-[#9CA3AF]" style={{ fontSize: '12px' }} />
                <YAxis
                  key="yaxis-category"
                  dataKey="categorie"
                  type="category"
                  stroke="#6B7280"
                  className="dark:stroke-[#9CA3AF]"
                  style={{ fontSize: '12px' }}
                  width={180}
                />
                <Tooltip
                  key="tooltip-category"
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar key="bar-count" dataKey="count" fill="#B983FF" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-6 shadow-sm border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Activité récente
        </h3>
        <div className="space-y-3">
          {activityData.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ x: 4, backgroundColor: 'var(--muted)' }}
              className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg border-b border-muted last:border-0 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{
                    scale: activity.risk === 'high' ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: activity.risk === 'high' ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className={`w-2 h-2 rounded-full ${
                    activity.risk === 'high'
                      ? 'bg-destructive'
                      : activity.risk === 'medium'
                      ? 'bg-[#F59E0B]'
                      : 'bg-primary'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.client}
                  </p>
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
