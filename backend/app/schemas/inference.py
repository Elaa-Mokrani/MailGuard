from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class NumericFeaturesInput(BaseModel):
    technicite: float | None = None
    urgence: float | None = None
    emotion: float | None = None
    longueur_totale: float | None = None
    longueur_email: float | None = None
    longueur_ocr: float | None = None
    longueur_corps: float | None = None
    nb_mots_sujet: float | None = None
    nb_mots_corps: float | None = None
    nb_mots_ocr: float | None = None
    nb_mots_total: float | None = None
    nb_mots: float | None = None
    nb_phrases: float | None = None
    nb_paragraphes: float | None = None
    nb_tokens: float | None = None
    montant_extrait_num: float | None = None
    client_probabilite_defaut: float | None = None
    client_ca: float | None = None
    client_effectif: float | None = None
    client_encours: float | None = None
    client_dso: float | None = None
    client_anciennete: float | None = None
    nb_pieces_jointes: float | None = None
    interne: float | None = None
    entrant: float | None = None
    lu: float | None = None
    repondu: float | None = None
    temps_reponse_minutes: float | None = None


class ClientContext(BaseModel):
    client_id: str | None = None
    client_nom: str | None = None
    client_secteur: str | None = None
    client_pays: str | None = None
    client_sante: str | None = None


class EmailMetadata(BaseModel):
    email_id: str | None = None
    dossier: str | None = "Inbox"
    from_nom: str | None = None
    from_email: str | None = None
    to_nom: str | None = None
    date_envoi: datetime | None = None


class EmailInferenceRequest(BaseModel):
    sujet: str = ""
    corps: str = ""
    texte_ocr: str = ""
    from_domaine: str = ""
    to_domaine: str = ""
    codix_service: str = ""
    metadata: EmailMetadata = Field(default_factory=EmailMetadata)
    client: ClientContext = Field(default_factory=ClientContext)
    features: NumericFeaturesInput = Field(default_factory=NumericFeaturesInput)


class BatchEmailInferenceRequest(BaseModel):
    emails: list[EmailInferenceRequest]


class PredictionLabel(BaseModel):
    label: str
    confidence: float
    probabilities: dict[str, float]


class ExtractionResult(BaseModel):
    reference_facture: str | None = None
    montant_mentionne: float | None = None
    montant_texte_brut: str | None = None


class FrontendEmailView(BaseModel):
    email_id: str
    date_envoi: str
    dossier: str
    type_email: str
    langue: str
    from_nom: str
    from_email: str
    to_nom: str
    sujet: str
    corps: str
    montant: float | None = None
    reference_facture: str | None = None
    client_id: str
    client_nom: str
    client_secteur: str
    client_pays: str
    client_sante: str
    client_encours: float
    priorite: str
    risque_impaye: str | None = None
    technicite: float
    sentiment: str


class EmailInferenceResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    request_id: str
    processed_at: str
    extraction: ExtractionResult
    predictions: dict[str, PredictionLabel]
    resume_front: FrontendEmailView
    model_version: str


class ModelArtifactStatus(BaseModel):
    name: str
    exists: bool
    path: str


class ModelMetadataResponse(BaseModel):
    available: bool
    models_dir: str
    load_error: str | None = None
    config: dict[str, Any] | None = None
    reports: dict[str, Any] = Field(default_factory=dict)
    artifacts: list[ModelArtifactStatus] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    model_ready: bool
    timestamp: str


class DocumentUploadResponse(BaseModel):
    filename: str
    content_type: str
    extracted_text_length: int
    inference: EmailInferenceResponse
