from __future__ import annotations

from datetime import datetime
from functools import lru_cache
from pathlib import Path
import re

import pandas as pd

from app.core.config import get_settings


PRIORITY_MAP = {
    "URGENTE": "HAUTE",
    "HAUTE": "HAUTE",
    "NORMALE": "NORMALE",
    "BASSE": "BASSE",
}

HEALTH_DEFAULT = "MOYENNE"
MAX_REASONABLE_ENCOURS = 1_000_000_000
MAX_REASONABLE_MONTANT = 100_000_000

AMOUNT_PATTERNS = [
    r"(?i)\b(?:montant|amount|total|somme|balance due|due amount|ttc)\s*[:\-]?\s*([€$£]?\s?\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{2})\s?(?:€|EUR|USD|\$|£)?)",
    r"(?i)([€$£]\s?\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{2}))",
    r"(?i)(\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{2})\s?(?:€|EUR|USD|\$|£))",
]

INVOICE_PATTERNS = [
    r"(?i)\b(?:invoice|facture|fac|ref(?:erence)?|reference|invoice number|numero de facture|n[°o])\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-_\/]{2,})",
    r"(?i)\b((?:INV|FAC|FACT|REF)[-_ ]?[A-Z0-9][A-Z0-9\-_\/]{2,})\b",
]


def _to_float(value) -> float | None:
    if value is None:
        return None
    try:
        if isinstance(value, str):
            value = value.replace(",", ".").strip()
            if value == "":
                return None
        return float(value)
    except (TypeError, ValueError):
        return None


def _to_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    normalized = str(value or "").strip().upper()
    return normalized in {"1", "TRUE", "VRAI", "YES", "OUI"}


def _normalize_sentiment(emotion: float | None) -> str:
    if emotion is None:
        return "neutral"
    if emotion >= 0.66:
        return "negative"
    if emotion <= 0.33:
        return "positive"
    return "neutral"


def _normalize_health(value: str | None) -> str:
    if not value:
        return HEALTH_DEFAULT
    normalized = str(value).strip().upper()
    if normalized in {"RISQUEE", "RISQUÉE", "RISQUÃ‰E"}:
        return "RISQUEE"
    if normalized in {"EXCELLENTE", "BONNE", "MOYENNE", "FRAGILE"}:
        return normalized
    return HEALTH_DEFAULT


def _normalize_risk_label(value: str | None, score: float | None = None) -> str:
    normalized = str(value or "").strip().lower()
    normalized = normalized.replace("é", "e").replace("è", "e")
    if normalized in {"aucun", "faible", "moyen", "eleve"}:
        return normalized

    score_value = float(score or 0)
    if score_value > 1:
        score_value = score_value / 100
    if score_value <= 0:
        return "aucun"
    if score_value >= 0.7:
        return "eleve"
    if score_value >= 0.4:
        return "moyen"
    return "faible"


def _extract_first_match(text: str, patterns: list[str]) -> str | None:
    if not text:
        return None
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
    return None


def _normalize_amount(raw: str | None) -> float | None:
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
    try:
        return float(text)
    except ValueError:
        return None


