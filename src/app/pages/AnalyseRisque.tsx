import { motion } from 'motion/react';
import { Brain, TrendingUp, Target, Activity, CheckCircle, Info } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const modelMetrics = [
  {
    name: 'Train',
    value: 94.5,
    description: 'Performance sur données d\'entraînement',
    icon: Target,
    color: 'from-[#6BCB77] to-[#4ADE80]',
  },
  {
    name: 'Validation',
    value: 91.2,
    description: 'Performance sur données de validation',
    icon: CheckCircle,
    color: 'from-[#B983FF] to-[#A78BFA]',
  },
  {
    name: 'Test',
    value: 89.76,
    description: 'Performance sur données de test',
    icon: Activity,
    color: 'from-[#F59E0B] to-[#FCD34D]',
  },
  {
    name: 'Écart',
    value: 4.7,
    description: 'Écart Train-Test',
    icon: TrendingUp,
    color: 'from-[#EF4444] to-[#F87171]',
  },
];

const featureImportanceData = [
  { feature: 'Historique paiements', importance: 0.32 },
  { feature: 'Délai moyen', importance: 0.24 },
  { feature: 'Montant factures', importance: 0.18 },
  { feature: 'Sentiment email', importance: 0.15 },
  { feature: 'Fréquence retards', importance: 0.11 },
];

const performanceOverTimeData = [
  { mois: 'Août', train: 92.1, validation: 89.5, test: 87.2 },
  { mois: 'Sept', train: 92.8, validation: 90.2, test: 88.1 },
  { mois: 'Oct', train: 93.4, validation: 90.8, test: 88.6 },
  { mois: 'Nov', train: 93.9, validation: 91.0, test: 89.0 },
  { mois: 'Déc', train: 94.3, validation: 91.1, test: 89.5 },
  { mois: 'Jan', train: 94.5, validation: 91.2, test: 89.76 },
];

const confusionMatrixData = [
  { category: 'Vrais négatifs', value: 1250, color: '#6BCB77' },
  { category: 'Vrais positifs', value: 890, color: '#B983FF' },
  { category: 'Faux positifs', value: 85, color: '#F59E0B' },
  { category: 'Faux négatifs', value: 42, color: '#EF4444' },
];

const radarData = [
  { metric: 'Train', value: 94.5 },
  { metric: 'Validation', value: 91.2 },
  { metric: 'Test', value: 89.76 },
  { metric: 'F1-Score', value: 90.8 },
  { metric: 'Recall', value: 88.5 },
  { metric: 'Precision', value: 91.3 },
];

export default function AnalyseRisque() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#B983FF]/10 to-[#6BCB77]/10 rounded-2xl p-8 border border-[#B983FF]/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6BCB77] to-[#B983FF] flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
              Modèle XGBoost - Intelligence Artificielle
            </h2>
            <p className="text-[#2F2F2F] mb-4">
              Le modèle XGBoost analyse automatiquement le contenu des emails et l'historique des
              paiements pour prédire avec précision le risque d'impayé. Grâce au machine
              learning, il s'améliore continuellement avec chaque nouvelle donnée.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#6B7280]">
                  Dernière mise à jour: 15 février 2026
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#2F2F2F] font-medium">
                <span>Train: <span className="text-[#6BCB77]">94.5%</span></span>
                <span>Validation: <span className="text-[#B983FF]">91.2%</span></span>
                <span>Test: <span className="text-[#F59E0B]">89.76%</span></span>
                <span>Temps: <span className="text-[#6B7280]">340s</span></span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelMetrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-semibold text-[#1E1E1E] mb-1">
                {metric.value}%
              </h3>
              <p className="text-sm font-medium text-[#2F2F2F] mb-1">{metric.name}</p>
              <p className="text-xs text-[#6B7280]">{metric.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">
            Évolution XGBoost (6 mois)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceOverTimeData}>
              <CartesianGrid key="grid-perf" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis key="xaxis-perf" dataKey="mois" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis key="yaxis-perf" stroke="#6B7280" style={{ fontSize: '12px' }} domain={[80, 100]} />
              <Tooltip
                key="tooltip-perf"
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend key="legend-perf" wrapperStyle={{ fontSize: '12px' }} />
              <Line
                key="line-train"
                type="monotone"
                dataKey="train"
                stroke="#6BCB77"
                strokeWidth={2}
                dot={{ fill: '#6BCB77', r: 4 }}
                name="Train"
              />
              <Line
                key="line-validation"
                type="monotone"
                dataKey="validation"
                stroke="#B983FF"
                strokeWidth={2}
                dot={{ fill: '#B983FF', r: 4 }}
                name="Validation"
              />
              <Line
                key="line-test"
                type="monotone"
                dataKey="test"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
                name="Test"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">
            Vue d'ensemble des métriques
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid key="polargrid" stroke="#E5E7EB" />
              <PolarAngleAxis
                key="polarangle"
                dataKey="metric"
                style={{ fontSize: '11px', fill: '#6B7280' }}
              />
              <PolarRadiusAxis
                key="polarradius"
                angle={90}
                domain={[0, 100]}
                style={{ fontSize: '10px', fill: '#6B7280' }}
              />
              <Radar
                key="radar-perf"
                name="Performance"
                dataKey="value"
                stroke="#B983FF"
                fill="#B983FF"
                fillOpacity={0.6}
              />
              <Tooltip
                key="tooltip-radar"
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">
            Importance des caractéristiques
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureImportanceData} layout="vertical">
              <CartesianGrid key="grid-feature" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                key="xaxis-feature"
                type="number"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <YAxis
                key="yaxis-feature"
                dataKey="feature"
                type="category"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                width={150}
              />
              <Tooltip
                key="tooltip-feature"
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
              />
              <Bar
                key="bar-importance"
                dataKey="importance"
                fill="#6BCB77"
                radius={[0, 8, 8, 0]}
                name="Importance"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">
            Matrice de confusion
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={confusionMatrixData}>
              <CartesianGrid key="grid-confusion" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                key="xaxis-confusion"
                dataKey="category"
                stroke="#6B7280"
                style={{ fontSize: '11px' }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis key="yaxis-confusion" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                key="tooltip-confusion"
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar key="bar-confusion" dataKey="value" radius={[8, 8, 0, 0]}>
                {confusionMatrixData.map((entry, index) => (
                  <rect key={`rect-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {confusionMatrixData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-[#6B7280]">{item.category}</span>
                <span className="text-xs font-semibold text-[#1E1E1E]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
      >
        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">
          Comment fonctionne le modèle ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#6BCB77]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-[#6BCB77]">1</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1E1E1E] mb-1">
                Collecte des données
              </h4>
              <p className="text-xs text-[#6B7280]">
                Extraction automatique des informations depuis les emails et l'historique
                de paiements.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#B983FF]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-[#B983FF]">2</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1E1E1E] mb-1">
                Analyse prédictive
              </h4>
              <p className="text-xs text-[#6B7280]">
                Algorithmes de machine learning pour calculer le score de risque avec une
                précision de 94%.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-[#10B981]">3</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1E1E1E] mb-1">
                Recommandations
              </h4>
              <p className="text-xs text-[#6B7280]">
                Suggestions d'actions personnalisées pour chaque client selon son profil
                de risque.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
