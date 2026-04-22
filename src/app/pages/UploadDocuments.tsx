import { useState } from "react";
import { motion } from "motion/react";
import { Upload, File, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

const recentUploads = [
  {
    id: 1,
    fileName: "BNP_Contract_2024_Q1.pdf",
    client: "TechCorp SA",
    uploadDate: "2026-02-13 14:32",
    status: "completed",
    riskScore: 85,
  },
  {
    id: 2,
    fileName: "SG_Financial_Statement.pdf",
    client: "GlobalTrade Inc",
    uploadDate: "2026-02-13 13:15",
    status: "processing",
    riskScore: null,
  },
  {
    id: 3,
    fileName: "CA_Guarantee_Document.pdf",
    client: "InnovateHub",
    uploadDate: "2026-02-13 11:45",
    status: "completed",
    riskScore: 68,
  },
  {
    id: 4,
    fileName: "HSBC_Loan_Agreement.pdf",
    client: "FinServe Ltd",
    uploadDate: "2026-02-13 10:22",
    status: "error",
    riskScore: null,
  },
  {
    id: 5,
    fileName: "DB_Investment_Report.pdf",
    client: "DataFlow Systems",
    uploadDate: "2026-02-13 09:18",
    status: "completed",
    riskScore: 55,
  },
];

const getRiskColor = (risk: number | null) => {
  if (!risk) return "#9CA3AF";
  if (risk >= 80) return "#EF4444";
  if (risk >= 60) return "#F59E0B";
  return "#10B981";
};

export function UploadDocuments() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(recentUploads);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic here
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-white rounded-xl border-2 border-dashed p-12 transition-all shadow-sm ${
            isDragging
              ? "border-[#6D28D9] bg-[#6D28D9]/5"
              : "border-[#E5E7EB] hover:border-[#6D28D9]/50"
          }`}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6D28D9]/5 to-[#8B5CF6]/5 opacity-0 hover:opacity-100 transition-opacity" />
          
          <div className="relative flex flex-col items-center justify-center space-y-4">
            <motion.div
              animate={{ y: isDragging ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-gradient-to-br from-[#6D28D9]/10 to-[#8B5CF6]/10 rounded-full"
            >
              <Upload className="w-12 h-12 text-[#6D28D9]" />
            </motion.div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-[#111827]">
                Déposez vos documents financiers ici ou parcourez
              </h3>
              <p className="text-[#6B7280] mb-4">
                PDF, DOC, DOCX jusqu'à 50MB
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#6D28D9]/30 transition-all">
                Parcourir les Fichiers
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Uploads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm"
      >
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">Téléchargements Récents</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">Nom du Fichier</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">Client</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">Date de Téléchargement</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">Statut</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">Score de Risque</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F3F4F6] rounded-lg">
                        <File className="w-4 h-4 text-[#6D28D9]" />
                      </div>
                      <span className="font-medium text-[#111827]">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6B7280]">{file.client}</td>
                  <td className="py-4 px-6 text-[#6B7280]">{file.uploadDate}</td>
                  <td className="py-4 px-6">
                    {file.status === "completed" && (
                      <div className="flex items-center gap-2 text-[#10B981]">
                        <CheckCircle className="w-4 h-4" />
                        <span>Terminé</span>
                      </div>
                    )}
                    {file.status === "processing" && (
                      <div className="flex items-center gap-2 text-[#6D28D9]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>En cours</span>
                      </div>
                    )}
                    {file.status === "error" && (
                      <div className="flex items-center gap-2 text-[#EF4444]">
                        <AlertCircle className="w-4 h-4" />
                        <span>Erreur</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {file.riskScore ? (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getRiskColor(file.riskScore)}20`,
                          color: getRiskColor(file.riskScore),
                          border: `1px solid ${getRiskColor(file.riskScore)}40`,
                        }}
                      >
                        {file.riskScore}
                      </span>
                    ) : (
                      <span className="text-[#6B7280]">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-[#6D28D9]/10 text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/20 transition-colors">
                        Voir
                      </button>
                      <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                        <X className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}