class DatasetService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.dataset_path = Path(self.settings.dataset_path)

    @lru_cache(maxsize=1)
    def _load_dataframe(self) -> pd.DataFrame:
        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset introuvable: {self.dataset_path}")

        df = pd.read_csv(self.dataset_path, encoding="utf-8-sig")

        numeric_columns = [
            "technicite",
            "urgence",
            "emotion",
            "montant",
            "client_ca",
            "client_effectif",
            "client_encours",
            "client_dso",
            "client_probabilite_defaut",
            "client_anciennete",
            "nb_pieces_jointes",
            "temps_reponse_minutes",
        ]
        for column in numeric_columns:
            if column in df.columns:
                df[column] = df[column].apply(_to_float)

        for column in [
            "sujet",
            "corps",
            "texte_ocr",
            "from_nom",
            "from_email",
            "to_nom",
            "client_nom",
            "client_secteur",
            "client_pays",
            "type_email",
            "langue",
            "dossier",
        ]:
            if column in df.columns:
                df[column] = df[column].fillna("").astype(str)

        for column in ["interne", "entrant", "lu", "repondu"]:
            if column in df.columns:
                df[column] = df[column].apply(_to_bool)

        if "date_envoi" in df.columns:
            df["date_envoi"] = pd.to_datetime(df["date_envoi"], errors="coerce")

        if "client_sante" in df.columns:
            df["client_sante"] = df["client_sante"].apply(_normalize_health)

        if "priorite" in df.columns:
            df["priorite"] = (
                df["priorite"]
                .fillna("NORMALE")
                .astype(str)
                .str.upper()
                .map(PRIORITY_MAP)
                .fillna("NORMALE")
            )

        df["sentiment_front"] = df.get("emotion", pd.Series(dtype=float)).apply(_normalize_sentiment)
        return df

    def reload(self) -> None:
        self._load_dataframe.cache_clear()

    def get_dataset_overview(self) -> dict:
        df = self._load_dataframe()
        latest = df["date_envoi"].max()
        earliest = df["date_envoi"].min()
        return {
            "total_emails": int(len(df)),
            "derniere_mise_a_jour": latest.isoformat() if pd.notna(latest) else datetime.now().isoformat(),
            "periode_analyse": (
                f"{earliest.date().isoformat()} a {latest.date().isoformat()}"
                if pd.notna(earliest) and pd.notna(latest)
                else "Periode indisponible"
            ),
        }

    def get_emails(self, limit: int = 200) -> list[dict]:
        df = self._load_dataframe().sort_values("date_envoi", ascending=False).head(limit).copy()
        records: list[dict] = []

        for _, row in df.iterrows():
            technicite = row.get("technicite")
            if pd.notna(technicite) and float(technicite) <= 1:
                technicite_pct = round(float(technicite) * 100, 2)
            else:
                technicite_pct = round(float(technicite or 0), 2)

            full_text = " ".join(
                [
                    str(row.get("sujet", "")),
                    str(row.get("corps", "")),
                    str(row.get("texte_ocr", "")),
                ]
            ).strip()

            montant_value = float(row["montant"]) if pd.notna(row.get("montant")) else None
            if montant_value is None:
                montant_value = _normalize_amount(_extract_first_match(full_text, AMOUNT_PATTERNS))
            if montant_value is not None and (montant_value <= 0 or montant_value > MAX_REASONABLE_MONTANT):
                montant_value = None

            records.append(
                {
                    "email_id": str(row.get("email_id", "")),
                    "date_envoi": row["date_envoi"].isoformat() if pd.notna(row.get("date_envoi")) else "",
                    "dossier": str(row.get("dossier", "Inbox")),
                    "type_email": str(row.get("type_email", "INCONNU")),
                    "langue": str(row.get("langue", "FR")),
                    "from_nom": str(row.get("from_nom", "")),
                    "from_email": str(row.get("from_email", "")),
                    "to_nom": str(row.get("to_nom", "")),
                    "sujet": str(row.get("sujet", "")),
                    "corps": str(row.get("corps", "")),
                    "texte_ocr": str(row.get("texte_ocr", "")),
                    "from_domaine": str(row.get("from_domaine", "")),
                    "to_domaine": str(row.get("to_domaine", "")),
                    "codix_service": str(row.get("codix_service", "")),
                    "montant": montant_value,
                    "reference_facture": _extract_first_match(full_text, INVOICE_PATTERNS),
                    "interne": bool(row.get("interne", False)),
                    "client_id": str(row.get("client_id", "")),
                    "client_nom": str(row.get("client_nom", "Client inconnu")),
                    "client_secteur": str(row.get("client_secteur", "Non renseigne")),
                    "client_pays": str(row.get("client_pays", "Non renseigne")),
                    "client_sante": str(row.get("client_sante", HEALTH_DEFAULT)),
                    "client_encours": float(row.get("client_encours") or 0),
                    "priorite": str(row.get("priorite", "NORMALE")),
                    "risque_impaye": _normalize_risk_label(row.get("risque_impaye"), technicite),
                    "technicite": technicite_pct,
                    "urgence": float(row.get("urgence") or 0),
                    "emotion": float(row.get("emotion") or 0),
                    "client_probabilite_defaut": float(row.get("client_probabilite_defaut") or 0),
                    "client_ca": float(row.get("client_ca") or 0),
                    "client_effectif": float(row.get("client_effectif") or 0),
                    "client_dso": float(row.get("client_dso") or 0),
                    "client_anciennete": float(row.get("client_anciennete") or 0),
                    "nb_pieces_jointes": float(row.get("nb_pieces_jointes") or 0),
                    "temps_reponse_minutes": float(row.get("temps_reponse_minutes") or 0),
                    "sentiment": str(row.get("sentiment_front", "neutral")),
                }
            )

        return records

    def get_clients(self, limit: int = 100) -> list[dict]:
        df = self._load_dataframe().copy()
        grouped = (
            df.sort_values("date_envoi", ascending=False)
            .groupby("client_id", dropna=False)
            .agg(
                client_nom=("client_nom", "first"),
                client_secteur=("client_secteur", "first"),
                client_pays=("client_pays", "first"),
                client_sante=("client_sante", "first"),
                client_encours=("client_encours", "max"),
                nb_emails=("email_id", "count"),
                derniere_interaction=("date_envoi", "max"),
            )
            .reset_index()
            .head(limit)
        )
        clients: list[dict] = []
        for _, row in grouped.iterrows():
            clients.append(
                {
                    "client_id": str(row.get("client_id", "")),
                    "client_nom": str(row.get("client_nom", "Client inconnu")),
                    "client_secteur": str(row.get("client_secteur", "Non renseigne")),
                    "client_pays": str(row.get("client_pays", "Non renseigne")),
                    "client_sante": str(row.get("client_sante", HEALTH_DEFAULT)),
                    "client_encours": float(row.get("client_encours") or 0),
                    "nb_emails": int(row.get("nb_emails") or 0),
                    "derniere_interaction": row["derniere_interaction"].isoformat()
                    if pd.notna(row.get("derniere_interaction"))
                    else "",
                }
            )
        return clients

    def get_statistics(self) -> dict:
        df = self._load_dataframe().copy()
        overview = self.get_dataset_overview()
        today = pd.Timestamp.now().date()
        today_emails = int((df["date_envoi"].dt.date == today).sum()) if "date_envoi" in df else 0
        clients_df = (
            df.sort_values("date_envoi", ascending=False)
            .groupby("client_id", dropna=False)
            .agg(
                client_sante=("client_sante", "first"),
                client_encours=("client_encours", "max"),
            )
            .reset_index()
        )
        risky_mask = clients_df["client_sante"].isin(["RISQUEE", "FRAGILE"])
        clients_at_risk = int(clients_df.loc[risky_mask, "client_id"].nunique())
        encours_mask = clients_df["client_encours"].fillna(0).between(0, MAX_REASONABLE_ENCOURS)
        total_exposed = float(
            clients_df.loc[risky_mask & encours_mask, "client_encours"].fillna(0).sum()
        )
        avg_processing = (
            round(float(df["temps_reponse_minutes"].dropna().mean() / 60), 2)
            if df["temps_reponse_minutes"].dropna().any()
            else 0.0
        )

        emails_by_language = {
            str(key): int(value)
            for key, value in df["langue"].fillna("INCONNU").value_counts().items()
        }
        emails_by_type = {
            str(key): int(value)
            for key, value in df["type_email"].fillna("INCONNU").value_counts().head(10).items()
        }
        risk_series = df.apply(
            lambda row: _normalize_risk_label(row.get("risque_impaye"), row.get("technicite")),
            axis=1,
        )
        emails_by_risk = {
            "aucun": int((risk_series == "aucun").sum()),
            "faible": int((risk_series == "faible").sum()),
            "moyen": int((risk_series == "moyen").sum()),
            "eleve": int((risk_series == "eleve").sum()),
        }

        return {
            **overview,
            "todayEmails": today_emails,
            "clientsAtRisk": clients_at_risk,
            "totalExposed": total_exposed,
            "avgProcessingTime": avg_processing,
            "emailsByLanguage": emails_by_language,
            "emailsByType": emails_by_type,
            "emailsByRisk": emails_by_risk,
        }


dataset_service = DatasetService()
