import { motion } from 'motion/react';
import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  Calendar,
  Building2,
  Globe,
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { realClients } from '../data/mockData';
import { DatasetInfo } from '../components/DatasetInfo';

const paymentHistoryData = [
  { mois: 'Août', paye: 250000, retard: 50000 },
  { mois: 'Sept', paye: 300000, retard: 80000 },
  { mois: 'Oct', paye: 280000, retard: 120000 },
  { mois: 'Nov', paye: 350000, retard: 70000 },
  { mois: 'Déc', paye: 320000, retard: 150000 },
  { mois: 'Jan', paye: 380000, retard: 100000 },
];

const riskEvolutionData = [
  { mois: 'Août', score: 65 },
  { mois: 'Sept', score: 72 },
  { mois: 'Oct', score: 68 },
  { mois: 'Nov', score: 75 },
  { mois: 'Déc', score: 80 },
  { mois: 'Jan', score: 78 },
];

const invoiceStatusData = [
  { name: 'Payées', value: 12, color: '#6BCB77' },
  { name: 'En retard', value: 3, color: '#EF4444' },
  { name: 'À venir', value: 2, color: '#B983FF' },
];

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = React.useState(realClients[0]);

  const getHealthScore = (sante: string) => {
    switch (sante) {
      case 'EXCELLENTE':
        return 95;
      case 'BONNE':
        return 75;
      case 'MOYENNE':
        return 50;
      case 'RISQUÉE':
        return 30;
      case 'FRAGILE':
        return 15;
      default:
        return 50;
    }
  };

  const getRiskBadge = (sante: string) => {
    switch (sante) {
      case 'EXCELLENTE':
        return {
          label: 'Excellente santé',
          color: 'bg-primary/10 text-primary border-primary/20',
        };
      case 'BONNE':
        return {
          label: 'Bonne santé',
          color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
        };
      case 'MOYENNE':
        return {
          label: 'Santé moyenne',
          color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
        };
      case 'RISQUÉE':
        return {
          label: 'Santé risquée',
          color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
        };
      case 'FRAGILE':
        return {
          label: 'Santé fragile',
          color: 'bg-destructive/10 text-destructive border-destructive/20',
        };
      default:
        return {
          label: 'Santé moyenne',
          color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculer le taux de paiement (simulé)
  const calculatePaymentRate = (sante: string) => {
    switch (sante) {
      case 'EXCELLENTE':
        return 98;
      case 'BONNE':
        return 88;
      case 'MOYENNE':
        return 75;
      case 'RISQUÉE':
        return 60;
      case 'FRAGILE':
        return 45;
      default:
        return 70;
    }
  };

  return (
    <div className="space-y-6">
      <DatasetInfo />

      {/* Client Selection */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {realClients.map((client) => {
          const badge = getRiskBadge(client.client_sante);
          const isSelected = selectedClient.client_id === client.client_id;

          return (
            <motion.button
              key={client.client_id}
              onClick={() => setSelectedClient(client)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 w-72 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'bg-secondary/10 border-secondary'
                  : 'bg-card border-border hover:border-secondary/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                  {client.client_nom.charAt(0)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {client.client_nom}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{client.client_pays}</span>
                <span>{client.nb_emails} emails</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Client Overview Card */}
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
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                {selectedClient.client_nom}
              </h2>
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
              <span
                className={`inline-flex px-4 py-2 rounded-xl text-sm font-medium border ${
                  getRiskBadge(selectedClient.client_sante).color
                }`}
              >
                {getRiskBadge(selectedClient.client_sante).label}
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {getHealthScore(selectedClient.client_sante)}
              <span className="text-lg text-muted-foreground">/100</span>
            </p>
            <p className="text-xs text-muted-foreground">Score santé financière</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar className="w-4 h-4" />
          Dernière interaction : {formatDate(selectedClient.derniere_interaction)}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-muted rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">Encours total</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(selectedClient.client_encours)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-muted rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-secondary" />
              <span className="text-xs text-muted-foreground">Emails échangés</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {selectedClient.nb_emails}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-muted rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span className="text-xs text-muted-foreground">Taux paiement</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {calculatePaymentRate(selectedClient.client_sante)}%
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-muted rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-xs text-muted-foreground">Santé client</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {selectedClient.client_sante}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Historique des paiements (6 derniers mois)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={paymentHistoryData}>
              <CartesianGrid key="grid-payment" strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis key="xaxis-payment" dataKey="mois" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis key="yaxis-payment" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                key="tooltip-payment"
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'var(--foreground)',
                }}
              />
              <Legend key="legend-payment" wrapperStyle={{ fontSize: '12px' }} />
              <Bar key="bar-paye" dataKey="paye" fill="#6BCB77" radius={[8, 8, 0, 0]} name="Payé" />
              <Bar key="bar-retard" dataKey="retard" fill="#EF4444" radius={[8, 8, 0, 0]} name="Retard" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Invoice Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Statut des factures
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={invoiceStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'var(--foreground)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {invoiceStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk Evolution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-6 shadow-sm border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Évolution du score de risque
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskEvolutionData}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis key="xaxis" dataKey="mois" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis key="yaxis" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} domain={[0, 100]} />
            <Tooltip
              key="tooltip"
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            />
            <Line
              key="line-score"
              type="monotone"
              dataKey="score"
              stroke="#B983FF"
              strokeWidth={3}
              dot={{ fill: '#B983FF', r: 6 }}
              name="Score risque"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
