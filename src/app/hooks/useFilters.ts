import { useMemo, useState } from "react";
import { normalizeRiskLevel, type RiskLevel } from "../lib/risk";

interface FilterableEmail {
  langue: string;
  type_email: string;
  priorite: string;
  client_nom: string;
  sujet: string;
  technicite?: number;
  risque_impaye?: string;
  interne?: boolean;
}

export interface Filters {
  langue: "ALL" | "FR" | "EN";
  type_email: string;
  risque: "ALL" | RiskLevel;
  provenance: "ALL" | "interne" | "externe";
  priorite: string;
  searchTerm: string;
}

export function useFilters<T extends FilterableEmail>(emails: T[]) {
  const [filters, setFilters] = useState<Filters>({
    langue: "ALL",
    type_email: "ALL",
    risque: "ALL",
    provenance: "ALL",
    priorite: "ALL",
    searchTerm: "",
  });

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      if (filters.langue !== "ALL" && email.langue !== filters.langue) {
        return false;
      }

      if (filters.type_email !== "ALL" && email.type_email !== filters.type_email) {
        return false;
      }

      if (filters.risque !== "ALL" && normalizeRiskLevel(email.risque_impaye, email.technicite ?? 0) !== filters.risque) {
        return false;
      }

      if (filters.provenance === "interne" && !email.interne) {
        return false;
      }

      if (filters.provenance === "externe" && email.interne) {
        return false;
      }

      if (filters.priorite !== "ALL" && email.priorite !== filters.priorite) {
        return false;
      }

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
      langue: "ALL",
      type_email: "ALL",
      risque: "ALL",
      provenance: "ALL",
      priorite: "ALL",
      searchTerm: "",
    });
  };

  return {
    filters,
    filteredEmails,
    updateFilter,
    resetFilters,
  };
}
