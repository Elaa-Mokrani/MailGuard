import { motion } from 'motion/react';
import { Filter, X, Search } from 'lucide-react';
import { Filters } from '../hooks/useFilters';
import { emailTypes, healthLevels } from '../data/mockData';

interface EmailFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  totalResults: number;
}

export function EmailFilters({ filters, onFilterChange, onReset, totalResults }: EmailFiltersProps) {
  const hasActiveFilters =
    filters.langue !== 'ALL' ||
    filters.type_email !== 'ALL' ||
    filters.client_sante !== 'ALL' ||
    filters.priorite !== 'ALL' ||
    filters.searchTerm !== '';

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filtres</h3>
          <span className="text-sm text-muted-foreground">
            ({totalResults} résultat{totalResults > 1 ? 's' : ''})
          </span>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Recherche textuelle */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filtre Langue */}
        <select
          value={filters.langue}
          onChange={(e) => onFilterChange('langue', e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Toutes langues</option>
          <option value="FR">🇫🇷 Français</option>
          <option value="EN">🇬🇧 English</option>
        </select>

        {/* Filtre Type d'email */}
        <select
          value={filters.type_email}
          onChange={(e) => onFilterChange('type_email', e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Tous types</option>
          {emailTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Filtre Santé client */}
        <select
          value={filters.client_sante}
          onChange={(e) => onFilterChange('client_sante', e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Toutes santés</option>
          {healthLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        {/* Filtre Priorité */}
        <select
          value={filters.priorite}
          onChange={(e) => onFilterChange('priorite', e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">Toutes priorités</option>
          <option value="HAUTE">Haute</option>
          <option value="NORMALE">Normale</option>
          <option value="BASSE">Basse</option>
        </select>
      </div>
    </div>
  );
}
