export const HISTORY_EVENTS_STORAGE_KEY = "mailguard_history_events";

export type UserHistoryEventType = "login" | "logout" | "validation" | "suggestion";

export interface UserHistoryEvent {
  id: string;
  type: UserHistoryEventType;
  client: string;
  titre: string;
  description: string;
  date: string;
  statut: "succes" | "en_cours" | "prioritaire";
}

export function readUserHistoryEvents(): UserHistoryEvent[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_EVENTS_STORAGE_KEY) || "[]");
  } catch {
    localStorage.removeItem(HISTORY_EVENTS_STORAGE_KEY);
    return [];
  }
}

export function addUserHistoryEvent(event: Omit<UserHistoryEvent, "id" | "date"> & { date?: string }) {
  const nextEvent: UserHistoryEvent = {
    ...event,
    id: `${event.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: event.date ?? new Date().toISOString(),
  };
  const current = readUserHistoryEvents();
  localStorage.setItem(HISTORY_EVENTS_STORAGE_KEY, JSON.stringify([nextEvent, ...current].slice(0, 300)));
  window.dispatchEvent(new Event("mailguard-history-updated"));
}
