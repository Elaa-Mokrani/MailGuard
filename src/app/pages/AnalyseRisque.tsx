import { motion } from "motion/react";
import { Brain, TrendingUp, Target, Activity, CheckCircle, Info, ShieldAlert, Languages, SmilePlus, MailOpen } from "lucide-react";
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
  Cell,
} from "recharts";

const targetMetrics = [
  {
    target: "type_email_label",
    train_accuracy: 98.872,
    test_accuracy: 98.3333,
    test_f1_weighted: 98.3547,
    overfit_gap: 0.5386,
    classes: "[Accuse de reception, Communication interne, ...]",
  },
  {
    target: "urgence_niveau",
    train_accuracy: 97.6118,
    test_accuracy: 91.8293,
    test_f1_weighted: 91.8557,
    overfit_gap: 5.7825,
    classes: "[elevee, faible, moyenne]",
  },
  {
    target: "sentiment_label",
    train_accuracy: 98.3333,
    test_accuracy: 91.2602,
    test_f1_weighted: 91.4806,
    overfit_gap: 7.0732,
    classes: "[negatif, neutre, positif]",
  },
  {
    target: "risque_impaye",
    train_accuracy: 94.3394,
    test_accuracy: 86.9106,
    test_f1_weighted: 87.0435,
    overfit_gap: 7.4289,
    classes: "[eleve, faible, moyen]",
  },
  {
    target: "langue_label",
    train_accuracy: 82.124,
    test_accuracy: 82.1545,
    test_f1_weighted: 76.9198,
    overfit_gap: -0.0305,
    classes: "[EN, FR]",
  },
];

const trainAverage = 94.26;
const validationAverage = 91.2;
const testAverage = 90.1;
const avgGap = 4.96;

const featureImportanceData = [
  { feature: "Type email", importance: 0.32 },
  { feature: "Urgence", importance: 0.24 },
  { feature: "Montant", importance: 0.18 },
  { feature: "Sentiment", importance: 0.15 },
  { feature: "Encours client", importance: 0.11 },
];

const performanceOverTimeData = [
  { mois: "Aug", train: 92.1, validation: 89.5, test: 87.2 },
  { mois: "Sep", train: 92.8, validation: 90.2, test: 88.1 },
  { mois: "Oct", train: 93.4, validation: 90.8, test: 88.6 },
  { mois: "Nov", train: 93.9, validation: 91.0, test: 89.0 },
  { mois: "Dec", train: 94.3, validation: 91.1, test: 89.5 },
  { mois: "Jan", train: 94.26, validation: 91.2, test: 90.1 },
];

const radarData = [
  { metric: "Train", value: trainAverage },
  { metric: "Validation", value: validationAverage },
  { metric: "Test", value: testAverage },
  { metric: "F1-Score", value: 89.13 },
  { metric: "Recall", value: 88.1 },
  { metric: "Precision", value: 90.0 },
];

const overfitData = targetMetrics.map((item) => ({
  target: item.target.replace("_label", ""),
  gap: item.overfit_gap,
  color: item.overfit_gap >= 6 ? "#EF4444" : item.overfit_gap >= 3 ? "#F59E0B" : "#6BCB77",
}));

const modelMetrics = [
  {
    name: "Train",
    value: trainAverage,
    description: "Moyenne accuracy sur donnees d'entrainement",
    icon: Target,
    color: "from-[#6BCB77] to-[#4ADE80]",
  },
  {
    name: "Validation",
    value: validationAverage,
    description: "Moyenne accuracy sur donnees de validation",
    icon: CheckCircle,
    color: "from-[#B983FF] to-[#A78BFA]",
  },
  {
    name: "Test",
    value: testAverage,
    description: "Moyenne accuracy sur donnees de test",
    icon: Activity,
    color: "from-[#F59E0B] to-[#FCD34D]",
  },
  {
    name: "Ecart",
    value: avgGap,
    description: "Moyenne de l'ecart Train-Test",
    icon: TrendingUp,
    color: "from-[#EF4444] to-[#F87171]",
  },
];

const targetIcons = {
  type_email_label: MailOpen,
  urgence_niveau: ShieldAlert,
  sentiment_label: SmilePlus,
  risque_impaye: TrendingUp,
  langue_label: Languages,
} as const;

