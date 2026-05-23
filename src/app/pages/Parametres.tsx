import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Database,
  Globe,
  Mail,
  Save,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
  User,
  Brain,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAPI } from "../hooks/useAPI";
import { getDatasetInfo, getDatasetStats, getModelMetadata, type DatasetInfoData, type DatasetStats, type ModelMetadata } from "../lib/api";

const SETTINGS_STORAGE_KEY = "mailguard_user_settings";

export default function Parametres() {
  const [notifications, setNotifications] = useState({
    email: true,
    risqueEleve: true,
    paiement: true,
    rapportHebdo: false,
  });

  const [preferences, setPreferences] = useState({
    langue: "fr",
    timezone: "Africa/Tunis",
    seuilMoyen: 40,
    seuilEleve: 70,
  });

  const [profile, setProfile] = useState({
    nom: "Elaa Mokrani",
    email: "elaa.mokrani@mailguard.local",
    role: "Administratrice PFE / Analyste risque",
  });

  const [savedMessage, setSavedMessage] = useState("");

  const { data: datasetInfo } = useAPI<DatasetInfoData>(getDatasetInfo, { delay: 0 });
  const { data: stats } = useAPI<DatasetStats>(getDatasetStats, { delay: 0 });
  const { data: metadata } = useAPI<ModelMetadata>(getModelMetadata, { delay: 0 });

  const modelStatus = useMemo(() => {
    if (!metadata) return { label: "Chargement...", color: "text-muted-foreground", icon: Brain };
    if (metadata.available) return { label: "Modele LSTM operationnel", color: "text-primary", icon: CheckCircle2 };
    return { label: "Modele indisponible", color: "text-destructive", icon: AlertTriangle };
  }, [metadata]);

  const StatusIcon = modelStatus.icon;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}");
      if (saved.profile) setProfile(saved.profile);
      if (saved.notifications) setNotifications(saved.notifications);
      if (saved.preferences) setPreferences(saved.preferences);
    } catch {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        profile,
        notifications,
        preferences,
        saved_at: new Date().toISOString(),
      })
    );
    setSavedMessage("Parametres enregistres localement.");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/10 to-primary/10 p-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-foreground">Parametres MailGuard</h2>
            <p className="text-muted-foreground">
              Configuration utilisateur, statut du backend et informations sur le modele LSTM.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Profil utilisateur</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Nom complet</label>
              <input
                type="text"
                value={profile.nom}
                onChange={(event) => setProfile((current) => ({ ...current, nom: event.target.value }))}
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Role</label>
              <input
                type="text"
                value={profile.role}
                onChange={(event) => setProfile((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Statut du backend et du modele</h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted p-4">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-5 w-5 ${modelStatus.color}`} />
                <div>
                  <p className={`text-sm font-medium ${modelStatus.color}`}>{modelStatus.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {datasetInfo?.modele_version ?? "Version modele indisponible"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Dataset</p>
                <p className="mt-1 text-sm font-medium text-foreground">{datasetInfo?.total_emails ?? 0} emails</p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Accuracy affichee</p>
                <p className="mt-1 text-sm font-medium text-foreground">{datasetInfo?.modele_accuracy ?? 0}%</p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Models dir</p>
                <p className="mt-1 break-all text-sm text-foreground">{metadata?.models_dir ?? "N/A"}</p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Emails aujourd'hui</p>
                <p className="mt-1 text-sm font-medium text-foreground">{stats?.todayEmails ?? 0}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6BCB77]/10 text-[#6BCB77]">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "email" as const,
                title: "Notifications par email",
                description: "Recevoir un resume des nouvelles analyses.",
              },
              {
                key: "risqueEleve" as const,
                title: "Alertes risque eleve",
                description: "Signaler immediatement les emails les plus sensibles.",
              },
              {
                key: "paiement" as const,
                title: "Mises a jour paiement",
                description: "Notifier les confirmations de reglement detectees.",
              },
              {
                key: "rapportHebdo" as const,
                title: "Rapport hebdomadaire",
                description: "Envoyer une synthese hebdomadaire du portefeuille.",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-xl bg-muted p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(event) =>
                      setNotifications((current) => ({
                        ...current,
                        [item.key]: event.target.checked,
                      }))
                    }
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-border after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Preferences d'analyse</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Langue interface</label>
              <select
                value={preferences.langue}
                onChange={(event) => setPreferences((current) => ({ ...current, langue: event.target.value }))}
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="fr">Francais</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Fuseau horaire</label>
              <select
                value={preferences.timezone}
                onChange={(event) => setPreferences((current) => ({ ...current, timezone: event.target.value }))}
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Africa/Tunis">Africa/Tunis</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>

            <div className="rounded-xl bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Seuil risque moyen</label>
                <span className="text-sm text-[#F59E0B]">{preferences.seuilMoyen}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={preferences.seuilMoyen}
                onChange={(event) => setPreferences((current) => ({ ...current, seuilMoyen: Number(event.target.value) }))}
                className="w-full accent-[#F59E0B]"
              />
            </div>

            <div className="rounded-xl bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Seuil risque eleve</label>
                <span className="text-sm text-destructive">{preferences.seuilEleve}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="90"
                value={preferences.seuilEleve}
                onChange={(event) => setPreferences((current) => ({ ...current, seuilEleve: Number(event.target.value) }))}
                className="w-full accent-[#EF4444]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Source de donnees</h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-muted p-4">
              <div className="mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <p className="text-sm font-medium text-foreground">Periode analysee</p>
              </div>
              <p className="text-sm text-muted-foreground">{datasetInfo?.periode_analyse ?? "Indisponible"}</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="mb-1 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Langues detectees</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats ? Object.keys(stats.emailsByLanguage).join(" / ") : "Indisponible"}
              </p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <div className="mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-foreground">Clients a risque</p>
              </div>
              <p className="text-sm text-muted-foreground">{stats?.clientsAtRisk ?? 0} clients identifies</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center justify-end gap-4"
      >
        {savedMessage ? <span className="text-sm text-primary">{savedMessage}</span> : null}
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
        >
          <Save className="h-5 w-5" />
          Enregistrer les parametres
        </button>
      </motion.div>
    </div>
  );
}
