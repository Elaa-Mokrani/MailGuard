import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  CheckCircle,
  Edit,
  Send,
  User,
  Calendar,
  FileText,
  DollarSign,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
} from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import { EmailCardSkeleton } from '../components/SkeletonLoader';
import { LanguageBadge } from '../components/LanguageBadge';
import { EmailFilters } from '../components/EmailFilters';
import { DatasetInfo } from '../components/DatasetInfo';
import { useFilters } from '../hooks/useFilters';
import { realEmails, Email } from '../data/mockData';

export default function EmailAnalysis() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [validated, setValidated] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Simulate API call to fetch emails
  const { data: emailsData, loading } = useAPI(async () => realEmails, { delay: 800 });

  // Filters
  const { filters, filteredEmails, updateFilter, resetFilters } = useFilters(emailsData || []);

  const getRiskBadge = (technicite: number = 0) => {
    if (technicite >= 70) {
      return { label: 'Risque élevé', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    } else if (technicite >= 40) {
      return { label: 'Risque moyen', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' };
    } else {
      return { label: 'Risque faible', color: 'bg-primary/10 text-primary border-primary/20' };
    }
  };

  const getSentimentIcon = (sentiment: string = 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-4 h-4 text-primary" />;
      case 'negative':
        return <Frown className="w-4 h-4 text-destructive" />;
      default:
        return <Meh className="w-4 h-4 text-[#F59E0B]" />;
    }
  };

  const getHealthColor = (sante: string) => {
    switch (sante) {
      case 'EXCELLENTE':
        return 'text-primary';
      case 'BONNE':
        return 'text-[#10B981]';
      case 'MOYENNE':
        return 'text-[#F59E0B]';
      case 'RISQUÉE':
        return 'text-[#EF4444]';
      case 'FRAGILE':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleValidate = () => {
    if (selectedEmail) {
      setValidated([...validated, selectedEmail.email_id]);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleEdit = () => {
    alert(`Mode édition pour l'email de ${selectedEmail?.client_nom}`);
  };

  const handleSuggestResponse = () => {
    alert(`Génération de réponse suggérée pour ${selectedEmail?.client_nom}...`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M€`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K€`;
    }
    return formatCurrency(amount);
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

  return (
    <div className="space-y-6">
      {/* Dataset Info */}
      <DatasetInfo />

      {/* Filters */}
      <EmailFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        totalResults={filteredEmails.length}
      />

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-8 z-50 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Analyse validée avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 h-[calc(100vh-16rem)] min-h-[600px]">
        {/* Email List - Left Column */}
        <div className="w-2/5 bg-card rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-medium text-foreground mb-1">
              Emails reçus
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredEmails.length} email{filteredEmails.length > 1 ? 's' : ''} à analyser
            </p>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {loading ? (
              <>
                <EmailCardSkeleton />
                <EmailCardSkeleton />
                <EmailCardSkeleton />
                <EmailCardSkeleton />
              </>
            ) : filteredEmails.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucun email ne correspond aux filtres</p>
                </div>
              </div>
            ) : (
              filteredEmails.map((email, index) => {
                const badge = getRiskBadge(email.technicite);
                const isSelected = selectedEmail?.email_id === email.email_id;
                const isValidated = validated.includes(email.email_id);

                return (
                  <motion.div
                    key={email.email_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedEmail(email)}
                    whileHover={{ x: 4 }}
                    className={`p-5 border-b border-border cursor-pointer transition-all duration-200 relative ${
                      isSelected ? 'bg-muted shadow-sm' : 'hover:bg-muted/50'
                    }`}
                  >
                    {isValidated && (
                      <div className="absolute top-2 right-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-[#A78BFA] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {email.client_nom.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-base font-medium text-foreground truncate">
                              {email.client_nom}
                            </p>
                            <LanguageBadge langue={email.langue} size="sm" />
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(email.date_envoi)}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {getSentimentIcon(email.sentiment)}
                      </div>
                    </div>
                    <p className="text-base text-foreground mb-3 line-clamp-2 leading-snug">
                      {email.sujet}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1.5 rounded-lg border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Score: {email.technicite || 0}%
                      </span>
                      <span className={`text-xs px-2.5 py-1.5 rounded-lg ${
                        email.priorite === 'HAUTE' ? 'bg-destructive/10 text-destructive' :
                        email.priorite === 'NORMALE' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {email.priorite}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Email Detail - Right Column */}
        {selectedEmail ? (
          <motion.div
            key={selectedEmail.email_id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-card rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden max-w-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex-shrink-0">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-medium text-foreground leading-tight">
                      {selectedEmail.sujet}
                    </h2>
                    <LanguageBadge langue={selectedEmail.langue} size="md" />
                  </div>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedEmail.client_nom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedEmail.date_envoi)}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getHealthColor(selectedEmail.client_sante)}`}>
                      <AlertTriangle className="w-4 h-4" />
                      {selectedEmail.client_sante}
                    </div>
                  </div>
                </div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`text-sm px-4 py-2 rounded-lg border flex-shrink-0 ${
                    getRiskBadge(selectedEmail.technicite).color
                  }`}
                >
                  {getRiskBadge(selectedEmail.technicite).label}
                </motion.span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
              {/* Email Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contenu de l'email
                </h3>
                <div className="bg-muted rounded-xl p-6">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {selectedEmail.corps}
                  </p>
                </div>
              </motion.div>

              {/* Extracted Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Informations extraites
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedEmail.montant && (
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-muted rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Montant</span>
                      </div>
                      <p className="text-base text-foreground">
                        {formatCurrency(selectedEmail.montant)}
                      </p>
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-muted rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span className="text-xs text-muted-foreground">Secteur</span>
                    </div>
                    <p className="text-base text-foreground">
                      {selectedEmail.client_secteur}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-muted rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-[#10B981]" />
                      <span className="text-xs text-muted-foreground">Pays</span>
                    </div>
                    <p className="text-base text-foreground">
                      {selectedEmail.client_pays}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* AI Score */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6"
              >
                <h3 className="text-sm font-medium text-foreground mb-5">
                  Score IA & Analyse
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-foreground">Score de risque technique</span>
                      <span className="text-base text-foreground">
                        {selectedEmail.technicite || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedEmail.technicite || 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          (selectedEmail.technicite || 0) >= 70
                            ? 'bg-destructive'
                            : (selectedEmail.technicite || 0) >= 40
                            ? 'bg-[#F59E0B]'
                            : 'bg-primary'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-foreground">Sentiment détecté:</span>
                      {getSentimentIcon(selectedEmail.sentiment)}
                      <span className="text-sm text-foreground capitalize">
                        {selectedEmail.sentiment === 'positive'
                          ? 'Positif'
                          : selectedEmail.sentiment === 'negative'
                          ? 'Négatif'
                          : 'Neutre'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Encours client</span>
                      <span className="text-base text-foreground">
                        {formatLargeAmount(selectedEmail.client_encours)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-foreground">
                      <span>Priorité:</span>{' '}
                      <span className={
                        selectedEmail.priorite === 'HAUTE' ? 'text-destructive' :
                        selectedEmail.priorite === 'NORMALE' ? 'text-[#F59E0B]' :
                        'text-muted-foreground'
                      }>
                        {selectedEmail.priorite}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-border flex items-center gap-4 flex-shrink-0 bg-card">
              <motion.button
                onClick={handleValidate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Valider l'analyse
              </motion.button>
              <motion.button
                onClick={handleEdit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </motion.button>
              <motion.button
                onClick={handleSuggestResponse}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Réponse suggérée
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Sélectionnez un email</p>
              <p className="text-sm mt-2">Choisissez un email dans la liste pour voir les détails</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
