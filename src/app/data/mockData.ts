// Données réelles simulées basées sur le dataset Codix (12 300 emails)

export interface Email {
  email_id: string;
  date_envoi: string;
  dossier: string;
  type_email: string;
  langue: 'FR' | 'EN';
  from_nom: string;
  from_email: string;
  to_nom: string;
  sujet: string;
  corps: string;
  montant?: number;
  client_id: string;
  client_nom: string;
  client_secteur: string;
  client_pays: string;
  client_sante: 'EXCELLENTE' | 'BONNE' | 'MOYENNE' | 'RISQUÉE' | 'FRAGILE';
  client_encours: number;
  priorite: 'HAUTE' | 'NORMALE' | 'BASSE';
  technicite?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface Client {
  client_id: string;
  client_nom: string;
  client_secteur: string;
  client_pays: string;
  client_sante: 'EXCELLENTE' | 'BONNE' | 'MOYENNE' | 'RISQUÉE' | 'FRAGILE';
  client_encours: number;
  nb_emails: number;
  derniere_interaction: string;
}

// Dataset metadata
export const datasetMetadata = {
  total_emails: 12300,
  derniere_mise_a_jour: '2025-12-16T14:30:00',
  periode_analyse: '2025-01-01 à 2025-12-16',
  modele_accuracy: 90.37,
  modele_version: 'XGBoost v2.1',
};

// Emails réels du dataset Codix
export const realEmails: Email[] = [
  {
    email_id: 'MAIL-20251216-00001',
    date_envoi: '2026-04-11T09:38:50',
    dossier: 'Inbox',
    type_email: 'Relance de paiement - Niveau 3',
    langue: 'EN',
    from_nom: 'Service Recouvrement',
    from_email: 'recouvrement@codix.eu',
    to_nom: 'Allen, Brown and Foster',
    sujet: 'Payment reminder - Level 3 - INV-30432',
    corps: 'Dear Sir/Madam,\n\nThis is our third reminder regarding the overdue payment for invoice INV-30432. The payment was due on March 15, 2026. We kindly request immediate settlement to avoid further actions.\n\nAmount due: €245,750\n\nBest regards,\nRecovery Department',
    montant: 245750,
    client_id: 'CLI-88852',
    client_nom: 'Allen, Brown and Foster',
    client_secteur: 'Technologies de l\'information',
    client_pays: 'United Kingdom',
    client_sante: 'RISQUÉE',
    client_encours: 885237777,
    priorite: 'HAUTE',
    technicite: 85,
    sentiment: 'negative',
  },
  {
    email_id: 'MAIL-20251216-00002',
    date_envoi: '2026-04-11T08:15:23',
    dossier: 'Inbox',
    type_email: 'Demande de délai de paiement',
    langue: 'FR',
    from_nom: 'Comptabilité Générale',
    from_email: 'compta@durand-industrie.fr',
    to_nom: 'Service Client',
    sujet: 'Demande de report échéance - Facture F-2026-1245',
    corps: 'Bonjour,\n\nSuite à des difficultés temporaires de trésorerie, nous sollicitons un délai supplémentaire de 30 jours pour le règlement de la facture F-2026-1245 d\'un montant de 156 800 €.\n\nNous nous engageons à procéder au paiement au plus tard le 15 mai 2026.\n\nCordialement,\nDirection Financière',
    montant: 156800,
    client_id: 'CLI-45623',
    client_nom: 'Durand Industrie SA',
    client_secteur: 'Industrie manufacturière',
    client_pays: 'France',
    client_sante: 'MOYENNE',
    client_encours: 423890500,
    priorite: 'HAUTE',
    technicite: 62,
    sentiment: 'neutral',
  },
  {
    email_id: 'MAIL-20251216-00003',
    date_envoi: '2026-04-11T07:42:11',
    dossier: 'Inbox',
    type_email: 'Confirmation de paiement',
    langue: 'FR',
    from_nom: 'Trésorerie',
    from_email: 'tresorerie@leblanc-group.fr',
    to_nom: 'Service Facturation',
    sujet: 'Confirmation virement - Factures F-2026-1189 et F-2026-1201',
    corps: 'Bonjour,\n\nNous vous confirmons avoir procédé ce jour au virement bancaire pour les factures suivantes :\n\n- F-2026-1189 : 89 450 €\n- F-2026-1201 : 112 300 €\n\nMontant total : 201 750 €\n\nVous devriez recevoir les fonds sous 48h ouvrées.\n\nCordialement,\nService Trésorerie',
    montant: 201750,
    client_id: 'CLI-12890',
    client_nom: 'Leblanc Group',
    client_secteur: 'Commerce de gros',
    client_pays: 'France',
    client_sante: 'BONNE',
    client_encours: 567234100,
    priorite: 'BASSE',
    technicite: 18,
    sentiment: 'positive',
  },
  {
    email_id: 'MAIL-20251216-00004',
    date_envoi: '2026-04-10T16:28:35',
    dossier: 'Inbox',
    type_email: 'Contestation de facture',
    langue: 'FR',
    from_nom: 'Service Juridique',
    from_email: 'legal@martin-services.fr',
    to_nom: 'Direction Commerciale',
    sujet: 'Contestation formelle - Facture F-2026-1156',
    corps: 'Madame, Monsieur,\n\nNous contestons formellement la facture F-2026-1156 pour les raisons suivantes :\n\n1. Les prestations facturées ne correspondent pas au bon de commande initial\n2. Les quantités mentionnées sont incorrectes\n3. Le prix unitaire appliqué diffère du devis accepté\n\nNous demandons l\'émission d\'un avoir et la refacturation correcte.\n\nService Juridique',
    montant: 324500,
    client_id: 'CLI-78945',
    client_nom: 'Martin Services SARL',
    client_secteur: 'Services aux entreprises',
    client_pays: 'France',
    client_sante: 'FRAGILE',
    client_encours: 1245678900,
    priorite: 'HAUTE',
    technicite: 91,
    sentiment: 'negative',
  },
  {
    email_id: 'MAIL-20251216-00005',
    date_envoi: '2026-04-10T14:55:12',
    dossier: 'Inbox',
    type_email: 'Demande d\'échelonnement',
    langue: 'FR',
    from_nom: 'Direction Financière',
    from_email: 'daf@rousseau-transport.fr',
    to_nom: 'Service Recouvrement',
    sujet: 'Proposition échelonnement - Factures en retard',
    corps: 'Bonjour,\n\nFace à des contraintes de trésorerie actuelles, nous proposons un plan d\'échelonnement pour les factures en retard (montant total : 267 890 €) :\n\n- Acompte immédiat : 50 000 €\n- Versement mensuel : 36 315 € sur 6 mois\n\nNous attendons votre retour pour finaliser cet accord.\n\nCordialement,\nDAF',
    montant: 267890,
    client_id: 'CLI-34567',
    client_nom: 'Rousseau Transport',
    client_secteur: 'Transport et logistique',
    client_pays: 'France',
    client_sante: 'RISQUÉE',
    client_encours: 789456200,
    priorite: 'HAUTE',
    technicite: 68,
    sentiment: 'neutral',
  },
  {
    email_id: 'MAIL-20251216-00006',
    date_envoi: '2026-04-10T11:22:48',
    dossier: 'Inbox',
    type_email: 'Relance de paiement - Niveau 1',
    langue: 'EN',
    from_nom: 'Accounts Receivable',
    from_email: 'ar@globaltech.com',
    to_nom: 'Finance Department',
    sujet: 'Payment reminder - Invoice GT-2026-8945',
    corps: 'Dear Finance Team,\n\nWe kindly remind you that invoice GT-2026-8945 for the amount of £125,400 is now 15 days overdue.\n\nDue date: March 25, 2026\nCurrent date: April 10, 2026\n\nPlease process the payment at your earliest convenience.\n\nBest regards,\nAR Team',
    montant: 145680,
    client_id: 'CLI-67234',
    client_nom: 'GlobalTech Solutions Ltd',
    client_secteur: 'Technologies de l\'information',
    client_pays: 'United Kingdom',
    client_sante: 'BONNE',
    client_encours: 456789300,
    priorite: 'NORMALE',
    technicite: 42,
    sentiment: 'neutral',
  },
  {
    email_id: 'MAIL-20251216-00007',
    date_envoi: '2026-04-10T09:15:00',
    dossier: 'Inbox',
    type_email: 'Demande de renseignements',
    langue: 'FR',
    from_nom: 'Service Comptabilité',
    from_email: 'compta@bernard-sas.fr',
    to_nom: 'Service Client',
    sujet: 'Demande copie facture F-2026-1089',
    corps: 'Bonjour,\n\nNous n\'avons pas reçu l\'original de la facture F-2026-1089. Pourriez-vous nous en transmettre une copie par email ?\n\nMerci d\'avance.\n\nCordialement,\nComptabilité',
    client_id: 'CLI-23456',
    client_nom: 'Bernard SAS',
    client_secteur: 'Construction',
    client_pays: 'France',
    client_sante: 'EXCELLENTE',
    client_encours: 234567800,
    priorite: 'BASSE',
    technicite: 12,
    sentiment: 'neutral',
  },
  {
    email_id: 'MAIL-20251216-00008',
    date_envoi: '2026-04-09T17:30:22',
    dossier: 'Inbox',
    type_email: 'Relance de paiement - Niveau 2',
    langue: 'EN',
    from_nom: 'Credit Control',
    from_email: 'credit@europacorp.eu',
    to_nom: 'Accounts Payable',
    sujet: 'Second reminder - Overdue invoice EC-2026-5623',
    corps: 'Dear AP Team,\n\nThis is our second reminder regarding invoice EC-2026-5623 (€189,500) which is now 45 days overdue.\n\nOriginal due date: February 23, 2026\n\nWe request immediate payment. If you have already processed this payment, please provide proof of transfer.\n\nRegards,\nCredit Control Department',
    montant: 189500,
    client_id: 'CLI-89234',
    client_nom: 'Europa Corporation',
    client_secteur: 'Services financiers',
    client_pays: 'Belgium',
    client_sante: 'MOYENNE',
    client_encours: 678923400,
    priorite: 'HAUTE',
    technicite: 71,
    sentiment: 'negative',
  },
  {
    email_id: 'MAIL-20251216-00009',
    date_envoi: '2026-04-09T15:18:44',
    dossier: 'Inbox',
    type_email: 'Annonce de paiement',
    langue: 'FR',
    from_nom: 'Trésorerie',
    from_email: 'tresorerie@dupont-fils.fr',
    to_nom: 'Service Facturation',
    sujet: 'Paiement programmé - Factures mars 2026',
    corps: 'Bonjour,\n\nNous vous informons que les paiements suivants sont programmés pour le 15 avril 2026 :\n\n- F-2026-0987 : 67 800 €\n- F-2026-1023 : 89 200 €\n- F-2026-1045 : 124 500 €\n\nMontant total : 281 500 €\n\nCordialement,\nService Trésorerie',
    montant: 281500,
    client_id: 'CLI-56789',
    client_nom: 'Dupont & Fils',
    client_secteur: 'Commerce de détail',
    client_pays: 'France',
    client_sante: 'BONNE',
    client_encours: 345678900,
    priorite: 'NORMALE',
    technicite: 25,
    sentiment: 'positive',
  },
  {
    email_id: 'MAIL-20251216-00010',
    date_envoi: '2026-04-09T13:45:30',
    dossier: 'Inbox',
    type_email: 'Demande de conditions de paiement',
    langue: 'EN',
    from_nom: 'Procurement',
    from_email: 'procurement@asiapac.com',
    to_nom: 'Sales Department',
    sujet: 'Request for extended payment terms',
    corps: 'Dear Sales Team,\n\nDue to current market conditions and cash flow optimization, we would like to request extended payment terms for future orders:\n\nCurrent terms: 30 days net\nRequested terms: 60 days net\n\nThis would significantly improve our business relationship going forward.\n\nBest regards,\nProcurement Manager',
    client_id: 'CLI-45123',
    client_nom: 'Asia Pacific Trading',
    client_secteur: 'Commerce international',
    client_pays: 'Singapore',
    client_sante: 'BONNE',
    client_encours: 567890100,
    priorite: 'NORMALE',
    technicite: 38,
    sentiment: 'neutral',
  },
];

// Clients réels agrégés
export const realClients: Client[] = [
  {
    client_id: 'CLI-88852',
    client_nom: 'Allen, Brown and Foster',
    client_secteur: 'Technologies de l\'information',
    client_pays: 'United Kingdom',
    client_sante: 'RISQUÉE',
    client_encours: 885237777,
    nb_emails: 15,
    derniere_interaction: '2026-04-11T09:38:50',
  },
  {
    client_id: 'CLI-45623',
    client_nom: 'Durand Industrie SA',
    client_secteur: 'Industrie manufacturière',
    client_pays: 'France',
    client_sante: 'MOYENNE',
    client_encours: 423890500,
    nb_emails: 8,
    derniere_interaction: '2026-04-11T08:15:23',
  },
  {
    client_id: 'CLI-12890',
    client_nom: 'Leblanc Group',
    client_secteur: 'Commerce de gros',
    client_pays: 'France',
    client_sante: 'BONNE',
    client_encours: 567234100,
    nb_emails: 12,
    derniere_interaction: '2026-04-11T07:42:11',
  },
  {
    client_id: 'CLI-78945',
    client_nom: 'Martin Services SARL',
    client_secteur: 'Services aux entreprises',
    client_pays: 'France',
    client_sante: 'FRAGILE',
    client_encours: 1245678900,
    nb_emails: 22,
    derniere_interaction: '2026-04-10T16:28:35',
  },
  {
    client_id: 'CLI-34567',
    client_nom: 'Rousseau Transport',
    client_secteur: 'Transport et logistique',
    client_pays: 'France',
    client_sante: 'RISQUÉE',
    client_encours: 789456200,
    nb_emails: 18,
    derniere_interaction: '2026-04-10T14:55:12',
  },
  {
    client_id: 'CLI-67234',
    client_nom: 'GlobalTech Solutions Ltd',
    client_secteur: 'Technologies de l\'information',
    client_pays: 'United Kingdom',
    client_sante: 'BONNE',
    client_encours: 456789300,
    nb_emails: 6,
    derniere_interaction: '2026-04-10T11:22:48',
  },
  {
    client_id: 'CLI-23456',
    client_nom: 'Bernard SAS',
    client_secteur: 'Construction',
    client_pays: 'France',
    client_sante: 'EXCELLENTE',
    client_encours: 234567800,
    nb_emails: 4,
    derniere_interaction: '2026-04-10T09:15:00',
  },
  {
    client_id: 'CLI-89234',
    client_nom: 'Europa Corporation',
    client_secteur: 'Services financiers',
    client_pays: 'Belgium',
    client_sante: 'MOYENNE',
    client_encours: 678923400,
    nb_emails: 11,
    derniere_interaction: '2026-04-09T17:30:22',
  },
];

// Statistiques calculées
export const getStatistics = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayEmails = realEmails.filter(
    (email) => email.date_envoi.split('T')[0] === today
  ).length;

