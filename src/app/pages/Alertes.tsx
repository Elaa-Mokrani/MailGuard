import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Filter,
  Search,
  Download,
  ChevronDown,
  TrendingUp,
  Mail,
  Phone,
} from 'lucide-react';

interface Alert {
  id: number;
  client: string;
  niveau: 'faible' | 'moyen' | 'eleve';
  montant: string;
  action: string;
  date: string;
  gestionnaire: string;
}

const alerts: Alert[] = [
  {
    id: 1,
    client: 'SAS Bernard',
    niveau: 'eleve',
    montant: '67 200 €',
    action: 'Relance juridique immédiate',
    date: '2026-02-16',
    gestionnaire: 'Sophie Martin',
  },
  {
    id: 2,
    client: 'SARL Dupont & Fils',
    niveau: 'eleve',
    montant: '45 000 €',
    action: 'Proposition échelonnement',
    date: '2026-02-16',
    gestionnaire: 'Jean Dupuis',
  },
  {
    id: 3,
    client: 'Transports Rousseau',
    niveau: 'moyen',
    montant: '34 500 €',
    action: 'Appel téléphonique',
    date: '2026-02-15',
    gestionnaire: 'Marie Leblanc',
  },
  {
    id: 4,
    client: 'Industries Martin',
    niveau: 'moyen',
    montant: '23 500 €',
    action: 'Email de suivi',
    date: '2026-02-15',
    gestionnaire: 'Sophie Martin',
  },
  {
    id: 5,
    client: 'Commerce Petit',
    niveau: 'eleve',
    montant: '52 800 €',
    action: 'Mise en demeure',
    date: '2026-02-14',
    gestionnaire: 'Jean Dupuis',
  },
  {
    id: 6,
    client: 'Services Pro',
    niveau: 'moyen',
    montant: '18 200 €',
    action: 'Email de rappel',
    date: '2026-02-14',
    gestionnaire: 'Marie Leblanc',
  },
  {
    id: 7,
    client: 'Construction Moderne',
    niveau: 'faible',
    montant: '12 400 €',
    action: 'Surveillance mensuelle',
    date: '2026-02-13',
    gestionnaire: 'Sophie Martin',
  },
  {
    id: 8,
    client: 'Tech Solutions',
    niveau: 'eleve',
    montant: '89 500 €',
    action: 'Réunion urgente',
    date: '2026-02-13',
    gestionnaire: 'Jean Dupuis',
  },
];

export default function AlertsPage() {
  const [selectedNiveau, setSelectedNiveau] = useState<string>('tous');
  const [selectedGestionnaire, setSelectedGestionnaire] = useState<string>('tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesNiveau = selectedNiveau === 'tous' || alert.niveau === selectedNiveau;
    const matchesGestionnaire =
      selectedGestionnaire === 'tous' || alert.gestionnaire === selectedGestionnaire;
    const matchesSearch =
      searchTerm === '' ||
      alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.action.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesNiveau && matchesGestionnaire && matchesSearch;
  });

  const getNiveauBadge = (niveau: string) => {
    switch (niveau) {
      case 'eleve':
        return {
          label: 'Élevé',
          color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
        };
      case 'moyen':
        return {
          label: 'Moyen',
          color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
        };
      case 'faible':
        return {
          label: 'Faible',
          color: 'bg-[#6BCB77]/10 text-[#6BCB77] border-[#6BCB77]/20',
        };
      default:
        return { label: niveau, color: '' };
    }
  };

  const stats = {
    total: alerts.length,
    eleve: alerts.filter((a) => a.niveau === 'eleve').length,
    moyen: alerts.filter((a) => a.niveau === 'moyen').length,
    faible: alerts.filter((a) => a.niveau === 'faible').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total alertes</p>
              <p className="text-2xl font-semibold text-[#1E1E1E]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#B983FF]/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#B983FF]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Risque élevé</p>
              <p className="text-2xl font-semibold text-[#EF4444]">{stats.eleve}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#EF4444]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Risque moyen</p>
              <p className="text-2xl font-semibold text-[#F59E0B]">{stats.moyen}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Risque faible</p>
              <p className="text-2xl font-semibold text-[#6BCB77]">{stats.faible}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#6BCB77]/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#6BCB77]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Rechercher un client ou une action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">Filtres:</span>
            </div>

            <select
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              className="px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77] appearance-none cursor-pointer"
            >
              <option value="tous">Tous les niveaux</option>
              <option value="eleve">Risque élevé</option>
              <option value="moyen">Risque moyen</option>
              <option value="faible">Risque faible</option>
            </select>

            <select
              value={selectedGestionnaire}
              onChange={(e) => setSelectedGestionnaire(e.target.value)}
              className="px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77] appearance-none cursor-pointer"
            >
              <option value="tous">Tous les gestionnaires</option>
              <option value="Sophie Martin">Sophie Martin</option>
              <option value="Jean Dupuis">Jean Dupuis</option>
              <option value="Marie Leblanc">Marie Leblanc</option>
            </select>

            <button className="px-4 py-2.5 bg-[#B983FF] text-white rounded-xl text-sm font-medium hover:bg-[#A78BFA] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Alerts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F6FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Niveau risque
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Montant exposé
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Action recommandée
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Gestionnaire
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredAlerts.map((alert, index) => {
                const badge = getNiveauBadge(alert.niveau);

                return (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#F5F6FA]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B983FF] to-[#A78BFA] flex items-center justify-center text-white text-xs font-semibold">
                          {alert.client.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[#1E1E1E]">
                          {alert.client}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-[#1E1E1E]">
                        {alert.montant}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#2F2F2F]">{alert.action}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#6B7280]">{alert.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#2F2F2F]">{alert.gestionnaire}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#6BCB77]/10 rounded-lg transition-colors group">
                          <Mail className="w-4 h-4 text-[#6B7280] group-hover:text-[#6BCB77]" />
                        </button>
                        <button className="p-2 hover:bg-[#B983FF]/10 rounded-lg transition-colors group">
                          <Phone className="w-4 h-4 text-[#6B7280] group-hover:text-[#B983FF]" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[#6B7280]">Aucune alerte ne correspond aux filtres sélectionnés</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
