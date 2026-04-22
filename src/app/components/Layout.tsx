import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Network,
  Shield,
  Bell,
  Search,
  Settings,
  User,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

const navigation = [
  { name: "Tableau de Bord", href: "/", icon: LayoutDashboard },
  { name: "Télécharger Documents", href: "/upload", icon: Upload },
  { name: "Analyse Documents", href: "/analysis", icon: FileText },
  { name: "Intelligence Graphique", href: "/graph", icon: Network },
  { name: "Tableau de Risques", href: "/risk", icon: Shield },
  { name: "Alertes", href: "/alerts", icon: Bell },
  { name: "Recherche", href: "/search", icon: Search },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E5E7EB] z-50 shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] rounded-lg flex items-center justify-center shadow-lg shadow-[#6D28D9]/20">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-[#111827]">FinGraph</div>
                <div className="text-xs text-[#6B7280]">Plateforme Analytique</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));

              return (
                <Link key={item.name} to={item.href} className="relative">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#6D28D9]/10 to-transparent border border-[#6D28D9]/30 text-[#6D28D9] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6D28D9] to-[#8B5CF6] rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#111827]">Jean Analyste</div>
                <div className="text-xs text-[#6B7280]">Analyste Senior</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB] shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">
                {navigation.find(item => {
                  if (location.pathname === "/") return item.href === "/";
                  return item.href !== "/" && location.pathname.startsWith(item.href);
                })?.name || "Tableau de Bord"}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
              >
                <Bell className="w-5 h-5 text-[#111827]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse" />
              </motion.button>

              {/* User Menu */}
              <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>

      {/* Background Gradient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6D28D9]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}