import json
import re
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import joblib
import numpy as np
import pandas as pd

from app.core.config import get_settings
from app.schemas.inference import (
    EmailInferenceRequest,
    EmailInferenceResponse,
    ExtractionResult,
    FrontendEmailView,
    ModelArtifactStatus,
    ModelMetadataResponse,
    PredictionLabel,
)

try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.sequence import pad_sequences
except ImportError:  # pragma: no cover
    tf = None
    pad_sequences = None


AMOUNT_PATTERNS = [
    r"(?i)\b(?:montant|amount|total|somme|balance due|due amount|ttc)\s*[:\-]?\s*([€$£]?\s?\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{2})\s?(?:€|EUR|USD|\$|£)?)",
    r"(?i)([€$£]\s?\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{2}))",
    r"(?i)(\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{2})\s?(?:€|EUR|USD|\$|£))",
]

INVOICE_PATTERNS = [
    r"(?i)\b(?:invoice|facture|fac|ref(?:erence)?|reference|invoice number|numero de facture|n[°o])\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-_\/]{2,})",
    r"(?i)\b((?:INV|FAC|FACT|REF)[-_ ]?[A-Z0-9][A-Z0-9\-_\/]{2,})\b",
]

MODEL_TASKS = (
    "type_email",
    "langue",
    "sentiment",
    "urgence",
    "risque_impaye",
)

FRONT_SENTIMENT_MAP = {
    "positif": "positive",
    "negatif": "negative",
    "neutre": "neutral",
}

PRIORITY_MAP = {
    "elevee": "HAUTE",
    "moyenne": "NORMALE",
    "faible": "BASSE",
}

RISK_LABEL_SCORES = {
    "aucun": 0.0,
    "faible": 20.0,
    "moyen": 60.0,
    "eleve": 90.0,
}


def extract_first_match(text: str, patterns: list[str]) -> str | None:
    if not text:
        return None

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()

    return None


def normalize_amount(raw: str | None) -> float | None:
    if raw is None:
        return None

    text = str(raw).strip()
    if not text:
        return None

    text = text.replace("\xa0", " ").replace(" ", "")
    text = re.sub(r"(?i)(eur|usd)", "", text)
    text = text.replace("€", "").replace("$", "").replace("£", "")

    if "," in text and "." in text:
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif text.count(",") == 1 and text.count(".") == 0:
        text = text.replace(",", ".")
    else:
        text = text.replace(",", "")

    text = re.sub(r"[^0-9.\-]", "", text)
    value = pd.to_numeric(text, errors="coerce")
    return None if pd.isna(value) else float(value)


