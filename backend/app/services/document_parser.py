from io import BytesIO
from pathlib import Path

from fastapi import UploadFile


class UnsupportedDocumentError(Exception):
    pass


async def extract_text_from_upload(file: UploadFile) -> str:
    content = await file.read()
    suffix = Path(file.filename or "").suffix.lower()

    if suffix == ".txt":
        return content.decode("utf-8", errors="ignore")

    if suffix == ".pdf":
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise UnsupportedDocumentError("Le support PDF nécessite pypdf.") from exc

        reader = PdfReader(BytesIO(content))
        return "\n".join((page.extract_text() or "") for page in reader.pages).strip()

    if suffix == ".docx":
        try:
            from docx import Document
        except ImportError as exc:
            raise UnsupportedDocumentError("Le support DOCX nécessite python-docx.") from exc

        document = Document(BytesIO(content))
        return "\n".join(paragraph.text for paragraph in document.paragraphs).strip()

    raise UnsupportedDocumentError(
        "Format non supporté. Utilisez un fichier .txt, .pdf ou .docx."
    )
