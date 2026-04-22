import { useState } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import {
  History as HistoryIcon,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Search,
  Filter,
} from 'lucide-react';

interface HistoryEvent {
  id: number;
  type: 'email' | 'appel' | 'document' | 'alerte' | 'paiement' | 'action';
  client: string;
  titre: string;
  description: string;
  date: string;
  heure: string;
  gestionnaire: string;
  statut: 'succes' | 'en_cours' | 'echec';
}

const historyEvents: HistoryEvent[] = [
  {
    id: 1,
    type: 'email',
    client: 'SARL Dupont & Fils',
    titre: 'Email à risque élevé détecté',
    description: 'Demande de délai de 60 jours pour facture #12453',
    date: '16 Feb 2026',
    heure: '09:23',
    gestionnaire: 'Sophie Martin',
    statut: 'en_cours',
  },
  {
    id: 2,
    type: 'appel',
    client: 'Industries Martin',
    titre: 'Appel téléphonique effectué',
    description: 'Discussion sur les conditions de paiement',
    date: '16 Feb 2026',
    heure: '08:45',
    gestionnaire: 'Jean Dupuis',
    statut: 'succes',
  },
  {
    id: 3,
    type: 'paiement',
    client: 'Entreprise Leblanc',
    titre: 'Paiement reçu',
    description: 'Facture #12401 - Montant: 12 800 €',
    date: '15 Feb 2026',
    heure: '16:30',
    gestionnaire: 'Système',
    statut: 'succes',
  },
  {
    id: 4,
    type: 'document',
    client: 'SAS Bernard',
    titre: 'Mise en demeure envoyée',
    description: 'Contestation facture #12467 - Action juridique',
    date: '15 Feb 2026',
    heure: '14:12',
    gestionnaire: 'Marie Leblanc',
    statut: 'en_cours',
  },
  {
    id: 5,
    type: 'alerte',
    client: 'Transports Rousseau',
    titre: 'Alerte risque moyen générée',
    description: 'Demande d\'échelonnement en 3 mensualités',
    date: '15 Feb 2026',
    heure: '11:05',
    gestionnaire: 'Système',
    statut: 'en_cours',
  },
  {
    id: 6,
    type: 'action',
    client: 'Commerce Petit',
    titre: 'Réunion planifiée',
    description: 'Négociation plan de paiement - Montant: 52 800 €',
    date: '14 Feb 2026',
    heure: '15:20',
    gestionnaire: 'Sophie Martin',
    statut: 'succes',
  },
  {
    id: 7,
    type: 'email',
    client: 'Services Pro',
    titre: 'Email de rappel envoyé',
    description: 'Relance échéance facture #12389',
    date: '14 Feb 2026',
    heure: '10:30',
    gestionnaire: 'Jean Dupuis',
    statut: 'succes',
  },
  {
    id: 8,
    type: 'paiement',
    client: 'Tech Solutions',
    titre: 'Paiement partiel reçu',
    description: 'Acompte de 30 000 € sur facture #12478',
    date: '13 Feb 2026',
    heure: '14:45',
    gestionnaire: 'Système',
    statut: 'succes',
  },
];

export default function Historique() {
  const [selectedType, setSelectedType] = useState<string>('tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = historyEvents.filter((event) => {
    const matchesType = selectedType === 'tous' || event.type === selectedType;
    const matchesSearch =
      searchTerm === '' ||
      event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.titre.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email':
        return { icon: Mail, color: 'bg-[#B983FF]/10 text-[#B983FF]' };
      case 'appel':
        return { icon: Phone, color: 'bg-[#6BCB77]/10 text-[#6BCB77]' };
      case 'document':
        return { icon: FileText, color: 'bg-[#F59E0B]/10 text-[#F59E0B]' };
      case 'alerte':
        return { icon: AlertTriangle, color: 'bg-[#EF4444]/10 text-[#EF4444]' };
      case 'paiement':
        return { icon: CheckCircle, color: 'bg-[#10B981]/10 text-[#10B981]' };
      case 'action':
        return { icon: User, color: 'bg-[#A78BFA]/10 text-[#A78BFA]' };
      default:
        return { icon: HistoryIcon, color: 'bg-[#6B7280]/10 text-[#6B7280]' };
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'succes':
        return {
          icon: CheckCircle,
          label: 'Succès',
          color: 'bg-[#6BCB77]/10 text-[#6BCB77] border-[#6BCB77]/20',
        };
      case 'en_cours':
        return {
          icon: Clock,
          label: 'En cours',
          color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
        };
      case 'echec':
        return {
          icon: XCircle,
          label: 'Échec',
          color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
        };
      default:
        return {
          icon: Clock,
          label: statut,
          color: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77] cursor-pointer"
            >
              <option value="tous">Tous les types</option>
              <option value="email">Emails</option>
              <option value="appel">Appels</option>
              <option value="document">Documents</option>
              <option value="alerte">Alertes</option>
              <option value="paiement">Paiements</option>
              <option value="action">Actions</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
        <div className="space-y-4">
          {filteredEvents.map((event, index) => {
            const iconData = getEventIcon(event.type);
            const Icon = iconData.icon;
            const statutBadge = getStatutBadge(event.statut);
            const StatutIcon = statutBadge.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex gap-4 pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0"
              >
                {/* Timeline Line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-[#E5E7EB]"></div>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${iconData.color} flex items-center justify-center flex-shrink-0 relative z-10`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-[#1E1E1E] mb-1">
                        {event.titre}
                      </h3>
                      <p className="text-sm text-[#2F2F2F] mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {event.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.date} à {event.heure}
                        </span>
                        <span>Par {event.gestionnaire}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border ${statutBadge.color}`}
                      >
                        <StatutIcon className="w-3 h-3" />
                        {statutBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center">
            <HistoryIcon className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
            <p className="text-[#6B7280]">
              Aucun événement ne correspond aux filtres sélectionnés
            </p>
          </div>
        )}
      </div>
    </div>
  );
}