class LSTMInferenceService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.models_dir = Path(self.settings.models_dir)
        self.ready = False
        self.load_error: str | None = None
        self.tokenizer = None
        self.imputer = None
        self.scaler = None
        self.config: dict = {}
        self.numeric_features: list[str] = []
        self.risk_numeric_features: list[str] = []
        self.task_numeric_dims: dict[str, int] = {}
        self.label_encoders: dict[str, object] = {}
        self.models: dict[str, object] = {}
        self._load_artifacts()

    def _load_artifacts(self) -> None:
        if tf is None or pad_sequences is None:
            self.load_error = "TensorFlow n'est pas installé dans l'environnement backend."
            return

        if not self.models_dir.exists():
            self.load_error = (
                f"Le dossier des modèles est introuvable: {self.models_dir}"
            )
            return

        try:
            self.tokenizer = joblib.load(self.models_dir / "tokenizer.pkl")
            self.imputer = joblib.load(self.models_dir / "numeric_imputer.pkl")
            self.scaler = joblib.load(self.models_dir / "numeric_scaler.pkl")

            with open(self.models_dir / "lstm_config.json", "r", encoding="utf-8") as file:
                self.config = json.load(file)

            self.numeric_features = list(self.config.get("numeric_features", []))
            self.risk_numeric_features = list(
                getattr(self.imputer, "feature_names_in_", self.numeric_features)
            )

            for task in MODEL_TASKS:
                self.label_encoders[task] = joblib.load(
                    self.models_dir / f"{task}_label_encoder.pkl"
                )
                self.models[task] = tf.keras.models.load_model(
                    self.models_dir / f"{task}_model.keras"
                )
                input_shape = self.models[task].input_shape
                self.task_numeric_dims[task] = int(input_shape[1][1])

            self.ready = True
            self.load_error = None
        except Exception as exc:  # pragma: no cover
            self.ready = False
            self.load_error = str(exc)

    def reload(self) -> None:
        self.ready = False
        self.load_error = None
        self.label_encoders = {}
        self.models = {}
        self._load_artifacts()

    def _build_text(self, payload: EmailInferenceRequest) -> str:
        pieces = [
            payload.sujet,
            payload.corps,
            payload.texte_ocr,
            payload.from_domaine,
            payload.to_domaine,
            payload.codix_service,
        ]
        return re.sub(r"\s+", " ", " [SEP] ".join(str(piece or "") for piece in pieces)).strip()

    def _build_numeric_frame(
        self,
        payload: EmailInferenceRequest,
        extracted_amount: float | None,
        features: list[str] | None = None,
    ) -> pd.DataFrame:
        feature_values = payload.features.model_dump()
        feature_values["montant_extrait_num"] = (
            extracted_amount
            if extracted_amount is not None
            else feature_values.get("montant_extrait_num")
        )

        selected_features = features or self.numeric_features
        row = {feature: feature_values.get(feature, np.nan) for feature in selected_features}
        return pd.DataFrame([row], columns=selected_features)

    def _prepare_risk_numeric(
        self,
        payload: EmailInferenceRequest,
        extracted_amount: float | None,
    ) -> np.ndarray:
        numeric_df = self._build_numeric_frame(
            payload,
            extracted_amount,
            features=self.risk_numeric_features,
        )
        imputed = self.imputer.transform(numeric_df)
        return self.scaler.transform(imputed)

    def _prepare_legacy_numeric(
        self,
        task_name: str,
    ) -> np.ndarray:
        # The refreshed risk model uses 27 numeric features, while the other
        # unchanged LSTM heads still expect 28. Without the old scaler artifact,
        # a neutral zero vector is safer than failing the whole inference call.
        return np.zeros((1, self.task_numeric_dims[task_name]), dtype=float)

    def _prepare_inputs(
        self,
        payload: EmailInferenceRequest,
        model_text: str,
        extracted_amount: float | None,
    ) -> tuple[np.ndarray, np.ndarray]:
        if not self.ready:
            raise RuntimeError(self.load_error or "Les modèles ne sont pas prêts.")

        sequence = self.tokenizer.texts_to_sequences([model_text])
        padded = pad_sequences(
            sequence,
            maxlen=int(self.config["MAX_LEN"]),
            padding="post",
            truncating="post",
        )

        numeric_df = self._build_numeric_frame(
            payload,
            extracted_amount,
            features=self.risk_numeric_features,
        )
        imputed = self.imputer.transform(numeric_df)
        scaled = self.scaler.transform(imputed)
        return padded, scaled

    def _predict_task(self, task_name: str, seq: np.ndarray, num: np.ndarray) -> PredictionLabel:
        probabilities = self.models[task_name].predict(
            {"text_input": seq, "num_input": num},
            verbose=0,
        )[0]

        labels = list(self.label_encoders[task_name].classes_)
        scored_probabilities = {
            label: round(float(probability), 4)
            for label, probability in zip(labels, probabilities)
        }
        index = int(np.argmax(probabilities))
        return PredictionLabel(
            label=labels[index],
            confidence=round(float(np.max(probabilities)), 4),
            probabilities=scored_probabilities,
        )

    def _predict_task_batch(
        self,
        task_name: str,
        seq: np.ndarray,
        num: np.ndarray,
    ) -> list[PredictionLabel]:
        probabilities_batch = self.models[task_name].predict(
            {"text_input": seq, "num_input": num},
            verbose=0,
        )

        labels = list(self.label_encoders[task_name].classes_)
        predictions: list[PredictionLabel] = []
        for probabilities in probabilities_batch:
            scored_probabilities = {
                label: round(float(probability), 4)
                for label, probability in zip(labels, probabilities)
            }
            index = int(np.argmax(probabilities))
            predictions.append(
                PredictionLabel(
                    label=labels[index],
                    confidence=round(float(np.max(probabilities)), 4),
                    probabilities=scored_probabilities,
                )
            )
        return predictions

    def _compute_technicite(self, risk_prediction: PredictionLabel) -> float:
        weighted_score = 0.0
        for label, probability in risk_prediction.probabilities.items():
            weighted_score += RISK_LABEL_SCORES.get(label, 50.0) * probability
        return round(weighted_score, 2)

    def _build_front_payload(
        self,
        payload: EmailInferenceRequest,
        extraction: ExtractionResult,
        predictions: dict[str, PredictionLabel],
    ) -> FrontendEmailView:
        metadata = payload.metadata
        client = payload.client

        sentiment_front = FRONT_SENTIMENT_MAP.get(
            predictions["sentiment"].label,
            predictions["sentiment"].label,
        )
        priority_front = PRIORITY_MAP.get(
            predictions["urgence"].label,
            predictions["urgence"].label.upper(),
        )

        date_value = metadata.date_envoi or datetime.now(timezone.utc)
        return FrontendEmailView(
            email_id=metadata.email_id or f"MAIL-{uuid4().hex[:12].upper()}",
            date_envoi=date_value.isoformat(),
            dossier=metadata.dossier or "Inbox",
            type_email=predictions["type_email"].label,
            langue=predictions["langue"].label,
            from_nom=metadata.from_nom or "",
            from_email=metadata.from_email or "",
            to_nom=metadata.to_nom or "",
            sujet=payload.sujet,
            corps=payload.corps,
            montant=extraction.montant_mentionne,
            reference_facture=extraction.reference_facture,
            client_id=client.client_id or "",
            client_nom=client.client_nom or "Client inconnu",
            client_secteur=client.client_secteur or "Non renseigné",
            client_pays=client.client_pays or "Non renseigné",
            client_sante=client.client_sante or "Non renseigné",
            client_encours=float(payload.features.client_encours or 0.0),
            priorite=priority_front,
            risque_impaye=predictions["risque_impaye"].label,
            technicite=self._compute_technicite(predictions["risque_impaye"]),
            sentiment=sentiment_front,
        )

    def predict_email(self, payload: EmailInferenceRequest) -> EmailInferenceResponse:
        model_text = self._build_text(payload)
        invoice_reference = extract_first_match(model_text, INVOICE_PATTERNS)
        raw_amount = extract_first_match(model_text, AMOUNT_PATTERNS)
        extracted_amount = normalize_amount(raw_amount)

        seq, risk_num = self._prepare_inputs(payload, model_text, extracted_amount)

        predictions = {}
        for task in MODEL_TASKS:
            if task == "risque_impaye":
                task_num = risk_num
            else:
                task_num = self._prepare_legacy_numeric(task)
            predictions[task] = self._predict_task(task, seq, task_num)
        extraction = ExtractionResult(
            reference_facture=invoice_reference,
            montant_mentionne=extracted_amount,
            montant_texte_brut=raw_amount,
        )

        return EmailInferenceResponse(
            request_id=str(uuid4()),
            processed_at=datetime.now(timezone.utc).isoformat(),
            extraction=extraction,
            predictions=predictions,
            resume_front=self._build_front_payload(payload, extraction, predictions),
            model_version=f"LSTM multi-output ({self.config.get('EMBEDDING_DIM', 'n/a')}d)",
        )

    def _payload_from_front_record(self, record: dict) -> EmailInferenceRequest:
        return EmailInferenceRequest(
            sujet=str(record.get("sujet", "")),
            corps=str(record.get("corps", "")),
            texte_ocr=str(record.get("texte_ocr", "")),
            from_domaine=str(record.get("from_domaine", "")),
            to_domaine=str(record.get("to_domaine", "")),
            codix_service=str(record.get("codix_service", "")),
            features={
                "technicite": record.get("technicite"),
                "urgence": record.get("urgence"),
                "emotion": record.get("emotion"),
                "montant_extrait_num": record.get("montant"),
                "client_probabilite_defaut": record.get("client_probabilite_defaut"),
                "client_ca": record.get("client_ca"),
                "client_effectif": record.get("client_effectif"),
                "client_encours": record.get("client_encours"),
                "client_dso": record.get("client_dso"),
                "client_anciennete": record.get("client_anciennete"),
                "nb_pieces_jointes": record.get("nb_pieces_jointes"),
                "interne": 1.0 if record.get("interne") else 0.0,
                "temps_reponse_minutes": record.get("temps_reponse_minutes"),
            },
        )

    def enrich_records_with_risk(self, records: list[dict]) -> list[dict]:
        if not records:
            return records
        if not self.ready:
            return records

        payloads = [self._payload_from_front_record(record) for record in records]
        model_texts = [self._build_text(payload) for payload in payloads]
        extracted_amounts = [
            normalize_amount(extract_first_match(text, AMOUNT_PATTERNS))
            for text in model_texts
        ]

        sequences = self.tokenizer.texts_to_sequences(model_texts)
        seq = pad_sequences(
            sequences,
            maxlen=int(self.config["MAX_LEN"]),
            padding="post",
            truncating="post",
        )

        numeric_frames = [
            self._build_numeric_frame(
                payload,
                extracted_amount,
                features=self.risk_numeric_features,
            )
            for payload, extracted_amount in zip(payloads, extracted_amounts)
        ]
        numeric_df = pd.concat(numeric_frames, ignore_index=True)
        imputed = self.imputer.transform(numeric_df)
        num = self.scaler.transform(imputed)

        risk_predictions = self._predict_task_batch("risque_impaye", seq, num)
        enriched: list[dict] = []
        for record, risk_prediction in zip(records, risk_predictions):
            next_record = dict(record)
            next_record["risque_impaye"] = risk_prediction.label
            next_record["risque_impaye_confidence"] = risk_prediction.confidence
            next_record["risque_impaye_probabilities"] = risk_prediction.probabilities
            next_record["technicite"] = self._compute_technicite(risk_prediction)
            enriched.append(next_record)
        return enriched

    def get_metadata(self) -> ModelMetadataResponse:
        reports: dict[str, dict] = {}
        for task in MODEL_TASKS:
            report_path = self.models_dir / f"{task}_report.json"
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as file:
                    reports[task] = json.load(file)

        config = None
        config_path = self.models_dir / "lstm_config.json"
        if config_path.exists():
            with open(config_path, "r", encoding="utf-8") as file:
                config = json.load(file)

        expected_paths = [
            self.models_dir / "tokenizer.pkl",
            self.models_dir / "numeric_imputer.pkl",
            self.models_dir / "numeric_scaler.pkl",
            self.models_dir / "lstm_config.json",
            *[self.models_dir / f"{task}_model.keras" for task in MODEL_TASKS],
            *[self.models_dir / f"{task}_label_encoder.pkl" for task in MODEL_TASKS],
        ]

        artifacts = [
            ModelArtifactStatus(
                name=path.name,
                exists=path.exists(),
                path=str(path),
            )
            for path in expected_paths
        ]

        return ModelMetadataResponse(
            available=self.ready,
            models_dir=str(self.models_dir),
            load_error=self.load_error,
            config=config,
            reports=reports,
            artifacts=artifacts,
        )


inference_service = LSTMInferenceService()
