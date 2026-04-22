import { useState, useMemo } from 'react';
import { Email } from '../data/mockData';

export interface Filters {
  langue: 'ALL' | 'FR' | 'EN';
  type_email: string;
  client_sante: string;
  priorite: string;
  searchTerm: string;
}

export function useFilters(emails: Email[]) {
  const [filters, setFilters] = useState<Filters>({
    langue: 'ALL',
    type_email: 'ALL',
    client_sante: 'ALL',
    priorite: 'ALL',
    searchTerm: '',
  });

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Filtre par langue
      if (filters.langue !== 'ALL' && email.langue !== filters.langue) {
        return false;
      }

      // Filtre par type
      if (filters.type_email !== 'ALL' && email.type_email !== filters.type_email) {
        return false;
      }

      // Filtre par santé client
      if (filters.client_sante !== 'ALL' && email.client_sante !== filters.client_sante) {
        return false;
      }

      // Filtre par priorité
      if (filters.priorite !== 'ALL' && email.priorite !== filters.priorite) {
        return false;
      }

      // Recherche textuelle
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          email.client_nom.toLowerCase().includes(searchLower) ||
          email.sujet.toLowerCase().includes(searchLower) ||
          email.type_email.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [emails, filters]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      langue: 'ALL',
      type_email: 'ALL',
      client_sante: 'ALL',
      priorite: 'ALL',
      searchTerm: '',
    });
  };

  return {
    filters,
    filteredEmails,
    updateFilter,
    resetFilters,
  };
}
