import { motion } from "motion/react";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#6D28D9]/10 to-[#8B5CF6]/10 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-[#6D28D9]" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-[#111827]">404</h1>
        <p className="text-xl text-[#6B7280] mb-8">Page non trouvée</p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#6D28D9]/30 transition-all"
          >
            <Home className="w-5 h-5" />
            Retour au Tableau de Bord
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}