  const clientsAtRisk = realClients.filter(
    (client) => client.client_sante === 'RISQUÉE' || client.client_sante === 'FRAGILE'
  ).length;

  const totalExposed = realClients
    .filter((client) => client.client_sante === 'RISQUÉE' || client.client_sante === 'FRAGILE')
    .reduce((sum, client) => sum + client.client_encours, 0);

  const avgProcessingTime = 2.1; // heures

  const emailsByLanguage = {
    FR: realEmails.filter((e) => e.langue === 'FR').length,
    EN: realEmails.filter((e) => e.langue === 'EN').length,
  };

  const emailsByType = realEmails.reduce((acc, email) => {
    acc[email.type_email] = (acc[email.type_email] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emailsByRisk = {
    faible: realEmails.filter((e) => (e.technicite || 0) < 40).length,
    moyen: realEmails.filter((e) => (e.technicite || 0) >= 40 && (e.technicite || 0) < 70).length,
    eleve: realEmails.filter((e) => (e.technicite || 0) >= 70).length,
  };

  return {
    todayEmails,
    clientsAtRisk,
    totalExposed,
    avgProcessingTime,
    emailsByLanguage,
    emailsByType,
    emailsByRisk,
  };
};

// Types d'emails uniques
export const emailTypes = [
  ...new Set(realEmails.map((e) => e.type_email)),
];

// Niveaux de santé client
export const healthLevels = ['EXCELLENTE', 'BONNE', 'MOYENNE', 'RISQUÉE', 'FRAGILE'] as const;
