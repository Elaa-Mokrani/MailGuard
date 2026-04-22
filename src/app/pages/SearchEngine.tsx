import { useState } from "react";
import { motion } from "motion/react";
import { Search, Building2, User, FileText, TrendingUp } from "lucide-react";

const searchResults = {
  companies: [
    { id: 1, name: "TechCorp SA", type: "Technologie", exposure: "€45M", risk: 85, contracts: 3 },
    { id: 2, name: "GlobalTrade Inc", type: "Commerce", exposure: "€32M", risk: 72, contracts: 4 },
    { id: 3, name: "InnovateHub", type: "Conseil", exposure: "€28M", risk: 68, contracts: 2 },
  ],
  directors: [
    { id: 1, name: "Jean-Pierre Durand", role: "PDG", companies: ["TechCorp SA", "GlobalTrade Inc"], totalExposure: "€77M" },
    { id: 2, name: "Michael Smith", role: "Directeur Financier", companies: ["InnovateHub", "TechCorp SA"], totalExposure: "€73M" },
    { id: 3, name: "Anna Mueller", role: "Directrice Générale", companies: ["FinServe Ltd"], totalExposure: "€52M" },
  ],
  contracts: [
    { id: 1, title: "BNP_Contract_2024_Q1.pdf", company: "TechCorp SA", bank: "BNP Paribas", amount: "€45M", date: "2024-01-15", status: "Actif" },
    { id: 2, title: "SG_Financial_Statement.pdf", company: "GlobalTrade Inc", bank: "Société Générale", amount: "€32M", date: "2024-02-20", status: "Actif" },
    { id: 3, title: "CA_Guarantee_Document.pdf", company: "InnovateHub", bank: "Crédit Agricole", amount: "€28M", date: "2024-03-10", status: "En Révision" },
  ],
  relations: [
    { id: 1, from: "BNP Paribas", to: "TechCorp SA", type: "FINANCE", amount: "€45M" },
    { id: 2, from: "Jean-Pierre Durand", to: "TechCorp SA", type: "DIRIGE", amount: null },
    { id: 3, from: "Jean-Pierre Durand", to: "GlobalTrade Inc", type: "GARANTIT", amount: "€32M" },
  ],
};

const getRiskColor = (risk: number) => {
  if (risk >= 80) return "#EF4444";
  if (risk >= 60) return "#F59E0B";
  return "#10B981";
};

export function SearchEngine() {
  const [activeTab, setActiveTab] = useState<"companies" | "directors" | "contracts" | "relations">("companies");
  const [searchQuery, setSearchQuery] = useState("");

  const tabLabels = {
    companies: "Entreprises",
    directors: "Dirigeants",
    contracts: "Contrats",
    relations: "Relations"
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par entreprise, dirigeant, contrat ou relation..."
            className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-12 pr-4 py-4 text-lg text-[#111827] focus:outline-none focus:border-[#6D28D9] focus:shadow-lg focus:shadow-[#6D28D9]/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-[#E5E7EB] p-2 shadow-sm">
        <div className="flex gap-2">
          {(["companies", "directors", "contracts", "relations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white shadow-lg shadow-[#6D28D9]/20"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111827]">{company.name}</h3>
                        <p className="text-sm text-[#6B7280]">{company.type}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getRiskColor(company.risk)}20`,
                          color: getRiskColor(company.risk),
                          border: `1px solid ${getRiskColor(company.risk)}40`,
                        }}
                      >
                        Risque: {company.risk}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div><span className="text-[#6B7280]">Exposition: </span><span className="font-semibold text-[#111827]">{company.exposure}</span></div>
                      <div><span className="text-[#6B7280]">Contrats: </span><span className="font-semibold text-[#111827]">{company.contracts}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Directors Tab */}
        {activeTab === "directors" && (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.directors.map((director, index) => (
              <motion.div
                key={director.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-[#111827]">{director.name}</h3>
                      <p className="text-sm text-[#6B7280]">{director.role}</p>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-sm text-[#6B7280]">Entreprises: </span><span className="text-sm font-medium text-[#111827]">{director.companies.join(", ")}</span></div>
                      <div><span className="text-sm text-[#6B7280]">Exposition Totale: </span><span className="text-sm font-semibold text-[#10B981]">{director.totalExposure}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === "contracts" && (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.contracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#6D28D9]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#6D28D9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[#111827]">{contract.title}</h3>
                        <p className="text-sm text-[#6B7280]">{contract.company}</p>
                      </div>
                      <span className="px-3 py-1 bg-[#6D28D9]/10 text-[#6D28D9] border border-[#6D28D9]/40 rounded-full text-xs font-medium">{contract.status}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div><span className="text-[#6B7280]">Banque: </span><span className="font-medium text-[#111827]">{contract.bank}</span></div>
                      <div><span className="text-[#6B7280]">Montant: </span><span className="font-semibold text-[#111827]">{contract.amount}</span></div>
                      <div><span className="text-[#6B7280]">Date: </span><span className="text-[#111827]">{contract.date}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Relations Tab */}
        {activeTab === "relations" && (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.relations.map((relation, index) => (
              <motion.div
                key={relation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:border-[#6D28D9]/40 hover:shadow-lg hover:shadow-[#6D28D9]/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-lg font-semibold text-[#111827]">{relation.from}</div>
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6]" />
                    <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/40 rounded-full text-xs font-medium">{relation.type}</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#10B981]" />
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    <div className="text-lg font-semibold text-[#111827]">{relation.to}</div>
                  </div>
                  {relation.amount && <div className="text-lg font-bold text-[#10B981]">{relation.amount}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