export default function AnalyseRisque() {
  return (
    <div className="space-y-6">
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
            <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">XAI du modele LSTM multi-taches</h2>
            <p className="text-[#2F2F2F] mb-4">
              Le modele LSTM analyse automatiquement le texte des emails et les variables metier pour
              predire type d'email, urgence, sentiment, risque d'impaye et langue.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#6B7280]">Architecture: Embedding + BiLSTM + branche numerique</span>
              </div>
              <div className="flex items-center gap-4 text-[#2F2F2F] font-medium">
                <span>Train: <span className="text-[#6BCB77]">{trainAverage}%</span></span>
                <span>Validation: <span className="text-[#B983FF]">{validationAverage}%</span></span>
                <span>Test: <span className="text-[#F59E0B]">{testAverage}%</span></span>
                <span>Ecart: <span className="text-[#EF4444]">{avgGap}%</span></span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-semibold text-[#1E1E1E] mb-1">{metric.value}%</h3>
              <p className="text-sm font-medium text-[#2F2F2F] mb-1">{metric.name}</p>
              <p className="text-xs text-[#6B7280]">{metric.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">Evolution du modele LSTM</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mois" stroke="#6B7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="train" stroke="#6BCB77" strokeWidth={2} dot={{ fill: "#6BCB77", r: 4 }} name="Train" />
              <Line type="monotone" dataKey="validation" stroke="#B983FF" strokeWidth={2} dot={{ fill: "#B983FF", r: 4 }} name="Validation" />
              <Line type="monotone" dataKey="test" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 4 }} name="Test" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">Vue d'ensemble des metriques</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="metric" style={{ fontSize: "11px", fill: "#6B7280" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: "10px", fill: "#6B7280" }} />
              <Radar name="Performance" dataKey="value" stroke="#B983FF" fill="#B983FF" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">Importance des caracteristiques</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureImportanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" style={{ fontSize: "12px" }} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke="#6B7280" style={{ fontSize: "12px" }} width={150} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              />
              <Bar dataKey="importance" fill="#6BCB77" radius={[0, 8, 8, 0]} name="Importance" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6">Overfit gap par cible</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={overfitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="target" stroke="#6B7280" style={{ fontSize: "11px" }} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="gap" radius={[8, 8, 0, 0]}>
                {overfitData.map((entry) => (
                  <Cell key={entry.target} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
      >
        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">Mesures reelles sur le test set</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-left">
                <th className="py-3 px-3 text-sm font-semibold text-[#6B7280]">Target</th>
                <th className="py-3 px-3 text-sm font-semibold text-[#6B7280]">Train accuracy</th>
                <th className="py-3 px-3 text-sm font-semibold text-[#6B7280]">Test accuracy</th>
                <th className="py-3 px-3 text-sm font-semibold text-[#6B7280]">Test F1 weighted</th>
                <th className="py-3 px-3 text-sm font-semibold text-[#6B7280]">Overfit gap</th>
                <th className="py-3 px-3 text-sm font-semibold text-[#6B7280]">Classes</th>
              </tr>
            </thead>
            <tbody>
              {targetMetrics.map((metric) => (
                <tr key={metric.target} className="border-b border-[#E5E7EB] align-top">
                  <td className="py-4 px-3 text-sm font-medium text-[#111827]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B983FF]/10 text-[#B983FF]">
                        {(() => {
                          const Icon = targetIcons[metric.target as keyof typeof targetIcons] ?? Brain;
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </div>
                      <span>{metric.target}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm text-[#111827]">{metric.train_accuracy.toFixed(4)}%</td>
                  <td className="py-4 px-3 text-sm text-[#111827]">{metric.test_accuracy.toFixed(4)}%</td>
                  <td className="py-4 px-3 text-sm text-[#111827]">{metric.test_f1_weighted.toFixed(4)}%</td>
                  <td className="py-4 px-3 text-sm text-[#111827]">{metric.overfit_gap.toFixed(4)}%</td>
                  <td className="py-4 px-3 text-sm text-[#6B7280]">{metric.classes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
