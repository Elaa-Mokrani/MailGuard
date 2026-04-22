import { motion } from "motion/react";
import { TrendingUp, TrendingDown, FileText, Shield, AlertTriangle, DollarSign } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const kpiData = [
  {
    title: "Exposition Totale",
    value: "€2.4Md",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Contrats Actifs",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Score de Risque Moyen",
    value: "67.3",
    change: "-3.1%",
    trend: "down",
    icon: Shield,
  },
  {
    title: "Taux de Défaut",
    value: "2.4%",
    change: "-0.5%",
    trend: "down",
    icon: AlertTriangle,
  },
];

const exposureByBank = [
  { name: "BNP Paribas", value: 580 },
  { name: "Société Générale", value: 420 },
  { name: "Crédit Agricole", value: 380 },
  { name: "HSBC", value: 340 },
  { name: "Deutsche Bank", value: 290 },
  { name: "Santander", value: 250 },
];

const riskEvolution = [
  { month: "Jan", score: 72 },
  { month: "Fév", score: 68 },
  { month: "Mar", score: 71 },
  { month: "Avr", score: 69 },
  { month: "Mai", score: 65 },
  { month: "Juin", score: 67 },
];

const riskMatrix = [
  { client: "TechCorp SA", bank: "BNP", risk: 85, exposure: "€45M" },
  { client: "GlobalTrade Inc", bank: "SG", risk: 72, exposure: "€32M" },
  { client: "InnovateHub", bank: "CA", risk: 68, exposure: "€28M" },
  { client: "FinServe Ltd", bank: "HSBC", risk: 91, exposure: "€52M" },
  { client: "DataFlow Systems", bank: "DB", risk: 55, exposure: "€18M" },
  { client: "CloudNet GmbH", bank: "Sant", risk: 78, exposure: "€39M" },
  { client: "SmartChain Co", bank: "BNP", risk: 63, exposure: "€21M" },
  { client: "AutoFinance", bank: "SG", risk: 81, exposure: "€44M" },
];

const getRiskColor = (risk: number) => {
  if (risk >= 80) return "#EF4444";
  if (risk >= 60) return "#F59E0B";
  return "#10B981";
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10 transition-all">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6D28D9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gradient-to-br from-[#6D28D9]/10 to-[#8B5CF6]/10 rounded-lg">
                    <kpi.icon className="w-5 h-5 text-[#6D28D9]" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    kpi.trend === "up" ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}>
                    {kpi.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {kpi.change}
                  </div>
                </div>
                
                <div className="text-3xl font-bold mb-1 text-[#111827]">{kpi.value}</div>
                <div className="text-sm text-[#6B7280]">{kpi.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart - Exposure by Bank */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Exposition par Banque (€M)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exposureByBank}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {exposureByBank.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#barGradient${index})`}
                  />
                ))}
              </Bar>
              <defs>
                {exposureByBank.map((_, index) => (
                  <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D28D9" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart - Risk Evolution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#111827]">Évolution du Risque</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} domain={[60, 75]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6D28D9" 
                strokeWidth={3}
                dot={{ fill: '#6D28D9', r: 6 }}
                activeDot={{ r: 8, fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Risk Concentration Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 text-[#111827]">Matrice de Concentration du Risque</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Banque</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Exposition</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Score Risque</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {riskMatrix.map((item, index) => (
                <motion.tr
                  key={item.client}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors group"
                >
                  <td className="py-3 px-4 text-[#111827]">{item.client}</td>
                  <td className="py-3 px-4 text-[#6B7280]">{item.bank}</td>
                  <td className="py-3 px-4 font-semibold text-[#111827]">{item.exposure}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.risk}%` }}
                          transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
                          className="h-full"
                          style={{ backgroundColor: getRiskColor(item.risk) }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-[#111827]">{item.risk}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getRiskColor(item.risk)}20`,
                        color: getRiskColor(item.risk),
                        border: `1px solid ${getRiskColor(item.risk)}40`
                      }}
                    >
                      {item.risk >= 80 ? "Risque Élevé" : item.risk >= 60 ? "Moyen" : "Risque Faible"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}