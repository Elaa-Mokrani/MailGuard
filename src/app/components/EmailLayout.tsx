import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Mail,
  AlertTriangle,
  Users,
  Bell,
  History,
  Settings,
  Menu,
  X,
  BarChart3,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { addUserHistoryEvent } from '../lib/history';
import logo from '../../imports/cropped_circle_image_(2).png';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/emails', icon: Mail, label: 'Emails' },
  { path: '/analyse-risque', icon: BarChart3, label: 'Modele BiLSTM' },
  { path: '/clients', icon: Users, label: 'Clients' },
  { path: '/alertes', icon: AlertTriangle, label: 'Alertes' },
  { path: '/historique', icon: History, label: 'Historique' },
  { path: '/parametres', icon: Settings, label: 'Paramètres' },
];

interface EmailLayoutProps {
  children: React.ReactNode;
}

export function EmailLayout({ children }: EmailLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    let session: { email?: string; name?: string } | null = null;
    try {
      session = JSON.parse(localStorage.getItem('mailguard_session') || 'null');
    } catch {
      session = null;
    }

    addUserHistoryEvent({
      type: 'logout',
      client: session?.name ?? 'Utilisateur MailGuard',
      titre: 'Deconnexion utilisateur',
      description: `${session?.email ?? 'Utilisateur'} s'est deconnecte de MailGuard`,
      statut: 'succes',
    });
    localStorage.removeItem('mailguard_session');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-sidebar border-r border-border flex flex-col relative shadow-sm"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <img 
                  src={logo} 
                  alt="MailGuard Logo" 
                  className="w-8 h-8 rounded-xl object-cover shadow-lg" 
                />
                <span className="text-lg font-semibold text-foreground">MailGuard</span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="mx-auto"
              >
                <img 
                  src={logo} 
                  alt="MailGuard Logo" 
                  className="w-8 h-8 rounded-xl object-cover shadow-lg" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link to={item.path}>
                    <motion.div
                      whileHover={{ x: isActive ? 0 : 4, scale: isActive ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
                        ${
                          isActive
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:shadow-sm'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${!isSidebarOpen && 'mx-auto'}`} />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        >
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-3 h-3 text-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-3 h-3 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-xl font-semibold text-foreground">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Analyse intelligente des risques d'impayés
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-secondary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"
              />
            </motion.button>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-destructive/10 rounded-xl transition-colors text-muted-foreground hover:text-destructive"
              title="Se deconnecter"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>

            {/* User Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold shadow-lg cursor-pointer"
            >
              JD
            </motion.div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
