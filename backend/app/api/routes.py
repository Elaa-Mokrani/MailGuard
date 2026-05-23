from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.schemas.inference import (
    BatchEmailInferenceRequest,
    DocumentUploadResponse,
    EmailInferenceRequest,
    EmailInferenceResponse,
    HealthResponse,
    ModelMetadataResponse,
)
from app.services.document_parser import UnsupportedDocumentError, extract_text_from_upload
from app.services.dataset_service import dataset_service
from app.services.inference import inference_service
from app.services.llm_service import generate_suggested_reply


router = APIRouter()
settings = get_settings()
DASHBOARD_RISK_SAMPLE_SIZE = 2000


class SuggestedReplyRequest(BaseModel):
    email_content: str = Field(..., min_length=1)
    analysis: dict[str, Any] = Field(default_factory=dict)


class SuggestedReplyResponse(BaseModel):
    suggested_reply: str


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class LoginResponse(BaseModel):
    authenticated: bool
    email: str
    name: str
    role: str
    token: str


@router.post("/auth/login", response_model=LoginResponse, tags=["auth"])
def login(payload: LoginRequest) -> LoginResponse:
    expected_email = "elaa.mokrani@codix.fr"
    expected_password = "0000"

    if payload.email.strip().lower() != expected_email or payload.password != expected_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
        )

    return LoginResponse(
        authenticated=True,
        email=expected_email,
        name="Elaa Mokrani",
        role="Administratrice MailGuard",
        token="mailguard-local-session",
    )


@router.get("/health", response_model=HealthResponse, tags=["system"])
def healthcheck() -> HealthResponse:
    return HealthResponse(
        status="ok",
        app_name=settings.app_name,
        version=settings.app_version,
        model_ready=inference_service.ready,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/data/overview", tags=["data"])
def dataset_overview() -> dict:
    return dataset_service.get_dataset_overview()


@router.get("/data/stats", tags=["data"])
def dataset_stats() -> dict:
    stats = dataset_service.get_statistics()
    inferred_emails = inference_service.enrich_records_with_risk(
        dataset_service.get_emails(limit=DASHBOARD_RISK_SAMPLE_SIZE)
    )
    risk_counts = {"aucun": 0, "faible": 0, "moyen": 0, "eleve": 0}
    for email in inferred_emails:
        risk = str(email.get("risque_impaye") or "").lower()
        if risk in risk_counts:
            risk_counts[risk] += 1

    stats["emailsByRisk"] = risk_counts
    stats["riskSampleSize"] = len(inferred_emails)
    stats["clientsAtRisk"] = len(
        {
            email.get("client_id") or email.get("client_nom")
            for email in inferred_emails
            if email.get("risque_impaye") == "eleve"
        }
    )
    return stats


@router.get("/data/emails", tags=["data"])
def dataset_emails(limit: int = 200) -> list[dict]:
    emails = dataset_service.get_emails(limit=limit)
    return inference_service.enrich_records_with_risk(emails)


@router.get("/data/clients", tags=["data"])
def dataset_clients(limit: int = 100) -> list[dict]:
    return dataset_service.get_clients(limit=limit)


@router.post("/data/reload", tags=["data"])
def reload_dataset() -> dict:
    dataset_service.reload()
    return {
        "status": "ok",
        "dataset_path": str(settings.dataset_path),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.post("/suggest-reply", response_model=SuggestedReplyResponse, tags=["llm"])
def suggest_reply(payload: SuggestedReplyRequest) -> SuggestedReplyResponse:
    try:
        suggested_reply = generate_suggested_reply(
            email_content=payload.email_content,
            analysis=payload.analysis,
        )
        return SuggestedReplyResponse(suggested_reply=suggested_reply)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/model/metadata", response_model=ModelMetadataResponse, tags=["model"])
def model_metadata() -> ModelMetadataResponse:
    return inference_service.get_metadata()


@router.post("/model/reload", response_model=ModelMetadataResponse, tags=["model"])
def reload_model() -> ModelMetadataResponse:
    inference_service.reload()
    return inference_service.get_metadata()


@router.post(
    "/inference/email",
    response_model=EmailInferenceResponse,
    tags=["inference"],
)
def infer_email(payload: EmailInferenceRequest) -> EmailInferenceResponse:
    try:
        return inference_service.predict_email(payload)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post(
    "/inference/batch",
    response_model=list[EmailInferenceResponse],
    tags=["inference"],
)
def infer_batch(payload: BatchEmailInferenceRequest) -> list[EmailInferenceResponse]:
    if len(payload.emails) > settings.max_batch_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Taille de batch maximale dépassée ({settings.max_batch_size}).",
        )

    return [infer_email(email_payload) for email_payload in payload.emails]


@router.post(
    "/inference/document",
    response_model=DocumentUploadResponse,
    tags=["documents"],
)
async def infer_document(
    file: UploadFile = File(...),
    sujet: str = "",
    from_domaine: str = "",
    to_domaine: str = "",
    codix_service: str = "",
) -> DocumentUploadResponse:
    try:
        text = await extract_text_from_upload(file)
    except UnsupportedDocumentError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    payload = EmailInferenceRequest(
        sujet=sujet or file.filename or "Document upload",
        texte_ocr=text,
        from_domaine=from_domaine,
        to_domaine=to_domaine,
        codix_service=codix_service,
    )

    return DocumentUploadResponse(
        filename=file.filename or "unknown",
        content_type=file.content_type or "application/octet-stream",
        extracted_text_length=len(text),
        inference=infer_email(payload),
    )
