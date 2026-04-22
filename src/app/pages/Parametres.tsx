import { motion } from 'motion/react';
import React from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Mail,
  Database,
  Palette,
  Globe,
  Save,
} from 'lucide-react';

export default function Parametres() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    risqueEleve: true,
    paiements: true,
    hebdomadaire: false,
  });

  const [preferences, setPreferences] = React.useState({
    langue: 'fr',
    timezone: 'Europe/Paris',
    theme: 'light',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#B983FF]/10 to-[#6BCB77]/10 rounded-2xl p-8 border border-[#B983FF]/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6BCB77] to-[#B983FF] flex items-center justify-center">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-1">
              Paramètres
            </h2>
            <p className="text-[#6B7280]">
              Configurez votre application selon vos préférences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#B983FF]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#B983FF]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E1E1E]">
              Profil utilisateur
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Nom complet
              </label>
              <input
                type="text"
                defaultValue="Jean Dupuis"
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="jean.dupuis@riskguard.fr"
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Fonction
              </label>
              <input
                type="text"
                defaultValue="Gestionnaire de recouvrement"
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6BCB77]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#6BCB77]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E1E1E]">
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#F5F6FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-[#2F2F2F]">
                  Notifications par email
                </p>
                <p className="text-xs text-[#6B7280]">
                  Recevoir les alertes par email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6BCB77] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6BCB77]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F5F6FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-[#2F2F2F]">
                  Alertes risque élevé
                </p>
                <p className="text-xs text-[#6B7280]">
                  Alertes immédiates pour les risques élevés
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.risqueEleve}
                  onChange={(e) =>
                    setNotifications({ ...notifications, risqueEleve: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6BCB77] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6BCB77]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F5F6FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-[#2F2F2F]">
                  Confirmations paiement
                </p>
                <p className="text-xs text-[#6B7280]">
                  Notifications lors des paiements reçus
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.paiements}
                  onChange={(e) =>
                    setNotifications({ ...notifications, paiements: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6BCB77] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6BCB77]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F5F6FA] rounded-xl">
              <div>
                <p className="text-sm font-medium text-[#2F2F2F]">
                  Rapport hebdomadaire
                </p>
                <p className="text-xs text-[#6B7280]">
                  Synthèse hebdomadaire des activités
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.hebdomadaire}
                  onChange={(e) =>
                    setNotifications({ ...notifications, hebdomadaire: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6BCB77] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6BCB77]"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E1E1E]">
              Sécurité
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Confirmer mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77]"
              />
            </div>

            <button className="w-full px-4 py-2.5 bg-[#B983FF] text-white rounded-xl font-medium hover:bg-[#A78BFA] transition-colors">
              Changer le mot de passe
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E1E1E]">
              Préférences
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Langue
              </label>
              <select
                value={preferences.langue}
                onChange={(e) =>
                  setPreferences({ ...preferences, langue: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77] cursor-pointer"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Fuseau horaire
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) =>
                  setPreferences({ ...preferences, timezone: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77] cursor-pointer"
              >
                <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="America/New_York">America/New York (GMT-5)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F2F2F] mb-2">
                Thème
              </label>
              <select
                value={preferences.theme}
                onChange={(e) =>
                  setPreferences({ ...preferences, theme: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F5F6FA] border border-[#E5E7EB] rounded-xl text-sm text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#6BCB77] cursor-pointer"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode (bientôt)</option>
                <option value="auto">Automatique (bientôt)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button className="px-8 py-3 bg-[#6BCB77] text-white rounded-xl font-medium hover:bg-[#4ADE80] transition-colors flex items-center gap-2 shadow-lg shadow-[#6BCB77]/30">
          <Save className="w-5 h-5" />
          Enregistrer les modifications
        </button>
      </motion.div>
    </div>
  );
}