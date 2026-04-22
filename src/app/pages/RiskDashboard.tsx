import { motion } from "motion/react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const contractDistribution = [
  { range: "0-10M", count: 45 },
  { range: "10-25M", count: 32 },
  { range: "25-50M", count: 18 },
  { range: "50-100M", count: 12 },
  { range: "100M+", count: 8 },
];

const riskHistogram = [
  { score: "0-20", count: 15 },
  { score: "21-40", count: 28 },
  { score: "41-60", count: 42 },
  { score: "61-80", count: 35 },
  { score: "81-100", count: 22 },
];

const topRiskyClients = [
  { name: "FinServe Ltd", risk: 91, exposure: "€52M" },
  { name: "TechCorp SA", risk: 85, exposure: "€45M" },
  { name: "AutoFinance", risk: 81, exposure: "€44M" },
  { name: "CloudNet GmbH", risk: 78, exposure: "€39M" },
  { name: "GlobalTrade Inc", risk: 72, exposure: "€32M" },
  { name: "InnovateHub", risk: 68, exposure: "€28M" },
  { name: "SmartChain Co", risk: 63, exposure: "€21M" },
  { name: "DataFlow Systems", risk: 55, exposure: "€18M" },
];

const exposureConcentration = [
  { name: "BNP Paribas", value: 580, color: "#6D28D9" },
  { name: "Société Générale", value: 420, color: "#8B5CF6" },
  { name: "Crédit Agricole", value: 380, color: "#10B981" },
  { name: "HSBC", value: 340, color: "#059669" },
  { name: "Autres", value: 680, color: "#6B7280" },
];

const getRiskColor = (risk: number) => {
  if (risk >= 80) return "#EF4444";
  if (risk >= 60) return "#F59E0B";
  return "#10B981";
};

export function RiskDashboard() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
      >
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Banque</label>
            <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6D28D9]">
              <option>Toutes les Banques</option>
              <option>BNP Paribas</option>
              <option>Société Générale</option>
              <option>Crédit Agricole</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Période</label>
            <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6D28D9]">
              <option>6 Derniers Mois</option>
              <option>Dernière Année</option>
              <option>Tout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#6B7280] mb-2">Seuil de Risque</label>
            <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6D28D9]">
              <option>Tous les Niveaux</option>
              <option>Risque Élevé (80+)</option>
              <option>Risque Moyen (60-79)</option>
              <option>Risque Faible (&lt;60)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-2 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#6D28D9]/30 transition-all">
              Appliquer les Filtres
            </button>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Contract Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Distribution des Montants de Contrats</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contractDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#111827",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D28D9" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Histogram */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Histogramme des Scores de Risque</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskHistogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="score" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#111827",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {riskHistogram.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index >= 4
                        ? "#EF4444"
                        : index >= 3
                        ? "#F59E0B"
                        : index >= 2
                        ? "#10B981"
                        : "#059669"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Risky Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Top 10 Clients à Risque</h3>
          <div className="space-y-3">
            {topRiskyClients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:bg-[#F3F4F6] transition-colors"
              >
                <div className="flex-shrink-0 w-8 text-center font-bold text-[#6B7280]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#111827]">{client.name}</div>
                  <div className="text-xs text-[#6B7280]">{client.exposure}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${client.risk}%`,
                        backgroundColor: getRiskColor(client.risk),
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getRiskColor(client.risk) }}
                  >
                    {client.risk}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Exposure Concentration Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Concentration de l'Exposition</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={exposureConcentration}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {exposureConcentration.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: "#111827",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => `€${value}M`}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="text-sm text-[#6B7280] mb-2">Total Contrats Analysés</div>
          <div className="text-3xl font-bold text-[#111827]">1,284</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="text-sm text-[#6B7280] mb-2">Contrats à Risque Élevé</div>
          <div className="text-3xl font-bold text-[#EF4444]">142</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="text-sm text-[#6B7280] mb-2">Score de Risque Moyen</div>
          <div className="text-3xl font-bold text-[#F59E0B]">67.3</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="text-sm text-[#6B7280] mb-2">Exposition Totale à Risque</div>
          <div className="text-3xl font-bold text-[#10B981]">€428M</div>
        </div>
      </motion.div>
    </div>
  );
}
