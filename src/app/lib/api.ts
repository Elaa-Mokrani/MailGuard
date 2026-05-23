const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export interface FrontEmail {
  email_id: string;
  date_envoi: string;
  dossier: string;
  type_email: string;
  langue: "FR" | "EN" | string;
  from_nom: string;
  from_email: string;
  to_nom: string;
  sujet: string;
  corps: string;
  montant?: number | null;
  reference_facture?: string | null;
  interne?: boolean;
  client_id: string;
  client_nom: string;
  client_secteur: string;
  client_pays: string;
  client_sante: string;
  client_encours: number;
  priorite: "HAUTE" | "NORMALE" | "BASSE" | string;
  risque_impaye?: "aucun" | "faible" | "moyen" | "eleve" | string;
  technicite?: number;
  sentiment?: "positive" | "negative" | "neutral" | string;
}

export interface FrontClient {
  client_id: string;
  client_nom: string;
  client_secteur: string;
  client_pays: string;
  client_sante: string;
  client_encours: number;
  nb_emails: number;
  derniere_interaction: string;
}

export interface DatasetOverview {
  total_emails: number;
  derniere_mise_a_jour: string;
  periode_analyse: string;
}

export interface DatasetStats extends DatasetOverview {
  todayEmails: number;
  clientsAtRisk: number;
  totalExposed: number;
  avgProcessingTime: number;
  riskSampleSize?: number;
  emailsByLanguage: Record<string, number>;
  emailsByType: Record<string, number>;
  emailsByRisk: Record<string, number>;
}

export interface ModelMetadata {
  available: boolean;
  models_dir: string;
  load_error?: string | null;
  config?: {
    MAX_LEN?: number;
    EMBEDDING_DIM?: number;
  } | null;
}

export interface DatasetInfoData extends DatasetOverview {
  modele_accuracy: number;
  modele_version: string;
}

export interface SuggestedReplyPayload {
  email_content: string;
  analysis: {
    type_email?: string;
    sentiment?: string;
    urgence?: string;
    risque?: string;
    langue?: string;
    interne?: boolean;
    client_nom?: string;
    montant?: number | null;
    reference_facture?: string | null;
  };
}

export interface SuggestedReplyResponse {
  suggested_reply: string;
}

export interface LoginResponse {
  authenticated: boolean;
  email: string;
  name: string;
  role: string;
  token: string;
}

async function ensureOk(response: Response, message: string) {
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body?.detail === "string" ? body.detail : "";
    } catch {
      detail = await response.text().catch(() => "");
    }
    throw new Error(detail || `${message} (${response.status})`);
  }
}

async function readJson<T>(path: string, message: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  await ensureOk(response, message);
  return response.json();
}

async function postJson<T>(path: string, payload: unknown, message: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await ensureOk(response, message);
  return response.json();
}

export async function getHealth() {
  return readJson("/health", "Health check failed");
}

export async function getModelMetadata(): Promise<ModelMetadata> {
  return readJson("/model/metadata", "Metadata fetch failed");
}

export async function getDatasetOverview(): Promise<DatasetOverview> {
  return readJson("/data/overview", "Dataset overview fetch failed");
}

export async function getDatasetStats(): Promise<DatasetStats> {
  return readJson("/data/stats", "Dataset stats fetch failed");
}

export async function getDatasetInfo(): Promise<DatasetInfoData> {
  const [overview, metadata] = await Promise.all([getDatasetOverview(), getModelMetadata()]);
  return {
    ...overview,
    modele_accuracy: metadata.available ? 90.37 : 0,
    modele_version: metadata.available
      ? metadata.config?.EMBEDDING_DIM
        ? `LSTM multi-taches (${metadata.config.EMBEDDING_DIM}d)`
        : "LSTM multi-taches"
      : "LSTM indisponible",
  };
}

export async function getEmails(limit = 200): Promise<FrontEmail[]> {
  return readJson(`/data/emails?limit=${limit}`, "Emails fetch failed");
}

export async function getClients(limit = 100): Promise<FrontClient[]> {
  return readJson(`/data/clients?limit=${limit}`, "Clients fetch failed");
}

export async function suggestReply(payload: SuggestedReplyPayload): Promise<SuggestedReplyResponse> {
  return postJson("/suggest-reply", payload, "Suggested reply generation failed");
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return postJson("/auth/login", { email, password }, "Login failed");
}
