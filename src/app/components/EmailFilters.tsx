import { motion } from "motion/react";
import { Filter, Search, X } from "lucide-react";
import { Filters } from "../hooks/useFilters";
import { emailTypes } from "../data/mockData";

interface EmailFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  totalResults: number;
}

export function EmailFilters({ filters, onFilterChange, onReset, totalResults }: EmailFiltersProps) {
  const hasActiveFilters =
    filters.langue !== "ALL" ||
    filters.type_email !== "ALL" ||
    filters.risque !== "ALL" ||
    filters.provenance !== "ALL" ||
    filters.priorite !== "ALL" ||
    filters.searchTerm !== "";

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filtres</h3>
          <span className="text-sm text-muted-foreground">
            ({totalResults} resultat{totalResults > 1 ? "s" : ""})
          </span>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm transition-colors hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
            Reinitialiser
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.searchTerm}
            onChange={(event) => onFilterChange("searchTerm", event.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={filters.langue}
          onChange={(event) => onFilterChange("langue", event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Toutes langues</option>
          <option value="FR">Francais</option>
          <option value="EN">English</option>
        </select>

        <select
          value={filters.type_email}
          onChange={(event) => onFilterChange("type_email", event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Tous types</option>
          {emailTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.risque}
          onChange={(event) => onFilterChange("risque", event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Tous risques</option>
          <option value="aucun">Aucun risque</option>
          <option value="faible">Risque faible</option>
          <option value="moyen">Risque moyen</option>
          <option value="eleve">Risque eleve</option>
        </select>

        <select
          value={filters.provenance}
          onChange={(event) => onFilterChange("provenance", event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Internes et externes</option>
          <option value="interne">Emails internes</option>
          <option value="externe">Emails externes</option>
        </select>

        <select
          value={filters.priorite}
          onChange={(event) => onFilterChange("priorite", event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Toutes priorites</option>
          <option value="HAUTE">Haute</option>
          <option value="NORMALE">Normale</option>
          <option value="BASSE">Basse</option>
        </select>
      </div>
    </div>
  );
}
