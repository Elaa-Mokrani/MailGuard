from __future__ import annotations

from typing import Any

from app.core.config import get_settings


def generate_suggested_reply(email_content: str, analysis: dict[str, Any]) -> str:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY est manquante dans backend/.env. Ajoutez votre cle Gemini puis redemarrez le backend.")

    try:
        import google.generativeai as genai
    except ImportError as exc:
        raise RuntimeError("La dependance google-generativeai n'est pas installee.") from exc

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')

    language = str(analysis.get("langue", "FR")).upper()
    response_language = "anglais" if language == "EN" else "francais"
    is_internal = bool(analysis.get("interne", False))
    audience = "un collaborateur interne Codix" if is_internal else "un client externe"
    risk = analysis.get("risque", "Non renseigne")

    prompt = f"""
Tu es un assistant de redaction pour le service client Codix.

Objectif:
Generer une reponse courte, professionnelle, claire et utile a l'email ci-dessous.

Contraintes:
- Repondre en {response_language}, selon la langue detectee du mail.
- Adapter le ton au destinataire: {audience}.
- Adapter le contenu au type d'email, au sentiment, a l'urgence et au niveau de risque.
- Si le mail est interne, proposer une reponse plus collaborative et orientee coordination.
- Si le mail est externe, proposer une reponse client professionnelle et rassurante.
- Ne pas inventer de paiement, de promesse ou de piece jointe.
- Rester poli, direct et professionnel.
- Mentionner le montant ou la reference facture seulement s'ils sont fournis.
- Si le risque ou l'urgence est eleve, rester ferme mais courtois.
- Terminer exactement par:
Service Client Codix

Analyse metier disponible:
- Type email: {analysis.get("type_email", "Non renseigne")}
- Sentiment: {analysis.get("sentiment", "Non renseigne")}
- Urgence: {analysis.get("urgence", "Non renseignee")}
- Risque: {risk}
- Langue: {language}
- Email interne: {"oui" if is_internal else "non"}
- Client ou interlocuteur: {analysis.get("client_nom", "Non renseigne")}
- Montant: {analysis.get("montant", "Non detecte")}
- Reference facture: {analysis.get("reference_facture", "Non detectee")}

Email recu:
{email_content}

Reponse professionnelle proposee:
""".strip()

    response = model.generate_content(prompt)
    text = getattr(response, "text", "") or ""
    if not text.strip():
        raise RuntimeError("Gemini n'a pas retourne de reponse exploitable.")
    return text.strip()
